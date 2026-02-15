import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Columns, Hand, Lock, LockOpen, Rows } from 'lucide-react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowStep } from '@/types/algorithms';

type DiagramLayout = 'vertical' | 'horizontal';

const VERTICAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 250, y: 0 },
  init: { x: 250, y: 100 },
  'check-length': { x: 220, y: 200 },
  compare: { x: 200, y: 320 },
  found: { x: 450, y: 320 },
  increment: { x: 50, y: 440 },
  'not-found': { x: 450, y: 200 },
};

// Horizontal layout: generous spacing (260px x, 140px y) so edges are clearly visible
const HORIZONTAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 0, y: 200 },
  init: { x: 260, y: 200 },
  'check-length': { x: 520, y: 200 },
  compare: { x: 780, y: 340 },
  found: { x: 1040, y: 200 },
  increment: { x: 780, y: 480 },
  'not-found': { x: 780, y: 60 },
};

function getPositions(layout: DiagramLayout): Record<string, { x: number; y: number }> {
  return layout === 'horizontal' ? HORIZONTAL_POSITIONS : VERTICAL_POSITIONS;
}

interface FlowDiagramProps {
  currentStep: FlowStep;
  /** When true, nodes cannot be dragged (lock elements). */
  locked?: boolean;
  onLockToggle?: () => void;
}

