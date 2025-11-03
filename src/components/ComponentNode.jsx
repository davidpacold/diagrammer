import React from 'react';
import { Handle, Position } from 'reactflow';

const ComponentNode = ({ data }) => {
  return (
    <div
      className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[140px]"
      title={data.description}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <span className="text-2xl">{data.icon}</span>
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-gray-800">{data.label}</div>
          {data.zone && (
            <div className="text-xs text-gray-500 capitalize">{data.zone}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default ComponentNode;
