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
import { useUrlState, parseUrlState } from './hooks/useUrlState';
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

// Initialize state from URL or defaults
const getInitialState = () => {
  const urlState = parseUrlState();
  const presetId = (urlState?.preset && presets[urlState.preset]) ? urlState.preset : 'shared-saas';
  const preset = presets[presetId];

  let components = flattenComponents(preset);

  // Apply hidden state from URL
  if (urlState?.hidden?.length > 0) {
    const hiddenSet = new Set(urlState.hidden);
    components = components.map(c => ({
      ...c,
      visible: hiddenSet.has(c.id) ? false : c.visible,
    }));
  }

  return {
    presetId,
    preset,
    components,
    selectedNodeId: urlState?.selected || null,
  };
};

function App() {
  const initial = getInitialState();

  const [currentPreset, setCurrentPreset] = useState(initial.presetId);
  const [components, setComponents] = useState(initial.components);
  const [connections, setConnections] = useState(initial.preset.connections);
  const [selectedNodeId, setSelectedNodeId] = useState(initial.selectedNodeId);
  const [boundaryBoxes, setBoundaryBoxes] = useState(initial.preset.boundaryBoxes || []);
  const [columnHeaders, setColumnHeaders] = useState(initial.preset.columnHeaders || []);
  const [zoneLabels, setZoneLabels] = useState(initial.preset.zoneLabels || DEFAULT_ZONE_LABELS);
  const [zoneDefinitions, setZoneDefinitions] = useState(initial.preset.zoneDefinitions || null);

  const nodes = useNodes({ components, connections, selectedNodeId, boundaryBoxes, zoneDefinitions, setSelectedNodeId });
  const edges = useEdges({ components, connections, selectedNodeId });
  const { copyLink, copied } = useUrlState(currentPreset, components, selectedNodeId);

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
          onCopyLink={copyLink}
          linkCopied={copied}
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
