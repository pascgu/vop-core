import { Node, Edge, XYPosition } from 'reactflow';

// Node Types
export type VopFlowNodeType =
  | 'import'
  | 'start'
  | 'function_call'
  | 'method_call'
  | 'loop'
  | 'conditional'
  | 'variable'
  | 'comment';

export interface VopFlowNodeData {
  module?: string;
  symbols?: string[];
  alias?: string | null;
  prototype?: string;
  target?: string;
  method?: string;
  loop_type?: 'for' | 'while';
  inputs?: Array<{
    id: string;
    type: string;
    value?: any;
  }>;
  outputs?: Array<{
    id: string;
    type: string;
  }>;
  properties?: {
    label?: string;
    [key: string]: any;
  };
}

export type VopFlowNode = Node & {
  type: VopFlowNodeType;
  data: VopFlowNodeData;
  position: XYPosition;
};

export type VopFlowEdgeType = 'flow' | 'data';

export interface VopFlowEdgeData {
  label?: string;
  [key: string]: any;
}

export type VopFlowEdge = Edge & {
  type: VopFlowEdgeType;
  animated?: boolean;
  data?: VopFlowEdgeData;
};

export interface VopFlowMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface VopFlow {
  version: string;
  name: string;
  metadata: VopFlowMetadata;
  nodes: VopFlowNode[];
  edges: VopFlowEdge[];
}
