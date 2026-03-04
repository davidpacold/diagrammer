# Demo Showstopper + Visual Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the architecture diagram tool into a visually impressive, narrative-driven sales demo tool with animated data flow, presentation mode, inline editing, polished connections, redesigned cards, and smarter layouts.

**Architecture:** Six independent feature tracks that build on the existing React + ReactFlow + Tailwind stack. Each track modifies specific files without cross-dependencies, so they can be implemented in any order. The existing reducer pattern in App.jsx is extended with new actions. New custom edge and node components replace the defaults.

**Tech Stack:** React 18, ReactFlow 11, Tailwind CSS 3, Vite 5, SVG animations

---

## Task 1: Animated Data Flow — Custom Edge Component

**Files:**
- Create: `src/components/AnimatedEdge.jsx`
- Modify: `src/components/DiagramCanvas.jsx:13-17` (register edge type)
- Modify: `src/hooks/useEdges.js:18-22` (set edge type)

**Step 1: Create the AnimatedEdge component**

Create `src/components/AnimatedEdge.jsx`:

```jsx
import React from 'react';
import { getSmoothStepPath } from 'reactflow';

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isHighlighted = style.stroke === '#3b82f6';

  return (
    <>
      {/* Base edge path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={style}
        fill="none"
      />

      {/* Animated particles when highlighted */}
      {isHighlighted && (
        <>
          {[0, 0.25, 0.5, 0.75].map((offset, i) => (
            <circle
              key={i}
              r="3"
              fill="#3b82f6"
              opacity="0.8"
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${offset * 2}s`}
                path={edgePath}
              />
            </circle>
          ))}
        </>
      )}
    </>
  );
};

export default AnimatedEdge;
```

**Step 2: Register the custom edge type in DiagramCanvas**

In `src/components/DiagramCanvas.jsx`, add import and edge types object:

```jsx
// After the existing imports (line 11)
import AnimatedEdge from './AnimatedEdge';

// After nodeTypes (line 17), add:
const edgeTypes = {
  animated: AnimatedEdge,
};
```

Then pass `edgeTypes` to the ReactFlow component:

```jsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  edgeTypes={edgeTypes}
  // ... rest of props
>
```

**Step 3: Set edge type in useEdges**

In `src/hooks/useEdges.js`, change the edge mapping (line 18-22) to use the custom edge type:

```jsx
return {
  ...edge,
  type: 'animated',
  style: isHighlighted ? { ...EDGE_STYLES.highlighted } : { ...EDGE_STYLES.default },
  animated: false, // We handle animation ourselves now
};
```

**Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Open the app, click a component — you should see blue dots traveling along highlighted connection paths.

**Step 5: Commit**

```bash
git add src/components/AnimatedEdge.jsx src/components/DiagramCanvas.jsx src/hooks/useEdges.js
git commit -m "feat: add animated data flow particles on connection highlighting"
```

---

## Task 2: Connection Line Polish — Edge Labels, Styles, Colors

**Files:**
- Modify: `src/components/AnimatedEdge.jsx` (add label rendering)
- Modify: `src/constants.js:34-37` (add edge style variants)
- Modify: `src/hooks/useEdges.js` (apply edge styles from connection data)
- Modify: `src/data/presets/shared-saas.js` (add label/style to key connections)
- Modify: `src/data/presets/dedicated-saas.js` (add label/style to key connections)

**Step 1: Add edge style constants**

In `src/constants.js`, extend `EDGE_STYLES` (replace lines 34-37):

```js
export const EDGE_STYLES = {
  default: { stroke: '#94a3b8', strokeWidth: 2 },
  highlighted: { stroke: '#3b82f6', strokeWidth: 3 },
  dashed: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '6 3' },
  dotted: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '2 4' },
};

export const EDGE_COLORS = {
  managed: '#4f46e5',   // Indigo for Airia-managed connections
  external: '#94a3b8',  // Gray for external services
  customer: '#10b981',  // Green for customer connections
  byok: '#f59e0b',      // Amber for BYOK connections
};
```

**Step 2: Add label rendering to AnimatedEdge**

In `src/components/AnimatedEdge.jsx`, add an edge label between the base path and animated particles:

```jsx
import { getSmoothStepPath, EdgeLabelRenderer, getBezierPath } from 'reactflow';

