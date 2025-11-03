import React from 'react';

const BoundaryBoxNode = ({ data }) => {
  return (
    <div
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        border: `2px dashed ${data.color || '#3b82f6'}`,
        borderRadius: '8px',
        position: 'relative',
        pointerEvents: 'all', // Changed to 'all' to allow parent node interaction
        background: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      {data.label && (
        <div
          style={{
            position: 'absolute',
            top: '-25px',
            left: '10px',
            color: data.color || '#3b82f6',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'white',
            padding: '0 8px',
            pointerEvents: 'none',
          }}
        >
          {data.label}
        </div>
      )}
    </div>
  );
};

export default BoundaryBoxNode;
