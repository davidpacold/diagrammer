# Architecture Diagram Demo Tool — Polish Design

**Date:** 2026-03-03
**Goal:** Polish the Airia architecture diagram tool for internal sales/customer demos
**Approach:** Incremental improvement — upgrade visuals, clean up code, add shareable URLs

## 1. Visual Design Upgrade

### Problem
Emoji icons look unprofessional. Generic color scheme with no branding. Basic component cards.

### Solution
- Replace emoji icons with inline SVG icons (Lucide-style) for all component types
- Airia brand color palette via CSS custom properties for easy theming
- Component cards get left-border color accent by type (infra=blue, data=green, security=orange)
- Clean zone labels (no emoji), professional typography
- Better edge/connection styling

## 2. Code Quality

### Problem
- `getConnectedNodes()` duplicated in App.jsx (nodes and edges useMemo)
- 46KB `presets.js` monolith
- Magic numbers scattered (ZONE_BOUNDARY_X=550, component dimensions)
- Hardcoded "Airia Managed"/"External" in ComponentNode.jsx
- Boundary badge logic coupled to specific boundary IDs

### Solution
- Extract `getConnectedNodes` into `src/utils/graphUtils.js`
- Split presets into `src/data/presets/shared-saas.js`, `dedicated-saas.js`, etc.
- Create `src/constants.js` for dimensions, colors, magic numbers
- Make boundary badge labels data-driven from preset config
- Extract node/edge building into `useNodes` and `useEdges` custom hooks

## 3. Shareable URL State

### How it works
- Encode state in URL hash: `#preset=shared-saas&hidden=customer-2,siem-public&selected=cdn`
- Parse hash on load to restore state
- "Copy Link" button in sidebar copies current URL to clipboard
- Supports: preset, visibility toggles, selected node
- Pure client-side, no server state needed

## 4. UI Polish

### Sidebar
- Collapsible component group sections
- Search/filter for component list
- "Show All" / "Hide All" quick actions
- Better visual hierarchy

### Canvas
- Replace `title` tooltips with floating popovers (custom component)
- Better connection hint panel
- Improved MiniMap styling

## 5. Cloudflare & Build Best Practices

- Proper `<meta>` tags (description, og:image)
- `_headers` file for Cloudflare Pages (cache control, security headers)
- Update `wrangler.toml` compatibility flags
- Custom favicon (not default Vite logo)
