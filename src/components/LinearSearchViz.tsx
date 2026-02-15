import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Pause, Play, Square, Trash2 } from 'lucide-react';
import { Algorithm } from '@/types/algorithms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import DataVisualization from './DataVisualization';
import FlowDiagram from './FlowDiagram';
import CodeSnippet from './CodeSnippet';
import TargetCombobox from './TargetCombobox';
import { Terminal, TerminalLine } from './ui/terminal';
import { linearSearchGenerator, AnimationStep } from '@/lib/linearSearch';

export type Speed = 'slow' | 'normal' | 'fast';

const SPEED_DELAY_MS: Record<Speed, number> = {
  slow: 1600,
  normal: 800,
  fast: 200,
};

interface LinearSearchVizProps {
  algorithm: Algorithm;
}

interface AlgorithmReadMoreProps {
  whatFor?: string;
  bestUseCase?: string;
  performance?: string;
}

function AlgorithmReadMore({ whatFor, bestUseCase, performance }: AlgorithmReadMoreProps) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
      <div className="flex justify-end">
        <CollapsibleTrigger className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer focus:outline-none">
          {open ? (
            <>
              <ChevronUp className="size-3 shrink-0" />
              Read less
            </>
          ) : (
            <>
              <ChevronDown className="size-3 shrink-0" />
              Read more
            </>
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-hidden">
        <div className="mt-3 space-y-3 text-sm text-black dark:text-gray-200 read-more-content">
          {whatFor && (
            <div>
              <p className="text-xs font-semibold text-black dark:text-gray-200 mb-0.5">What it&apos;s for</p>
              <p>{whatFor}</p>
            </div>
          )}
          {bestUseCase && (
            <div>
              <p className="text-xs font-semibold text-black dark:text-gray-200 mb-0.5">Best use case</p>
              <p>{bestUseCase}</p>
            </div>
          )}
          {performance && (
            <div>
              <p className="text-xs font-semibold text-black dark:text-gray-200 mb-0.5">Performance</p>
              <p>{performance}</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Utility function to generate random array
const generateRandomArray = (size: number, min: number = 1, max: number = 20): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
};

const DEFAULT_ARRAY_SIZE = 7;
const MAX_ARRAY_SIZE = 20;

export default function LinearSearchViz({ algorithm }: LinearSearchVizProps) {
  const [data, setData] = useState<number[]>(() => generateRandomArray(DEFAULT_ARRAY_SIZE));
  const [arraySize, setArraySize] = useState<number>(DEFAULT_ARRAY_SIZE);
  const [arraySizeInput, setArraySizeInput] = useState<string>(String(DEFAULT_ARRAY_SIZE));
  const [diagramLocked, setDiagramLocked] = useState(true);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [targetInput, setTargetInput] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<AnimationStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [lastRunDurationMs, setLastRunDurationMs] = useState<number | null>(null);
  const generatorRef = useRef<AsyncGenerator<AnimationStep> | null>(null);
  const stoppedRef = useRef(false);
  const isPausedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const runStartTimeRef = useRef<number | null>(null);

  // Scroll logs to the last line when a new entry is added (use the Terminal's scroll container)
  const logScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logEntries.length > 0 && logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logEntries]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const applyArraySize = (size: number) => {
    const clamped = Math.min(MAX_ARRAY_SIZE, Math.max(1, size));
    setArraySize(clamped);
    setArraySizeInput(String(clamped));
    setData(generateRandomArray(clamped));
    setCurrentStep(null);
    setTargetValue(null);
    setTargetInput('');
    setLogEntries([]);
  };

  const handleApplyArraySize = () => {
    if (isRunning) return;
    const n = parseInt(arraySizeInput, 10);
    if (isNaN(n) || n < 1) {
      const valid = DEFAULT_ARRAY_SIZE;
      setArraySizeInput(String(valid));
      setArraySize(valid);
      applyArraySize(valid);
      return;
    }
    if (n > MAX_ARRAY_SIZE) {
      setArraySizeInput(String(MAX_ARRAY_SIZE));
      toast.warning(`Maximum array size is ${MAX_ARRAY_SIZE}.`, {
      style: { background: '#fff', color: '#000', border: '1px solid #e5e5e5' },
    });
      return;
    }
    applyArraySize(n);
    toast.success('Number of array visualization changed', {
      style: { background: '#fff', color: '#000', border: '1px solid #e5e5e5' },
    });
  };

  const handleStart = () => {
    if (isRunning && !isPaused) {
      // Pause
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isPausedRef.current = true;
      setIsPaused(true);
      toast.success('Algorithm has paused');
      return;
    }
    if (isRunning && isPaused) {
      // Resume
      isPausedRef.current = false;
      setIsPaused(false);
      runNextStep();
      return;
    }

    const target = parseInt(targetInput, 10);
    if (isNaN(target) || targetInput.trim() === '') {
      toast.error('Select or type a valid target number.');
      return;
    }
    if (!data.includes(target)) {
      toast.error('This number is not in the array. Please select a value from the list.');
      return;
    }

    setTargetValue(target);
    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setLastRunDurationMs(null);
    stoppedRef.current = false;
    runStartTimeRef.current = Date.now();
    generatorRef.current = linearSearchGenerator(data, target);
    runNextStep();
  };

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    generatorRef.current = null;
    stoppedRef.current = true;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(false);
    setCurrentStep(null);
    setLogEntries([]);
    toast.success('Algorithm has stopped');
  };

  const runNextStep = async () => {
    if (!generatorRef.current || stoppedRef.current) return;

    const { value, done } = await generatorRef.current.next();
    
    if (done || !value || stoppedRef.current) {
      setIsRunning(false);
      return;
    }

    setCurrentStep(value);
    const msg = value.message;
    if (msg) {
      setLogEntries((prev) => [...prev, msg]);
    }

    if (!value.isComplete && !stoppedRef.current && !isPausedRef.current) {
      const delayMs = SPEED_DELAY_MS[speed];
      timeoutRef.current = window.setTimeout(() => {
        runNextStep();
      }, delayMs);
    } else if (value.isComplete || stoppedRef.current) {
      if (runStartTimeRef.current != null && !stoppedRef.current) {
        setLastRunDurationMs(Date.now() - runStartTimeRef.current);
      }
      setIsRunning(false);
    }
    // when isPausedRef.current: do nothing, don't schedule next, don't set isRunning false
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generatorRef.current = null;
    stoppedRef.current = true;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(false);
    setCurrentStep(null);
    setTargetValue(null);
    setTargetInput('');
    setLogEntries([]);
    setLastRunDurationMs(null);
    const size = Math.min(MAX_ARRAY_SIZE, Math.max(1, arraySize));
    setArraySizeInput(String(size));
    setData(generateRandomArray(size));
    toast.success('Number of array visualization changed', {
      style: { background: '#fff', color: '#000', border: '1px solid #e5e5e5' },
    });
  };

  const visualizationState = currentStep || {
    data,
    currentIndex: -1,
    targetValue,
    found: false,
    isRunning: false,
    isComplete: false,
  };

  const flowStep = currentStep?.flowStep || 'start';

  return (
    <div className="space-y-4">
      {/* Algorithm Info - compact */}
      <Card>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-xl">{algorithm.name}</CardTitle>
          <CardDescription className="text-sm mt-1">{algorithm.description}</CardDescription>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Best Case</p>
              <p className="font-bold">{algorithm.bestCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Average Case</p>
              <p className="font-bold">{algorithm.averageCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Worst Case</p>
              <p className="font-bold">{algorithm.worstCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Space</p>
              <p className="font-bold">{algorithm.spaceComplexity}</p>
            </div>
          </div>
          {(algorithm.whatFor ?? algorithm.bestUseCase ?? algorithm.performance) && (
            <AlgorithmReadMore
              whatFor={algorithm.whatFor}
              bestUseCase={algorithm.bestUseCase}
              performance={algorithm.performance}
            />
          )}
        </CardContent>
      </Card>

      {/* Three columns: Controls (narrow) | Diagram (center, main width) | Logs (narrow, half width) */}
      <div className="grid grid-cols-1 lg:grid-cols-[185px_1fr_280px] gap-4">
        {/* Left: Controls only */}
        <div className="flex flex-col">
          <Card className="w-full">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-base">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">Speed</p>
                <Select
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as Speed)}
                  disabled={isRunning}
                  className="h-8 text-xs w-full hover:cursor-pointer"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </Select>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300 ">Array size</p>
                <div className="flex gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    max={MAX_ARRAY_SIZE}
                    inputMode="numeric"
                    autoComplete="off"
                    value={arraySizeInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setArraySizeInput(raw === '' ? '' : raw);
                      const n = parseInt(raw, 10);
                      if (raw !== '' && !isNaN(n)) {
                        setArraySize(Math.min(MAX_ARRAY_SIZE, Math.max(1, n)));
                      }
                    }}
                    onBlur={() => {
                      const n = parseInt(arraySizeInput, 10);
                      if (arraySizeInput === '' || isNaN(n)) {
                        setArraySizeInput(String(DEFAULT_ARRAY_SIZE));
                        setArraySize(DEFAULT_ARRAY_SIZE);
                        return;
                      }
                      if (n < 1) {
                        setArraySizeInput('1');
                        setArraySize(1);
                        return;
                      }
                      // Don't clamp > MAX here so Check click can show warning
                      if (n > MAX_ARRAY_SIZE) return;
                      setArraySizeInput(String(n));
                      setArraySize(n);
                    }}
                    disabled={isRunning}
                    className="h-8 text-xs flex-1 min-w-0 hover:cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0 hover:cursor-pointer"
                    onClick={handleApplyArraySize}
                    disabled={isRunning}
                    title="Apply array size"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">Target</p>
                <TargetCombobox
                  options={data}
                  value={targetInput}
                  onChange={setTargetInput}
                  disabled={isRunning}
                  placeholder="Select or type"
                />
              </div>
              <div className="flex gap-1.5 pt-1 ">
                <Button onClick={handleReset} variant="outline" size="sm" className="flex-1 hover:cursor-pointer">
                  Reset
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-[#fca5a5] border-[#fca5a5] hover:bg-[#f87171] hover:border-[#f87171] text-red-800 dark:bg-red-900/60 dark:border-red-700 dark:text-[#fecaca] dark:hover:bg-red-800/50 dark:hover:border-red-600"
                  title="Stop (restart from beginning)"
                >
                  <Square className="size-4" />
                </Button>
                <Button
                  onClick={handleStart}
                  disabled={!isRunning && !targetInput.trim()}
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0 bg-[#86efac] border-[#86efac] hover:bg-[#4ade80] hover:border-[#4ade80] text-green-800 dark:bg-green-800/50 dark:border-green-600 dark:text-[#86efac] dark:hover:bg-green-700/50 dark:hover:border-green-500 cursor-pointer"
                  title={isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
                >
                  {isRunning && !isPaused ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: Diagram */}
        <div className="flex flex-col min-h-0">
          <Card className="w-full h-full flex flex-col min-h-0">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-base">Diagram</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
              <FlowDiagram
                currentStep={flowStep}
                locked={diagramLocked}
                onLockToggle={() => setDiagramLocked((l) => !l)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Logs in Terminal style */}
        <div className="flex flex-col min-h-0">
          <Card className="w-full flex flex-col min-h-0">
            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Logs</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0 cursor-pointer"
                onClick={() => setLogEntries([])}
                disabled={logEntries.length === 0}
                title="Clear logs"
              >
                <Trash2 className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col min-h-[360px] max-h-[360px] overflow-hidden p-0">
              <Terminal scrollRef={logScrollRef} className="min-h-0 flex-1 overflow-hidden h-full" sequence={false}>
                {logEntries.length === 0 ? (
                  <TerminalLine className="text-gray-500 dark:text-gray-400">Steps appear when you run the search.</TerminalLine>
                ) : (
                  logEntries.map((entry, idx) => (
                    <TerminalLine key={idx}>
                      <span className="text-gray-400 dark:text-gray-400">[{idx + 1}]</span> {entry}
                    </TerminalLine>
                  ))
                )}
              </Terminal>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Array Visualization - below Diagram */}
      <DataVisualization state={visualizationState} lastRunDurationMs={lastRunDurationMs} speed={speed} />

      {/* Code */}
      <CodeSnippet code={algorithm.pythonCode} />
    </div>
  );
}
