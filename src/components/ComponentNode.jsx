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

  // Determine zone badge color
  const zoneBadgeColor = data.zone === 'public'
    ? 'bg-blue-100 text-blue-700 border-blue-300'
    : data.zone === 'private'
    ? 'bg-gray-100 text-gray-700 border-gray-300'
    : 'bg-yellow-100 text-yellow-700 border-yellow-300';

  // Check if component is in a boundary
  const isInBoundary = data.parentBoundary != null;
  const boundaryBadge = isInBoundary ? 'Airia Managed' : 'External';
  const boundaryBadgeColor = isInBoundary
    ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
    : 'bg-green-100 text-green-700 border-green-300';

  // Build detailed tooltip
  const tooltip = [
    data.description,
    `\nZone: ${data.zone || 'not set'}`,
    isInBoundary ? `Location: Inside ${data.parentBoundary}` : 'Location: Outside boundaries',
    data.position ? `Position: (${Math.round(data.position?.x || 0)}, ${Math.round(data.position?.y || 0)})` : ''
  ].filter(Boolean).join('\n');

  return (
    <div
      className={`px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-all w-[180px] cursor-pointer relative ${
        data.isSelected
          ? 'border-4 border-blue-500 ring-2 ring-blue-200'
          : data.isConnected
          ? 'border-3 border-blue-300 ring-1 ring-blue-100'
          : 'border-2 border-gray-300'
      }`}
      title={tooltip}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      {/* Zone and Boundary badges at top */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {data.zone && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase ${zoneBadgeColor}`}>
            {data.zone}
          </span>
        )}
        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${boundaryBadgeColor}`}>
          {boundaryBadge}
        </span>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{data.icon}</span>
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-gray-800 leading-tight">{data.label}</div>
        </div>
      </div>

      {/* Visual indicator for boundary membership */}
      {isInBoundary && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-bl-lg"
             title="Inside Airia Managed" />
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default ComponentNode;
