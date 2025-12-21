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
import JsCsBridge from '../utils/JsCsBridge';
import { IVopHost } from '../interfaces/IVopHost';

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

  const saveWorkflow = async () => {
    const workflowData: Workflow = {
      version: workflow.version,
      name: workflow.name,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
      metadata: workflow.metadata
    };
    console.log('Workflow:', workflowData);
    const bridge = JsCsBridge.getInstance();
    try {
      await bridge.invokeMethodAsync('VopPico.App', 'SaveWorkflow');
      console.log('Workflow saved successfully.');
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const testSendCode = async () => {
    const bridge = JsCsBridge.getInstance();
    try {
      await bridge.invokeMethodAsync('VopPico.App', 'SendCodeToDevice', 'console.log("Hello, world!");');
      console.log('Code sent to device successfully.');
    } catch (error) {
      console.error('Error sending code to device:', error);
    }
  };

  const testGetDeviceStatus = async () => {
    const bridge = JsCsBridge.getInstance();
    try {
      console.log('Getting device status...')
      const status = await bridge.invokeMethodAsync('VopPico.App', 'GetDeviceStatus');
      console.log('Device status:', status);
    } catch (error) {
      console.error('Error getting device status:', error);
    }
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
          <button
            onClick={testSendCode}
            style={{ position: 'absolute', top: 10, right: 120, zIndex: 100 }}
          >
            Test Send Code
          </button>
          <button
            onClick={testGetDeviceStatus}
            style={{ position: 'absolute', top: 10, right: 240, zIndex: 100 }}
          >
            Test Get Device Status
          </button>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
