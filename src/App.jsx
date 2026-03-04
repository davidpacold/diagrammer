import React, { useReducer, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { presets } from './data/presets';
import { snapPositionToGrid } from './utils/layoutUtils';
import { validateBoundaryContainment, logValidationErrors } from './utils/boundaryValidation';
import { logComponentPositions } from './utils/positionDebugger';
import { useConnectedNodes } from './hooks/useConnectedNodes';
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

// Build state from a preset definition
const buildPresetState = (presetId, preset, components) => ({
  currentPreset: presetId,
  components,
  connections: preset.connections,
  selectedNodeId: null,
  boundaryBoxes: preset.boundaryBoxes || [],
  zoneLabels: preset.zoneLabels || DEFAULT_ZONE_LABELS,
  zoneDefinitions: preset.zoneDefinitions || null,
  componentGroups: preset.componentGroups || [],
});

// Initialize state from URL or defaults
const getInitialState = () => {
  const urlState = parseUrlState();
  const presetId = (urlState?.preset && presets[urlState.preset]) ? urlState.preset : 'shared-saas';
  const preset = presets[presetId];

  let components = flattenComponents(preset);

  if (urlState?.hidden?.length > 0) {
    const hiddenSet = new Set(urlState.hidden);
    components = components.map(c => ({
      ...c,
      visible: hiddenSet.has(c.id) ? false : c.visible,
    }));
  }

  return {
    ...buildPresetState(presetId, preset, components),
    selectedNodeId: urlState?.selected || null,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_PRESET': {
      const preset = presets[action.presetId];
      if (!preset) return state;
      return buildPresetState(action.presetId, preset, flattenComponents(preset));
    }
    case 'TOGGLE_COMPONENT':
      return {
        ...state,
        components: state.components.map(c =>
          c.id === action.id ? { ...c, visible: !c.visible } : c
        ),
      };
    case 'SHOW_ALL':
      return { ...state, components: state.components.map(c => ({ ...c, visible: true })) };
    case 'HIDE_ALL':
      return { ...state, components: state.components.map(c => ({ ...c, visible: false })) };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: state.selectedNodeId === action.id ? null : action.id };
    case 'CLEAR_SELECTION':
      return { ...state, selectedNodeId: null };
    case 'UPDATE_POSITION':
      return {
        ...state,
        components: state.components.map(c =>
          c.id === action.id ? { ...c, position: action.position } : c
        ),
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  const {
    currentPreset, components, connections, selectedNodeId,
    boundaryBoxes, zoneLabels, zoneDefinitions, componentGroups,
  } = state;

  const { connectedNodes } = useConnectedNodes(components, connections, selectedNodeId);
  const nodes = useNodes({ components, connectedNodes, selectedNodeId, boundaryBoxes, zoneDefinitions });
  const edges = useEdges({ components, connections, connectedNodes, selectedNodeId });
  const { copyLink, copied } = useUrlState(currentPreset, components, selectedNodeId);

  const handleNodeClick = useCallback((_event, node) => {
    if (node.type === 'component') {
      dispatch({ type: 'SELECT_NODE', id: node.id });
    }
  }, []);

  const handlePaneClick = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const onNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        const position = change.dragging === false
          ? snapPositionToGrid(change.position)
          : change.position;
        dispatch({ type: 'UPDATE_POSITION', id: change.id, position });
      }
    });
  }, []);

  const onEdgesChange = useCallback(() => {}, []);

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE_COMPONENT', id });
  }, []);

  const handleShowAll = useCallback(() => dispatch({ type: 'SHOW_ALL' }), []);
  const handleHideAll = useCallback(() => dispatch({ type: 'HIDE_ALL' }), []);

  const handlePresetChange = useCallback((presetId) => {
    dispatch({ type: 'CHANGE_PRESET', presetId });
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const validationResult = validateBoundaryContainment(components, boundaryBoxes);
      console.group(`Boundary Validation - ${currentPreset}`);
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
          componentGroups={componentGroups}
        />
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          selectedNodeId={selectedNodeId}
          onPaneClick={handlePaneClick}
          zoneLabels={zoneLabels}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
