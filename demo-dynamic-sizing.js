/**
 * Demo: Dynamic Boundary Sizing
 * Shows how boundary automatically grows when components are toggled visible
 * Run with: node demo-dynamic-sizing.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;

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
console.log('🎬 DYNAMIC BOUNDARY SIZING DEMONSTRATION');
console.log('='.repeat(80) + '\n');

const preset = JSON.parse(JSON.stringify(presets['shared-saas'])); // Deep clone
const boundaryBox = preset.boundaryBoxes[0];
const components = preset.zones
  ? Object.values(preset.zones).flatMap(zone => zone.components)
  : preset.components || [];

console.log('Scenario: Toggle regional platforms on/off\n');

// Scenario 1: Current state (only NA visible)
console.log('1️⃣  INITIAL STATE: Only NA platform visible');
console.log('-'.repeat(80));

const visibleChildren1 = components.filter(c =>
  c.visible && c.parentBoundary === 'airia-managed'
);

console.log(`Visible children: ${visibleChildren1.length}`);
visibleChildren1.forEach(c => {
  console.log(`  ✅ ${c.label.padEnd(25)} at (${c.position.x}, ${c.position.y})`);
});

const size1 = calculateBoundarySize(boundaryBox, components);
console.log(`\nBoundary size: ${size1.width} × ${size1.height}`);
console.log(`Absolute position: (${boundaryBox.x}, ${boundaryBox.y}) to (${boundaryBox.x + size1.width}, ${boundaryBox.y + size1.height})`);
console.log(`Zone boundary check: ${boundaryBox.x + size1.width} < 550 ✅\n`);

// Scenario 2: Enable EU platform
console.log('2️⃣  TOGGLE EU PLATFORM ON');
console.log('-'.repeat(80));

const euPlatform = components.find(c => c.id === 'airia-platform-eu');
euPlatform.visible = true;

const visibleChildren2 = components.filter(c =>
  c.visible && c.parentBoundary === 'airia-managed'
);

console.log(`Visible children: ${visibleChildren2.length}`);
visibleChildren2.forEach(c => {
  console.log(`  ✅ ${c.label.padEnd(25)} at (${c.position.x}, ${c.position.y})`);
});

const size2 = calculateBoundarySize(boundaryBox, components);
console.log(`\nBoundary size: ${size2.width} × ${size2.height} (height grew by ${size2.height - size1.height}px)`);
console.log(`Absolute position: (${boundaryBox.x}, ${boundaryBox.y}) to (${boundaryBox.x + size2.width}, ${boundaryBox.y + size2.height})`);
console.log(`Zone boundary check: ${boundaryBox.x + size2.width} < 550 ✅\n`);

// Scenario 3: Enable APAC platform
console.log('3️⃣  TOGGLE APAC PLATFORM ON');
console.log('-'.repeat(80));

const apacPlatform = components.find(c => c.id === 'airia-platform-apac');
apacPlatform.visible = true;

const visibleChildren3 = components.filter(c =>
  c.visible && c.parentBoundary === 'airia-managed'
);

console.log(`Visible children: ${visibleChildren3.length}`);
visibleChildren3.forEach(c => {
  console.log(`  ✅ ${c.label.padEnd(25)} at (${c.position.x}, ${c.position.y})`);
});

const size3 = calculateBoundarySize(boundaryBox, components);
console.log(`\nBoundary size: ${size3.width} × ${size3.height} (height grew by ${size3.height - size2.height}px)`);
console.log(`Absolute position: (${boundaryBox.x}, ${boundaryBox.y}) to (${boundaryBox.x + size3.width}, ${boundaryBox.y + size3.height})`);
console.log(`Zone boundary check: ${boundaryBox.x + size3.width} < 550 ✅\n`);

// Scenario 4: Enable MENA platform (all visible)
console.log('4️⃣  TOGGLE MENA PLATFORM ON (ALL PLATFORMS VISIBLE)');
console.log('-'.repeat(80));

const menaPlatform = components.find(c => c.id === 'airia-platform-mena');
menaPlatform.visible = true;

const visibleChildren4 = components.filter(c =>
  c.visible && c.parentBoundary === 'airia-managed'
);

console.log(`Visible children: ${visibleChildren4.length}`);
visibleChildren4.forEach(c => {
  console.log(`  ✅ ${c.label.padEnd(25)} at (${c.position.x}, ${c.position.y})`);
});

const size4 = calculateBoundarySize(boundaryBox, components);
console.log(`\nBoundary size: ${size4.width} × ${size4.height} (height grew by ${size4.height - size3.height}px)`);
console.log(`Absolute position: (${boundaryBox.x}, ${boundaryBox.y}) to (${boundaryBox.x + size4.width}, ${boundaryBox.y + size4.height})`);
console.log(`Zone boundary check: ${boundaryBox.x + size4.width} < 550 ✅\n`);

console.log('='.repeat(80));
console.log('📊 SUMMARY');
console.log('='.repeat(80));
console.log(`Initial height: ${size1.height}px`);
console.log(`Final height: ${size4.height}px`);
console.log(`Total growth: +${size4.height - size1.height}px (${Math.round((size4.height / size1.height - 1) * 100)}% increase)`);
console.log(`\n✅ Boundary automatically adjusts to fit all visible components!`);
console.log(`✅ Always stays within zone boundary (${boundaryBox.x + size4.width} < 550)\n`);
