/**
 * Comprehensive Layout Test Suite
 * Run with: node test-layout.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

// Color codes for output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

/**
 * Convert relative position to absolute based on parent boundary
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
 * Check if two rectangles overlap
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
 * TEST 1: No Overlaps
 */
function testNoOverlaps(presetName, preset) {
  const errors = [];

  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const visibleComponents = components.filter(c => c.visible);
  const boundaryBoxes = preset.boundaryBoxes || [];

  for (let i = 0; i < visibleComponents.length; i++) {
    for (let j = i + 1; j < visibleComponents.length; j++) {
      const c1 = visibleComponents[i];
      const c2 = visibleComponents[j];

      const sameParent = c1.parentBoundary === c2.parentBoundary;
      const sameZone = c1.zone === c2.zone;

      if (sameParent || (sameZone && !c1.parentBoundary && !c2.parentBoundary)) {
        const pos1 = getAbsolutePosition(c1, boundaryBoxes);
        const pos2 = getAbsolutePosition(c2, boundaryBoxes);

        const rect1 = { x: pos1.x, y: pos1.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
        const rect2 = { x: pos2.x, y: pos2.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

        if (checkOverlap(rect1, rect2)) {
          errors.push(`${c1.label} at (${pos1.x}, ${pos1.y}) overlaps ${c2.label} at (${pos2.x}, ${pos2.y})`);
        }
      }
    }
  }

  return { passed: errors.length === 0, errors };
}

/**
 * TEST 2: Zone Boundaries
 */
function testZoneBoundaries(presetName, preset) {
  const errors = [];

  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const visibleComponents = components.filter(c => c.visible);
  const boundaryBoxes = preset.boundaryBoxes || [];

  visibleComponents.forEach(c => {
    if (c.zone === 'public') {
      const absPos = getAbsolutePosition(c, boundaryBoxes);
      const rightEdge = absPos.x + COMPONENT_WIDTH;

      if (rightEdge > ZONE_BOUNDARY_X) {
        errors.push(`${c.label} extends beyond zone boundary (${rightEdge} > ${ZONE_BOUNDARY_X})`);
      }
    }
  });

  // Check boundary boxes
  boundaryBoxes.forEach(box => {
    if (box.zone === 'public') {
      const rightEdge = box.x + box.width;
      if (rightEdge > ZONE_BOUNDARY_X) {
        errors.push(`Boundary "${box.label}" extends beyond zone (${rightEdge} > ${ZONE_BOUNDARY_X})`);
      }
    }
  });

  return { passed: errors.length === 0, errors };
}

/**
 * TEST 3: Parent Containment
 */
function testParentContainment(presetName, preset) {
  const errors = [];

  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const visibleComponents = components.filter(c => c.visible);
  const boundaryBoxes = preset.boundaryBoxes || [];

  visibleComponents.forEach(c => {
    if (c.parentBoundary) {
      const boundary = boundaryBoxes.find(b => b.id === c.parentBoundary);

      if (!boundary) {
        errors.push(`${c.label} has parentBoundary="${c.parentBoundary}" but boundary not found`);
        return;
      }

      // For relative positioning, check if component is within parent bounds
      const relPos = c.position; // This is relative to parent

      const cRight = relPos.x + COMPONENT_WIDTH;
      const cBottom = relPos.y + COMPONENT_HEIGHT;

      if (relPos.x < 0 || cRight > boundary.width || relPos.y < 0 || cBottom > boundary.height) {
        errors.push(`${c.label} at relative (${relPos.x}, ${relPos.y}) is outside parent boundary (0,0) to (${boundary.width}, ${boundary.height})`);
      }
    }
  });

  return { passed: errors.length === 0, errors };
}

/**
 * TEST 4: Containment Rules
 */
function testContainmentRules(presetName, preset) {
  const errors = [];

  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const boundaryBoxes = preset.boundaryBoxes || [];

  boundaryBoxes.forEach(boundary => {
    if (!boundary.containmentRules) return;

    const { mustContain, mustExclude } = boundary.containmentRules;

    mustContain.forEach(componentId => {
      const component = components.find(c => c.id === componentId);

      if (!component) {
        errors.push(`Boundary "${boundary.label}" should contain "${componentId}" but component doesn't exist`);
        return;
      }

      if (component.parentBoundary !== boundary.id) {
        errors.push(`${component.label} should have parentBoundary="${boundary.id}" but has "${component.parentBoundary || 'none'}"`);
      }
    });

    mustExclude.forEach(componentId => {
      const component = components.find(c => c.id === componentId);

      if (component && component.parentBoundary === boundary.id) {
        errors.push(`${component.label} should NOT be in "${boundary.label}" but has parentBoundary="${boundary.id}"`);
      }
    });
  });

  return { passed: errors.length === 0, errors };
}

/**
 * TEST 5: Minimum Spacing
 */
function testMinimumSpacing(presetName, preset) {
  const errors = [];
  const warnings = [];

  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const visibleComponents = components.filter(c => c.visible);
  const boundaryBoxes = preset.boundaryBoxes || [];

  for (let i = 0; i < visibleComponents.length; i++) {
    for (let j = i + 1; j < visibleComponents.length; j++) {
      const c1 = visibleComponents[i];
      const c2 = visibleComponents[j];

      const sameParent = c1.parentBoundary === c2.parentBoundary;
      if (!sameParent) continue;

      const pos1 = getAbsolutePosition(c1, boundaryBoxes);
      const pos2 = getAbsolutePosition(c2, boundaryBoxes);

      const horizontalDist = Math.min(
        Math.abs(pos2.x - (pos1.x + COMPONENT_WIDTH)),
        Math.abs(pos1.x - (pos2.x + COMPONENT_WIDTH))
      );

      const verticalDist = Math.min(
        Math.abs(pos2.y - (pos1.y + COMPONENT_HEIGHT)),
        Math.abs(pos1.y - (pos2.y + COMPONENT_HEIGHT))
      );

      const minDist = Math.min(horizontalDist, verticalDist);

      if (minDist < MIN_SPACING && minDist >= 0) {
        warnings.push(`${c1.label} and ${c2.label} have ${minDist}px spacing (< ${MIN_SPACING}px recommended)`);
      }
    }
  }

  return { passed: warnings.length === 0, errors: warnings };
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 COMPREHENSIVE LAYOUT TEST SUITE');
  console.log('='.repeat(70) + '\n');

  const allResults = {};

  Object.entries(presets).forEach(([presetName, preset]) => {
    console.log(`\n📦 Testing: ${presetName}`);
    console.log('-'.repeat(70));

    const tests = [
      { name: 'No Overlaps', fn: testNoOverlaps },
      { name: 'Zone Boundaries', fn: testZoneBoundaries },
      { name: 'Parent Containment', fn: testParentContainment },
      { name: 'Containment Rules', fn: testContainmentRules },
      { name: 'Minimum Spacing', fn: testMinimumSpacing }
    ];

    const results = {};
    let totalPassed = 0;

    tests.forEach(test => {
      const result = test.fn(presetName, preset);
      results[test.name] = result;

      if (result.passed) {
        console.log(`${GREEN}✓${RESET} ${test.name}`);
        totalPassed++;
      } else {
        console.log(`${RED}✗${RESET} ${test.name} (${result.errors.length} errors)`);
        result.errors.forEach(err => {
          console.log(`  ${RED}→${RESET} ${err}`);
        });
      }
    });

    allResults[presetName] = {
      passed: totalPassed === tests.length,
      totalTests: tests.length,
      passedTests: totalPassed,
      results
    };

    console.log(`\nResult: ${totalPassed}/${tests.length} tests passed`);
  });

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));

  Object.entries(allResults).forEach(([presetName, summary]) => {
    const status = summary.passed ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    console.log(`${presetName}: ${status} (${summary.passedTests}/${summary.totalTests})`);
  });

  console.log('\n');
}

runAllTests();
