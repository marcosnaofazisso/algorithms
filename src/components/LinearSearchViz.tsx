import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Algorithm } from '@/types/algorithms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import DataVisualization from './DataVisualization';
import FlowDiagram from './FlowDiagram';
import CodeSnippet from './CodeSnippet';
import TargetCombobox from './TargetCombobox';
import { Terminal, TerminalLine } from './ui/terminal';
import { linearSearchGenerator, AnimationStep } from '@/lib/linearSearch';

interface LinearSearchVizProps {
  algorithm: Algorithm;
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
  const [manualInput, setManualInput] = useState<string>('');
  const [targetInput, setTargetInput] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<AnimationStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [showCustomNumbers, setShowCustomNumbers] = useState(false);
  const [lastRunDurationMs, setLastRunDurationMs] = useState<number | null>(null);
  const generatorRef = useRef<AsyncGenerator<AnimationStep> | null>(null);
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
      toast.error(`Maximum array size is ${MAX_ARRAY_SIZE}.`);
      return;
    }
    applyArraySize(n);
  };

  const handleRandomArray = () => {
    if (isRunning) return;
    const size = Math.min(MAX_ARRAY_SIZE, Math.max(1, arraySize));
    setArraySize(size);
    setArraySizeInput(String(size));
    setData(generateRandomArray(size));
    setCurrentStep(null);
    setTargetValue(null);
    setTargetInput('');
    setLogEntries([]);
    toast.success('Numbers of array visualization changed!');
  };

  const handleManualInput = () => {
    if (isRunning) return;
    const numbers = manualInput
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    if (numbers.length > 0) {
      setData(numbers);
      setCurrentStep(null);
      setTargetValue(null);
      setTargetInput('');
      setManualInput('');
      setLogEntries([]);
    }
  };

  const handleStart = () => {
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
    setLastRunDurationMs(null);
    runStartTimeRef.current = Date.now();
    generatorRef.current = linearSearchGenerator(data, target);
    runNextStep();
  };

  const runNextStep = async () => {
    if (!generatorRef.current) return;

    const { value, done } = await generatorRef.current.next();
    
    if (done || !value) {
      setIsRunning(false);
      return;
    }

    setCurrentStep(value);
    if (value.message) {
      setLogEntries((prev) => [...prev, value.message]);
    }

    if (!value.isComplete) {
      timeoutRef.current = window.setTimeout(() => {
        runNextStep();
      }, 800); // 800ms delay between steps
    } else {
      if (runStartTimeRef.current != null) {
        setLastRunDurationMs(Date.now() - runStartTimeRef.current);
      }
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generatorRef.current = null;
    setIsRunning(false);
    setCurrentStep(null);
    setTargetValue(null);
    setTargetInput('');
    setLogEntries([]);
    setLastRunDurationMs(null);
    const size = Math.min(MAX_ARRAY_SIZE, Math.max(1, arraySize));
    setArraySizeInput(String(size));
    setData(generateRandomArray(size));
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
              <p className="text-xs font-medium text-gray-600">Best Case</p>
              <p className="font-bold">{algorithm.bestCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Average Case</p>
              <p className="font-bold">{algorithm.averageCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Worst Case</p>
              <p className="font-bold">{algorithm.worstCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Space</p>
              <p className="font-bold">{algorithm.spaceComplexity}</p>
            </div>
          </div>
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
                <p className="text-xs font-medium mb-1 text-gray-600">Array size</p>
                <div className="flex gap-1.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={arraySizeInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setArraySizeInput(raw);
                      const n = parseInt(raw, 10);
                      setArraySize(raw === '' ? DEFAULT_ARRAY_SIZE : Math.min(MAX_ARRAY_SIZE, Math.max(1, isNaN(n) ? DEFAULT_ARRAY_SIZE : n)));
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
                      if (n > MAX_ARRAY_SIZE) {
                        setArraySize(MAX_ARRAY_SIZE);
                        return;
                      }
                      setArraySizeInput(String(n));
                      setArraySize(n);
                    }}
                    disabled={isRunning}
                    className="h-8 text-xs flex-1 min-w-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0"
                    onClick={handleApplyArraySize}
                    disabled={isRunning}
                    title="Apply array size"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600">Array</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    onClick={handleRandomArray}
                    disabled={isRunning}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    Random
                  </Button>
                  <Button
                    onClick={() => setShowCustomNumbers((s) => !s)}
                    disabled={isRunning}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    {showCustomNumbers ? 'Hide' : 'Add custom'}
                  </Button>
                </div>
                {showCustomNumbers && (
                  <div className="mt-2 flex gap-1.5">
                    <Input
                      type="text"
                      placeholder="e.g. 4,2,7,1,9"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      disabled={isRunning}
                      className="h-8 text-xs flex-1"
                    />
                    <Button
                      onClick={handleManualInput}
                      disabled={isRunning || !manualInput}
                      variant="outline"
                      size="sm"
                    >
                      Set
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600">Target</p>
                <TargetCombobox
                  options={data}
                  value={targetInput}
                  onChange={setTargetInput}
                  disabled={isRunning}
                  placeholder="Select or type"
                />
              </div>
              <div className="flex gap-1.5 pt-1">
                <Button
                  onClick={handleStart}
                  disabled={isRunning || !targetInput.trim()}
                  size="sm"
                  className="flex-1"
                >
                  {isRunning ? 'Running...' : 'Start'}
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm" className="flex-1">
                  Reset
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
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-base">Logs</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col min-h-[360px] max-h-[360px] overflow-hidden p-0">
              <Terminal scrollRef={logScrollRef} className="min-h-0 flex-1 overflow-hidden h-full" sequence={false}>
                {logEntries.length === 0 ? (
                  <TerminalLine className="text-gray-500">Steps appear when you run the search.</TerminalLine>
                ) : (
                  logEntries.map((entry, idx) => (
                    <TerminalLine key={idx}>
                      <span className="text-gray-400">[{idx + 1}]</span> {entry}
                    </TerminalLine>
                  ))
                )}
              </Terminal>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Array Visualization - below Diagram */}
      <DataVisualization state={visualizationState} lastRunDurationMs={lastRunDurationMs} />

      {/* Code */}
      <CodeSnippet code={algorithm.pythonCode} />
    </div>
  );
}
