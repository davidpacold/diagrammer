# Demo Tool Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the Airia architecture diagram tool into a professional internal demo tool with better visuals, cleaner code, shareable URLs, and Cloudflare best practices.

**Architecture:** Incremental improvement of existing React + ReactFlow + Tailwind app deployed to Cloudflare Pages. No framework changes. Refactor code quality, upgrade visual design, add URL state sharing.

**Tech Stack:** React 18, ReactFlow 11, Tailwind CSS 3, Vite 5, Cloudflare Pages

---

### Task 1: Create constants file and extract magic numbers

**Files:**
- Create: `src/constants.js`
- Modify: `src/App.jsx`
- Modify: `src/components/DiagramCanvas.jsx`
- Modify: `src/utils/layoutUtils.js`

**Step 1: Create constants file**

```javascript
// src/constants.js
// Shared constants for the architecture diagram tool

// Component card dimensions
export const COMPONENT_WIDTH = 180;
export const COMPONENT_HEIGHT = 110;

// Grid system
export const GRID_SIZE = 20;
export const MIN_SPACING = 40;

// Zone boundary (canvas X coordinate separating public/private zones)
export const ZONE_BOUNDARY_X = 550;

// Boundary box defaults
export const DEFAULT_BOUNDARY_PADDING = 30;

// Default zone labels
export const DEFAULT_ZONE_LABELS = {
  left: 'Internet / Public',
  right: 'Private Network',
};

// Default zone background colors
export const ZONE_COLORS = {
  public: '#dbeafe',
  private: '#f3f4f6',
  privateBorder: '#9ca3af',
};

// Edge styling
export const EDGE_STYLES = {
  default: { stroke: '#94a3b8', strokeWidth: 2 },
  highlighted: { stroke: '#3b82f6', strokeWidth: 3 },
};

// Component type accent colors (left border on cards)
export const TYPE_ACCENT_COLORS = {
  infrastructure: '#3b82f6', // blue
  data: '#10b981',           // green
  security: '#f59e0b',       // amber
  integration: '#8b5cf6',    // purple
  user: '#6b7280',           // gray
  ai: '#ec4899',             // pink
};
```

**Step 2: Update imports in App.jsx**

Replace hardcoded `ZONE_BOUNDARY_X = 550` and `padding || 30` in `src/App.jsx` with imports from constants. Replace hardcoded edge style objects with `EDGE_STYLES`.

**Step 3: Update imports in DiagramCanvas.jsx**

Replace hardcoded `ZONE_BOUNDARY_X = 550` in `src/components/DiagramCanvas.jsx` with import.

**Step 4: Update imports in layoutUtils.js**

Replace hardcoded `COMPONENT_WIDTH = 180`, `COMPONENT_HEIGHT = 110`, `MIN_SPACING = 40`, `GRID_SIZE = 20` at top of `src/utils/layoutUtils.js` with imports from constants.

**Step 5: Verify app still works**

Run: `npm run dev`
Open browser, verify all three presets render correctly.

**Step 6: Commit**

```
feat: extract magic numbers into shared constants file
```

---

### Task 2: Extract duplicated getConnectedNodes into utility

**Files:**
- Create: `src/utils/graphUtils.js`
- Modify: `src/App.jsx`

**Step 1: Create graphUtils.js**

```javascript
// src/utils/graphUtils.js
// Graph traversal utilities for connection highlighting

/**
 * Get all nodes reachable from a starting node via forward connections.
 * Follows source -> target direction only.
 *
 * @param {string} nodeId - Starting node ID
 * @param {Array} connections - Array of { source, target } edge objects
 * @param {Set} visibleIds - Set of currently visible node IDs
 * @param {Set} [visited] - Internal tracking set (do not pass externally)
 * @returns {Set} Set of all connected node IDs (including the starting node)
 */
export const getConnectedNodes = (nodeId, connections, visibleIds, visited = new Set()) => {
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
};
```

**Step 2: Update App.jsx to use shared utility**

In `src/App.jsx`, remove both inline `getConnectedNodes` functions (one inside the `nodes` useMemo around line 84, one inside the `edges` useMemo around line 247). Replace with:

```javascript
import { getConnectedNodes } from './utils/graphUtils';
```

In the `nodes` useMemo, replace the inline function call with:
```javascript
const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));
const connectedNodes = selectedNodeId
  ? getConnectedNodes(selectedNodeId, connections, visibleIds)
  : new Set();
```

In the `edges` useMemo, replace similarly using the same imported function.

**Step 3: Verify**

Run: `npm run dev`
Click a component node, verify connection highlighting still works correctly across all presets.

**Step 4: Commit**

```
refactor: extract duplicated getConnectedNodes into shared utility
```

---

