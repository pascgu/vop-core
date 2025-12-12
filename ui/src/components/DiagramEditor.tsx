import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, WorkflowNode, WorkflowEdge } from '../interfaces/WorkflowTypes';
import demoWorkflow from '../interfaces/DemoWorkflow.json';

interface DiagramEditorProps {
  showDemoWorkflow?: boolean;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ showDemoWorkflow = true }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([]);

  const [workflow, setWorkflow] = useState<Workflow>({
    version: '1.0',
    name: '',
    nodes: [],
    edges: [],
    metadata: {
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (showDemoWorkflow) {
      setNodes(demoWorkflow.nodes as unknown as WorkflowNode[]);
      setEdges(demoWorkflow.edges as unknown as WorkflowEdge[]);
      setWorkflow(demoWorkflow as unknown as Workflow);
    }
  }, [showDemoWorkflow, setNodes, setEdges]);

  const saveWorkflow = () => {
    const workflowData: Workflow = {
      version: workflow.version,
      name: workflow.name,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
      metadata: workflow.metadata
    };
    console.log('Workflow saved:', workflowData);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        const updatedEdges = addEdge(params, eds);
        return updatedEdges.map(edge => ({
          ...edge,
          metadata: (edge as WorkflowEdge).metadata || {}
        })) as WorkflowEdge[];
      });

      setWorkflow((prevWorkflow: Workflow) => {
        const updatedEdges = addEdge(params, prevWorkflow.edges);
        return {
          ...prevWorkflow,
          edges: updatedEdges.map(edge => ({
            ...edge,
            metadata: (edge as WorkflowEdge).metadata || {}
          })) as WorkflowEdge[]
        };
      });
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange as OnNodesChange}
          onEdgesChange={onEdgesChange as OnEdgesChange}
          fitView
          onConnect={onConnect}
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <Background />
          <Controls />
          <button
            onClick={saveWorkflow}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}
          >
            Save Workflow
          </button>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
