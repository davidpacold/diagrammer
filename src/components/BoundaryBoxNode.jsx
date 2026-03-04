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
            top: '-12px',
            left: '12px',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            fontFamily: "'Inter', system-ui, sans-serif",
            background: data.color || '#3b82f6',
            padding: '2px 10px',
            borderRadius: '10px',
            pointerEvents: 'none',
            letterSpacing: '0.025em',
          }}
        >
          {data.label}
        </div>
      )}
    </div>
  );
};

export default BoundaryBoxNode;
