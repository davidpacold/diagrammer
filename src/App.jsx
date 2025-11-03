import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { initialComponents, initialConnections } from './data/components';
import { presets } from './data/presets';
import { resolveOverlaps, snapPositionToGrid, arrangeInGrid, autoArrangeInBoundary, autoFixOverlaps } from './utils/layoutUtils';
import { validateBoundaryContainment, logValidationErrors } from './utils/boundaryValidation';
import { logComponentPositions } from './utils/positionDebugger';

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
  const [zoneDefinitions, setZoneDefinitions] = useState(presets['shared-saas'].zoneDefinitions || null);

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
          parentBoundary: c.parentBoundary,
          position: c.position,
          isSelected: selectedNodeId === c.id,
          isConnected: connectedNodes.has(c.id),
          onNodeClick: setSelectedNodeId,
        },
      }));

    // Add zone background nodes from zoneDefinitions or use defaults
    const ZONE_BOUNDARY_X = 550;
    const zoneBackgroundNodes = zoneDefinitions
      ? Object.entries(zoneDefinitions).map(([zoneName, zoneDef]) => ({
          id: `zone-${zoneName}`,
          type: 'zoneBackground',
          position: { x: zoneDef.x, y: zoneDef.y },
          data: {
            width: zoneDef.width,
            height: zoneDef.height,
            color: zoneDef.backgroundColor,
            opacity: zoneDef.opacity,
            showBorder: zoneDef.showBorder,
            borderColor: zoneDef.borderColor,
          },
          draggable: false,
          selectable: false,
          zIndex: -10,
        }))
      : [
        // Fallback to hardcoded zones if no zoneDefinitions
        {
          id: 'zone-public',
          type: 'zoneBackground',
          position: { x: -5000, y: -5000 },
          data: {
            width: 5000 + ZONE_BOUNDARY_X,
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

    // Add boundary box nodes with dynamic sizing based on visible children
    const boundaryBoxNodes = boundaryBoxes.map((box) => {
      // Find all visible children of this boundary
      const childComponents = components.filter(c =>
        c.visible && c.parentBoundary === box.id
      );

      let width = box.width;
      let height = box.height;
      const x = box.x; // Keep x position fixed
      const y = box.y; // Keep y position fixed

      // If there are visible children, calculate dynamic size
      if (childComponents.length > 0) {
        const COMPONENT_WIDTH = 180;
        const COMPONENT_HEIGHT = 110;
        const PADDING = box.padding || 30; // Use box padding or default to 30

        // Calculate bounds from RELATIVE positions of children
        const childPositions = childComponents.map(c => c.position);
        const minX = Math.min(...childPositions.map(p => p.x));
        const maxX = Math.max(...childPositions.map(p => p.x));
        const minY = Math.min(...childPositions.map(p => p.y));
        const maxY = Math.max(...childPositions.map(p => p.y));

        // Calculate required width and height to fit all children with padding
        // Assumes children should start at relative position (PADDING, PADDING)
        const rightEdge = maxX + COMPONENT_WIDTH;
        const bottomEdge = maxY + COMPONENT_HEIGHT;

        width = Math.max(rightEdge + PADDING, width);
        height = Math.max(bottomEdge + PADDING, height);
      }

      return {
        id: box.id || `boundary-${box.label}`,
        type: 'boundaryBox',
        position: { x, y },
        data: {
          label: box.label,
          width,
          height,
          color: box.color,
        },
        draggable: true,
        selectable: true,
        zIndex: -1,
        style: {
          width,
          height,
        },
      };
    });

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
  }, [components, selectedNodeId, boundaryBoxes, zoneDefinitions]);

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

  // Handle node position changes (drag) with snap-to-grid
  const onNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        // Snap to grid when drag is complete (dragging === false)
        const position = change.dragging === false
          ? snapPositionToGrid(change.position)
          : change.position;

        setComponents(prev =>
          prev.map(c =>
            c.id === change.id
              ? { ...c, position }
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
      setZoneDefinitions(preset.zoneDefinitions || null);
    }
  }, []);

  // Grid-based auto-arrange (Visio-style)
  const handleAutoArrange = useCallback(() => {
    setComponents(prev => {
      // Group components by parent boundary
      const boundaryGroups = {};
      const ungroupedComponents = [];

      prev.forEach(c => {
        if (c.parentBoundary) {
          if (!boundaryGroups[c.parentBoundary]) {
            boundaryGroups[c.parentBoundary] = [];
          }
          boundaryGroups[c.parentBoundary].push(c);
        } else {
          ungroupedComponents.push(c);
        }
      });

      // Arrange each boundary group in a grid
      let result = [...prev];
      Object.keys(boundaryGroups).forEach(boundaryId => {
        result = autoArrangeInBoundary(result, boundaryId, 40, 40, 2);
      });

      return result;
    });
  }, []);

  // Validate boundary containment rules whenever preset changes
  useEffect(() => {
    const validationResult = validateBoundaryContainment(components, boundaryBoxes);
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Boundary Validation - ${currentPreset}`);
      logValidationErrors(validationResult);
      console.groupEnd();

      // Debug position overlaps in browser
      logComponentPositions(components, boundaryBoxes);
    }
  }, [currentPreset, components, boundaryBoxes]);

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
          onAutoArrange={handleAutoArrange}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
