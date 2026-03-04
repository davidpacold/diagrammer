import React from 'react';
import { Handle, Position } from 'reactflow';
import { iconMap } from './icons';
import Tooltip from './Tooltip';
import { CATEGORY_COLORS, ICON_BG_COLORS } from '../constants';

const BADGE_COLOR_MAP = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
};

const ComponentNode = ({ data }) => {
  const badgeLabel = data.badgeLabel || 'External';
  const badgeColor = data.badgeColor || 'green';
  const boundaryBadgeClass = BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.green;
  const iconBg = ICON_BG_COLORS[data.icon] || 'bg-gray-100';

  return (
    <Tooltip content={data.description}>
      <div
        className={`bg-white rounded-xl w-[180px] cursor-pointer relative transition-all duration-150 ${
          data.isSelected
            ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-100 scale-[1.03]'
            : data.isConnected
            ? 'ring-1 ring-blue-200 shadow-md'
            : 'shadow-sm hover:shadow-md hover:scale-[1.01]'
        }`}
        style={{
          borderLeft: `4px solid ${CATEGORY_COLORS[data.icon] || '#94a3b8'}`,
        }}
      >
        <Handle type="target" position={Position.Left} className="w-3 h-3" />

        <div className="px-3 py-2.5">
          {/* Icon + Label row */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
              {iconMap[data.icon]
                ? React.createElement(iconMap[data.icon], { size: 20, className: 'text-gray-600' })
                : <span className="text-lg">{data.icon}</span>
              }
            </div>
            <div className="font-semibold text-[13px] text-gray-800 leading-tight">
              {data.label}
            </div>
          </div>

          {/* Badge row at bottom */}
          <div className="flex gap-1">
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${boundaryBadgeClass}`}>
              {badgeLabel}
            </span>
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      </div>
    </Tooltip>
  );
};

export default ComponentNode;
