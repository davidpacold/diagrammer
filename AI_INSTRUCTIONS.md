# AI Assistant Instructions for Diagrammer Project

## Quick Start for AI Assistants
This document provides essential information for Claude, Cursor, Cline, Aider, and other AI coding assistants working on this project.

## Project Summary
Interactive React diagram tool for visualizing Airia deployment architectures using ReactFlow.

## Non-Negotiable Rules ⚠️

### 1. Component Dimensions
```javascript
// ComponentNode.jsx - Line 37
className="... w-[180px] ..."  // FIXED - NEVER change to min-w or any other width
```
- Width: **180px** (fixed, not minimum)
- Height: **110px** (fixed)
- Reason: Variable width causes visual overlaps even when positions are correct

### 2. Spacing Requirements
- Minimum spacing: **40px** between all components
- Calculation: `nextPosition = currentPosition + componentSize + 40`
- Example:
  - Component A at x=40 (width 180px) → Component B at x=260 (40 + 180 + 40 = 260)
  - Component A at y=40 (height 110px) → Component B at y=190 (40 + 110 + 40 = 190)

### 3. Zone Boundary
- Public zone: x < 550px (blue background)
- Private zone: x ≥ 550px (gray background)
- Public components MUST have x + 180 ≤ 550

### 4. Position Types
**Absolute positions** (no parent):
```javascript
{ id: 'external-service', position: { x: 100, y: 200 }, zone: 'public' }
```

**Relative positions** (with parent):
```javascript
{
  id: 'managed-service',
  position: { x: 30, y: 40 },  // Relative to parent boundary
  parentBoundary: 'airia-managed'
}
```

## Mandatory Workflow

### Before ANY Position Changes
```bash
# 1. Run validation
node test-all-presets-comprehensive.js

# 2. Check browser console for position debug
# Look for: 🔍 Component Positions Debug

# 3. Calculate new positions (show your math!)
# nextX = currentX + 180 + 40
# nextY = currentY + 110 + 40
```

### After Position Changes
```bash
# 1. Update src/data/presets.js
# 2. Recalculate boundary sizes if needed
# 3. Run validation again
node test-all-presets-comprehensive.js

# 4. Verify in browser (npm run dev)
```

## Current State Reference

### Shared-SaaS Preset ✅
- Status: 21/21 components validated
- Customer cards: x=20, y=[40, 190, 340] (150px spacing)
- Boundary: (260, 20) single-column layout
- External services: y≥450

### Dedicated-SaaS Preset ✅
- Status: 22/22 components validated
- Company cards: x=-250, y=[40, 190, 340] (150px spacing)
- Boundary: (0, 0) two-column layout
  - Column 1 (CDNs): x=40
  - Column 2 (Platforms): x=260
  - Key LLM: x=150, y=490 (centered)
- **Special feature**: Grouped toggles (1 checkbox per company controls 3 components)

### Customer-Hosted Preset ⚠️
- Status: 76 overlaps detected
- Needs: Complete layout refactor
- Do not reference this preset for positioning examples

## File Reference

### Critical Files
| File | Purpose | Key Lines |
|------|---------|-----------|
| `src/data/presets.js` | All positions & connections | Entire file |
| `src/components/ComponentNode.jsx` | Component card rendering | Line 37 (width) |
| `src/App.jsx` | Dynamic boundary sizing | Lines 173-224 |
| `src/components/ToggleSidebar.jsx` | Grouped company toggles | Lines 13-117 |

### Test Files
| File | Purpose |
|------|---------|
| `test-all-presets-comprehensive.js` | Validates all presets |
| `test-dedicated-saas-components.js` | Individual component tests |
| `test-all-visible.js` | All visible simultaneously |

## Common Tasks

### Task: Fix Component Overlap

**Bad approach** ❌:
```javascript
// Just guessing new positions
position: { x: 100, y: 200 }
```

**Good approach** ✅:
```javascript
// 1. Identify overlap
node test-all-presets-comprehensive.js
// Output: "Component A overlaps Component B (gap: 10px, required: 40px)"

// 2. Calculate fix
// Component A at x=100 (width 180px)
// Required spacing: 40px
// Component B new x = 100 + 180 + 40 = 320

// 3. Update position
position: { x: 320, y: 200 }  // Now has 40px gap

// 4. Validate
node test-all-presets-comprehensive.js
```

### Task: Add New Component

```javascript
// 1. Find insertion point (e.g., after Component A)
const componentA = { position: { x: 40, y: 40 } };

// 2. Calculate position with 40px spacing
const newComponent = {
  id: 'new-service',
  label: 'New Service',
  position: {
    x: 40,  // Same column
    y: 40 + 110 + 40  // componentA.y + height + spacing = 190
  },
  visible: true,
  icon: '🔧',
  zone: 'public'
};

// 3. Add to presets.js components array
// 4. Add connections if needed
// 5. Validate
```

### Task: Adjust Boundary Size

```javascript
// 1. Find rightmost/bottommost child
const children = components.filter(c => c.parentBoundary === 'boundary-id');
const maxX = Math.max(...children.map(c => c.position.x));
const maxY = Math.max(...children.map(c => c.position.y));

// 2. Calculate required size
const PADDING = 40;
const requiredWidth = maxX + 180 + PADDING;  // x + width + padding
const requiredHeight = maxY + 110 + PADDING;  // y + height + padding

// 3. Update boundary in presets.js
boundaryBoxes: [{
  id: 'boundary-id',
  width: requiredWidth,
  height: requiredHeight,
  padding: 40
}]
```

## Debugging Tips

### Browser Console (Dev Mode)
The app automatically logs detailed position information:
```
🔍 Component Positions Debug
  📦 Boundary Boxes
    Airia Managed at (0, 0) 480×640
      Children: 9
        - CDN (Company A): rel(40,40) → abs(40,40)
  ⚠️ Overlap Detection
    ✅ No overlaps detected
```

### Validation Output
```bash
$ node test-all-presets-comprehensive.js

Testing: Dedicated SaaS
✓ Total components: 22
✓ Visible components: 22
✅ ALL CHECKS PASSED
```

### Common Error Messages
| Error | Cause | Fix |
|-------|-------|-----|
| "Exceeds public zone boundary" | x + 180 > 550 | Move left or change to private zone |
| "Outside parent boundary" | Relative position too large | Recalculate boundary size or move component |
| "Overlaps with X (gap: Npx)" | Components too close | Recalculate with 40px spacing |

## Technology Stack
- **React 18**: Functional components, hooks
- **ReactFlow**: Diagram rendering library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling

## Development Commands
```bash
npm install           # Install dependencies
npm run dev           # Start dev server (port 5173)
npm run build         # Production build
node test-*.js        # Run validation tests
```

## Getting Help
1. Check `.clinerules` for detailed documentation
2. Run validation tests to identify issues
3. Check browser console for position debug output
4. Reference working presets (shared-saas, dedicated-saas)

---
**Remember**: Always validate before and after making changes!
