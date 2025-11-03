/**
 * Test All Components Visible Simultaneously
 * Enables ALL components and checks for overlaps
 * Run with: node test-all-visible.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function getAbsolutePosition(component, boundaryBoxes) {
  if (!component.parentBoundary) {
    return component.position;
  }

  const boundary = boundaryBoxes.find(b => b.id === component.parentBoundary);
  if (!boundary) {
    return component.position;
  }

  return {
    x: boundary.x + component.position.x,
    y: boundary.y + component.position.y
  };
}

function checkOverlap(rect1, rect2) {
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

  return !(
    r1.x + r1.width <= r2.x ||
    r2.x + r2.width <= r1.x ||
    r1.y + r1.height <= r2.y ||
    r2.y + r2.height <= r1.y
  );
}

function calculateBoundarySize(box, components) {
  const childComponents = components.filter(c =>
    c.visible && c.parentBoundary === box.id
  );

  if (childComponents.length === 0) {
    return { width: box.width, height: box.height };
  }

  const PADDING = box.padding || 30;
  const childPositions = childComponents.map(c => c.position);
  const maxX = Math.max(...childPositions.map(p => p.x));
  const maxY = Math.max(...childPositions.map(p => p.y));

  const rightEdge = maxX + COMPONENT_WIDTH;
  const bottomEdge = maxY + COMPONENT_HEIGHT;

  return {
    width: Math.max(rightEdge + PADDING, box.width),
    height: Math.max(bottomEdge + PADDING, box.height)
  };
}

console.log('\n' + '='.repeat(80));
console.log('🔍 TEST: ALL COMPONENTS VISIBLE SIMULTANEOUSLY');
console.log('='.repeat(80) + '\n');

const preset = JSON.parse(JSON.stringify(presets['shared-saas']));
const boundaryBoxes = preset.boundaryBoxes || [];
const allComponents = preset.zones
  ? Object.values(preset.zones).flatMap(zone => zone.components)
  : preset.components || [];

// Enable ALL components
allComponents.forEach(c => c.visible = true);

console.log(`Total components: ${allComponents.length}`);
console.log(`All components enabled for testing\n`);

// Update boundary sizes
const updatedBoundaries = {};
boundaryBoxes.forEach(box => {
  const size = calculateBoundarySize(box, allComponents);
  updatedBoundaries[box.id] = { ...box, ...size };
  console.log(`Boundary "${box.label}": ${box.width}×${box.height} → ${size.width}×${size.height}`);

  if (box.zone === 'public') {
    const rightEdge = box.x + size.width;
    if (rightEdge > ZONE_BOUNDARY_X) {
      console.log(`  ${RED}❌ Exceeds zone: ${rightEdge} > ${ZONE_BOUNDARY_X}${RESET}`);
    } else {
      console.log(`  ${GREEN}✅ Within zone: ${rightEdge} <= ${ZONE_BOUNDARY_X}${RESET}`);
    }
  }
});

console.log('\n' + '-'.repeat(80));
console.log('CHECKING FOR OVERLAPS');
console.log('-'.repeat(80) + '\n');

const overlaps = [];

for (let i = 0; i < allComponents.length; i++) {
  for (let j = i + 1; j < allComponents.length; j++) {
    const c1 = allComponents[i];
    const c2 = allComponents[j];

    // Only check components in same context
    const sameParent = c1.parentBoundary === c2.parentBoundary;
    const sameZone = c1.zone === c2.zone;

    if (sameParent || (sameZone && !c1.parentBoundary && !c2.parentBoundary)) {
      const pos1 = getAbsolutePosition(c1, Object.values(updatedBoundaries));
      const pos2 = getAbsolutePosition(c2, Object.values(updatedBoundaries));

      const rect1 = { x: pos1.x, y: pos1.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
      const rect2 = { x: pos2.x, y: pos2.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

      if (checkOverlap(rect1, rect2)) {
        const horizontalDist = Math.min(
          Math.abs(pos2.x - (pos1.x + COMPONENT_WIDTH)),
          Math.abs(pos1.x - (pos2.x + COMPONENT_WIDTH))
        );
        const verticalDist = Math.min(
          Math.abs(pos2.y - (pos1.y + COMPONENT_HEIGHT)),
          Math.abs(pos1.y - (pos2.y + COMPONENT_HEIGHT))
        );
        const gap = Math.min(horizontalDist, verticalDist);

        overlaps.push({
          c1: c1.label,
          c2: c2.label,
          pos1,
          pos2,
          gap: Math.round(gap),
          zone: c1.zone
        });
      }
    }
  }
}

if (overlaps.length === 0) {
  console.log(`${GREEN}✅ NO OVERLAPS FOUND - All ${allComponents.length} components positioned correctly!${RESET}\n`);
} else {
  console.log(`${RED}❌ Found ${overlaps.length} overlap(s):${RESET}\n`);

  // Group by zone
  const publicOverlaps = overlaps.filter(o => o.zone === 'public');
  const privateOverlaps = overlaps.filter(o => o.zone === 'private');

  if (publicOverlaps.length > 0) {
    console.log(`${YELLOW}PUBLIC ZONE:${RESET}`);
    publicOverlaps.forEach((overlap, i) => {
      console.log(`  ${i + 1}. ${overlap.c1} at (${overlap.pos1.x}, ${overlap.pos1.y})`);
      console.log(`     ⚠️  OVERLAPS ${overlap.c2} at (${overlap.pos2.x}, ${overlap.pos2.y})`);
      console.log(`     Gap: ${overlap.gap}px (need 40px minimum)\n`);
    });
  }

  if (privateOverlaps.length > 0) {
    console.log(`${YELLOW}PRIVATE ZONE:${RESET}`);
    privateOverlaps.forEach((overlap, i) => {
      console.log(`  ${i + 1}. ${overlap.c1} at (${overlap.pos1.x}, ${overlap.pos1.y})`);
      console.log(`     ⚠️  OVERLAPS ${overlap.c2} at (${overlap.pos2.x}, ${overlap.pos2.y})`);
      console.log(`     Gap: ${overlap.gap}px (need 40px minimum)\n`);
    });
  }
}

// Check zone boundaries
console.log('-'.repeat(80));
console.log('CHECKING ZONE BOUNDARIES');
console.log('-'.repeat(80) + '\n');

const violations = [];
allComponents.forEach(c => {
  const absPos = getAbsolutePosition(c, Object.values(updatedBoundaries));
  const rightEdge = absPos.x + COMPONENT_WIDTH;

  if (c.zone === 'public' && rightEdge > ZONE_BOUNDARY_X) {
    violations.push({ label: c.label, position: absPos, rightEdge });
  }
});

if (violations.length === 0) {
  console.log(`${GREEN}✅ All components respect zone boundaries${RESET}\n`);
} else {
  console.log(`${RED}❌ Found ${violations.length} zone violation(s):${RESET}\n`);
  violations.forEach((v, i) => {
    console.log(`  ${i + 1}. ${v.label} at (${v.position.x}, ${v.position.y})`);
    console.log(`     Right edge: ${v.rightEdge}px (exceeds ${ZONE_BOUNDARY_X}px)\n`);
  });
}

// Summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total components: ${allComponents.length}`);
console.log(`Overlaps: ${overlaps.length}`);
console.log(`Zone violations: ${violations.length}`);
console.log(`${overlaps.length === 0 && violations.length === 0 ? GREEN + '✅ ALL TESTS PASSED' + RESET : RED + '❌ ISSUES FOUND' + RESET}\n`);

process.exit(overlaps.length > 0 || violations.length > 0 ? 1 : 0);
