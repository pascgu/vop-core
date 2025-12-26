import { Node, Edge, XYPosition } from 'reactflow';

export type VopFlowNode = Node & {
  type: 'input' | 'output' | 'processing';
  properties: any;
  position: XYPosition;
};

export type VopFlowEdge = Edge & {
  metadata: any;
};

export interface VopFlowMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface VopFlow {
  version: string;
  name: string;
  nodes: VopFlowNode[];
  edges: VopFlowEdge[];
  metadata: VopFlowMetadata;
}
