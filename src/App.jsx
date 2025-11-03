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

  // Convert components to React Flow nodes
  const nodes = useMemo(() => {
    return components
      .filter(c => c.visible)
      .map(c => ({
        id: c.id,
        type: 'component',
        position: c.position,
        data: {
          label: c.label,
          description: c.description,
          icon: c.icon,
          zone: c.zone,
          isSelected: selectedNodeId === c.id,
          onNodeClick: setSelectedNodeId,
        },
      }));
  }, [components, selectedNodeId]);

  // Filter edges to only show those between visible nodes and apply highlighting
  const edges = useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));
    return connections
      .filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map(edge => {
        const isHighlighted = selectedNodeId &&
          (edge.source === selectedNodeId || edge.target === selectedNodeId);
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
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
