// Utility functions for automatic layout and collision detection

const COMPONENT_WIDTH = 180; // Card width with safety margin
const COMPONENT_HEIGHT = 110; // Card height with safety margin
const MIN_SPACING = 40; // Generous spacing between cards for clarity

// Grid system for Visio-style alignment
const GRID_SIZE = 20; // 20px grid for snapping
const GRID_COLUMNS = 2; // Default columns for grid layout
const GRID_ROW_SPACING = 150; // Vertical spacing between rows
const GRID_COL_SPACING = 200; // Horizontal spacing between columns

/**
 * Check if two card rectangles overlap (including spacing buffer)
 */
export const checkOverlap = (rect1, rect2) => {
  // Add spacing buffer to both rectangles
  const r1 = {
    x: rect1.x - MIN_SPACING / 2,
    y: rect1.y - MIN_SPACING / 2,
    width: rect1.width + MIN_SPACING,
    height: rect1.height + MIN_SPACING
  };
  const r2 = {
    x: rect2.x - MIN_SPACING / 2,
    y: rect2.y - MIN_SPACING / 2,
    width: rect2.width + MIN_SPACING,
    height: rect2.height + MIN_SPACING
  };

  // Check if rectangles with buffers overlap
  return !(
    r1.x + r1.width <= r2.x ||
    r2.x + r2.width <= r1.x ||
    r1.y + r1.height <= r2.y ||
    r2.y + r2.height <= r1.y
  );
};

/**
 * Resolve overlaps between components using a simple force-directed approach
 * IMPORTANT: Only moves components within the same parent boundary or zone
 * @param {Array} components - Array of components with positions
 * @param {number} iterations - Number of iterations to run (default: 50)
 * @param {boolean} respectBoundaries - If true, won't move components with parentBoundary (default: false)
 * @returns {Array} - Components with adjusted positions
 */
export const resolveOverlaps = (components, iterations = 50, respectBoundaries = false) => {
  // Create a working copy with rectangles
  const rects = components.map(c => ({
    id: c.id,
    x: c.position.x,
    y: c.position.y,
    width: COMPONENT_WIDTH,
    height: COMPONENT_HEIGHT,
    parentBoundary: c.parentBoundary,
    zone: c.zone,
    locked: respectBoundaries && c.parentBoundary != null, // Lock components with parent boundaries
  }));

  // Run multiple iterations to resolve overlaps
  for (let iter = 0; iter < iterations; iter++) {
    let hasOverlap = false;

    // Check each pair of components
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        // Only check overlaps for components in the same parent or zone
        const sameParent = rects[i].parentBoundary === rects[j].parentBoundary;
        const sameZone = rects[i].zone === rects[j].zone;

        if ((sameParent || (sameZone && !rects[i].parentBoundary && !rects[j].parentBoundary)) &&
            checkOverlap(rects[i], rects[j])) {
          hasOverlap = true;

          // Skip if both components are locked
          if (rects[i].locked && rects[j].locked) continue;

          // Calculate centers
          const centerI = {
            x: rects[i].x + rects[i].width / 2,
            y: rects[i].y + rects[i].height / 2,
          };
          const centerJ = {
            x: rects[j].x + rects[j].width / 2,
            y: rects[j].y + rects[j].height / 2,
          };

          // Calculate push direction
          const dx = centerJ.x - centerI.x;
          const dy = centerJ.y - centerI.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          // Calculate required separation distance
          const requiredDistanceX = (rects[i].width + rects[j].width) / 2 + MIN_SPACING;
          const requiredDistanceY = (rects[i].height + rects[j].height) / 2 + MIN_SPACING;
          const requiredDistance = Math.sqrt(requiredDistanceX * requiredDistanceX + requiredDistanceY * requiredDistanceY);

          // Apply force proportional to overlap severity
          const overlapRatio = Math.max(0, (requiredDistance - distance) / requiredDistance);
          const forceStrength = 25 * (1 + overlapRatio * 2); // Stronger force for worse overlaps

          const forceX = (dx / distance) * forceStrength;
          const forceY = (dy / distance) * forceStrength;

          // Push components apart (only if not locked)
          if (!rects[i].locked) {
            rects[i].x -= forceX;
            rects[i].y -= forceY;
          }
          if (!rects[j].locked) {
            rects[j].x += forceX;
            rects[j].y += forceY;
          }
        }
      }
    }

    // If no overlaps remain, we can stop early
    if (!hasOverlap) break;
  }

  // Return components with updated positions
  return components.map(c => {
    const rect = rects.find(r => r.id === c.id);
    return {
      ...c,
      position: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
      },
    };
  });
};

/**
 * Snap a position to the nearest grid point (Visio-style)
 * @param {number} value - The value to snap
 * @param {number} gridSize - Grid size (default: GRID_SIZE)
 * @returns {number} - Snapped value
 */
export const snapToGrid = (value, gridSize = GRID_SIZE) => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a component position to grid
 * @param {object} position - Position with x and y
 * @returns {object} - Snapped position
 */
export const snapPositionToGrid = (position) => {
  return {
    x: snapToGrid(position.x),
    y: snapToGrid(position.y),
  };
};

