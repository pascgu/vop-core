import { Node, Edge, XYPosition } from 'reactflow';

export type WorkflowNode = Node & {
  type: 'input' | 'output' | 'processing';
  properties: any;
  position: XYPosition;
};

export type WorkflowEdge = Edge & {
  metadata: any;
};

export interface WorkflowMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  version: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: WorkflowMetadata;
}