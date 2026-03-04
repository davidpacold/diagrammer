import React from 'react';
import { getSmoothStepPath } from 'reactflow';

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
