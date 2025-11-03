import React from 'react';

const ZoneBackgroundNode = ({ data }) => {
  return (
    <div
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        background: data.color,
        opacity: data.opacity || 0.3,
        pointerEvents: 'none',
        border: data.showBorder ? `2px solid ${data.borderColor || '#9ca3af'}` : 'none',
      }}
    />
  );
};

export default ZoneBackgroundNode;
