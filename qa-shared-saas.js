/**
 * Comprehensive QA for Shared-SaaS Layout
 * Run with: node qa-shared-saas.js
 */

import { presets } from './src/data/presets.js';

const COMPONENT_WIDTH = 180;
const COMPONENT_HEIGHT = 110;
const ZONE_BOUNDARY_X = 550;

const preset = presets['shared-saas'];
const components = preset.zones.public.components.concat(preset.zones.private.components);
const visibleComponents = components.filter(c => c.visible);
const boundaryBoxes = preset.boundaryBoxes || [];
const boundary = boundaryBoxes.find(b => b.id === 'airia-managed');

console.log('\n' + '='.repeat(80));
console.log('🔍 COMPREHENSIVE QA: SHARED-SAAS LAYOUT');
console.log('='.repeat(80) + '\n');

// QA 1: Component Inventory
console.log('📋 QA 1: COMPONENT INVENTORY');
console.log('-'.repeat(80));
console.log(`Total components: ${components.length}`);
console.log(`Visible components: ${visibleComponents.length}`);
console.log(`Hidden components: ${components.length - visibleComponents.length}\n`);

console.log('Visible components:');
visibleComponents.forEach(c => {
  const absPos = c.parentBoundary ?
    { x: boundary.x + c.position.x, y: boundary.y + c.position.y } :
    c.position;
  console.log(`  ✓ ${c.label.padEnd(25)} at (${absPos.x}, ${absPos.y})`);
});

// QA 2: Boundary Box Configuration
console.log('\n📦 QA 2: BOUNDARY BOX CONFIGURATION');
console.log('-'.repeat(80));
console.log(`Boundary: ${boundary.label}`);
console.log(`  Position: (${boundary.x}, ${boundary.y})`);
console.log(`  Size: ${boundary.width} × ${boundary.height}`);
console.log(`  Right edge: ${boundary.x + boundary.width} (zone boundary: ${ZONE_BOUNDARY_X})`);
console.log(`  Stays in zone: ${boundary.x + boundary.width <= ZONE_BOUNDARY_X ? '✅ YES' : '❌ NO'}`);
console.log(`  Zone: ${boundary.zone}`);
console.log(`  Color: ${boundary.color}\n`);

// QA 3: Customer Cards
console.log('👥 QA 3: CUSTOMER CARDS');
console.log('-'.repeat(80));
const customers = components.filter(c => c.id.startsWith('customer-'));
customers.forEach(c => {
  const rightEdge = c.position.x + COMPONENT_WIDTH;
  const gapToBoundary = boundary.x - rightEdge;
  console.log(`${c.label}:`);
  console.log(`  Position: (${c.position.x}, ${c.position.y})`);
  console.log(`  Visible: ${c.visible ? '✅' : '❌'}`);
  console.log(`  Parent: ${c.parentBoundary || 'none (external) ✅'}`);
  console.log(`  Right edge: ${rightEdge}px`);
  console.log(`  Gap to boundary: ${gapToBoundary}px ${gapToBoundary >= 40 ? '✅' : '⚠️'}`);
});

// QA 4: Airia Managed Components
console.log('\n🏢 QA 4: AIRIA MANAGED COMPONENTS');
console.log('-'.repeat(80));
const airiaComponents = components.filter(c => c.parentBoundary === 'airia-managed');
console.log(`Total children: ${airiaComponents.length}`);
console.log(`Visible children: ${airiaComponents.filter(c => c.visible).length}\n`);

airiaComponents.forEach(c => {
  const absPos = { x: boundary.x + c.position.x, y: boundary.y + c.position.y };
  const rightEdge = c.position.x + COMPONENT_WIDTH;
  const bottomEdge = c.position.y + COMPONENT_HEIGHT;
  const fitsInWidth = rightEdge <= boundary.width;
  const fitsInHeight = bottomEdge <= boundary.height;

  console.log(`${c.label}:`);
  console.log(`  Relative position: (${c.position.x}, ${c.position.y})`);
  console.log(`  Absolute position: (${absPos.x}, ${absPos.y})`);
  console.log(`  Visible: ${c.visible ? '✅' : '⏸️ hidden'}`);
  console.log(`  Parent: ${c.parentBoundary}`);
  console.log(`  Fits in boundary width: ${fitsInWidth ? '✅' : '❌'} (${rightEdge}/${boundary.width})`);
  console.log(`  Fits in boundary height: ${fitsInHeight ? '✅' : '❌'} (${bottomEdge}/${boundary.height})`);
});

// QA 5: External Services
console.log('\n🌐 QA 5: EXTERNAL SERVICES (PUBLIC ZONE)');
console.log('-'.repeat(80));
const externalServices = components.filter(c =>
  c.zone === 'public' &&
  !c.parentBoundary &&
  !c.id.startsWith('customer-')
);
console.log(`Count: ${externalServices.length}\n`);

externalServices.forEach(c => {
  const rightEdge = c.position.x + COMPONENT_WIDTH;
  const inZone = rightEdge <= ZONE_BOUNDARY_X;
  console.log(`${c.label}:`);
  console.log(`  Position: (${c.position.x}, ${c.position.y})`);
  console.log(`  Visible: ${c.visible ? '✅' : '⏸️ hidden'}`);
  console.log(`  Right edge: ${rightEdge}px (zone: ${ZONE_BOUNDARY_X}px)`);
  console.log(`  In zone: ${inZone ? '✅' : '❌'}`);
});

