import React, { useCallback } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, addEdge, Connection, Edge, useNodesState, useEdgesState, OnNodesChange, OnEdgesChange } from 'reactflow';
import { Node } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } }
];
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'step', label: 'connects with' }
];

const DiagramEditor: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
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
          fitView // Center the diagram
          onConnect={onConnect}
          deleteKeyCode={['Delete', 'Backspace']} /* 'delete'-key */
          >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
