/**
 * Layout Validation Utility
 * Programmatically verifies layout correctness
 */

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

/**
 * Check if two rectangles overlap
 */
const checkOverlap = (rect1, rect2) => {
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
};

/**
 * Validate entire preset layout
 */
export const validatePresetLayout = (preset) => {
  const errors = [];
  const warnings = [];

  // Flatten components
  const components = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  const visibleComponents = components.filter(c => c.visible);
  const boundaryBoxes = preset.boundaryBoxes || [];

  // TEST 1: Check for overlaps
  console.log('\n🔍 TEST 1: Checking for overlaps...');
  for (let i = 0; i < visibleComponents.length; i++) {
    for (let j = i + 1; j < visibleComponents.length; j++) {
      const c1 = visibleComponents[i];
      const c2 = visibleComponents[j];

      // Only check if in same parent or both have no parent
      const sameParent = c1.parentBoundary === c2.parentBoundary;
      const sameZone = c1.zone === c2.zone;

      if ((sameParent || (sameZone && !c1.parentBoundary && !c2.parentBoundary))) {
        const rect1 = { x: c1.position.x, y: c1.position.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
        const rect2 = { x: c2.position.x, y: c2.position.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

        if (checkOverlap(rect1, rect2)) {
          errors.push({
            test: 'overlap',
            message: `❌ OVERLAP: "${c1.label}" at (${c1.position.x}, ${c1.position.y}) overlaps with "${c2.label}" at (${c2.position.x}, ${c2.position.y})`,
            component1: c1.id,
            component2: c2.id
          });
        }
      }
    }
  }

  // TEST 2: Check zone boundary violations for public zone components
  console.log('\n🔍 TEST 2: Checking zone boundary violations...');
  visibleComponents.forEach(c => {
    if (c.zone === 'public') {
      const rightEdge = c.position.x + COMPONENT_WIDTH;
      if (rightEdge > ZONE_BOUNDARY_X) {
        errors.push({
          test: 'zone-boundary',
          message: `❌ ZONE VIOLATION: "${c.label}" extends beyond public zone boundary (x + width = ${rightEdge} > ${ZONE_BOUNDARY_X})`,
          component: c.id,
          position: c.position
        });
      }
    }
  });

  // TEST 3: Check boundary box stays within zone
  console.log('\n🔍 TEST 3: Checking boundary boxes stay within zones...');
  boundaryBoxes.forEach(box => {
    if (box.zone === 'public') {
      const rightEdge = box.x + box.width;
      if (rightEdge > ZONE_BOUNDARY_X) {
        errors.push({
          test: 'boundary-zone',
          message: `❌ BOUNDARY VIOLATION: "${box.label}" boundary box extends beyond public zone (${box.x} + ${box.width} = ${rightEdge} > ${ZONE_BOUNDARY_X})`,
          boundary: box.id
        });
      }
    }
  });

  // TEST 4: Check children are inside parent boundaries
  console.log('\n🔍 TEST 4: Checking parent-child containment...');
  visibleComponents.forEach(c => {
    if (c.parentBoundary) {
      const boundary = boundaryBoxes.find(b => b.id === c.parentBoundary);
      if (!boundary) {
        warnings.push({
          test: 'parent-exists',
          message: `⚠️  WARNING: "${c.label}" has parentBoundary="${c.parentBoundary}" but boundary not found`,
          component: c.id
        });
        return;
      }

      // Check if component is inside boundary
      const cLeft = c.position.x;
      const cRight = c.position.x + COMPONENT_WIDTH;
      const cTop = c.position.y;
      const cBottom = c.position.y + COMPONENT_HEIGHT;

      const bLeft = boundary.x;
      const bRight = boundary.x + boundary.width;
      const bTop = boundary.y;
      const bBottom = boundary.y + boundary.height;

      const isOutside = cLeft < bLeft || cRight > bRight || cTop < bTop || cBottom > bBottom;

      if (isOutside) {
        errors.push({
          test: 'containment',
          message: `❌ CONTAINMENT VIOLATION: "${c.label}" is outside its parent boundary "${boundary.label}"\n   Component: (${cLeft}, ${cTop}) to (${cRight}, ${cBottom})\n   Boundary: (${bLeft}, ${bTop}) to (${bRight}, ${bBottom})`,
          component: c.id,
          boundary: boundary.id
        });
      }
    }
  });

  // TEST 5: Check containment rules
  console.log('\n🔍 TEST 5: Checking containment rules...');
  boundaryBoxes.forEach(boundary => {
    if (!boundary.containmentRules) return;

    const { mustContain, mustExclude } = boundary.containmentRules;

    mustContain.forEach(componentId => {
      const component = components.find(c => c.id === componentId);
      if (!component) {
        warnings.push({
          test: 'containment-rules',
          message: `⚠️  WARNING: Boundary "${boundary.label}" should contain "${componentId}" but component doesn't exist`,
          boundary: boundary.id
        });
        return;
      }

      if (component.parentBoundary !== boundary.id) {
        errors.push({
          test: 'containment-rules',
          message: `❌ RULE VIOLATION: "${component.label}" should have parentBoundary="${boundary.id}" but has "${component.parentBoundary || 'none'}"`,
          component: componentId,
          boundary: boundary.id
        });
      }
    });

    mustExclude.forEach(componentId => {
      const component = components.find(c => c.id === componentId);
      if (component && component.parentBoundary === boundary.id) {
        errors.push({
          test: 'containment-rules',
          message: `❌ RULE VIOLATION: "${component.label}" should NOT be inside "${boundary.label}" but has parentBoundary="${boundary.id}"`,
          component: componentId,
          boundary: boundary.id
        });
      }
    });
  });

  // Summary
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    stats: {
      totalComponents: components.length,
      visibleComponents: visibleComponents.length,
      totalErrors: errors.length,
      totalWarnings: warnings.length
    }
  };
};

/**
 * Print validation results to console
 */
export const printValidationResults = (presetName, result) => {
  console.log('\n' + '='.repeat(60));
  console.log(`📊 LAYOUT VALIDATION REPORT: ${presetName}`);
  console.log('='.repeat(60));

  console.log(`\n📈 Statistics:`);
  console.log(`   Total components: ${result.stats.totalComponents}`);
  console.log(`   Visible components: ${result.stats.visibleComponents}`);
  console.log(`   Errors: ${result.stats.totalErrors}`);
  console.log(`   Warnings: ${result.stats.totalWarnings}`);

  if (result.errors.length > 0) {
    console.log(`\n❌ ERRORS (${result.errors.length}):`);
    result.errors.forEach((error, i) => {
      console.log(`\n${i + 1}. ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${result.warnings.length}):`);
    result.warnings.forEach((warning, i) => {
      console.log(`\n${i + 1}. ${warning.message}`);
    });
  }

  if (result.isValid) {
    console.log(`\n✅ VALIDATION PASSED! Layout is correct.`);
  } else {
    console.log(`\n❌ VALIDATION FAILED! Found ${result.stats.totalErrors} error(s).`);
  }

  console.log('\n' + '='.repeat(60) + '\n');
};
