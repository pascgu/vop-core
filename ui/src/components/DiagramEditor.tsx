import React, { useCallback, useState, useEffect, useRef } from 'react';
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

declare global {
    interface Window {
        vopHost: IVopHost;
        logMessage: (message: string, type?: 'error' | 'warning') => void;
    }
}

const logMessage = (message: string, type?: 'error' | 'warning') => {
  if (type === 'error') {
    console.error(message);
  } else if (type === 'warning') {
    console.warn(message);
  } else {
    console.log(message);
  }

  const logDiv = document.getElementById('logDiv');
  if (logDiv) {
    const newLog = document.createElement('div');
    newLog.textContent = message;
    if (type === 'error') {
      newLog.style.color = 'red';
    } else if (type === 'warning') {
      newLog.style.color = 'orange';
    }
    logDiv.insertBefore(newLog, logDiv.firstChild);
  }
};


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
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // init component
    console.log('init component DiagramEditor');
    
    // create shortcuts for vopHost and logMessage in the window object
    window.vopHost = vopHost;
    window.logMessage = logMessage;
    let last_msg = '';
    let last_time = 0;
    const onHybridWebViewMessageReceived = (e: Event) => {
        if (e instanceof CustomEvent) {
          if ( Date.now() - last_time > 100 || last_msg != e.detail.message) { // hack to avoid 2nd raise of the same message
            window.vopHost.onRawMessageReceived(e.detail.message);
          } else {
            logMessage('JS onRawMessageReceived ignoring duplicate message', 'warning');
          }
          last_msg = e.detail.message;
          last_time = Date.now();
        }
    };
    window.addEventListener("HybridWebViewMessageReceived", onHybridWebViewMessageReceived);

    if (showDemoWorkflow) {
      setNodes(demoWorkflow.nodes as unknown as WorkflowNode[]);
      setEdges(demoWorkflow.edges as unknown as WorkflowEdge[]);
      setWorkflow(demoWorkflow as unknown as Workflow);
    }

    return () => {
      // cleanup component
      console.log('cleanup component DiagramEditor');
      window.removeEventListener("HybridWebViewMessageReceived", onHybridWebViewMessageReceived);
    };
  }, [showDemoWorkflow, setNodes, setEdges, vopHost]);

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
            <button onClick={loadWorkflow}>
              Load Workflow
            </button>
            <button onClick={saveWorkflow}>
              Save Workflow
            </button>
            <button onClick={vopHost.executeWorkflow}>
              <b>&gt;</b> Execute Workflow
            </button>
            <button onClick={vopHost.getDeviceStatus}>
              Get Device Status
            </button>
            <button onClick={vopHost.checkCS2JS}>
              Check JS&lt;=&gt;CS
            </button>
            <div
              id="logDiv"
              ref={logRef}
              style={{
                width: '150px',
                height: '400px',
                overflowY: 'auto',
                padding: '10px',
                border: '1px solid #ccc',
                fontSize: '10px',
                marginTop: '10px',
                wordWrap: 'break-word'
              }}
            >
            </div>
          </div>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );

};

export default DiagramEditor;
export { logMessage };
