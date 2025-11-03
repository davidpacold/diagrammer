import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { initialComponents, initialConnections } from './data/components';
import { presets } from './data/presets';

// Helper function to flatten zone-based components into a single array
const flattenComponents = (preset) => {
  // Check if preset has zone-based structure
  if (preset.zones) {
    const allComponents = [];
    Object.entries(preset.zones).forEach(([zoneName, zoneData]) => {
      zoneData.components.forEach(component => {
        allComponents.push({
          ...component,
          zone: zoneName,
          type: component.type || 'component'
        });
      });
    });
    return allComponents;
  }
  // Fall back to old structure
  return preset.components || [];
};

function App() {
  const [currentPreset, setCurrentPreset] = useState('shared-saas'); // Default preset
  const [components, setComponents] = useState(flattenComponents(presets['shared-saas']));
  const [connections, setConnections] = useState(presets['shared-saas'].connections);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [boundaryBoxes, setBoundaryBoxes] = useState(presets['shared-saas'].boundaryBoxes || []);
  const [columnHeaders, setColumnHeaders] = useState(presets['shared-saas'].columnHeaders || []);
  const [zoneLabels, setZoneLabels] = useState(presets['shared-saas'].zoneLabels || { left: '🌐 Internet / Public', right: '🔒 Private Network' });

  // Convert components to React Flow nodes
  const nodes = useMemo(() => {
    // Helper to calculate position based on positioning metadata
    const calculatePosition = (component) => {
      if (!component.positioning?.relativeTo) {
        return component.position;
      }

      // Find the boundary box it's relative to
      const boundaryBox = boundaryBoxes.find(box => box.id === component.positioning.relativeTo);
      if (!boundaryBox) {
        return component.position;
      }

      const { placement, offsetX = 0, offsetY = 0 } = component.positioning;

      switch (placement) {
        case 'below':
          return {
            x: boundaryBox.x + offsetX,
            y: boundaryBox.y + boundaryBox.height + offsetY
          };
        case 'right':
          return {
            x: boundaryBox.x + boundaryBox.width + offsetX,
            y: boundaryBox.y + offsetY
          };
        case 'above':
          return {
            x: boundaryBox.x + offsetX,
            y: boundaryBox.y - offsetY
          };
        case 'left':
          return {
            x: boundaryBox.x - offsetX,
            y: boundaryBox.y + offsetY
          };
        default:
          return component.position;
      }
    };

    // Build connected nodes set for node highlighting (forward direction only)
    const getConnectedNodes = (nodeId, visitedNodes = new Set()) => {
      if (!nodeId || visitedNodes.has(nodeId)) return visitedNodes;
      visitedNodes.add(nodeId);

      connections.forEach(edge => {
        // Only follow forward direction (source → target)
        if (edge.source === nodeId && components.find(c => c.id === edge.target && c.visible)) {
          getConnectedNodes(edge.target, visitedNodes);
        }
      });

      return visitedNodes;
    };

    const connectedNodes = selectedNodeId ? getConnectedNodes(selectedNodeId) : new Set();

    const componentNodes = components
      .filter(c => c.visible)
      .map(c => ({
        id: c.id,
        type: 'component',
        position: calculatePosition(c),
        data: {
          label: c.label,
          description: c.description,
          icon: c.icon,
          zone: c.zone,
          isSelected: selectedNodeId === c.id,
          isConnected: connectedNodes.has(c.id),
          onNodeClick: setSelectedNodeId,
        },
      }));

    // Add zone background nodes (public and private zones)
    const ZONE_BOUNDARY_X = 550;
    const zoneBackgroundNodes = [
      {
        id: 'zone-public',
        type: 'zoneBackground',
        position: { x: -5000, y: -5000 },
        data: {
          width: 5000 + ZONE_BOUNDARY_X, // From -5000 to exactly 550
          height: 10000,
          color: '#dbeafe',
          opacity: 0.3,
        },
        draggable: false,
        selectable: false,
        zIndex: -10,
      },
      {
        id: 'zone-private',
        type: 'zoneBackground',
        position: { x: ZONE_BOUNDARY_X, y: -5000 },
        data: {
          width: 5000,
          height: 10000,
          color: '#f3f4f6',
          opacity: 0.3,
          showBorder: true,
          borderColor: '#9ca3af',
        },
        draggable: false,
        selectable: false,
        zIndex: -10,
      },
    ];

    // Add boundary box nodes
    const boundaryBoxNodes = boundaryBoxes.map((box) => ({
      id: box.id || `boundary-${box.label}`,
      type: 'boundaryBox',
      position: { x: box.x, y: box.y },
      data: {
        label: box.label,
        width: box.width,
        height: box.height,
        color: box.color,
      },
      draggable: true,
      selectable: true,
      zIndex: -1,
      style: {
        width: box.width,
        height: box.height,
      },
    }));

    // Update component nodes to set parent relationships
    const componentNodesWithParents = componentNodes.map(node => {
      const component = components.find(c => c.id === node.id);
      if (component?.parentBoundary) {
        return {
          ...node,
          parentNode: component.parentBoundary,
          extent: 'parent', // Constrain child to parent bounds
        };
      }
      return node;
    });

    return [...zoneBackgroundNodes, ...boundaryBoxNodes, ...componentNodesWithParents];
  }, [components, selectedNodeId, boundaryBoxes]);

  // Filter edges to only show those between visible nodes and apply highlighting
  const edges = useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));

    // Build a set of all connected nodes recursively from selectedNodeId (forward only)
    const getConnectedNodes = (nodeId, visitedNodes = new Set()) => {
      if (!nodeId || visitedNodes.has(nodeId)) return visitedNodes;

      visitedNodes.add(nodeId);

      // Find all edges connected to this node (forward direction only)
      connections
        .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
        .forEach(edge => {
          if (edge.source === nodeId) {
            getConnectedNodes(edge.target, visitedNodes);
          }
        });

      return visitedNodes;
    };

    const connectedNodes = selectedNodeId ? getConnectedNodes(selectedNodeId) : new Set();

    return connections
      .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map(edge => {
        // Highlight edge if both source and target are in the connected set
        const isHighlighted = selectedNodeId &&
          connectedNodes.has(edge.source) &&
          connectedNodes.has(edge.target);

        return {
          ...edge,
          style: {
            stroke: isHighlighted ? '#3b82f6' : '#94a3b8',
            strokeWidth: isHighlighted ? 3 : 2,
          },
          animated: isHighlighted,
        };
      });
  }, [components, connections, selectedNodeId]);

  // Handle node position changes (drag)
  const onNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        setComponents(prev =>
          prev.map(c =>
            c.id === change.id
              ? { ...c, position: change.position }
              : c
          )
        );
      }
    });
  }, []);

  // Handle edge changes (if needed)
  const onEdgesChange = useCallback((changes) => {
    // For now, we're not handling edge changes
    // This could be extended to support custom connections
  }, []);

  // Toggle component visibility
  const handleToggle = useCallback((id) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, visible: !c.visible } : c
      )
    );
  }, []);

  // Handle preset change
  const handlePresetChange = useCallback((presetId) => {
    const preset = presets[presetId];
    if (preset) {
      setCurrentPreset(presetId);
      setComponents(flattenComponents(preset));
      setConnections(preset.connections);
      setBoundaryBoxes(preset.boundaryBoxes || []);
      setColumnHeaders(preset.columnHeaders || []);
      setZoneLabels(preset.zoneLabels || { left: '🌐 Internet / Public', right: '🔒 Private Network' });
    }
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen">
        <ToggleSidebar
          components={components}
          onToggle={handleToggle}
          currentPreset={currentPreset}
          onPresetChange={handlePresetChange}
        />
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          selectedNodeId={selectedNodeId}
          onPaneClick={() => setSelectedNodeId(null)}
          zoneLabels={zoneLabels}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
