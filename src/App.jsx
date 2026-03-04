import React, { useReducer, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { presets } from './data/presets';
import { snapPositionToGrid, resolveOverlaps } from './utils/layoutUtils';
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
  presentationMode: false,
  sceneIndex: 0,
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

// Resolve overlaps among visible components after visibility changes
const fixOverlaps = (components) => {
  const visible = components.filter(c => c.visible);
  const fixed = resolveOverlaps(visible, 50, true);
  const fixedMap = new Map(fixed.map(c => [c.id, c.position]));
  return components.map(c => {
    const pos = fixedMap.get(c.id);
    return pos ? { ...c, position: { x: Math.round(pos.x), y: Math.round(pos.y) } } : c;
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_PRESET': {
      const preset = presets[action.presetId];
      if (!preset) return state;
      return { ...buildPresetState(action.presetId, preset, flattenComponents(preset)), fitViewTrigger: (state.fitViewTrigger || 0) + 1 };
    }
    case 'TOGGLE_MANY': {
      const idSet = new Set(action.ids);
      const toggled = state.components.map(c =>
        idSet.has(c.id) ? { ...c, visible: action.visible } : c
      );
      return { ...state, components: fixOverlaps(toggled), fitViewTrigger: (state.fitViewTrigger || 0) + 1 };
    }
    case 'TOGGLE_COMPONENT': {
      const toggled = state.components.map(c =>
        c.id === action.id ? { ...c, visible: !c.visible } : c
      );
      return { ...state, components: fixOverlaps(toggled), fitViewTrigger: (state.fitViewTrigger || 0) + 1 };
    }
    case 'SHOW_ALL':
      return { ...state, components: fixOverlaps(state.components.map(c => ({ ...c, visible: true }))), fitViewTrigger: (state.fitViewTrigger || 0) + 1 };
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
    case 'START_PRESENTATION': {
      const preset = presets[state.currentPreset];
      const scenes = preset.scenes;
      if (!scenes || scenes.length === 0) return state;
      const scene = scenes[0];
      const visibleSet = new Set(scene.visible);
      return {
        ...state,
        presentationMode: true,
        sceneIndex: 0,
        components: state.components.map(c => ({ ...c, visible: visibleSet.has(c.id) })),
        selectedNodeId: scene.select || null,
        fitViewTrigger: (state.fitViewTrigger || 0) + 1,
      };
    }
    case 'NEXT_SCENE':
    case 'PREV_SCENE': {
      const preset = presets[state.currentPreset];
      const scenes = preset.scenes;
      if (!scenes) return state;
      const newIndex = action.type === 'NEXT_SCENE'
        ? Math.min(state.sceneIndex + 1, scenes.length - 1)
        : Math.max(state.sceneIndex - 1, 0);
      if (newIndex === state.sceneIndex) return state;
      const scene = scenes[newIndex];
      const visibleSet = new Set(scene.visible);
      return {
        ...state,
        sceneIndex: newIndex,
        components: state.components.map(c => ({ ...c, visible: visibleSet.has(c.id) })),
        selectedNodeId: scene.select || null,
        fitViewTrigger: (state.fitViewTrigger || 0) + 1,
      };
    }
    case 'EXIT_PRESENTATION': {
      const preset = presets[state.currentPreset];
      return {
        ...state,
        presentationMode: false,
        sceneIndex: 0,
        components: flattenComponents(preset),
        selectedNodeId: null,
        fitViewTrigger: (state.fitViewTrigger || 0) + 1,
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  const {
    currentPreset, components, connections, selectedNodeId,
    boundaryBoxes, zoneLabels, zoneDefinitions, componentGroups,
    fitViewTrigger,
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

  const handleToggleMany = useCallback((ids, visible) => {
    dispatch({ type: 'TOGGLE_MANY', ids, visible });
  }, []);

  const handleShowAll = useCallback(() => dispatch({ type: 'SHOW_ALL' }), []);
  const handleHideAll = useCallback(() => dispatch({ type: 'HIDE_ALL' }), []);

  const handlePresetChange = useCallback((presetId) => {
    dispatch({ type: 'CHANGE_PRESET', presetId });
  }, []);

  const handleStartPresentation = useCallback(() => dispatch({ type: 'START_PRESENTATION' }), []);
  const handleNextScene = useCallback(() => dispatch({ type: 'NEXT_SCENE' }), []);
  const handlePrevScene = useCallback(() => dispatch({ type: 'PREV_SCENE' }), []);
  const handleExitPresentation = useCallback(() => dispatch({ type: 'EXIT_PRESENTATION' }), []);

  useEffect(() => {
    if (!state.presentationMode) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') dispatch({ type: 'NEXT_SCENE' });
      else if (e.key === 'ArrowLeft') dispatch({ type: 'PREV_SCENE' });
      else if (e.key === 'Escape') dispatch({ type: 'EXIT_PRESENTATION' });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.presentationMode]);

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
          onToggleMany={handleToggleMany}
          onShowAll={handleShowAll}
          onHideAll={handleHideAll}
          currentPreset={currentPreset}
          onPresetChange={handlePresetChange}
          onCopyLink={copyLink}
          linkCopied={copied}
          componentGroups={componentGroups}
          onStartPresentation={handleStartPresentation}
          presentationMode={state.presentationMode}
          scenes={presets[currentPreset]?.scenes}
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
          fitViewTrigger={fitViewTrigger}
          presentationMode={state.presentationMode}
          sceneIndex={state.sceneIndex}
          scenes={presets[currentPreset]?.scenes}
          onNextScene={handleNextScene}
          onPrevScene={handlePrevScene}
          onExitPresentation={handleExitPresentation}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
