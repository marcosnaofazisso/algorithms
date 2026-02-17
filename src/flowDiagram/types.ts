export interface NodeDef {
  id: string;
  label: string;
  decision?: boolean;
}

export interface EdgeDef {
  id: string;
  source: string;
  target: string;
  label?: string;
  smoothstep?: boolean;
  /** Step ids that make this edge active (styled and animated). */
  activeSteps: string[];
}

export interface FlowDefinition {
  nodes: NodeDef[];
  edges: EdgeDef[];
}
