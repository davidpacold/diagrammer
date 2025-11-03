/**
 * Test All Dedicated-SaaS Components Individually
 * Run with: node test-dedicated-saas-components.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
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

function calculateBoundarySize(box, components) {
  const childComponents = components.filter(c =>
    c.visible && c.parentBoundary === box.id
  );

  if (childComponents.length === 0) {
    return { width: box.width, height: box.height };
  }

  const PADDING = box.padding || 40;
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

function validateComponent(component, allComponents, boundaryBoxes) {
  const errors = [];

  const absPos = getAbsolutePosition(component, boundaryBoxes);

  // Check zone boundary
  if (component.zone === 'public') {
    const rightEdge = absPos.x + COMPONENT_WIDTH;
    if (rightEdge > ZONE_BOUNDARY_X) {
      errors.push(`Exceeds public zone boundary (${rightEdge}px > ${ZONE_BOUNDARY_X}px)`);
    }
  }

  // Check parent containment
  if (component.parentBoundary) {
    const boundary = boundaryBoxes.find(b => b.id === component.parentBoundary);
    if (boundary) {
      const boundarySize = calculateBoundarySize(boundary, allComponents);
      const relPos = component.position;
      const cRight = relPos.x + COMPONENT_WIDTH;
      const cBottom = relPos.y + COMPONENT_HEIGHT;

      if (relPos.x < 0 || cRight > boundarySize.width || relPos.y < 0 || cBottom > boundarySize.height) {
        errors.push(`Outside parent boundary (0,0)-(${boundarySize.width},${boundarySize.height})`);
      }
    }
  }

  // Check overlaps
  const visibleComponents = allComponents.filter(c => c.visible && c.id !== component.id);
  visibleComponents.forEach(other => {
    const sameParent = component.parentBoundary === other.parentBoundary;
    const sameZone = component.zone === other.zone;

    if (sameParent || (sameZone && !component.parentBoundary && !other.parentBoundary)) {
      const otherAbsPos = getAbsolutePosition(other, boundaryBoxes);

      const rect1 = { x: absPos.x, y: absPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
      const rect2 = { x: otherAbsPos.x, y: otherAbsPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

      if (checkOverlap(rect1, rect2)) {
        errors.push(`Overlaps with: ${other.label}`);
      }
    }
  });

  return { errors };
}

console.log('\n' + '='.repeat(80));
console.log('🧪 COMPREHENSIVE COMPONENT TOGGLE TEST - DEDICATED-SAAS');
console.log('='.repeat(80) + '\n');

const preset = JSON.parse(JSON.stringify(presets['dedicated-saas']));
const boundaryBoxes = preset.boundaryBoxes || [];
const allComponents = preset.zones
  ? Object.values(preset.zones).flatMap(zone => zone.components)
  : preset.components || [];

let totalTests = 0;
let passedTests = 0;

allComponents.forEach((component, index) => {
  totalTests++;
  const testNum = `[${(index + 1).toString().padStart(2, '0')}/${allComponents.length}]`;

  component.visible = true;
  const result = validateComponent(component, allComponents, boundaryBoxes);

  if (result.errors.length === 0) {
    console.log(`${testNum} ${GREEN}✓${RESET} ${component.label}`);
    passedTests++;
  } else {
    console.log(`${testNum} ${RED}✗${RESET} ${component.label}`);
    result.errors.forEach(err => console.log(`     ${RED}→${RESET} ${err}`));
  }

  component.visible = allComponents[index].visible; // Restore
});

console.log('\n' + '='.repeat(80));
console.log(`${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);

if (passedTests === totalTests) {
  console.log(`${GREEN}🎉 All components can be safely toggled on!${RESET}\n`);
} else {
  console.log(`${RED}❌ ${totalTests - passedTests} component(s) have issues${RESET}\n`);
  process.exit(1);
}