// Inside the component, after calculating edgePath:
const labelX = (sourceX + targetX) / 2;
const labelY = (sourceY + targetY) / 2;

// In the JSX, after the base path:
{data?.label && (
  <EdgeLabelRenderer>
    <div
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
        pointerEvents: 'none',
      }}
      className="text-[9px] font-medium text-gray-400 bg-white/90 px-1.5 py-0.5 rounded border border-gray-200"
    >
      {data.label}
    </div>
  </EdgeLabelRenderer>
)}
```

**Step 3: Apply connection styles in useEdges**

In `src/hooks/useEdges.js`, import `EDGE_COLORS` and use connection metadata:

```jsx
import { EDGE_STYLES, EDGE_COLORS } from '../constants';

// In the edge mapping:
const edgeColor = edge.edgeColor ? EDGE_COLORS[edge.edgeColor] : null;
const baseStyle = edge.lineStyle === 'dashed'
  ? { ...EDGE_STYLES.dashed }
  : edge.lineStyle === 'dotted'
  ? { ...EDGE_STYLES.dotted }
  : { ...EDGE_STYLES.default };

if (edgeColor) {
  baseStyle.stroke = edgeColor;
}

return {
  ...edge,
  type: 'animated',
  style: isHighlighted ? { ...EDGE_STYLES.highlighted } : baseStyle,
  animated: false,
  data: { label: edge.label },
};
```

**Step 4: Add labels and styles to key connections in presets**

In `src/data/presets/shared-saas.js`, update select connections with labels/styles. Example updates:

```js
{ id: 'e0-customer1', source: 'customer-1', target: 'cdn', label: 'HTTPS', edgeColor: 'customer' },
{ id: 'e1-na', source: 'cdn', target: 'airia-platform-na', label: 'API', edgeColor: 'managed' },
{ id: 'e-llm-openai-managed', source: 'airia-key-llm', target: 'llm-openai-managed', edgeColor: 'managed' },
{ id: 'e-byok-openai-na', source: 'airia-platform-na', target: 'llm-openai-byok', lineStyle: 'dashed', edgeColor: 'byok' },
```

Do the same for dedicated-saas connections. Add `label`, `edgeColor`, and `lineStyle` to connections where they add clarity. Not every connection needs a label — focus on the main flow paths.

**Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Connections should show labels on key paths, dashed lines for BYOK, and color-coded edges.

**Step 6: Commit**

```bash
git add src/constants.js src/components/AnimatedEdge.jsx src/hooks/useEdges.js src/data/presets/shared-saas.js src/data/presets/dedicated-saas.js
git commit -m "feat: add edge labels, line styles, and color coding to connections"
```

---

## Task 3: Component Card Redesign

**Files:**
- Modify: `src/components/ComponentNode.jsx` (full redesign)
- Modify: `src/constants.js` (add icon background colors)

**Step 1: Add icon background color map**

In `src/constants.js`, add after `CATEGORY_COLORS`:

```js
export const ICON_BG_COLORS = {
  users: 'bg-gray-100',
  globe: 'bg-blue-100',
  layers: 'bg-indigo-100',
  key: 'bg-amber-100',
  cpu: 'bg-pink-100',
  database: 'bg-emerald-100',
  shield: 'bg-amber-100',
  link: 'bg-violet-100',
  server: 'bg-blue-100',
  monitor: 'bg-amber-100',
  message: 'bg-violet-100',
  box: 'bg-emerald-100',
  scale: 'bg-blue-100',
  door: 'bg-blue-100',
  memory: 'bg-emerald-100',
  eye: 'bg-pink-100',
  network: 'bg-blue-100',
};
```

**Step 2: Redesign ComponentNode**

Replace the entire content of `src/components/ComponentNode.jsx`:

```jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { iconMap } from './icons';
import Tooltip from './Tooltip';
import { CATEGORY_COLORS, ICON_BG_COLORS } from '../constants';

const BADGE_COLOR_MAP = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
};

