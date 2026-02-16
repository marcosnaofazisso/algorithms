import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store/theme';
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

/** Height of the Diagram+Logs panel in px. The flow fills the space below the Diagram card header. */
export const FLOW_DIAGRAM_HEIGHT_PX = 360;

type DiagramLayout = 'vertical' | 'horizontal';
type DiagramVariant = 'linear-search' | 'binary-search';

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

// Binary search: vertical
const BINARY_VERTICAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 250, y: 0 },
  init: { x: 250, y: 80 },
  check: { x: 250, y: 160 },
  mid: { x: 250, y: 240 },
  compare: { x: 250, y: 320 },
  found: { x: 450, y: 320 },
  'go-left': { x: 80, y: 420 },
  'go-right': { x: 420, y: 420 },
  'not-found': { x: 450, y: 160 },
};

// Binary search: horizontal
const BINARY_HORIZONTAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 0, y: 200 },
  init: { x: 200, y: 200 },
  check: { x: 400, y: 200 },
  mid: { x: 600, y: 200 },
  compare: { x: 800, y: 280 },
  found: { x: 1000, y: 120 },
  'go-left': { x: 680, y: 400 },
  'go-right': { x: 920, y: 400 },
  'not-found': { x: 400, y: 60 },
};

function getPositions(layout: DiagramLayout, variant: DiagramVariant): Record<string, { x: number; y: number }> {
  if (variant === 'binary-search') {
    return layout === 'horizontal' ? BINARY_HORIZONTAL_POSITIONS : BINARY_VERTICAL_POSITIONS;
  }
  return layout === 'horizontal' ? HORIZONTAL_POSITIONS : VERTICAL_POSITIONS;
}

interface FlowDiagramProps {
  currentStep: FlowStep;
  variant?: DiagramVariant;
  /** When true, nodes cannot be dragged (lock elements). */
  locked?: boolean;
  onLockToggle?: () => void;
}

