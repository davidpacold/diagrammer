import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ComponentNode from './ComponentNode';
import BoundaryBoxNode from './BoundaryBoxNode';
import ZoneBackgroundNode from './ZoneBackgroundNode';
import { EDGE_STYLES, DEFAULT_ZONE_LABELS, GRID_SIZE } from '../constants';

const nodeTypes = {
  component: ComponentNode,
  boundaryBox: BoundaryBoxNode,
  zoneBackground: ZoneBackgroundNode,
};

const DiagramCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, selectedNodeId, onPaneClick, zoneLabels = DEFAULT_ZONE_LABELS }) => {

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
        onPaneClick={onPaneClick}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { ...EDGE_STYLES.default },
        }}
      >
        <Background color="#cbd5e1" gap={GRID_SIZE} size={1} />

        {/* Zone labels as panels */}
        <Panel position="top-left" className="bg-blue-50 bg-opacity-70 px-4 py-2 rounded-md pointer-events-none">
          <span className="text-sm font-semibold text-gray-700 uppercase">
            {zoneLabels.left}
          </span>
        </Panel>
        <Panel position="top-right" className="bg-gray-100 bg-opacity-70 px-4 py-2 rounded-md pointer-events-none">
          <span className="text-sm font-semibold text-gray-700 uppercase">
            {zoneLabels.right}
          </span>
        </Panel>

        {/* Connection hint */}
        <Panel position="top-center" className="pointer-events-none flex flex-col items-center gap-2">
          {selectedNodeId && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded text-xs">
              Showing connections for selected component
            </div>
          )}
          {!selectedNodeId && (
            <div className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded text-xs">
              Click a component to highlight its connections
            </div>
          )}
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
