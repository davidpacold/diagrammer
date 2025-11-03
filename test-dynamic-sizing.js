/**
 * Test Dynamic Boundary Sizing
 * Tests that boundary boxes grow to accommodate visible children
 * Run with: node test-dynamic-sizing.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;

console.log('\n' + '='.repeat(80));
console.log('🧪 TESTING DYNAMIC BOUNDARY SIZING');
console.log('='.repeat(80) + '\n');

const preset = presets['shared-saas'];
const boundaryBoxes = preset.boundaryBoxes || [];
const components = preset.zones
  ? Object.values(preset.zones).flatMap(zone => zone.components)
  : preset.components || [];

boundaryBoxes.forEach(box => {
  console.log(`📦 Testing: ${box.label}`);
  console.log('-'.repeat(80));

  // Find all visible children
  const visibleChildren = components.filter(c =>
    c.visible && c.parentBoundary === box.id
  );

  console.log(`Children: ${visibleChildren.length} visible`);
  console.log(`Base dimensions: ${box.width} × ${box.height}`);
  console.log(`Position: (${box.x}, ${box.y})`);
  console.log(`Padding: ${box.padding || 30}px\n`);

  if (visibleChildren.length === 0) {
    console.log('⚠️  No visible children - boundary uses base dimensions\n');
    return;
  }

  // Calculate what the dynamic size should be
  const PADDING = box.padding || 30;
  const childPositions = visibleChildren.map(c => c.position);
  const minX = Math.min(...childPositions.map(p => p.x));
  const maxX = Math.max(...childPositions.map(p => p.x));
  const minY = Math.min(...childPositions.map(p => p.y));
  const maxY = Math.max(...childPositions.map(p => p.y));

  const rightEdge = maxX + COMPONENT_WIDTH;
  const bottomEdge = maxY + COMPONENT_HEIGHT;

  const calculatedWidth = Math.max(rightEdge + PADDING, box.width);
  const calculatedHeight = Math.max(bottomEdge + PADDING, box.height);

  console.log('Children positions (relative):');
  visibleChildren.forEach(c => {
    console.log(`  ${c.label.padEnd(25)} at (${c.position.x}, ${c.position.y})`);
  });

  console.log(`\nBounds:`);
  console.log(`  X: ${minX} to ${maxX} (${maxX - minX}px span)`);
  console.log(`  Y: ${minY} to ${maxY} (${maxY - minY}px span)`);

  console.log(`\nCalculated dimensions:`);
  console.log(`  Width: ${calculatedWidth}px ${calculatedWidth > box.width ? '(GROWS from ' + box.width + 'px)' : '(uses minimum)'}`);
  console.log(`  Height: ${calculatedHeight}px ${calculatedHeight > box.height ? '(GROWS from ' + box.height + 'px)' : '(uses minimum)'}`);

  // Check if it exceeds zone boundary
  const ZONE_BOUNDARY_X = 550;
  const absoluteRightEdge = box.x + calculatedWidth;

  if (box.zone === 'public' && absoluteRightEdge > ZONE_BOUNDARY_X) {
    console.log(`\n❌ ZONE VIOLATION: Boundary extends to ${absoluteRightEdge}px (exceeds ${ZONE_BOUNDARY_X}px)`);
  } else if (box.zone === 'public') {
    console.log(`\n✅ Zone boundary: ${absoluteRightEdge}px < ${ZONE_BOUNDARY_X}px`);
  }

  console.log('\n');
});

// Test with all regional platforms enabled
console.log('='.repeat(80));
console.log('🌍 SIMULATING ALL REGIONAL PLATFORMS ENABLED');
console.log('='.repeat(80) + '\n');

const allRegionalComponents = components.filter(c =>
  c.id.startsWith('airia-platform-') && c.parentBoundary === 'airia-managed'
);

console.log(`Regional platforms found: ${allRegionalComponents.length}`);
allRegionalComponents.forEach(c => {
  console.log(`  ${c.label.padEnd(30)} visible: ${c.visible ? '✅' : '❌'}  position: (${c.position.x}, ${c.position.y})`);
});

// Calculate what size boundary would need if all were visible
const simulatedVisible = components.filter(c =>
  c.parentBoundary === 'airia-managed' &&
  (c.visible || c.id.startsWith('airia-platform-'))
);

console.log(`\nSimulated visible children: ${simulatedVisible.length}`);

const box = boundaryBoxes.find(b => b.id === 'airia-managed');
const PADDING = box.padding || 30;
const childPositions = simulatedVisible.map(c => c.position);
const minY = Math.min(...childPositions.map(p => p.y));
const maxY = Math.max(...childPositions.map(p => p.y));

const bottomEdge = maxY + COMPONENT_HEIGHT;
const requiredHeight = bottomEdge + PADDING;

console.log(`\nRequired dimensions with all platforms:`);
console.log(`  Height: ${requiredHeight}px (current: ${box.height}px)`);
console.log(`  Growth: +${requiredHeight - box.height}px`);

const ZONE_BOUNDARY_X = 550;
const absoluteRightEdge = box.x + box.width;

if (absoluteRightEdge > ZONE_BOUNDARY_X) {
  console.log(`\n❌ ZONE VIOLATION: ${absoluteRightEdge}px > ${ZONE_BOUNDARY_X}px`);
} else {
  console.log(`\n✅ Would stay in zone: ${absoluteRightEdge}px < ${ZONE_BOUNDARY_X}px`);
}

console.log('\n');
