import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider, Background, Controls, addEdge, Connection, Edge, Node,
  useNodesState, useEdgesState, OnNodesChange, OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { VopFlow, VopFlowNode, VopFlowEdge } from '../interfaces/VopFlowTypes';
import demoVopFlow from '../interfaces/DemoVopFlow.json';
import { IVopHost, LogMessageType } from '../interfaces/IVopHost';

interface VopFlowEditorProps {
  showDemoVopFlow?: boolean;
  vopHost: IVopHost;
}

declare global {
    interface Window {
        vopHost: IVopHost;
        logMessage: (message: string, type?: LogMessageType) => void;
    }
}

const messageQueue: { message: string; type?: LogMessageType }[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (messageQueue.length > 0) {
    const { message, type } = messageQueue.shift()!;
    try {
      if (type === 'error') {
        console.error(message);
      } else if (type === 'warning') {
        console.warn(message);
      } else if (type === 'code') {
        console.log('c> '+message);
      } else {
        console.log(message);
      }

      await new Promise(resolve => requestAnimationFrame(resolve));

      const logDiv = document.getElementById('logDiv');
      if (logDiv) {
        const newLog = document.createElement('div');
        newLog.textContent = message;
        if (type === 'error') {
          newLog.style.color = 'red';
        } else if (type === 'warning') {
          newLog.style.color = 'orange';
        } else if (type === 'code') {
          newLog.style.color = 'cyan';
        }
        logDiv.appendChild(newLog);
        logDiv.scrollTop = logDiv.scrollHeight;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
  isProcessingQueue = false;
};

const logMessage = async (message: string, type?: LogMessageType) => {
  messageQueue.push({ message, type });
  await processQueue();
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
  const [serialPorts, setSerialPorts] = useState<{ portName: string; details: string }[]>([]);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  useEffect(() => {
    // init component
    console.log('init component VopFlowEditor');

    // create shortcuts for vopHost and logMessage in the window object
    window.vopHost = vopHost;
    window.logMessage = logMessage;
    let last_msg = '';
    let last_time = 0;
    const onHybridWebViewMessageReceived = async (e: Event) => {
        if (e instanceof CustomEvent) {
          if ( Date.now() - last_time > 100 || last_msg != e.detail.message) { // hack to avoid 2nd raise of the same message
            window.vopHost.onRawMessageReceived(e.detail.message);
          } else {
            await logMessage('JS onRawMessageReceived ignoring duplicate message', 'warning');
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
      const processedVopFlowData = await vopHost.onSavingVopFlow(vopFlowData);
      console.log('Processed VopFlow Data:', processedVopFlowData);
      if (processedVopFlowData) {
        const blob = new Blob([processedVopFlowData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vopflow-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('VopFlow saved successfully.');
      } else {
        console.error('Error processing VopFlow data.');
      }
    } catch (error) {
      console.error('Error saving VopFlow:', error);
    }
  };

  const loadVopFlow = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const vopFlowJson = e.target?.result as string;
          try {
            const vopFlowData = await vopHost.onLoadingVopFlow(vopFlowJson);
            setNodes(vopFlowData.nodes as unknown as VopFlowNode[]);
            setEdges(vopFlowData.edges as unknown as VopFlowEdge[]);
            setVopFlow(vopFlowData);
            await logMessage('VopFlow loaded successfully.');
          } catch (error) {
            await logMessage('Error loading VopFlow: ' + JSON.stringify(error), 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const listSerialPorts = async () => {
    try {
      const ports = await vopHost.listSerialPorts();
      setSerialPorts(ports.map(port => {
        const [portName, details] = port.split(' (');
        return { portName, details: details ? details.slice(0, -1) : '' };
      }));
      console.log('Available serial ports:', ports);

      // Auto-connect if only one device is found
      if (ports.length === 1) {
        const portName = ports[0].split(' (')[0];
        console.log(`Only one device found, auto-connecting to: ${portName}`);
        await logMessage(`Auto-connecting to single device: ${portName}`);
        await selectSerialPort(portName);
      }
    } catch (error) {
      console.error('Error listing serial ports:', error);
    }
  };

  const selectSerialPort = async (portName: string) => {
    try {
      const selectedPort = await vopHost.selectSerialPort(portName);
      setSelectedPort(selectedPort);
      console.log('Selected serial port:', selectedPort);
    } catch (error) {
      console.error('Error selecting serial port:', error);
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

  const sendTestMessageToPico = async () => {
    try {
      await window.vopHost.sendCodeToDevice("print('from VoP '+str(1*2)+' Pico')");
    } catch (error) {
      console.error("Error sending test message to Pico:", error);
      await logMessage(`Error sending test message to Pico: ${JSON.stringify(error)}`);
    }
  };

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
            <div style={{ border: '1px solid #ccc', padding: '2px', marginTop: '3px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2px' }}>
                <label style={{ fontSize: 'small' }}>Tests C#{"<=>"}JS</label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '10px', paddingRight: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                  <button onClick={vopHost.JSeval}>
                    JSeval
                  </button>
                  <button onClick={vopHost.JSinvoke}>
                    JSinvoke
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button onClick={vopHost.JSraw}>
                    JSraw
                  </button>
                  <button onClick={vopHost.CSraw}>
                    C#raw
                  </button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button onClick={listSerialPorts}>
                List Serial Ports
              </button>
            </div>
            {serialPorts.length > 0 && (
              <select onChange={(e) => selectSerialPort(e.target.value)} value={selectedPort || ''}>
                <option value="">Select a serial port</option>
                {serialPorts.map((port) => (
                  <option key={port.portName} value={port.portName}>
                    {port.details ? `${port.portName} (${port.details})` : port.portName}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={sendTestMessageToPico}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Send Test Message
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
                wordWrap: 'break-word',
                textAlign: 'left'
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
