import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ComponentNode from './ComponentNode';

const nodeTypes = {
  component: ComponentNode,
};

// Canvas coordinate where the zone boundary is (between public and private)
// Shifted right to give more space to public zone (more components there)
const ZONE_BOUNDARY_X = 550;

const DiagramCanvas = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  return (
    <div className="flex-1 h-full relative">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 150, y: 50, zoom: 0.7 }}
        className="bg-white"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
      >
        {/* Zone backgrounds as canvas elements */}
        <svg className="react-flow__background" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <defs>
            <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.5" fill="#cbd5e1" />
            </pattern>
          </defs>
          {/* Public zone background */}
          <rect x="-10000" y="-10000" width="10425" height="20000" fill="#dbeafe" fillOpacity="0.3" />
          {/* Private zone background */}
          <rect x={ZONE_BOUNDARY_X} y="-10000" width="10000" height="20000" fill="#f3f4f6" fillOpacity="0.3" />
          {/* Vertical divider line */}
          <line x1={ZONE_BOUNDARY_X} y1="-10000" x2={ZONE_BOUNDARY_X} y2="10000" stroke="#9ca3af" strokeWidth="2" />
          {/* Grid pattern */}
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid)" />
        </svg>

        {/* Zone labels as panels */}
        <Panel position="top-left" className="bg-blue-50 bg-opacity-70 px-4 py-2 rounded-md pointer-events-none">
          <span className="text-sm font-semibold text-gray-700 uppercase">
            🌐 Internet / Public
          </span>
        </Panel>
        <Panel position="top-right" className="bg-gray-100 bg-opacity-70 px-4 py-2 rounded-md pointer-events-none">
          <span className="text-sm font-semibold text-gray-700 uppercase">
            🔒 Private Network
          </span>
        </Panel>

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
