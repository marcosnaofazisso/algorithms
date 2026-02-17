import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Algorithm } from '@/types/algorithms';
import {
  TreeNode,
  fromArray,
  cloneTree,
  insert,
  remove,
  invert,
  searchPath,
  computeLayout,
  resetTreeId,
} from '@/lib/binaryTree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Input } from './ui/input';
import FlowDiagram, { FLOW_DIAGRAM_HEIGHT_PX } from './FlowDiagram';
import CodeSnippet from './CodeSnippet';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Terminal, TerminalLine } from './ui/terminal';
import type { FlowStep } from '@/types/algorithms';

const INITIAL_VALUES = [8, 3, 10, 1, 6, 14, 4, 7];
const NODE_R = 14;
const SPEED_MS = 500;

interface BinaryTreeVizProps {
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
          {open ? <><ChevronUp className="size-3 shrink-0" /> Read less</> : <><ChevronDown className="size-3 shrink-0" /> Read more</>}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-hidden">
        <div className="mt-3 space-y-3 text-sm text-black dark:text-gray-200 read-more-content">
          {whatFor && <div><p className="text-xs font-semibold mb-0.5">What it&apos;s for</p><p>{whatFor}</p></div>}
          {bestUseCase && <div><p className="text-xs font-semibold mb-0.5">Best use case</p><p>{bestUseCase}</p></div>}
          {performance && <div><p className="text-xs font-semibold mb-0.5">Performance</p><p>{performance}</p></div>}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function TreeSvg({
  root,
  layout,
  highlightedId,
}: {
  root: TreeNode | null;
  layout: Map<string, { x: number; y: number }>;
  highlightedId: string | null;
}) {
  if (!root) {
    return (
      <svg className="w-full h-full min-h-[120px]" viewBox="0 0 160 60" preserveAspectRatio="xMidYMid meet">
        <text x="80" y="30" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-xs">Empty tree</text>
      </svg>
    );
  }

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  function collectEdges(node: TreeNode) {
    const pos = layout.get(node.id);
    if (!pos) return;
    if (node.left) {
      const leftPos = layout.get(node.left.id);
      if (leftPos) edges.push({ x1: pos.x, y1: pos.y, x2: leftPos.x, y2: leftPos.y });
      collectEdges(node.left);
    }
    if (node.right) {
      const rightPos = layout.get(node.right.id);
      if (rightPos) edges.push({ x1: pos.x, y1: pos.y, x2: rightPos.x, y2: rightPos.y });
      collectEdges(node.right);
    }
  }
  collectEdges(root);

  const nodes = Array.from(layout.entries());
  const padding = 14;
  const minX = Math.min(...nodes.map(([, p]) => p.x)) - NODE_R - padding;
  const maxX = Math.max(...nodes.map(([, p]) => p.x)) + NODE_R + padding;
  const topPadding = NODE_R + padding;
  const minY = -topPadding;
  const maxY = Math.max(...nodes.map(([, p]) => p.y)) + NODE_R + padding;
  const width = Math.max(240, maxX - minX);
  const height = Math.max(180, maxY - minY + padding);

  return (
    <svg className="w-full h-full" viewBox={`${minX} ${minY} ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-500" />
      ))}
      {nodes.map(([id, pos]) => {
        const isHighlight = highlightedId === id;
        return (
          <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
            <circle
              r={NODE_R}
              fill={isHighlight ? 'var(--highlight-bg, #fef08a)' : 'var(--node-bg, #f1f5f9)'}
              stroke={isHighlight ? 'var(--highlight-border, #eab308)' : 'var(--node-border, #94a3b8)'}
              strokeWidth={isHighlight ? 3 : 2}
              className="dark:-[--node-bg:#1e293b] dark:-[--node-border:#475569] dark:-[--highlight-bg:#854d0e] dark:-[--highlight-border:#eab308]"
            />
            <text textAnchor="middle" dominantBaseline="central" className="fill-gray-900 dark:fill-gray-100 text-xs font-semibold" style={{ fontFamily: 'system-ui' }}>
              {(() => {
                const n = findNode(root, id);
                return n ? n.value : '';
              })()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function findNode(root: TreeNode | null, id: string): TreeNode | null {
  if (!root) return null;
  if (root.id === id) return root;
  return findNode(root.left, id) ?? findNode(root.right, id);
}

export default function BinaryTreeViz({ algorithm }: BinaryTreeVizProps) {
  const [root, setRoot] = useState<TreeNode | null>(() => {
    resetTreeId();
    return fromArray(INITIAL_VALUES);
  });
  const [valueInput, setValueInput] = useState('');
  const [diagramLocked, setDiagramLocked] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>('bt-start');
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const logScrollRef = useRef<HTMLDivElement | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (logEntries.length > 0 && logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logEntries]);

  const layout = computeLayout(root);

  const addLog = (msg: string) => setLogEntries((prev) => [...prev, msg]);

  const runSteps = async (steps: { delay?: number; highlightId: string | null; log?: string; flowStep?: FlowStep }[]) => {
    for (const step of steps) {
      if (stoppedRef.current) return;
      if (step.highlightId !== undefined) setHighlightedId(step.highlightId);
      if (step.flowStep) setFlowStep(step.flowStep);
      if (step.log) addLog(step.log);
      if (step.delay) await new Promise((r) => setTimeout(r, step.delay));
    }
  };

  const handleSearch = async () => {
    const val = parseInt(valueInput, 10);
    if (Number.isNaN(val) || valueInput.trim() === '') {
      toast.error('Enter a number to search.');
      return;
    }
    if (!root) {
      toast.error('Tree is empty.');
      return;
    }
    setIsRunning(true);
    stoppedRef.current = false;
    setFlowStep('bt-search');
    setLogEntries([]);
    const path = searchPath(root, val);
    const found = path.length > 0 && path[path.length - 1].value === val;
    const steps: { delay?: number; highlightId: string | null; log?: string; flowStep?: FlowStep }[] = [
      { flowStep: 'bt-search', highlightId: null, log: `Searching for ${val}...` },
    ];
    path.forEach((node) => {
      steps.push({ delay: SPEED_MS, highlightId: node.id, log: `Compare ${val} with ${node.value}${node.value === val ? ' → Found!' : val < node.value ? ' → go left' : ' → go right'}` });
    });
    if (!found) steps.push({ highlightId: null, log: `Value ${val} not in tree.` });
    steps.push({ flowStep: 'bt-done', highlightId: null });
    await runSteps(steps);
    setHighlightedId(null);
    setIsRunning(false);
  };

  const handleInsert = async () => {
    const val = parseInt(valueInput, 10);
    if (Number.isNaN(val) || valueInput.trim() === '') {
      toast.error('Enter a number to insert.');
      return;
    }
    if (root && searchPath(root, val).some((n) => n.value === val)) {
      toast.info('Value already in tree.');
      return;
    }
    setIsRunning(true);
    stoppedRef.current = false;
    setFlowStep('bt-insert');
    setLogEntries([]);
    const path = searchPath(root, val);
    const steps: { delay?: number; highlightId: string | null; log?: string; flowStep?: FlowStep }[] = [
      { flowStep: 'bt-insert', highlightId: null, log: `Inserting ${val}...` },
    ];
    path.forEach((node) => {
      steps.push({ delay: SPEED_MS, highlightId: node.id, log: `Compare ${val} with ${node.value} → ${val < node.value ? 'go left' : 'go right'}` });
    });
    steps.push({ delay: SPEED_MS, highlightId: null, log: `Insert ${val} as new node.` });
    await runSteps(steps);
    setRoot(insert(cloneTree(root), val));
    addLog('Done.');
    setFlowStep('bt-done');
    setHighlightedId(null);
    setIsRunning(false);
    toast.success(`Inserted ${val}`);
  };

  const handleRemove = async () => {
    const val = parseInt(valueInput, 10);
    if (Number.isNaN(val) || valueInput.trim() === '') {
      toast.error('Enter a number to remove.');
      return;
    }
    if (!root) {
      toast.error('Tree is empty.');
      return;
    }
    const path = searchPath(root, val);
    const found = path.length > 0 && path[path.length - 1].value === val;
    if (!found) {
      toast.error('Value not in tree.');
      return;
    }
    setIsRunning(true);
    stoppedRef.current = false;
    setFlowStep('bt-remove');
    setLogEntries([]);
    const steps: { delay?: number; highlightId: string | null; log?: string; flowStep?: FlowStep }[] = [
      { flowStep: 'bt-remove', highlightId: null, log: `Removing ${val}...` },
    ];
    path.forEach((node) => {
      steps.push({ delay: SPEED_MS, highlightId: node.id, log: node.value === val ? `Found node ${val}. Removing.` : `Compare ${val} with ${node.value} → ${val < node.value ? 'go left' : 'go right'}` });
    });
    await runSteps(steps);
    setRoot(remove(cloneTree(root), val));
    addLog('Done.');
    setFlowStep('bt-done');
    setHighlightedId(null);
    setIsRunning(false);
    toast.success(`Removed ${val}`);
  };

  const handleInvert = async () => {
    if (!root) {
      toast.error('Tree is empty.');
      return;
    }
    setIsRunning(true);
    stoppedRef.current = false;
    setFlowStep('bt-invert');
    setLogEntries([]);
    addLog('Inverting: swap left ↔ right at every node.');
    await new Promise((r) => setTimeout(r, SPEED_MS));
    if (stoppedRef.current) { setIsRunning(false); return; }
    setRoot(invert(cloneTree(root)));
    addLog('Done.');
    setFlowStep('bt-done');
    setIsRunning(false);
    toast.success('Tree inverted');
  };

  const handleRandom = () => {
    if (isRunning) return;
    resetTreeId();
    const size = 6 + Math.floor(Math.random() * 6);
    const vals: number[] = [];
    const used = new Set<number>();
    while (vals.length < size) {
      const v = Math.floor(Math.random() * 30) + 1;
      if (!used.has(v)) { used.add(v); vals.push(v); }
    }
    setRoot(fromArray(vals));
    setHighlightedId(null);
    setFlowStep('bt-start');
    setLogEntries([]);
    toast.success('New random tree');
  };

  const handleStop = () => {
    stoppedRef.current = true;
    setHighlightedId(null);
    setFlowStep('bt-start');
    setIsRunning(false);
    toast.success('Stopped');
  };

  return (
    <div className="space-y-4">
      <Card className="algorithm-info-container">
        <CardHeader className="algorithm-info-header py-2 px-4">
          <CardTitle className="text-xl">{algorithm.name}</CardTitle>
          <CardDescription className="text-sm mt-1">{algorithm.description}</CardDescription>
        </CardHeader>
        <CardContent className="algorithm-info-content py-2 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><p className="text-xs font-medium text-gray-600 dark:text-gray-300">Best Case</p><p className="font-bold">{algorithm.bestCase}</p></div>
            <div><p className="text-xs font-medium text-gray-600 dark:text-gray-300">Average Case</p><p className="font-bold">{algorithm.averageCase}</p></div>
            <div><p className="text-xs font-medium text-gray-600 dark:text-gray-300">Worst Case</p><p className="font-bold">{algorithm.worstCase}</p></div>
            <div><p className="text-xs font-medium text-gray-600 dark:text-gray-300">Space</p><p className="font-bold">{algorithm.spaceComplexity}</p></div>
          </div>
          {(algorithm.whatFor ?? algorithm.bestUseCase ?? algorithm.performance) && (
            <AlgorithmReadMore whatFor={algorithm.whatFor} bestUseCase={algorithm.bestUseCase} performance={algorithm.performance} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[185px_1fr] gap-4 min-h-0">
        <div className="controls-container flex flex-col shrink-0">
          <Card className="w-full">
            <CardHeader className="controls-header py-2 px-4">
              <CardTitle className="text-base">Controls</CardTitle>
            </CardHeader>
            <CardContent className="controls-content space-y-2 px-4 pb-4">
              <div>
                <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">Value</p>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Number"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={isRunning}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" onClick={handleSearch} disabled={isRunning} className="h-8 text-xs">Search</Button>
                <Button size="sm" variant="outline" onClick={handleInsert} disabled={isRunning} className="h-8 text-xs">Insert</Button>
                <Button size="sm" variant="outline" onClick={handleRemove} disabled={isRunning} className="h-8 text-xs">Remove</Button>
                <Button size="sm" variant="outline" onClick={handleInvert} disabled={isRunning} className="h-8 text-xs">Invert</Button>
              </div>
              <div className="flex gap-1.5 pt-1">
                <Button size="sm" variant="outline" onClick={handleRandom} disabled={isRunning} className="h-8 flex-1 text-xs">Random</Button>
                <Button size="sm" variant="outline" onClick={handleStop} disabled={!isRunning} className="h-8 flex-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">Stop</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-h-0 shrink-0 overflow-hidden" style={{ height: FLOW_DIAGRAM_HEIGHT_PX }}>
          <ResizablePanelGroup orientation="horizontal" className="rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden h-full" style={{ height: FLOW_DIAGRAM_HEIGHT_PX }}>
            <ResizablePanel defaultSize={70} minSize={40} className="diagram-container flex flex-col min-h-0 overflow-hidden">
              <Card className="w-full h-full flex flex-col min-h-0 rounded-none border-0 border-r border-gray-200 dark:border-gray-600 overflow-hidden">
                <CardHeader className="diagram-header py-2 px-4 shrink-0">
                  <CardTitle className="text-base">Diagram</CardTitle>
                </CardHeader>
                <CardContent className="diagram-content p-0 pb-0! flex-1 min-h-0 overflow-hidden">
                  <FlowDiagram variant="binary-tree" currentStep={flowStep} locked={diagramLocked} onLockToggle={() => setDiagramLocked((l) => !l)} />
                </CardContent>
              </Card>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20} className="logs-container flex flex-col min-h-0 overflow-hidden">
              <Card className="w-full h-full flex flex-col min-h-0 rounded-none border-0 overflow-hidden">
                <CardHeader className="logs-header p-1 px-4 flex flex-row items-center justify-between space-y-0 shrink-0">
                  <CardTitle className="text-base">Logs</CardTitle>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 cursor-pointer" onClick={() => setLogEntries([])} disabled={logEntries.length === 0} title="Clear logs">
                    <Trash2 className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent className="logs-content flex flex-col flex-1 min-h-0 overflow-y-auto p-0">
                  <Terminal scrollRef={logScrollRef} className="min-h-0 flex-1 overflow-hidden h-full" sequence={false}>
                    {logEntries.length === 0 ? (
                      <TerminalLine className="text-gray-500 dark:text-gray-400">Steps appear when you run an action.</TerminalLine>
                    ) : (
                      logEntries.map((entry, idx) => (
                        <TerminalLine key={idx}><span className="text-gray-400 dark:text-gray-400">[{idx + 1}]</span> {entry}</TerminalLine>
                      ))
                    )}
                  </Terminal>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="py-2 px-4 shrink-0">
          <CardTitle className="text-base">Binary Search Tree</CardTitle>
          <CardDescription className="text-sm wrap-break-word">
            Click Search / Insert / Remove with a value; Invert swaps left and right at every node.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-3 px-4 overflow-hidden" style={{ height: 340 }}>
          <div className="w-full h-full min-h-0 overflow-hidden flex items-center justify-center">
            <TreeSvg root={root} layout={layout} highlightedId={highlightedId} />
          </div>
        </CardContent>
      </Card>

      <CodeSnippet codeByLanguage={algorithm.code} />
    </div>
  );
}
