/**
 * Comprehensive Test for ALL Presets - All Components Visible
 * Tests each preset with all components enabled simultaneously
 * Run with: node test-all-presets-comprehensive.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const MIN_SPACING = 40;
const ZONE_BOUNDARY_X = 550;

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
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

function validatePreset(presetId, preset) {
  console.log(`\n${BLUE}${'='.repeat(80)}${RESET}`);
  console.log(`${BLUE}Testing: ${preset.name} (${presetId})${RESET}`);
  console.log(`${BLUE}${'='.repeat(80)}${RESET}\n`);

  const boundaryBoxes = preset.boundaryBoxes || [];
  const allComponents = preset.zones
    ? Object.values(preset.zones).flatMap(zone => zone.components)
    : preset.components || [];

  // Enable all components
  allComponents.forEach(c => { c.visible = true; });

  const errors = [];
  const warnings = [];

  // Check each component
  allComponents.forEach(component => {
    const absPos = getAbsolutePosition(component, boundaryBoxes);

    // Check zone boundary
    if (component.zone === 'public') {
      const rightEdge = absPos.x + COMPONENT_WIDTH;
      if (rightEdge > ZONE_BOUNDARY_X) {
        errors.push({
          component: component.label,
          issue: `Exceeds public zone boundary (${rightEdge}px > ${ZONE_BOUNDARY_X}px)`
        });
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
          errors.push({
            component: component.label,
            issue: `Outside parent boundary (0,0)-(${boundarySize.width},${boundarySize.height})`
          });
        }
      }
    }

    // Check overlaps
    allComponents.forEach(other => {
      if (other.id === component.id) return;

      const sameParent = component.parentBoundary === other.parentBoundary;
      const sameZone = component.zone === other.zone;

      if (sameParent || (sameZone && !component.parentBoundary && !other.parentBoundary)) {
        const otherAbsPos = getAbsolutePosition(other, boundaryBoxes);

        const rect1 = { x: absPos.x, y: absPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };
        const rect2 = { x: otherAbsPos.x, y: otherAbsPos.y, width: COMPONENT_WIDTH, height: COMPONENT_HEIGHT };

        if (checkOverlap(rect1, rect2)) {
          // Calculate actual gap
          const horizontalGap = Math.min(
            Math.abs(otherAbsPos.x - (absPos.x + COMPONENT_WIDTH)),
            Math.abs(absPos.x - (otherAbsPos.x + COMPONENT_WIDTH))
          );
          const verticalGap = Math.min(
            Math.abs(otherAbsPos.y - (absPos.y + COMPONENT_HEIGHT)),
            Math.abs(absPos.y - (otherAbsPos.y + COMPONENT_HEIGHT))
          );
          const gap = Math.min(horizontalGap, verticalGap);

          errors.push({
            component: component.label,
            issue: `Overlaps with ${other.label} (gap: ${Math.round(gap)}px, required: ${MIN_SPACING}px)`
          });
        }
      }
    });
  });

  // Check customer/company card spacing consistency
  const customerCards = allComponents.filter(c =>
    (c.label.includes('Customer') || c.label.includes('Company')) &&
    c.label.includes('Users')
  ).sort((a, b) => a.position.y - b.position.y);

  if (customerCards.length >= 2) {
    for (let i = 1; i < customerCards.length; i++) {
      const spacing = customerCards[i].position.y - customerCards[i - 1].position.y;
      if (i === 1) {
        // First spacing is the reference
        continue;
      }
      const firstSpacing = customerCards[1].position.y - customerCards[0].position.y;
      if (spacing !== firstSpacing) {
        warnings.push({
          issue: `Inconsistent customer/company card spacing: ${customerCards[i - 1].label} → ${customerCards[i].label} = ${spacing}px (expected ${firstSpacing}px)`
        });
      }
    }
  }

  // Report results
  console.log(`${GREEN}✓${RESET} Total components: ${allComponents.length}`);
  console.log(`${GREEN}✓${RESET} Visible components: ${allComponents.filter(c => c.visible).length}`);
  console.log(`${GREEN}✓${RESET} Boundary boxes: ${boundaryBoxes.length}`);

  if (warnings.length > 0) {
    console.log(`\n${YELLOW}⚠️  Warnings (${warnings.length}):${RESET}`);
    warnings.forEach(w => {
      console.log(`  ${YELLOW}→${RESET} ${w.issue}`);
    });
  }

  if (errors.length === 0) {
    console.log(`\n${GREEN}✅ ALL CHECKS PASSED - No overlaps or containment issues!${RESET}`);
    return true;
  } else {
    console.log(`\n${RED}❌ ERRORS FOUND (${errors.length}):${RESET}`);
    const groupedErrors = {};
    errors.forEach(e => {
      if (!groupedErrors[e.component]) {
        groupedErrors[e.component] = [];
      }
      groupedErrors[e.component].push(e.issue);
    });

    Object.entries(groupedErrors).forEach(([component, issues]) => {
      console.log(`  ${RED}✗${RESET} ${component}:`);
      issues.forEach(issue => {
        console.log(`     ${RED}→${RESET} ${issue}`);
      });
    });

    return false;
  }
}

// Test all presets
console.log('\n' + '='.repeat(80));
console.log('🧪 COMPREHENSIVE PRESET VALIDATION - ALL COMPONENTS VISIBLE');
console.log('='.repeat(80));

const results = {};
Object.entries(presets).forEach(([id, preset]) => {
  results[id] = validatePreset(id, preset);
});

// Final summary
console.log(`\n${BLUE}${'='.repeat(80)}${RESET}`);
console.log(`${BLUE}FINAL SUMMARY${RESET}`);
console.log(`${BLUE}${'='.repeat(80)}${RESET}\n`);

Object.entries(results).forEach(([id, passed]) => {
  const status = passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  console.log(`${status} ${presets[id].name} (${id})`);
});

const allPassed = Object.values(results).every(r => r);
const passedCount = Object.values(results).filter(r => r).length;
const totalCount = Object.keys(results).length;

console.log(`\n${allPassed ? GREEN : RED}${passedCount}/${totalCount} presets passed${RESET}\n`);

if (!allPassed) {
  process.exit(1);
}