### Task 3: Extract node/edge building into custom hooks

**Files:**
- Create: `src/hooks/useNodes.js`
- Create: `src/hooks/useEdges.js`
- Modify: `src/App.jsx`

**Step 1: Create useNodes hook**

Extract the `nodes` useMemo block from App.jsx (lines ~42-240) into `src/hooks/useNodes.js`. The hook should accept `{ components, connections, selectedNodeId, boundaryBoxes, zoneDefinitions }` and return `nodes`.

**Step 2: Create useEdges hook**

Extract the `edges` useMemo block from App.jsx (lines ~243-283) into `src/hooks/useEdges.js`. The hook should accept `{ components, connections, selectedNodeId }` and return `edges`.

**Step 3: Simplify App.jsx**

App.jsx should now use:
```javascript
const nodes = useNodes({ components, connections, selectedNodeId, boundaryBoxes, zoneDefinitions });
const edges = useEdges({ components, connections, selectedNodeId });
```

This reduces App.jsx from ~370 lines to ~150 lines.

**Step 4: Verify all three presets work**

Run: `npm run dev`
Test shared-saas, dedicated-saas, customer-hosted presets. Verify drag, toggle, connection highlighting.

**Step 5: Commit**

```
refactor: extract node and edge building into custom hooks
```

---

### Task 4: Split presets.js into separate files

**Files:**
- Create: `src/data/presets/shared-saas.js`
- Create: `src/data/presets/dedicated-saas.js`
- Create: `src/data/presets/customer-hosted.js`
- Create: `src/data/presets/index.js`
- Delete: `src/data/presets.js`

**Step 1: Create preset directory and split files**

Move each preset object (lines 4-380, 381-757, 758-1118 of current `presets.js`) into its own file. Each file exports a single `preset` object.

**Step 2: Create index.js that re-exports**

```javascript
// src/data/presets/index.js
import { sharedSaas } from './shared-saas';
import { dedicatedSaas } from './dedicated-saas';
import { customerHosted } from './customer-hosted';

export const presets = {
  'shared-saas': sharedSaas,
  'dedicated-saas': dedicatedSaas,
  'customer-hosted': customerHosted,
};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' },
];
```

**Step 3: Update imports**

Update `src/App.jsx` import from `'./data/presets'` to `'./data/presets/index'` (or just `'./data/presets'` since index.js is auto-resolved).
Update `src/components/PresetSelector.jsx` import similarly.

**Step 4: Delete old presets.js**

Remove `src/data/presets.js`.

**Step 5: Verify**

Run: `npm run dev`
Test all three presets load and render correctly.

**Step 6: Commit**

```
refactor: split 1100-line presets.js into separate files per preset
```

---

### Task 5: Make boundary badge labels data-driven

**Files:**
- Modify: `src/data/presets/shared-saas.js`
- Modify: `src/data/presets/dedicated-saas.js`
- Modify: `src/data/presets/customer-hosted.js`
- Modify: `src/components/ComponentNode.jsx`
- Modify: `src/App.jsx` (or `src/hooks/useNodes.js`)

**Step 1: Add badge config to preset boundaryBoxes**

Each `boundaryBox` in a preset gets a new `badgeLabel` field:
```javascript
{
  id: 'airia-managed',
  label: 'Airia Managed',
  badgeLabel: 'Airia Managed',  // NEW
  badgeColor: 'indigo',          // NEW
  ...
}
```

Components not in any boundary get a default `badgeLabel: 'External'`.

**Step 2: Pass badge info through node data**

In the node-building logic (useNodes hook), pass `badgeLabel` and `badgeColor` through `data`:
```javascript
data: {
  ...existingData,
  badgeLabel: boundaryBox?.badgeLabel || 'External',
  badgeColor: boundaryBox?.badgeColor || 'green',
}
```

**Step 3: Update ComponentNode.jsx**

Remove the hardcoded `isAiriaManaged` logic that checks specific boundary IDs. Replace with:
```javascript
const badgeLabel = data.badgeLabel || 'External';
const badgeColor = data.badgeColor || 'green';
```

Use a color lookup map instead of hardcoded classes:
```javascript
const badgeColorMap = {
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
};
```

**Step 4: Verify**

Check that badges display correctly on all presets.

**Step 5: Commit**

```
refactor: make boundary badge labels data-driven from preset config
```

---

### Task 6: SVG icon system replacing emoji

**Files:**
- Create: `src/components/icons/index.jsx`
- Modify: `src/components/ComponentNode.jsx`
- Modify: all preset files (icon field changes)

**Step 1: Create SVG icon components**

Create `src/components/icons/index.jsx` with inline SVG icon components for each architecture component type. Use simple, clean line-art style (similar to Lucide/Heroicons). Each icon is a small React component accepting `className` and `size` props.

