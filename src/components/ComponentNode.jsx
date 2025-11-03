import React from 'react';
import { Handle, Position } from 'reactflow';

const ComponentNode = ({ data, id }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (data.onNodeClick) {
      // Toggle selection: if already selected, deselect
      data.onNodeClick(data.isSelected ? null : id);
    }
  };

  return (
    <div
      className={`px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all min-w-[140px] cursor-pointer ${
        data.isSelected
          ? 'border-4 border-blue-500 ring-2 ring-blue-200'
          : data.isConnected
          ? 'border-3 border-blue-300 ring-1 ring-blue-100'
          : 'border-2 border-gray-300'
      }`}
      title={data.description}
      onClick={handleClick}
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
