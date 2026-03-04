import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { presets } from './data/presets';
import { snapPositionToGrid } from './utils/layoutUtils';
import { validateBoundaryContainment, logValidationErrors } from './utils/boundaryValidation';
import { logComponentPositions } from './utils/positionDebugger';
import { useNodes } from './hooks/useNodes';
import { useEdges } from './hooks/useEdges';
import { DEFAULT_ZONE_LABELS } from './constants';

// Helper function to flatten zone-based components into a single array
const flattenComponents = (preset) => {
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
  return preset.components || [];
};

function App() {
  const [currentPreset, setCurrentPreset] = useState('shared-saas');
  const [components, setComponents] = useState(flattenComponents(presets['shared-saas']));
  const [connections, setConnections] = useState(presets['shared-saas'].connections);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [boundaryBoxes, setBoundaryBoxes] = useState(presets['shared-saas'].boundaryBoxes || []);
  const [columnHeaders, setColumnHeaders] = useState(presets['shared-saas'].columnHeaders || []);
  const [zoneLabels, setZoneLabels] = useState(presets['shared-saas'].zoneLabels || DEFAULT_ZONE_LABELS);
  const [zoneDefinitions, setZoneDefinitions] = useState(presets['shared-saas'].zoneDefinitions || null);

  const nodes = useNodes({ components, connections, selectedNodeId, boundaryBoxes, zoneDefinitions, setSelectedNodeId });
  const edges = useEdges({ components, connections, selectedNodeId });

  // Handle node position changes (drag) with snap-to-grid
  const onNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        const position = change.dragging === false
          ? snapPositionToGrid(change.position)
          : change.position;

        setComponents(prev =>
          prev.map(c =>
            c.id === change.id ? { ...c, position } : c
          )
        );
      }
    });
  }, []);

  // Handle edge changes
  const onEdgesChange = useCallback(() => {}, []);

  // Toggle component visibility
  const handleToggle = useCallback((id) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, visible: !c.visible } : c
      )
    );
  }, []);

  const handleShowAll = useCallback(() => {
    setComponents(prev => prev.map(c => ({ ...c, visible: true })));
  }, []);

  const handleHideAll = useCallback(() => {
    setComponents(prev => prev.map(c => ({ ...c, visible: false })));
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
      setZoneLabels(preset.zoneLabels || DEFAULT_ZONE_LABELS);
      setZoneDefinitions(preset.zoneDefinitions || null);
    }
  }, []);

  // Validate boundary containment rules in development
  useEffect(() => {
    const validationResult = validateBoundaryContainment(components, boundaryBoxes);
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Boundary Validation - ${currentPreset}`);
      logValidationErrors(validationResult);
      console.groupEnd();
      logComponentPositions(components, boundaryBoxes);
    }
  }, [currentPreset, components, boundaryBoxes]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen">
        <ToggleSidebar
          components={components}
          onToggle={handleToggle}
          onShowAll={handleShowAll}
          onHideAll={handleHideAll}
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
