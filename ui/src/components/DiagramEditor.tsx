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
import { IVopHost } from '../interfaces/IVopHost';

interface DiagramEditorProps {
  showDemoWorkflow?: boolean;
  vopHost: IVopHost;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ showDemoWorkflow = true, vopHost }) => {
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
    try {
      await vopHost.saveWorkflow();
      console.log('Workflow saved successfully.');
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const sendCodeToDevice = async () => {
    try {
      await vopHost.sendCodeToDevice('console.log("Hello, world!");');
      console.log('Code sent to device successfully.');
    } catch (error) {
      console.error('Error sending code to device:', error);
    }
  };

  const receiveDataFromDevice = async () => {
    try {
      await vopHost.receiveDataFromDevice({ message: 'Device is ready' });
      console.log('Data received from device successfully.');
    } catch (error) {
      console.error('Error receiving data from device:', error);
    }
  };

  const loadWorkflow = async () => {
    try {
      await vopHost.loadWorkflow({ /* workflow data */ });
      console.log('Workflow loaded successfully.');
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  };

  const executeWorkflow = async () => {
    try {
      await vopHost.executeWorkflow();
      console.log('Workflow executed successfully.');
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const onNodeExecutionStart = async () => {
    try {
      await vopHost.onNodeExecutionStart('nodeId');
      console.log('Node execution start handled successfully.');
    } catch (error) {
      console.error('Error handling node execution start:', error);
    }
  };

  const onNodeExecutionEnd = async () => {
    try {
      await vopHost.onNodeExecutionEnd('nodeId');
      console.log('Node execution end handled successfully.');
    } catch (error) {
      console.error('Error handling node execution end:', error);
    }
  };

  const onWorkflowExecutionError = async () => {
    try {
      await vopHost.onWorkflowExecutionError({ message: 'Error occurred' });
      console.log('Workflow execution error handled successfully.');
    } catch (error) {
      console.error('Error handling workflow execution error:', error);
    }
  };

  const onRawMessageReceived = async () => {
    try {
      await vopHost.onRawMessageReceived('Raw message received');
      console.log('Raw message received handled successfully.');
    } catch (error) {
      console.error('Error handling raw message received:', error);
    }
  };

  const getDeviceStatus = async () => {
    try {
      const status = await vopHost.getDeviceStatus();
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
          <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <button onClick={saveWorkflow}>
              Save Workflow
            </button>
            <button onClick={sendCodeToDevice}>
              Send Code to Device
            </button>
            <button onClick={receiveDataFromDevice}>
              Receive Data from Device
            </button>
            <button onClick={loadWorkflow}>
              Load Workflow
            </button>
            <button onClick={executeWorkflow}>
              Execute Workflow
            </button>
            <button onClick={onNodeExecutionStart}>
              Node Execution Start
            </button>
            <button onClick={onNodeExecutionEnd}>
              Node Execution End
            </button>
            <button onClick={onWorkflowExecutionError}>
              Workflow Execution Error
            </button>
            <button onClick={onRawMessageReceived}>
              Raw Message Received
            </button>
            <button onClick={getDeviceStatus}>
              Get Device Status
            </button>
          </div>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
