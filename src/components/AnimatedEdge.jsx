import React from 'react';
import { getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isHighlighted = style.stroke === '#3b82f6';
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      {/* Base edge path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={style}
        fill="none"
      />

      {/* Edge label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="text-[9px] font-medium text-gray-400 bg-white/90 px-1.5 py-0.5 rounded border border-gray-200"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Animated particles when highlighted */}
      {isHighlighted && (
        <>
          {[0, 0.25, 0.5, 0.75].map((offset, i) => (
            <circle
              key={i}
              r="3"
              fill="#3b82f6"
              opacity="0.8"
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${offset * 2}s`}
                path={edgePath}
              />
            </circle>
          ))}
        </>
      )}
    </>
  );
};

export default AnimatedEdge;