/**
 * Auto-arrange components in a grid layout within a boundary box (Visio-style)
 * @param {Array} components - All components
 * @param {string} boundaryId - ID of the boundary box
 * @param {number} startX - Starting X position (relative to boundary)
 * @param {number} startY - Starting Y position (relative to boundary)
 * @param {number} columns - Number of columns (default: GRID_COLUMNS)
 * @returns {Array} - Components with grid-arranged positions
 */
export const autoArrangeInBoundary = (components, boundaryId, startX = 40, startY = 40, columns = GRID_COLUMNS) => {
  const childComponents = components.filter(c => c.parentBoundary === boundaryId && c.visible);

  return components.map(c => {
    if (c.parentBoundary === boundaryId && c.visible) {
      const index = childComponents.findIndex(child => child.id === c.id);
      const row = Math.floor(index / columns);
      const col = index % columns;

      // Calculate grid-based position
      const x = snapToGrid(startX + col * GRID_COL_SPACING);
      const y = snapToGrid(startY + row * GRID_ROW_SPACING);

      return {
        ...c,
        position: { x, y },
      };
    }
    return c;
  });
};

/**
 * Arrange components in a grid layout (Visio-style)
 * Automatically calculates optimal grid based on number of components
 * @param {Array} components - Array of components to arrange
 * @param {number} startX - Starting X position
 * @param {number} startY - Starting Y position
 * @returns {Array} - Components with grid-arranged positions
 */
export const arrangeInGrid = (components, startX = 40, startY = 40) => {
  const visibleComponents = components.filter(c => c.visible);

  // Calculate optimal columns (2-3 for most cases)
  const numComponents = visibleComponents.length;
  const columns = numComponents <= 4 ? 2 : Math.min(3, Math.ceil(Math.sqrt(numComponents)));

  return components.map(c => {
    if (!c.visible) return c;

    const index = visibleComponents.findIndex(comp => comp.id === c.id);
    const row = Math.floor(index / columns);
    const col = index % columns;

    return {
      ...c,
      position: {
        x: snapToGrid(startX + col * GRID_COL_SPACING),
        y: snapToGrid(startY + row * GRID_ROW_SPACING),
      },
    };
  });
};

/**
 * Check if any components are overlapping
 * @param {Array} components - Array of visible components
 * @returns {boolean} - True if any overlaps detected
 */
export const hasOverlaps = (components) => {
  const rects = components.map(c => ({
    x: c.position.x,
    y: c.position.y,
    width: COMPONENT_WIDTH,
    height: COMPONENT_HEIGHT,
    parentBoundary: c.parentBoundary,
    zone: c.zone,
  }));

  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const sameParent = rects[i].parentBoundary === rects[j].parentBoundary;
      const sameZone = rects[i].zone === rects[j].zone;

      if ((sameParent || (sameZone && !rects[i].parentBoundary && !rects[j].parentBoundary)) &&
          checkOverlap(rects[i], rects[j])) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Detect and report overlaps with details
 * @param {Array} components - Array of visible components
 * @returns {Array} - Array of overlap details
 */
export const detectOverlaps = (components) => {
  const overlaps = [];
  const rects = components.map(c => ({
    id: c.id,
    label: c.label,
    x: c.position.x,
    y: c.position.y,
    width: COMPONENT_WIDTH,
    height: COMPONENT_HEIGHT,
    parentBoundary: c.parentBoundary,
    zone: c.zone,
  }));

  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const sameParent = rects[i].parentBoundary === rects[j].parentBoundary;
      const sameZone = rects[i].zone === rects[j].zone;

      if ((sameParent || (sameZone && !rects[i].parentBoundary && !rects[j].parentBoundary)) &&
          checkOverlap(rects[i], rects[j])) {
        overlaps.push({
          component1: { id: rects[i].id, label: rects[i].label, position: { x: rects[i].x, y: rects[i].y } },
          component2: { id: rects[j].id, label: rects[j].label, position: { x: rects[j].x, y: rects[j].y } },
          context: rects[i].parentBoundary || rects[i].zone || 'none'
        });
      }
    }
  }

  return overlaps;
};

/**
 * Auto-fix overlaps on preset load by adjusting positions
 * IMPORTANT: Respects parent boundaries - components stay in their containers
 * @param {Array} components - Array of components (may have overlaps)
 * @returns {Array} - Components with corrected positions
 */
export const autoFixOverlaps = (components) => {
  const visibleComponents = components.filter(c => c.visible);

  // Detect overlaps first
  const overlaps = detectOverlaps(visibleComponents);

  if (overlaps.length === 0) {
    console.log('✅ No overlaps detected in preset');
    return components;
  }

  console.warn(`⚠️ Detected ${overlaps.length} overlaps in preset. Auto-fixing while respecting parent boundaries...`);
  overlaps.forEach(overlap => {
    console.log(`  - ${overlap.component1.label} overlaps with ${overlap.component2.label} (in ${overlap.context})`);
  });

  // Use resolveOverlaps with respectBoundaries=true to keep components in their containers
  const fixedVisibleComponents = resolveOverlaps(visibleComponents, 100, true);

  // Snap positions to grid after fixing
  const snappedComponents = fixedVisibleComponents.map(c => ({
    ...c,
    position: snapPositionToGrid(c.position)
  }));

  // Merge fixed visible components back with hidden components
  return components.map(c => {
    if (c.visible) {
      const fixed = snappedComponents.find(fc => fc.id === c.id);
      return fixed || c;
    }
    return c;
  });
};
