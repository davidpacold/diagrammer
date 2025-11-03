import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ComponentNode from './ComponentNode';

const nodeTypes = {
  component: ComponentNode,
};

const DiagramCanvas = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  return (
    <div className="flex-1 h-full relative">
      {/* Split Background Labels */}
      <div className="absolute top-0 left-0 right-0 z-10 flex h-12 pointer-events-none">
        <div className="w-1/2 flex items-center justify-center bg-blue-50 bg-opacity-50">
          <span className="text-sm font-semibold text-gray-600 uppercase">
            🌐 Internet / Public
          </span>
        </div>
        <div className="w-1/2 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <span className="text-sm font-semibold text-gray-600 uppercase">
            🔒 Private Network
          </span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 50, y: 50, zoom: 0.52 }}
        className="bg-gradient-to-r from-blue-50 via-blue-50 to-gray-50"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
      >
        {/* Vertical divider line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 pointer-events-none z-0" />

        <Background color="#cbd5e1" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return node.data.zone === 'public' ? '#93c5fd' : '#cbd5e1';
          }}
          className="bg-white border border-gray-200"
        />
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