function FlowDiagramInner({ currentStep, locked = true, onLockToggle }: FlowDiagramProps) {
  const [panEnabled, setPanEnabled] = useState(true);
  const [layout, setLayout] = useState<DiagramLayout>('vertical');
  const positions = getPositions(layout);
  // Node styles: no transform/scale so the diagram stays static
  const getNodeStyle = (_nodeId: FlowStep, isActive: boolean) => ({
    background: isActive ? '#000000' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#000000',
    border: isActive ? '2px solid #000000' : '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: '"Noto Serif", serif',
    minWidth: '120px',
    textAlign: 'center' as const,
    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
  });

  const getDecisionNodeStyle = (_nodeId: FlowStep, isActive: boolean) => ({
    background: isActive ? '#000000' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#000000',
    border: isActive ? '2px solid #000000' : '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    fontFamily: '"Noto Serif", serif',
    width: '140px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
  });

  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'start',
      type: 'default',
      position: positions.start,
      data: { label: 'Start' },
      style: getNodeStyle('start', currentStep === 'start'),
    },
    {
      id: 'init',
      type: 'default',
      position: positions.init,
      data: { label: 'i = 0' },
      style: getNodeStyle('init', currentStep === 'init'),
    },
    {
      id: 'check-length',
      type: 'default',
      position: positions['check-length'],
      data: { label: 'i < length?' },
      style: getDecisionNodeStyle('check-length', currentStep === 'check-length'),
    },
    {
      id: 'compare',
      type: 'default',
      position: positions.compare,
      data: { label: 'arr[i] == target?' },
      style: getDecisionNodeStyle('compare', currentStep === 'compare'),
    },
    {
      id: 'found',
      type: 'default',
      position: positions.found,
      data: { label: 'Return i' },
      style: getNodeStyle('found', currentStep === 'found'),
    },
    {
      id: 'increment',
      type: 'default',
      position: positions.increment,
      data: { label: 'i++' },
      style: getNodeStyle('increment', currentStep === 'increment'),
    },
    {
      id: 'not-found',
      type: 'default',
      position: positions['not-found'],
      data: { label: 'Return -1' },
      style: getNodeStyle('not-found', currentStep === 'not-found'),
    },
  ], [currentStep, layout]);

  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'e-start-init',
      source: 'start',
      target: 'init',
      style: { stroke: currentStep === 'start' ? '#000000' : '#9CA3AF', strokeWidth: currentStep === 'start' ? 2.5 : 1.5 },
      animated: currentStep === 'start',
    },
    {
      id: 'e-init-check',
      source: 'init',
      target: 'check-length',
      style: { stroke: currentStep === 'init' ? '#000000' : '#9CA3AF', strokeWidth: currentStep === 'init' ? 2.5 : 1.5 },
      animated: currentStep === 'init',
    },
    {
      id: 'e-check-compare',
      source: 'check-length',
      target: 'compare',
      label: 'Yes',
      style: { stroke: currentStep === 'check-length' ? '#000000' : '#9CA3AF', strokeWidth: currentStep === 'check-length' ? 2.5 : 1.5 },
      animated: currentStep === 'check-length',
      labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' },
      labelBgStyle: { fill: '#FFFFFF' },
    },
    {
      id: 'e-check-notfound',
      source: 'check-length',
      target: 'not-found',
      label: 'No',
      style: { stroke: '#9CA3AF', strokeWidth: 1.5 },
      animated: false,
      labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' },
      labelBgStyle: { fill: '#FFFFFF' },
    },
    {
      id: 'e-compare-found',
      source: 'compare',
      target: 'found',
      label: 'Yes',
      style: { stroke: currentStep === 'compare' || currentStep === 'found' ? '#000000' : '#9CA3AF', strokeWidth: currentStep === 'compare' || currentStep === 'found' ? 2.5 : 1.5 },
      animated: currentStep === 'compare' || currentStep === 'found',
      labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' },
      labelBgStyle: { fill: '#FFFFFF' },
    },
    {
      id: 'e-compare-increment',
      source: 'compare',
      target: 'increment',
      label: 'No',
      style: { stroke: currentStep === 'increment' ? '#000000' : '#9CA3AF', strokeWidth: currentStep === 'increment' ? 2.5 : 1.5 },
      animated: currentStep === 'increment',
      labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' },
      labelBgStyle: { fill: '#FFFFFF' },
    },
    {
      id: 'e-increment-check',
      source: 'increment',
      target: 'check-length',
      style: { stroke: '#9CA3AF', strokeWidth: 1.5 },
      type: 'smoothstep',
      animated: false,
    },
  ], [currentStep]);

  const togglePan = () => setPanEnabled((p) => !p);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();

  // On step change: only update styles (and edge styles), preserve node positions so user drags are kept
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const fromInitial = initialNodes.find((n) => n.id === node.id);
        return fromInitial ? { ...node, style: fromInitial.style, data: fromInitial.data } : node;
      })
    );
    setEdges((current) =>
      current.map((edge) => {
        const fromInitial = initialEdges.find((e) => e.id === edge.id);
        return fromInitial
          ? { ...edge, style: fromInitial.style, animated: fromInitial.animated, label: fromInitial.label }
          : edge;
      })
    );
  }, [currentStep, initialNodes, initialEdges, setNodes, setEdges]);

  // Default view: fit on mount
  useEffect(() => {
    fitView({ padding: 0.3, maxZoom: 1, duration: 0 });
  }, [fitView]);

  // When layout changes: update node positions and fit view so edges remain visible
  useEffect(() => {
    const pos = getPositions(layout);
    setNodes((nds) => nds.map((n) => ({ ...n, position: pos[n.id] ?? n.position })));
    const t = setTimeout(() => fitView({ padding: 0.25, maxZoom: 1, duration: 300 }), 0);
    return () => clearTimeout(t);
  }, [layout, setNodes, fitView]);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ width: '100%', height: 360 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1, duration: 0 }}
        attributionPosition="bottom-left"
        nodesDraggable={!locked}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={panEnabled}
        panOnScroll={panEnabled}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        minZoom={0.5}
        maxZoom={1.5}
        style={{ width: '100%', height: '100%' }}
      >
        <Background color="#E5E7EB" gap={16} size={1} />
        <Controls position="bottom-left" showInteractive={false}>
          <ControlButton
            onClick={() => setLayout((l) => (l === 'vertical' ? 'horizontal' : 'vertical'))}
            title={layout === 'vertical' ? 'Switch to horizontal layout' : 'Switch to vertical layout'}
            style={{ background: layout === 'horizontal' ? 'rgba(0,0,0,0.06)' : undefined }}
          >
            {layout === 'vertical' ? <Columns className="size-4" /> : <Rows className="size-4" />}
          </ControlButton>
          <ControlButton
            onClick={togglePan}
            title={panEnabled ? 'Pan on (click to disable)' : 'Pan off (click to enable)'}
            style={{ background: panEnabled ? undefined : 'rgba(0,0,0,0.05)' }}
          >
            <Hand className="size-4" />
          </ControlButton>
          {onLockToggle && (
            <ControlButton
              onClick={onLockToggle}
              title={locked ? 'Unlock to move elements' : 'Lock elements'}
            >
              {locked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
            </ControlButton>
          )}
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default function FlowDiagram({ currentStep, locked = true, onLockToggle }: FlowDiagramProps) {
  return (
    <ReactFlowProvider initialWidth={800} initialHeight={360} fitView>
      <FlowDiagramInner currentStep={currentStep} locked={locked} onLockToggle={onLockToggle} />
    </ReactFlowProvider>
  );
}
