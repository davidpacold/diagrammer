import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ComponentNode from './ComponentNode';
import BoundaryBoxNode from './BoundaryBoxNode';
import ZoneBackgroundNode from './ZoneBackgroundNode';
import { EDGE_STYLES, DEFAULT_ZONE_LABELS, GRID_SIZE, DEFAULT_VIEWPORT } from '../constants';
import AnimatedEdge from './AnimatedEdge';

const nodeTypes = {
  component: ComponentNode,
  boundaryBox: BoundaryBoxNode,
  zoneBackground: ZoneBackgroundNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const DiagramCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onNodeClick, selectedNodeId, onPaneClick, zoneLabels = DEFAULT_ZONE_LABELS, fitViewTrigger }) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (fitViewTrigger) {
      // Short delay to let ReactFlow process the new nodes first
      const timeout = setTimeout(() => {
        fitView({ padding: 0.15, duration: 300, includeHiddenNodes: false });
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [fitViewTrigger, fitView]);

  return (
    <div className="flex-1 h-full relative">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={DEFAULT_VIEWPORT}
        className="bg-white"
        onPaneClick={onPaneClick}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { ...EDGE_STYLES.default },
        }}
      >
        <Background color="#e2e8f0" gap={GRID_SIZE} size={1} />

        {/* Zone labels as panels */}
        <Panel position="top-left" className="bg-blue-50 px-4 py-1.5 rounded-full pointer-events-none shadow-sm border border-blue-100">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            {zoneLabels.left}
          </span>
        </Panel>
        <Panel position="top-right" className="bg-gray-50 px-4 py-1.5 rounded-full pointer-events-none shadow-sm border border-gray-200">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {zoneLabels.right}
          </span>
        </Panel>

        {/* Connection hint */}
        <Panel position="top-center" className="pointer-events-none">
          {selectedNodeId ? (
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              Showing downstream connections
            </div>
          ) : (
            <div className="bg-white/80 border border-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs shadow-sm">
              Click a component to trace connections
            </div>
          )}
        </Panel>

      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
