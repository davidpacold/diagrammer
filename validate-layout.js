/**
 * Layout Validation Script
 * Run with: node validate-layout.js
 */

import { presets } from './src/data/presets.js';
import { validatePresetLayout, printValidationResults } from './src/utils/layoutValidator.js';

console.log('🚀 Starting layout validation...\n');

// Validate each preset
Object.entries(presets).forEach(([presetId, preset]) => {
  const result = validatePresetLayout(preset);
  printValidationResults(presetId, result);
});

console.log('✅ Validation complete!');