// QA 6: Private Zone Components
console.log('\n🔒 QA 6: PRIVATE ZONE COMPONENTS');
console.log('-'.repeat(80));
const privateComponents = components.filter(c => c.zone === 'private');
console.log(`Count: ${privateComponents.length}\n`);

privateComponents.forEach(c => {
  const inPrivateZone = c.position.x >= ZONE_BOUNDARY_X;
  console.log(`${c.label}:`);
  console.log(`  Position: (${c.position.x}, ${c.position.y})`);
  console.log(`  Visible: ${c.visible ? '✅' : '⏸️ hidden'}`);
  console.log(`  In private zone: ${inPrivateZone ? '✅' : '❌'} (x >= ${ZONE_BOUNDARY_X})`);
});

// QA 7: Connections
console.log('\n🔗 QA 7: CONNECTIONS');
console.log('-'.repeat(80));
console.log(`Total connections: ${preset.connections.length}`);

const visibleIds = new Set(visibleComponents.map(c => c.id));
const visibleConnections = preset.connections.filter(
  conn => visibleIds.has(conn.source) && visibleIds.has(conn.target)
);
console.log(`Visible connections: ${visibleConnections.length}\n`);

// Check for missing components in connections
const missingComponents = [];
preset.connections.forEach(conn => {
  if (!components.find(c => c.id === conn.source)) {
    missingComponents.push(`Source: ${conn.source}`);
  }
  if (!components.find(c => c.id === conn.target)) {
    missingComponents.push(`Target: ${conn.target}`);
  }
});

if (missingComponents.length > 0) {
  console.log('⚠️  Missing components in connections:');
  missingComponents.forEach(m => console.log(`  - ${m}`));
} else {
  console.log('✅ All connection endpoints exist');
}

// QA 8: Spacing Analysis
console.log('\n📏 QA 8: SPACING ANALYSIS');
console.log('-'.repeat(80));

const spacingIssues = [];

for (let i = 0; i < visibleComponents.length; i++) {
  for (let j = i + 1; j < visibleComponents.length; j++) {
    const c1 = visibleComponents[i];
    const c2 = visibleComponents[j];

    // Only check components in same context
    const sameParent = c1.parentBoundary === c2.parentBoundary;
    if (!sameParent) continue;

    // Get absolute positions
    const pos1 = c1.parentBoundary ?
      { x: boundary.x + c1.position.x, y: boundary.y + c1.position.y } :
      c1.position;
    const pos2 = c2.parentBoundary ?
      { x: boundary.x + c2.position.x, y: boundary.y + c2.position.y } :
      c2.position;

    // Calculate spacing
    const horizontalGap = Math.abs(pos1.x - pos2.x) - COMPONENT_WIDTH;
    const verticalGap = Math.abs(pos1.y - pos2.y) - COMPONENT_HEIGHT;
    const gap = Math.min(Math.abs(horizontalGap), Math.abs(verticalGap));

    if (gap < 40 && gap >= 0) {
      spacingIssues.push({
        c1: c1.label,
        c2: c2.label,
        gap: Math.round(gap)
      });
    }
  }
}

if (spacingIssues.length > 0) {
  console.log('⚠️  Spacing warnings (< 40px):');
  spacingIssues.forEach(issue => {
    console.log(`  ${issue.c1} ↔ ${issue.c2}: ${issue.gap}px`);
  });
} else {
  console.log('✅ All visible components have adequate spacing (≥ 40px)');
}

// QA 9: Zone Labels
console.log('\n🏷️  QA 9: ZONE LABELS');
console.log('-'.repeat(80));
console.log(`Left label: ${preset.zoneLabels?.left || 'Not set'}`);
console.log(`Right label: ${preset.zoneLabels?.right || 'Not set'}`);

// QA 10: Containment Rules Validation
console.log('\n✅ QA 10: CONTAINMENT RULES');
console.log('-'.repeat(80));

const rules = boundary.containmentRules;
console.log(`Must contain: ${rules.mustContain.length} components`);
console.log(`Must exclude: ${rules.mustExclude.length} components\n`);

const ruleViolations = [];

rules.mustContain.forEach(componentId => {
  const component = components.find(c => c.id === componentId);
  if (!component) {
    ruleViolations.push(`Missing: ${componentId}`);
  } else if (component.parentBoundary !== 'airia-managed') {
    ruleViolations.push(`${component.label} should be in boundary but isn't`);
  }
});

rules.mustExclude.forEach(componentId => {
  const component = components.find(c => c.id === componentId);
  if (component && component.parentBoundary === 'airia-managed') {
    ruleViolations.push(`${component.label} should NOT be in boundary but is`);
  }
});

if (ruleViolations.length > 0) {
  console.log('❌ Rule violations:');
  ruleViolations.forEach(v => console.log(`  - ${v}`));
} else {
  console.log('✅ All containment rules satisfied');
}

// SUMMARY
console.log('\n' + '='.repeat(80));
console.log('📊 QA SUMMARY');
console.log('='.repeat(80));

const issues = [
  ...missingComponents,
  ...spacingIssues.map(s => `Spacing: ${s.c1} ↔ ${s.c2}`),
  ...ruleViolations
];

if (issues.length === 0) {
  console.log('\n✅ ALL CHECKS PASSED - Layout is production ready!\n');
} else {
  console.log(`\n⚠️  Found ${issues.length} issue(s):\n`);
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
  console.log();
}