Icons needed: Globe (CDN), Server, Database, Shield (security), Cloud, Users, Key, Link (integration), Monitor, MessageSquare (queue), HardDrive (storage), Cpu (AI/LLM), Box (container), Layers (platform).

```javascript
// src/components/icons/index.jsx
const iconSize = 24;

export const GlobeIcon = ({ size = iconSize, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ... similar for all other icons
```

**Step 2: Create icon mapping**

Add an `iconMap` that maps icon string keys to components:
```javascript
export const iconMap = {
  globe: GlobeIcon,
  server: ServerIcon,
  database: DatabaseIcon,
  // ...
};
```

**Step 3: Update preset data**

Change `icon: '🌐'` to `icon: 'globe'`, `icon: '🗄️'` to `icon: 'database'`, etc. across all preset files.

**Step 4: Update ComponentNode.jsx**

Replace `<span className="text-2xl">{data.icon}</span>` with:
```javascript
import { iconMap } from './icons';
// ...
const IconComponent = iconMap[data.icon];
// ...
{IconComponent ? <IconComponent size={28} className="text-gray-600" /> : <span className="text-2xl">{data.icon}</span>}
```

**Step 5: Verify icons render**

Run: `npm run dev`
Check all components show SVG icons.

**Step 6: Commit**

```
feat: replace emoji icons with professional SVG icon system
```

---

### Task 7: Visual design upgrade — component cards and color palette

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/ComponentNode.jsx`
- Modify: `src/components/BoundaryBoxNode.jsx`
- Modify: `src/components/DiagramCanvas.jsx`
- Modify: `src/components/ToggleSidebar.jsx`

**Step 1: Add CSS custom properties for Airia brand**

Add to `src/index.css`:
```css
:root {
  --airia-primary: #4f46e5;
  --airia-primary-light: #e0e7ff;
  --airia-accent: #06b6d4;
  --airia-surface: #ffffff;
  --airia-surface-alt: #f8fafc;
  --airia-border: #e2e8f0;
  --airia-text: #1e293b;
  --airia-text-muted: #64748b;
}
```

**Step 2: Upgrade ComponentNode card design**

- Add left border accent based on component type (using `TYPE_ACCENT_COLORS` from constants)
- Improve shadow and hover transitions
- Better font sizing and spacing
- Remove position coordinates from tooltip (not useful for demos)

**Step 3: Upgrade BoundaryBoxNode**

- Slightly rounded corners, softer dashed border
- Better label styling with background pill

**Step 4: Upgrade DiagramCanvas**

- Update background grid color to match brand
- Improve Panel styling for zone labels and connection hints
- Better MiniMap colors

**Step 5: Upgrade ToggleSidebar**

- Add Airia logo/branding at top (text-based, no image needed)
- Better section separators
- Improved checkbox styling
- Subtle hover/active states

**Step 6: Verify full visual coherence**

Run: `npm run dev`
Check all presets look polished and cohesive.

**Step 7: Commit**

```
feat: visual design upgrade with Airia brand palette
```

---

### Task 8: Replace title tooltips with floating popovers

**Files:**
- Create: `src/components/Tooltip.jsx`
- Modify: `src/components/ComponentNode.jsx`

**Step 1: Create Tooltip component**

A simple floating popover that appears on hover, positioned above the component card:

```javascript
// src/components/Tooltip.jsx
import React, { useState } from 'react';

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
```

**Step 2: Update ComponentNode to use Tooltip**

Remove `title={tooltip}` attribute. Wrap the card with `<Tooltip content={data.description}>`. Show description text in a clean popover instead of browser-native tooltip.

**Step 3: Verify**

Hover over components, verify popover appears and disappears cleanly.

**Step 4: Commit**

```
feat: replace browser tooltips with styled floating popovers
```

---

### Task 9: Sidebar UI improvements

**Files:**
- Modify: `src/components/ToggleSidebar.jsx`

**Step 1: Add Show All / Hide All buttons**

Add two small buttons above the component list:
```jsx
<div className="flex gap-2 mb-3">
  <button onClick={onShowAll} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">
    Show All
  </button>
  <button onClick={onHideAll} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">
    Hide All
  </button>
</div>
```

**Step 2: Add onShowAll/onHideAll callbacks to App.jsx**

```javascript
const handleShowAll = useCallback(() => {
  setComponents(prev => prev.map(c => ({ ...c, visible: true })));
}, []);

