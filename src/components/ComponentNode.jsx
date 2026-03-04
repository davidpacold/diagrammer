import React from 'react';
import { Handle, Position } from 'reactflow';
import { iconMap } from './icons';
import Tooltip from './Tooltip';

const CATEGORY_COLORS = {
  users: '#6b7280',
  globe: '#3b82f6',
  layers: '#4f46e5',
  key: '#f59e0b',
  cpu: '#ec4899',
  database: '#10b981',
  shield: '#f59e0b',
  link: '#8b5cf6',
  server: '#3b82f6',
  scale: '#3b82f6',
  door: '#3b82f6',
  memory: '#10b981',
  message: '#8b5cf6',
  box: '#10b981',
  monitor: '#f59e0b',
  eye: '#ec4899',
  network: '#3b82f6',
};

const BADGE_COLOR_MAP = {
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
};

const BADGE_DOT_MAP = {
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
};

const ComponentNode = ({ data }) => {
  const zoneBadgeColor = data.zone === 'public'
    ? 'bg-blue-100 text-blue-700 border-blue-300'
    : data.zone === 'private'
    ? 'bg-gray-100 text-gray-700 border-gray-300'
    : 'bg-yellow-100 text-yellow-700 border-yellow-300';

  const badgeLabel = data.badgeLabel || 'External';
  const badgeColor = data.badgeColor || 'green';
  const boundaryBadgeColor = BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.green;
  const showDot = badgeLabel !== 'External' && BADGE_DOT_MAP[badgeColor];

  return (
    <Tooltip content={data.description}>
    <div
      className={`px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all w-[180px] cursor-pointer relative ${
        data.isSelected
          ? 'border-4 border-blue-500 ring-2 ring-blue-200'
          : data.isConnected
          ? 'border-2 border-blue-300 ring-1 ring-blue-100'
          : 'border-2 border-gray-300'
      }`}
      style={{ borderLeftColor: CATEGORY_COLORS[data.icon] || '#94a3b8', borderLeftWidth: '4px' }}
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
          {badgeLabel}
        </span>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-2">
        {iconMap[data.icon]
          ? React.createElement(iconMap[data.icon], { size: 28, className: 'text-gray-600 shrink-0' })
          : <span className="text-2xl">{data.icon}</span>
        }
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-gray-800 leading-tight">{data.label}</div>
        </div>
      </div>

      {/* Visual indicator for managed boundary membership */}
      {showDot && (
        <div className={`absolute top-0 right-0 w-3 h-3 ${showDot} rounded-bl-lg`} />
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
    </Tooltip>
  );
};

export default ComponentNode;