const ComponentNode = ({ data }) => {
  const badgeLabel = data.badgeLabel || 'External';
  const badgeColor = data.badgeColor || 'green';
  const boundaryBadgeClass = BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.green;
  const iconBg = ICON_BG_COLORS[data.icon] || 'bg-gray-100';

  return (
    <Tooltip content={data.description}>
      <div
        className={`bg-white rounded-xl w-[180px] cursor-pointer relative transition-all duration-150 ${
          data.isSelected
            ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-100 scale-[1.03]'
            : data.isConnected
            ? 'ring-1 ring-blue-200 shadow-md'
            : 'shadow-sm hover:shadow-md hover:scale-[1.01]'
        }`}
        style={{
          borderLeft: `4px solid ${CATEGORY_COLORS[data.icon] || '#94a3b8'}`,
        }}
      >
        <Handle type="target" position={Position.Left} className="w-3 h-3" />

        <div className="px-3 py-2.5">
          {/* Icon + Label row */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
              {iconMap[data.icon]
                ? React.createElement(iconMap[data.icon], { size: 20, className: 'text-gray-600' })
                : <span className="text-lg">{data.icon}</span>
              }
            </div>
            <div className="font-semibold text-[13px] text-gray-800 leading-tight">
              {data.label}
            </div>
          </div>

          {/* Badge row at bottom */}
          <div className="flex gap-1">
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${boundaryBadgeClass}`}>
              {badgeLabel}
            </span>
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      </div>
    </Tooltip>
  );
};

export default ComponentNode;
```

Key changes:
- Icons now have colored background circles (`w-9 h-9 rounded-lg`)
- Removed the zone badge (redundant with zone backgrounds)
- Badge moved to bottom as a rounded pill
- Card uses `rounded-xl` with cleaner shadow states
- Hover effect: subtle scale + shadow lift
- Selected state: blue ring + shadow + scale
- No more separate border classes — single `borderLeft` style
- Cleaner padding and spacing

**Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Components should have colored icon backgrounds, cleaner layout, smooth hover/selection transitions.

**Step 4: Commit**

```bash
git add src/components/ComponentNode.jsx src/constants.js
git commit -m "feat: redesign component cards with icon backgrounds and cleaner layout"
```

---

## Task 4: Quick Label Editing

**Files:**
- Modify: `src/App.jsx:78-116` (add RENAME_COMPONENT action)
- Modify: `src/App.jsx:118-211` (pass handler, add to URL state)
- Modify: `src/components/ComponentNode.jsx` (add double-click edit)
- Modify: `src/hooks/useNodes.js` (pass customLabel to node data)
- Modify: `src/hooks/useUrlState.js` (encode/decode custom labels)

**Step 1: Add RENAME_COMPONENT reducer action**

In `src/App.jsx`, add a new case in the reducer after `UPDATE_POSITION` (around line 106):

```js
case 'RENAME_COMPONENT':
  return {
    ...state,
    components: state.components.map(c =>
      c.id === action.id ? { ...c, customLabel: action.label } : c
    ),
  };
```

**Step 2: Pass rename handler from App to DiagramCanvas to nodes**

In `src/App.jsx`, add a callback:

```js
const handleRename = useCallback((id, label) => {
  dispatch({ type: 'RENAME_COMPONENT', id, label });
}, []);
```

Pass it to DiagramCanvas:

```jsx
<DiagramCanvas
  // ... existing props
  onNodeRename={handleRename}
/>
```

**Step 3: Pass onRename through DiagramCanvas to nodes via data**

In `src/hooks/useNodes.js`, add to the node data:

```js
data: {
  // ... existing fields
  label: c.customLabel || c.label,
  originalLabel: c.label,
  componentId: c.id,
},
```

In `src/components/DiagramCanvas.jsx`, pass the rename handler to ReactFlow nodes by adding it to the node data in a useEffect, OR simpler: use ReactFlow's `onNodeDoubleClick` prop:

```jsx
<ReactFlow
  // ... existing props
  onNodeDoubleClick={onNodeRename ? (event, node) => {
    if (node.type === 'component') {
      const newLabel = window.prompt('Edit label:', node.data.label);
      if (newLabel !== null && newLabel.trim()) {
        onNodeRename(node.data.componentId || node.id, newLabel.trim());
      }
    }
  } : undefined}
>
```

Note: Using `window.prompt` is the simplest approach for v1. Can be upgraded to inline editing later.

**Step 4: Accept onNodeRename prop in DiagramCanvas**

Update the DiagramCanvas function signature:

```jsx
const DiagramCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onNodeClick, selectedNodeId, onPaneClick, zoneLabels = DEFAULT_ZONE_LABELS, fitViewTrigger, onNodeRename }) => {
```

**Step 5: Encode custom labels in URL state**

In `src/hooks/useUrlState.js`, update `encodeState`:

```js
const renamedComponents = components.filter(c => c.customLabel);
if (renamedComponents.length > 0) {
  const labels = renamedComponents.map(c => `${c.id}:${encodeURIComponent(c.customLabel)}`).join(',');
  params.set('labels', labels);
}
```

Update `parseUrlState`:

```js
return {
  preset,
  hidden: params.get('hidden')?.split(',').filter(Boolean) || [],
  selected: params.get('selected') || null,
  labels: params.get('labels')?.split(',').reduce((acc, pair) => {
    const [id, label] = pair.split(':');
    if (id && label) acc[id] = decodeURIComponent(label);
    return acc;
  }, {}) || {},
};
```

In `src/App.jsx` `getInitialState`, apply custom labels from URL:

```js
if (urlState?.labels && Object.keys(urlState.labels).length > 0) {
  components = components.map(c => ({
    ...c,
    customLabel: urlState.labels[c.id] || undefined,
  }));
}
```

**Step 6: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Double-click a component → prompt appears → label changes. Share link preserves custom labels.

**Step 7: Commit**

```bash
git add src/App.jsx src/components/DiagramCanvas.jsx src/components/ComponentNode.jsx src/hooks/useNodes.js src/hooks/useUrlState.js
git commit -m "feat: add quick label editing via double-click with URL persistence"
```

---

## Task 5: Presentation Mode (Scenes)

**Files:**
- Create: `src/components/PresentationBar.jsx`
- Modify: `src/App.jsx` (add scene state and handlers)
- Modify: `src/components/DiagramCanvas.jsx` (render PresentationBar)
- Modify: `src/data/presets/shared-saas.js` (add scenes array)
- Modify: `src/data/presets/dedicated-saas.js` (add scenes array)

**Step 1: Add scenes to shared-saas preset**

In `src/data/presets/shared-saas.js`, add at the top level of the export (after `columnHeaders: []`):

```js
scenes: [
  {
    title: 'Customer Entry',
    description: 'End users connect through CloudFlare WAF and CDN for security and performance.',
    visible: ['customer-1', 'cdn'],
    select: 'cdn',
  },
  {
    title: 'Platform Orchestration',
    description: 'The Airia Platform orchestrates AI workflows, routing requests to the right services.',
    visible: ['customer-1', 'cdn', 'airia-platform-na'],
    select: 'airia-platform-na',
  },
  {
    title: 'Managed LLM Access',
    description: 'Airia Key LLM provides managed access to multiple LLM providers with a single API key.',
    visible: ['customer-1', 'cdn', 'airia-platform-na', 'airia-key-llm', 'llm-openai-managed', 'llm-anthropic-managed', 'llm-google-managed'],
    select: 'airia-key-llm',
  },
  {
    title: 'Multi-Tenant Architecture',
    description: 'Multiple customers share the same infrastructure, with isolated data and configurations.',
    visible: ['customer-1', 'customer-2', 'customer-3', 'cdn', 'airia-platform-na', 'airia-key-llm', 'llm-openai-managed', 'llm-anthropic-managed', 'llm-google-managed'],
    select: null,
  },
],
```

**Step 2: Add scenes to dedicated-saas preset**

In `src/data/presets/dedicated-saas.js`, add scenes:

```js
scenes: [
  {
    title: 'Dedicated Resources',
    description: 'Each company gets their own dedicated CDN and platform instance for full isolation.',
    visible: ['company-a-users', 'cdn-company-a', 'airia-platform-company-a'],
    select: 'airia-platform-company-a',
  },
  {
    title: 'Managed LLM Layer',
    description: 'Shared Airia Key LLM provides managed access to LLM providers across all tenants.',
    visible: ['company-a-users', 'cdn-company-a', 'airia-platform-company-a', 'airia-key-llm', 'llm-openai-managed', 'llm-anthropic-managed', 'llm-google-managed'],
    select: 'airia-key-llm',
  },
  {
    title: 'Multi-Company View',
    description: 'Multiple companies each get isolated infrastructure within the Airia Managed boundary.',
    visible: ['company-a-users', 'cdn-company-a', 'airia-platform-company-a', 'company-b-users', 'cdn-company-b', 'airia-platform-company-b', 'airia-key-llm', 'llm-openai-managed', 'llm-anthropic-managed', 'llm-google-managed'],
    select: null,
  },
],
```

**Step 3: Create PresentationBar component**

Create `src/components/PresentationBar.jsx`:

```jsx
import React from 'react';

const PresentationBar = ({ scene, sceneIndex, totalScenes, onPrev, onNext, onExit }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Prev button */}
        <button
          onClick={onPrev}
          disabled={sceneIndex === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scene content */}
        <div className="flex-1 text-center">
          <div className="text-sm font-bold text-gray-800">{scene.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{scene.description}</div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={sceneIndex === totalScenes - 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scene counter + exit */}
        <div className="flex items-center gap-3 ml-2">
          <span className="text-xs text-gray-400 font-medium">
            {sceneIndex + 1}/{totalScenes}
          </span>
          <button
            onClick={onExit}
            className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationBar;
```

**Step 4: Add presentation state to App.jsx**

In `src/App.jsx`, add to the reducer:

```js
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
```

Add `presentationMode` and `sceneIndex` to `buildPresetState`:

```js
const buildPresetState = (presetId, preset, components) => ({
  // ... existing fields
  presentationMode: false,
  sceneIndex: 0,
});
```

Add handlers in the App function:

```js
const handleStartPresentation = useCallback(() => dispatch({ type: 'START_PRESENTATION' }), []);
const handleNextScene = useCallback(() => dispatch({ type: 'NEXT_SCENE' }), []);
const handlePrevScene = useCallback(() => dispatch({ type: 'PREV_SCENE' }), []);
const handleExitPresentation = useCallback(() => dispatch({ type: 'EXIT_PRESENTATION' }), []);
```

Add keyboard listener for arrow keys and Escape:

```js
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
```

Pass presentation props to DiagramCanvas:

```jsx
<DiagramCanvas
  // ... existing props
  presentationMode={state.presentationMode}
  sceneIndex={state.sceneIndex}
  scenes={presets[currentPreset]?.scenes}
  onStartPresentation={handleStartPresentation}
  onNextScene={handleNextScene}
  onPrevScene={handlePrevScene}
  onExitPresentation={handleExitPresentation}
/>
```

**Step 5: Render PresentationBar in DiagramCanvas**

In `src/components/DiagramCanvas.jsx`, import and render:

```jsx
import PresentationBar from './PresentationBar';

// In the component signature, add new props:
const DiagramCanvas = ({ ..., presentationMode, sceneIndex, scenes, onStartPresentation, onNextScene, onPrevScene, onExitPresentation }) => {

// After </ReactFlow>, inside the outer div:
{presentationMode && scenes && scenes[sceneIndex] && (
  <PresentationBar
    scene={scenes[sceneIndex]}
    sceneIndex={sceneIndex}
    totalScenes={scenes.length}
    onPrev={onPrevScene}
    onNext={onNextScene}
    onExit={onExitPresentation}
  />
)}
```

**Step 6: Add "Present" button to ToggleSidebar**

In `src/components/ToggleSidebar.jsx`, add a Present button in the footer area (before the Copy Link button). Pass `onStartPresentation` and `presentationMode` as props.

```jsx
{!presentationMode && scenes?.length > 0 && (
  <button
    onClick={onStartPresentation}
    className="w-full text-[11px] px-2 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors flex items-center justify-center gap-1 mb-1.5"
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    Present
  </button>
)}
```

Update the ToggleSidebar signature and App.jsx to pass `onStartPresentation`, `presentationMode`, and `scenes` props.

**Step 7: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Click "Present" → bottom bar appears with scene navigation. Arrow keys work. Escape exits.

**Step 8: Commit**

```bash
git add src/components/PresentationBar.jsx src/components/DiagramCanvas.jsx src/components/ToggleSidebar.jsx src/App.jsx src/data/presets/shared-saas.js src/data/presets/dedicated-saas.js
git commit -m "feat: add presentation mode with scene-based walkthrough"
```

---

## Task 6: Layout Engine Improvements

**Files:**
- Modify: `src/utils/layoutUtils.js` (add column-based layout)
- Modify: `src/App.jsx:67-76` (use improved overlap resolution)

**Step 1: Read current layoutUtils.js**

Read `src/utils/layoutUtils.js` to understand the current `resolveOverlaps` function and its signature.

**Step 2: Add column-aware overlap resolution**

In `src/utils/layoutUtils.js`, add a new function:

```js
/**
 * Resolve overlaps using column-aware positioning.
 * Groups components by their approximate X position into columns,
 * then ensures uniform vertical spacing within each column.
 */
export const resolveOverlapsColumnAware = (components, spacing = MIN_SPACING) => {
  if (components.length <= 1) return components;

  // Group by approximate column (X position within 100px tolerance)
  const COLUMN_TOLERANCE = 100;
  const sorted = [...components].sort((a, b) => a.position.x - b.position.x);
  const columns = [];

  sorted.forEach(comp => {
    const existingCol = columns.find(col =>
      Math.abs(col.x - comp.position.x) < COLUMN_TOLERANCE
    );
    if (existingCol) {
      existingCol.components.push(comp);
    } else {
      columns.push({ x: comp.position.x, components: [comp] });
    }
  });

  // Within each column, sort by Y and enforce minimum spacing
  const result = [];
  columns.forEach(col => {
    const colComponents = col.components.sort((a, b) => a.position.y - b.position.y);
    let currentY = colComponents[0].position.y;

    colComponents.forEach((comp, i) => {
      if (i === 0) {
        result.push(comp);
        return;
      }
      const minY = currentY + COMPONENT_HEIGHT + spacing;
      const newY = Math.max(comp.position.y, minY);
      result.push({
        ...comp,
        position: { x: comp.position.x, y: newY },
      });
      currentY = newY;
    });
  });

  return result;
};
```

Import `COMPONENT_HEIGHT` at the top of `layoutUtils.js` if not already imported.

**Step 3: Update fixOverlaps in App.jsx to use column-aware resolution**

In `src/App.jsx`, update the import:

```js
import { snapPositionToGrid, resolveOverlapsColumnAware } from './utils/layoutUtils';
```

Update `fixOverlaps`:

```js
const fixOverlaps = (components) => {
  const visible = components.filter(c => c.visible);
  const fixed = resolveOverlapsColumnAware(visible);
  const fixedMap = new Map(fixed.map(c => [c.id, c.position]));
  return components.map(c => {
    const pos = fixedMap.get(c.id);
    return pos ? { ...c, position: { x: Math.round(pos.x), y: Math.round(pos.y) } } : c;
  });
};
```

**Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Toggle components on/off — they should align in clean columns with uniform vertical spacing.

**Step 5: Commit**

```bash
git add src/utils/layoutUtils.js src/App.jsx
git commit -m "feat: column-aware layout engine for cleaner component positioning"
```

---

## Summary of Tasks

| Task | Feature | Files Changed | Priority |
|------|---------|---------------|----------|
| 1 | Animated Data Flow | 3 files | High |
| 2 | Connection Polish | 5 files | High |
| 3 | Card Redesign | 2 files | High |
| 4 | Quick Label Editing | 5 files | Medium |
| 5 | Presentation Mode | 6 files | High |
| 6 | Layout Engine | 2 files | Medium |

**Recommended execution order:** Tasks 1→2→3→5→4→6 (animated flow and visual polish first for maximum impact, then narrative features, then utility features).

**Note on testing:** This is a UI-heavy React app without a test framework (no Jest/Vitest configured). Testing is manual — run `npm run dev`, open in browser, and verify each feature works. The `npm run build` command catches compile errors and type issues. Run `node test-all-presets-comprehensive.js` after modifying preset data to validate positions and boundaries.
