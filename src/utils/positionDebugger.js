/**
 * Position Debugger - Logs actual component positions in browser
 * Use in development mode to debug positioning issues
 */

export const logComponentPositions = (components, boundaryBoxes) => {
  console.group('🔍 Component Positions Debug');

  const visibleComponents = components.filter(c => c.visible);
  console.log(`Total visible: ${visibleComponents.length}/${components.length}`);

  // Group by parent
  const byParent = {};
  const external = [];

  visibleComponents.forEach(c => {
    if (c.parentBoundary) {
      if (!byParent[c.parentBoundary]) {
        byParent[c.parentBoundary] = [];
      }
      byParent[c.parentBoundary].push(c);
    } else {
      external.push(c);
    }
  });

  // Log boundary boxes
  console.group('📦 Boundary Boxes');
  boundaryBoxes.forEach(box => {
    const children = byParent[box.id] || [];
    console.log(`${box.label} at (${box.x}, ${box.y}) ${box.width}×${box.height}`);
    console.log(`  Children: ${children.length}`);
    children.forEach(c => {
      const absX = box.x + c.position.x;
      const absY = box.y + c.position.y;
      console.log(`    - ${c.label}: rel(${c.position.x},${c.position.y}) → abs(${absX},${absY})`);
    });
  });
  console.groupEnd();

  // Log external components
  console.group('🌍 External Components (no parent)');
  external.forEach(c => {
    console.log(`${c.label}: (${c.position.x}, ${c.position.y}) [${c.zone}]`);
  });
  console.groupEnd();

  // Check for overlaps
  console.group('⚠️  Overlap Detection');
  const COMPONENT_WIDTH = 180;
  const COMPONENT_HEIGHT = 110;
  const MIN_SPACING = 40;

  const overlaps = [];

  for (let i = 0; i < visibleComponents.length; i++) {
    for (let j = i + 1; j < visibleComponents.length; j++) {
      const c1 = visibleComponents[i];
      const c2 = visibleComponents[j];

      // Only check same context
      const sameParent = c1.parentBoundary === c2.parentBoundary;
      const sameZone = c1.zone === c2.zone;

      if (sameParent || (sameZone && !c1.parentBoundary && !c2.parentBoundary)) {
        // Get absolute positions
        let pos1 = c1.position;
        let pos2 = c2.position;

        if (c1.parentBoundary) {
          const boundary = boundaryBoxes.find(b => b.id === c1.parentBoundary);
          if (boundary) {
            pos1 = { x: boundary.x + c1.position.x, y: boundary.y + c1.position.y };
          }
        }

        if (c2.parentBoundary) {
          const boundary = boundaryBoxes.find(b => b.id === c2.parentBoundary);
          if (boundary) {
            pos2 = { x: boundary.x + c2.position.x, y: boundary.y + c2.position.y };
          }
        }

        // Check overlap with spacing buffer
        const r1 = {
          x: pos1.x - MIN_SPACING / 2,
          y: pos1.y - MIN_SPACING / 2,
          width: COMPONENT_WIDTH + MIN_SPACING,
          height: COMPONENT_HEIGHT + MIN_SPACING
        };
        const r2 = {
          x: pos2.x - MIN_SPACING / 2,
          y: pos2.y - MIN_SPACING / 2,
          width: COMPONENT_WIDTH + MIN_SPACING,
          height: COMPONENT_HEIGHT + MIN_SPACING
        };

        const doesOverlap = !(
          r1.x + r1.width <= r2.x ||
          r2.x + r2.width <= r1.x ||
          r1.y + r1.height <= r2.y ||
          r2.y + r2.height <= r1.y
        );

        if (doesOverlap) {
          const horizontalGap = Math.min(
            Math.abs(pos2.x - (pos1.x + COMPONENT_WIDTH)),
            Math.abs(pos1.x - (pos2.x + COMPONENT_WIDTH))
          );
          const verticalGap = Math.min(
            Math.abs(pos2.y - (pos1.y + COMPONENT_HEIGHT)),
            Math.abs(pos1.y - (pos2.y + COMPONENT_HEIGHT))
          );
          const gap = Math.min(horizontalGap, verticalGap);

          overlaps.push({
            c1: c1.label,
            c2: c2.label,
            pos1,
            pos2,
            gap: Math.round(gap)
          });
        }
      }
    }
  }

  if (overlaps.length === 0) {
    console.log('✅ No overlaps detected');
  } else {
    console.log(`❌ Found ${overlaps.length} overlap(s):`);
    overlaps.forEach(overlap => {
      console.log(`  ${overlap.c1} at (${overlap.pos1.x},${overlap.pos1.y}) OVERLAPS ${overlap.c2} at (${overlap.pos2.x},${overlap.pos2.y}) - gap: ${overlap.gap}px`);
    });
  }
  console.groupEnd();

  console.groupEnd();

  return { visibleComponents, overlaps };
};
