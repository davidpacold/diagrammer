/**
 * Comprehensive Component Toggle Test
 * Tests every component individually by toggling it on and validating:
 * - No overlaps with other visible components
 * - Stays within zone boundaries
 * - Parent containment (if applicable)
 * - Boundary box sizing adjusts correctly
 *
 * Run with: node test-all-components.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

// Color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

/**
 * Calculate boundary size based on visible children
 */
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

/**
 * Get absolute position of component
 */
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

/**
 * Check if two rectangles overlap (with spacing buffer)
 */
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

/**
 * Validate component positioning
 */
function validateComponent(component, allComponents, boundaryBoxes) {
  const errors = [];
  const warnings = [];
  const info = [];

  const absPos = getAbsolutePosition(component, boundaryBoxes);

  info.push(`Position: ${component.parentBoundary ? 'relative ' : 'absolute '}(${component.position.x}, ${component.position.y})`);
  if (component.parentBoundary) {
    info.push(`Absolute: (${absPos.x}, ${absPos.y})`);
    info.push(`Parent: ${component.parentBoundary}`);
  }
  info.push(`Zone: ${component.zone}`);

  // Check 1: Zone boundary violation
  if (component.zone === 'public') {
    const rightEdge = absPos.x + COMPONENT_WIDTH;
    if (rightEdge > ZONE_BOUNDARY_X) {
      errors.push(`Exceeds public zone boundary (${rightEdge}px > ${ZONE_BOUNDARY_X}px)`);
    }
  } else if (component.zone === 'private') {
    if (absPos.x < ZONE_BOUNDARY_X) {
      errors.push(`Not in private zone (${absPos.x}px < ${ZONE_BOUNDARY_X}px)`);
    }
  }

  // Check 2: Parent containment
  if (component.parentBoundary) {
    const boundary = boundaryBoxes.find(b => b.id === component.parentBoundary);
    if (!boundary) {
      errors.push(`Parent boundary "${component.parentBoundary}" not found`);
    } else {
      const boundarySize = calculateBoundarySize(boundary, allComponents);
      const relPos = component.position;
      const cRight = relPos.x + COMPONENT_WIDTH;
      const cBottom = relPos.y + COMPONENT_HEIGHT;

      if (relPos.x < 0 || cRight > boundarySize.width || relPos.y < 0 || cBottom > boundarySize.height) {
        errors.push(`Outside parent boundary (0,0)-(${boundarySize.width},${boundarySize.height})`);
      } else {
        info.push(`Fits in parent: ${cRight} <= ${boundarySize.width} (width), ${cBottom} <= ${boundarySize.height} (height)`);
      }
    }
  }

  // Check 3: Overlaps with other visible components
  const visibleComponents = allComponents.filter(c => c.visible && c.id !== component.id);
  const overlaps = [];

  visibleComponents.forEach(other => {
    // Only check overlaps within same context
    const sameParent = component.parentBoundary === other.parentBoundary;
    const sameZone = component.zone === other.zone;

    if (sameParent || (sameZone && !component.parentBoundary && !other.parentBoundary)) {
      const otherAbsPos = getAbsolutePosition(other, boundaryBoxes);

      const rect1 = { x: absPos.x, y: absPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
      const rect2 = { x: otherAbsPos.x, y: otherAbsPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

      if (checkOverlap(rect1, rect2)) {
        overlaps.push(other.label);
      }
    }
  });

  if (overlaps.length > 0) {
    errors.push(`Overlaps with: ${overlaps.join(', ')}`);
  }

  // Check 4: Boundary box size adjustment (if this component has parent)
  if (component.parentBoundary) {
    const boundary = boundaryBoxes.find(b => b.id === component.parentBoundary);
    if (boundary) {
      const newSize = calculateBoundarySize(boundary, allComponents);
      const oldSize = { width: boundary.width, height: boundary.height };

      if (newSize.width !== oldSize.width || newSize.height !== oldSize.height) {
        info.push(`Boundary grows: ${oldSize.width}×${oldSize.height} → ${newSize.width}×${newSize.height}`);

        // Check if boundary still fits in zone
        if (boundary.zone === 'public') {
          const boundaryRightEdge = boundary.x + newSize.width;
          if (boundaryRightEdge > ZONE_BOUNDARY_X) {
            errors.push(`Causes boundary to exceed zone (${boundaryRightEdge}px > ${ZONE_BOUNDARY_X}px)`);
          }
        }
      }
    }
  }

  return { errors, warnings, info };
}

/**
 * Main test runner
 */
function runComponentTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 COMPREHENSIVE COMPONENT TOGGLE TEST - SHARED-SAAS');
  console.log('='.repeat(80) + '\n');

  const preset = JSON.parse(JSON.stringify(presets['shared-saas'])); // Deep clone
  const boundaryBoxes = preset.boundaryBoxes || [];
  const allComponents = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  // Get initial visible components
  const initialVisible = allComponents.filter(c => c.visible).map(c => c.label);
  console.log(`${BLUE}Initial configuration:${RESET}`);
  console.log(`  ${initialVisible.length} components visible: ${initialVisible.join(', ')}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failedComponents = [];

  // Test each component
  allComponents.forEach((component, index) => {
    totalTests++;
    const testNum = `[${(index + 1).toString().padStart(2, '0')}/${allComponents.length}]`;

    console.log(`${testNum} Testing: ${BLUE}${component.label}${RESET}`);
    console.log('-'.repeat(80));

    // Save original visibility
    const wasVisible = component.visible;

    // Turn component ON for testing
    component.visible = true;

    // Validate
    const result = validateComponent(component, allComponents, boundaryBoxes);

    // Display results
    result.info.forEach(msg => {
      console.log(`  ${BLUE}ℹ${RESET}  ${msg}`);
    });

    if (result.errors.length === 0) {
      console.log(`  ${GREEN}✓${RESET} PASS - No issues found`);
      passedTests++;
    } else {
      console.log(`  ${RED}✗${RESET} FAIL - ${result.errors.length} error(s):`);
      result.errors.forEach(err => {
        console.log(`    ${RED}→${RESET} ${err}`);
      });
      failedTests++;
      failedComponents.push({ label: component.label, errors: result.errors });
    }

    result.warnings.forEach(msg => {
      console.log(`  ${YELLOW}⚠${RESET}  ${msg}`);
    });

    // Restore original visibility
    component.visible = wasVisible;

    console.log('');
  });

  // Summary
  console.log('='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total components tested: ${totalTests}`);
  console.log(`${GREEN}Passed: ${passedTests}${RESET}`);
  console.log(`${RED}Failed: ${failedTests}${RESET}`);
  console.log(`Success rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);

  if (failedComponents.length > 0) {
    console.log(`${RED}Failed components:${RESET}`);
    failedComponents.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.label}`);
      comp.errors.forEach(err => {
        console.log(`     - ${err}`);
      });
    });
    console.log('');
  } else {
    console.log(`${GREEN}🎉 All components can be safely toggled on without issues!${RESET}\n`);
  }

  return { totalTests, passedTests, failedTests, failedComponents };
}

// Run the tests
const results = runComponentTests();
process.exit(results.failedTests > 0 ? 1 : 0);
