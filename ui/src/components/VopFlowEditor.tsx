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
import { VopFlow, VopFlowNode, VopFlowEdge } from '../interfaces/VopFlowTypes';
import demoVopFlow from '../interfaces/DemoVopFlow.json';
import { IVopHost } from '../interfaces/IVopHost';

interface VopFlowEditorProps {
  showDemoVopFlow?: boolean;
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

const VopFlowEditor: React.FC<VopFlowEditorProps> = ({ showDemoVopFlow = true, vopHost }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<VopFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<VopFlowEdge>([]);
  const [vopFlow, setVopFlow] = useState<VopFlow>({
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
    console.log('init component VopFlowEditor');

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

    if (showDemoVopFlow) {
      setNodes(demoVopFlow.nodes as unknown as VopFlowNode[]);
      setEdges(demoVopFlow.edges as unknown as VopFlowEdge[]);
      setVopFlow(demoVopFlow as unknown as VopFlow);
    }

    return () => {
      // cleanup component
      console.log('cleanup component VopFlowEditor');
      window.removeEventListener("HybridWebViewMessageReceived", onHybridWebViewMessageReceived);
    };
  }, [showDemoVopFlow, setNodes, setEdges, vopHost]);

  const saveVopFlow = async () => {
    const vopFlowData: VopFlow = {
      version: vopFlow.version,
      name: vopFlow.name,
      nodes: nodes as VopFlowNode[],
      edges: edges as VopFlowEdge[],
      metadata: vopFlow.metadata
    };
    console.log('VopFlow:', vopFlowData);
    try {
      await vopHost.saveVopFlow();
      console.log('VopFlow saved successfully.');
    } catch (error) {
      console.error('Error saving VopFlow:', error);
    }
  };

  const loadVopFlow = async () => {
    try {
      // load DemoVopFlow.json
      let vopFlow_data = await fetch('/DemoWorkflow.json').then(res => res.json());
      await vopHost.loadVopFlow(vopFlow_data);
      console.log('VopFlow loaded successfully.');
    } catch (error) {
      console.error('Error loading VopFlow:', error);
    }
  };

  const executeVopFlow = async () => {
    try {
      await vopHost.executeVopFlow();
      console.log('VopFlow executed successfully.');
    } catch (error) {
      console.error('Error executing VopFlow:', error);
    }
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        const updatedEdges = addEdge(params, eds);
        return updatedEdges.map(edge => ({
          ...edge,
          metadata: (edge as VopFlowEdge).metadata || {}
        })) as VopFlowEdge[];
      });

      setVopFlow((prevVopFlow: VopFlow) => {
        const updatedEdges = addEdge(params, prevVopFlow.edges);
        return {
          ...prevVopFlow,
          edges: updatedEdges.map(edge => ({
            ...edge,
            metadata: (edge as VopFlowEdge).metadata || {}
          })) as VopFlowEdge[]
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
            <button onClick={loadVopFlow}>
              Load VopFlow
            </button>
            <button onClick={saveVopFlow}>
              Save VopFlow
            </button>
            <button onClick={vopHost.executeVopFlow}>
              <b>{">"}</b> Execute VopFlow
            </button>
            <button onClick={vopHost.getDeviceStatus}>
              Get Device Status
            </button>
            <button onClick={vopHost.checkCS2JS}>
              Check JS{"<=>"}CS
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

export default VopFlowEditor;
export { logMessage };
