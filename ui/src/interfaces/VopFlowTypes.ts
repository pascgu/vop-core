import { Node, Edge } from 'reactflow';

// Node types in VopFlow v1.2
export type VopFlowNodeType =
  | 'start'
  | 'import'
  | 'function-call'
  | 'method-call'
  | 'loop'
  | 'condition'
  | 'variable'
  | 'literal'
  | string;         // Allow custom types

// Input port definition
export interface VopFlowInputPort {
  default?: any;    // Default value when no data-flow edge is connected
}

// Output binding
export interface VopFlowOutput {
  name: string;     // Variable name this node's result is assigned to
}

// Data structure for nodes (mixed: common fields + type-specific fields)
export interface VopFlowNodeData {
  label: string;
  target?: string; // Target language (micropython, python, arduino, etc.)

  // Import-specific
  module?: string;
  alias?: string;

  // Function-call specific
  function?: string;

  // Method-call specific
  method?: string;
  object?: string;  // For static/module calls (e.g., "machine")

  // Loop-specific
  loopType?: 'for' | 'while';
  iterator?: string;
  condition?: string;

  // Variable-specific
  name?: string;
  value?: any;

  // Literal-specific
  valueType?: 'integer' | 'float' | 'string' | 'boolean' | 'list';

  // Structured inputs
  inputs?: Record<string, VopFlowInputPort>;

  // Output variable binding
  output?: VopFlowOutput;

  // Future: namespace for sub-flow organization
  namespace?: string;

  // Allow additional custom fields
  [key: string]: any;
}

export type VopFlowNode = Node<VopFlowNodeData, VopFlowNodeType>;

// Edge metadata for typed connections
export interface VopFlowEdgeMetadata {
  flowType?: 'control-flow' | 'data-flow';
  [key: string]: any;
}

export type VopFlowEdge = Edge & {
  sourceHandle?: string;
  targetHandle?: string;
  metadata?: VopFlowEdgeMetadata;
};

export interface VopFlowMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface VopFlow {
  version: string;
  name: string;
  metadata?: VopFlowMetadata;
  nodes: VopFlowNode[];
  edges: VopFlowEdge[];
}
