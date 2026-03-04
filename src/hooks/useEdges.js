import { useMemo } from 'react';
import { getConnectedNodes } from '../utils/graphUtils';
import { EDGE_STYLES } from '../constants';

/**
 * Hook that builds React Flow edges with visibility filtering and highlighting.
 */
export const useEdges = ({ components, connections, selectedNodeId }) => {
  return useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));
    const connectedNodes = selectedNodeId ? getConnectedNodes(selectedNodeId, connections, visibleIds) : new Set();

    return connections
      .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map(edge => {
        const isHighlighted = selectedNodeId &&
          connectedNodes.has(edge.source) &&
          connectedNodes.has(edge.target);

        return {
          ...edge,
          style: isHighlighted ? { ...EDGE_STYLES.highlighted } : { ...EDGE_STYLES.default },
          animated: isHighlighted,
        };
      });
  }, [components, connections, selectedNodeId]);
};
