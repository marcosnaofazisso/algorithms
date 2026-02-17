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
import { FLOW_DEFINITIONS } from '@/flowDiagram/flowDefinitions';
import { getPositions, type DiagramLayout, type DiagramVariant } from '@/flowDiagram/positions';

/** Height of the Diagram+Logs panel in px. The flow fills the space below the Diagram card header. */
export const FLOW_DIAGRAM_HEIGHT_PX = 360;

export type { DiagramVariant };

interface FlowDiagramProps {
  currentStep: FlowStep;
  variant?: DiagramVariant;
  /** When true, nodes cannot be dragged (lock elements). */
  locked?: boolean;
  onLockToggle?: () => void;
}

const LABEL_STYLE = { fontFamily: '"Noto Serif", serif', fontSize: '12px' };

function FlowDiagramInner({ currentStep, variant = 'linear-search', locked = true, onLockToggle }: FlowDiagramProps) {
  const [panEnabled, setPanEnabled] = useState(false);
  const [layout, setLayout] = useState<DiagramLayout>('vertical');
  const [theme] = useAtom(themeAtom);
  const isDark = theme === 'dark';
  const positions = getPositions(layout, variant);
  const definition = FLOW_DEFINITIONS[variant];

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
    return definition.nodes.map((node) => {
      const pos = positions[node.id] ?? { x: 0, y: 0 };
      const isActive = currentStep === node.id;
      const style = node.decision ? getDecisionNodeStyle(node.id as FlowStep, isActive) : getNodeStyle(node.id as FlowStep, isActive);
      return {
        id: node.id,
        type: 'default',
        position: pos,
        data: { label: node.label },
        style,
      };
    });
  }, [currentStep, layout, variant, isDark, positions, definition.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return definition.edges.map((edge) => {
      const isActive = edge.activeSteps.includes(currentStep);
      const stroke = isActive ? edgeActive : edgeInactive;
      const strokeWidth = isActive ? 2.5 : 1.5;
      const base: Edge = {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        style: { stroke, strokeWidth },
        animated: isActive,
      };
      if (edge.label) {
        base.label = edge.label;
        base.labelStyle = LABEL_STYLE;
        base.labelBgStyle = { fill: labelBg };
      }
      if (edge.smoothstep) {
        base.type = 'smoothstep';
      }
      return base;
    });
  }, [currentStep, variant, isDark, labelBg, edgeActive, edgeInactive, definition.edges]);

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
