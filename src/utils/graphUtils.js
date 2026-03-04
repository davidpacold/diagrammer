/**
 * Get all nodes reachable from a starting node via forward connections.
 * Follows source -> target direction only.
 */
export function getConnectedNodes(nodeId, connections, visibleIds, visited = new Set()) {
  if (!nodeId || visited.has(nodeId)) return visited;
  visited.add(nodeId);

  connections
    .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    .forEach(edge => {
      if (edge.source === nodeId) {
        getConnectedNodes(edge.target, connections, visibleIds, visited);
      }
    });

  return visited;
}