const handleHideAll = useCallback(() => {
  setComponents(prev => prev.map(c => ({ ...c, visible: false })));
}, []);
```

**Step 3: Make component groups collapsible**

Wrap each zone section (Public/Private) in a collapsible container with a toggle chevron.

**Step 4: Verify**

Test show all, hide all, and collapsible sections.

**Step 5: Commit**

```
feat: add show/hide all buttons and collapsible sidebar sections
```

---

### Task 10: Shareable URL state

**Files:**
- Create: `src/hooks/useUrlState.js`
- Modify: `src/App.jsx`
- Modify: `src/components/ToggleSidebar.jsx`

**Step 1: Create useUrlState hook**

```javascript
// src/hooks/useUrlState.js
import { useEffect, useCallback } from 'react';

/**
 * Encode current diagram state into URL hash.
 * Format: #preset=shared-saas&hidden=id1,id2&selected=id3
 */
export const encodeState = (preset, components, selectedNodeId) => {
  const params = new URLSearchParams();
  params.set('preset', preset);

  const hiddenIds = components.filter(c => !c.visible).map(c => c.id);
  if (hiddenIds.length > 0) {
    params.set('hidden', hiddenIds.join(','));
  }

  if (selectedNodeId) {
    params.set('selected', selectedNodeId);
  }

  return '#' + params.toString();
};

/**
 * Parse URL hash into state.
 * Returns null if no hash present.
 */
export const parseUrlState = () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return {
    preset: params.get('preset'),
    hidden: params.get('hidden')?.split(',').filter(Boolean) || [],
    selected: params.get('selected') || null,
  };
};

/**
 * Hook that syncs diagram state to URL hash.
 */
export const useUrlState = (preset, components, selectedNodeId) => {
  // Update URL hash when state changes (debounced)
  useEffect(() => {
    const hash = encodeState(preset, components, selectedNodeId);
    window.history.replaceState(null, '', hash);
  }, [preset, components, selectedNodeId]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return { copyLink };
};
```

**Step 2: Integrate into App.jsx**

On initial mount, check for URL state and apply it:
```javascript
const urlState = parseUrlState();
const initialPreset = urlState?.preset || 'shared-saas';
// Initialize state from URL or defaults
```

Use the hook to keep URL synced:
```javascript
const { copyLink } = useUrlState(currentPreset, components, selectedNodeId);
```

**Step 3: Add "Copy Link" button to sidebar**

In `ToggleSidebar.jsx`, add a button in the footer:
```jsx
<button
  onClick={onCopyLink}
  className="w-full text-xs px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1"
>
  Copy Shareable Link
</button>
```

Show a brief "Copied!" feedback after clicking.

**Step 4: Verify**

1. Load app, change preset, toggle components, click a node
2. Copy the URL from browser bar
3. Open in new tab — verify state is restored
4. Test "Copy Link" button

**Step 5: Commit**

```
feat: add shareable URL state with copy link button
```

---

### Task 11: Cloudflare Pages best practices

**Files:**
- Modify: `index.html`
- Create: `public/_headers`
- Modify: `wrangler.toml`
- Create: `public/favicon.svg`

**Step 1: Update index.html meta tags**

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Airia Architecture Diagram - Interactive system architecture visualization" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Airia Architecture Diagram</title>
</head>
```

**Step 2: Create Cloudflare Pages _headers file**

```
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

**Step 3: Update wrangler.toml**

```toml
name = "architecture-diagram"
compatibility_date = "2025-12-01"
pages_build_output_dir = "dist"
```

**Step 4: Create simple favicon.svg**

A simple SVG favicon (diagram/architecture icon):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="2" y="2" width="12" height="8" rx="2" fill="#4f46e5"/>
  <rect x="18" y="2" width="12" height="8" rx="2" fill="#06b6d4"/>
  <rect x="10" y="22" width="12" height="8" rx="2" fill="#4f46e5"/>
  <line x1="8" y1="10" x2="16" y2="22" stroke="#94a3b8" stroke-width="2"/>
  <line x1="24" y1="10" x2="16" y2="22" stroke="#94a3b8" stroke-width="2"/>
</svg>
```

**Step 5: Verify build**

Run: `npm run build`
Check dist output has _headers and favicon.svg.

**Step 6: Commit**

```
feat: add Cloudflare Pages headers, meta tags, and favicon
```

---

### Task 12: Final verification and cleanup

**Step 1: Run full build**

```bash
npm run build
```

Verify no build errors.

**Step 2: Preview production build**

```bash
npm run preview
```

Open in browser, test all three presets, toggle visibility, click to highlight connections, verify shareable URLs work, check SVG icons render.

**Step 3: Clean up unused files**

Remove any test files at project root that are no longer needed (e.g., `qa-shared-saas.js`, `test-*.js`, `validate-layout.js`, `demo-dynamic-sizing.js`) — check with user first.

**Step 4: Final commit**

```
chore: final cleanup and verification
```
