import { useMemo } from 'react';
import { getConnectedNodes } from '../utils/graphUtils';

/**
 * Computes the set of visible component IDs and the set of nodes
 * connected downstream from the selected node. Shared by useNodes and useEdges.
 */
export const useConnectedNodes = (components, connections, selectedNodeId) => {
  return useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));
    const connectedNodes = selectedNodeId
      ? getConnectedNodes(selectedNodeId, connections, visibleIds)
      : new Set();
    return { visibleIds, connectedNodes };
  }, [components, connections, selectedNodeId]);
};