function FlowDiagramInner({ currentStep, variant = 'linear-search', locked = true, onLockToggle }: FlowDiagramProps) {
  const [panEnabled, setPanEnabled] = useState(false);
  const [layout, setLayout] = useState<DiagramLayout>('vertical');
  const [theme] = useAtom(themeAtom);
  const isDark = theme === 'dark';
  const positions = getPositions(layout, variant);

  const activeBg = isDark ? '#E5E7EB' : '#000000';
  const activeFg = isDark ? '#000000' : '#FFFFFF';
  const inactiveBg = isDark ? '#374151' : '#FFFFFF';
  const inactiveFg = isDark ? '#E5E7EB' : '#000000';
  const inactiveBorder = isDark ? '#4B5563' : '#E5E7EB';
  const edgeActive = isDark ? '#E5E7EB' : '#000000';
  const edgeInactive = '#9CA3AF';
  const labelBg = isDark ? '#374151' : '#FFFFFF';

  const getNodeStyle = (_nodeId: FlowStep, isActive: boolean) => ({
    background: isActive ? activeBg : inactiveBg,
    color: isActive ? activeFg : inactiveFg,
    border: isActive ? `2px solid ${activeBg}` : `1px solid ${inactiveBorder}`,
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
    background: isActive ? activeBg : inactiveBg,
    color: isActive ? activeFg : inactiveFg,
    border: isActive ? `2px solid ${activeBg}` : `1px solid ${inactiveBorder}`,
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

  const initialNodes: Node[] = useMemo(() => {
    if (variant === 'binary-search') {
      return [
        { id: 'start', type: 'default', position: positions.start, data: { label: 'Start' }, style: getNodeStyle('start', currentStep === 'start') },
        { id: 'init', type: 'default', position: positions.init, data: { label: 'left=0, right=n-1' }, style: getNodeStyle('init', currentStep === 'init') },
        { id: 'check', type: 'default', position: positions.check, data: { label: 'left <= right?' }, style: getDecisionNodeStyle('check', currentStep === 'check') },
        { id: 'mid', type: 'default', position: positions.mid, data: { label: 'mid = (L+R)/2' }, style: getNodeStyle('mid', currentStep === 'mid') },
        { id: 'compare', type: 'default', position: positions.compare, data: { label: 'arr[mid] == target?' }, style: getDecisionNodeStyle('compare', currentStep === 'compare') },
        { id: 'found', type: 'default', position: positions.found, data: { label: 'Return mid' }, style: getNodeStyle('found', currentStep === 'found') },
        { id: 'go-left', type: 'default', position: positions['go-left'], data: { label: 'right = mid-1' }, style: getNodeStyle('go-left', currentStep === 'go-left') },
        { id: 'go-right', type: 'default', position: positions['go-right'], data: { label: 'left = mid+1' }, style: getNodeStyle('go-right', currentStep === 'go-right') },
        { id: 'not-found', type: 'default', position: positions['not-found'], data: { label: 'Return -1' }, style: getNodeStyle('not-found', currentStep === 'not-found') },
      ];
    }
    return [
      { id: 'start', type: 'default', position: positions.start, data: { label: 'Start' }, style: getNodeStyle('start', currentStep === 'start') },
      { id: 'init', type: 'default', position: positions.init, data: { label: 'i = 0' }, style: getNodeStyle('init', currentStep === 'init') },
      { id: 'check-length', type: 'default', position: positions['check-length'], data: { label: 'i < length?' }, style: getDecisionNodeStyle('check-length', currentStep === 'check-length') },
      { id: 'compare', type: 'default', position: positions.compare, data: { label: 'arr[i] == target?' }, style: getDecisionNodeStyle('compare', currentStep === 'compare') },
      { id: 'found', type: 'default', position: positions.found, data: { label: 'Return i' }, style: getNodeStyle('found', currentStep === 'found') },
      { id: 'increment', type: 'default', position: positions.increment, data: { label: 'i++' }, style: getNodeStyle('increment', currentStep === 'increment') },
      { id: 'not-found', type: 'default', position: positions['not-found'], data: { label: 'Return -1' }, style: getNodeStyle('not-found', currentStep === 'not-found') },
    ];
  }, [currentStep, layout, variant, isDark, positions]);

  const initialEdges: Edge[] = useMemo(() => {
    if (variant === 'binary-search') {
      return [
        { id: 'e-start-init', source: 'start', target: 'init', style: { stroke: currentStep === 'start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'start' ? 2.5 : 1.5 }, animated: currentStep === 'start' },
        { id: 'e-init-check', source: 'init', target: 'check', style: { stroke: currentStep === 'init' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'init' ? 2.5 : 1.5 }, animated: currentStep === 'init' },
        { id: 'e-check-mid', source: 'check', target: 'mid', label: 'Yes', style: { stroke: currentStep === 'check' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'check' ? 2.5 : 1.5 }, animated: currentStep === 'check', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-check-notfound', source: 'check', target: 'not-found', label: 'No', style: { stroke: currentStep === 'not-found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'not-found' ? 2.5 : 1.5 }, animated: currentStep === 'not-found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-mid-compare', source: 'mid', target: 'compare', style: { stroke: currentStep === 'mid' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'mid' ? 2.5 : 1.5 }, animated: currentStep === 'mid' },
        { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', style: { stroke: currentStep === 'compare' || currentStep === 'found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'compare' || currentStep === 'found' ? 2.5 : 1.5 }, animated: currentStep === 'compare' || currentStep === 'found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-compare-goleft', source: 'compare', target: 'go-left', label: 'No, >', style: { stroke: currentStep === 'go-left' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'go-left' ? 2.5 : 1.5 }, animated: currentStep === 'go-left', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-compare-goright', source: 'compare', target: 'go-right', label: 'No, <', style: { stroke: currentStep === 'go-right' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'go-right' ? 2.5 : 1.5 }, animated: currentStep === 'go-right', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-goleft-check', source: 'go-left', target: 'check', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
        { id: 'e-goright-check', source: 'go-right', target: 'check', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
      ];
    }
    return [
      { id: 'e-start-init', source: 'start', target: 'init', style: { stroke: currentStep === 'start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'start' ? 2.5 : 1.5 }, animated: currentStep === 'start' },
      { id: 'e-init-check', source: 'init', target: 'check-length', style: { stroke: currentStep === 'init' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'init' ? 2.5 : 1.5 }, animated: currentStep === 'init' },
      { id: 'e-check-compare', source: 'check-length', target: 'compare', label: 'Yes', style: { stroke: currentStep === 'check-length' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'check-length' ? 2.5 : 1.5 }, animated: currentStep === 'check-length', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-check-notfound', source: 'check-length', target: 'not-found', label: 'No', style: { stroke: edgeInactive, strokeWidth: 1.5 }, animated: false, labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', style: { stroke: currentStep === 'compare' || currentStep === 'found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'compare' || currentStep === 'found' ? 2.5 : 1.5 }, animated: currentStep === 'compare' || currentStep === 'found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-compare-increment', source: 'compare', target: 'increment', label: 'No', style: { stroke: currentStep === 'increment' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'increment' ? 2.5 : 1.5 }, animated: currentStep === 'increment', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-increment-check', source: 'increment', target: 'check-length', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
    ];
  }, [currentStep, variant, isDark, labelBg, edgeActive, edgeInactive]);

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
          ? {
              ...edge,
              style: fromInitial.style,
              animated: fromInitial.animated,
              label: fromInitial.label,
              labelStyle: fromInitial.labelStyle,
              labelBgStyle: fromInitial.labelBgStyle,
            }
          : edge;
      })
    );
  }, [currentStep, initialNodes, initialEdges, setNodes, setEdges]);

  // Default view: fit on mount
  useEffect(() => {
    fitView({ padding: 0.3, maxZoom: 1, duration: 0 });
  }, [fitView]);

  // When layout or variant changes: update node positions and fit view so edges remain visible
  useEffect(() => {
    const pos = getPositions(layout, variant);
    setNodes((nds) => nds.map((n) => ({ ...n, position: pos[n.id] ?? n.position })));
    const t = setTimeout(() => fitView({ padding: 0.25, maxZoom: 1, duration: 300 }), 0);
    return () => clearTimeout(t);
  }, [layout, variant, setNodes, fitView]);

  return (
    <div className="w-full h-full min-h-0 border border-gray-200 dark:border-gray-500 rounded-lg overflow-hidden bg-white dark:bg-[#0f1117]">
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
        <Background color={isDark ? '#4B5563' : '#E5E7EB'} gap={16} size={1} />
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

export default function FlowDiagram({ currentStep, variant = 'linear-search', locked = true, onLockToggle }: FlowDiagramProps) {
  return (
    <ReactFlowProvider initialWidth={800} initialHeight={FLOW_DIAGRAM_HEIGHT_PX} fitView>
      <FlowDiagramInner currentStep={currentStep} variant={variant} locked={locked} onLockToggle={onLockToggle} />
    </ReactFlowProvider>
  );
}
