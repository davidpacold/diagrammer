import { useMemo } from 'react';
import { EDGE_STYLES, EDGE_COLORS } from '../constants';

/**
 * Hook that builds React Flow edges with visibility filtering and highlighting.
 */
export const useEdges = ({ components, connections, connectedNodes, selectedNodeId }) => {
  return useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));

    return connections
      .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map(edge => {
        const isHighlighted = selectedNodeId &&
          connectedNodes.has(edge.source) &&
          connectedNodes.has(edge.target);

        const edgeColor = edge.edgeColor ? EDGE_COLORS[edge.edgeColor] : null;
        const baseStyle = edge.lineStyle === 'dashed'
          ? { ...EDGE_STYLES.dashed }
          : edge.lineStyle === 'dotted'
          ? { ...EDGE_STYLES.dotted }
          : { ...EDGE_STYLES.default };

        if (edgeColor) {
          baseStyle.stroke = edgeColor;
        }

        return {
          ...edge,
          type: 'animated',
          style: isHighlighted ? { ...EDGE_STYLES.highlighted } : baseStyle,
          animated: false,
          data: { label: edge.label },
        };
      });
  }, [components, connections, connectedNodes, selectedNodeId]);
};
