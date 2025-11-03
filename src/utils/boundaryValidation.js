/**
 * Boundary validation utilities
 * Validates component placement against boundary containment rules
 */

/**
 * Validate that all components follow boundary containment rules
 * @param {Array} components - Array of components
 * @param {Array} boundaryBoxes - Array of boundary boxes with containmentRules
 * @returns {Object} - Validation result with errors array
 */
export const validateBoundaryContainment = (components, boundaryBoxes) => {
  const errors = [];
  const warnings = [];

  boundaryBoxes.forEach(boundary => {
    if (!boundary.containmentRules) return;

    const { mustContain, mustExclude, description } = boundary.containmentRules;

    // Check mustContain rules
    mustContain.forEach(componentId => {
      const component = components.find(c => c.id === componentId);

      if (!component) {
        warnings.push({
          boundary: boundary.id,
          componentId,
          type: 'missing',
          message: `Component '${componentId}' should be in '${boundary.label}' but doesn't exist`
        });
        return;
      }

      // Check if component has correct parentBoundary
      if (component.parentBoundary !== boundary.id) {
        errors.push({
          boundary: boundary.id,
          componentId,
          type: 'missing-parent',
          message: `Component '${component.label}' (${componentId}) should have parentBoundary='${boundary.id}' but has '${component.parentBoundary || 'none'}'`,
          fix: `Add parentBoundary: '${boundary.id}' to component '${componentId}'`
        });
      }
    });

    // Check mustExclude rules
    mustExclude.forEach(componentId => {
      const component = components.find(c => c.id === componentId);

      if (!component) {
        // Component doesn't exist, that's fine
        return;
      }

      // Check if component incorrectly has this boundary as parent
      if (component.parentBoundary === boundary.id) {
        errors.push({
          boundary: boundary.id,
          componentId,
          type: 'incorrect-parent',
          message: `Component '${component.label}' (${componentId}) should NOT be inside '${boundary.label}' but has parentBoundary='${boundary.id}'`,
          fix: `Remove parentBoundary property from component '${componentId}'`
        });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      message: errors.length === 0
        ? '✅ All boundary containment rules are satisfied'
        : `❌ Found ${errors.length} boundary containment violations`
    }
  };
};

/**
 * Get containment rules for a specific boundary
 * @param {string} boundaryId - ID of the boundary box
 * @param {Array} boundaryBoxes - Array of boundary boxes
 * @returns {Object|null} - Containment rules or null if not found
 */
export const getBoundaryRules = (boundaryId, boundaryBoxes) => {
  const boundary = boundaryBoxes.find(b => b.id === boundaryId);
  return boundary?.containmentRules || null;
};

/**
 * Check if a component should be inside a specific boundary
 * @param {string} componentId - ID of the component
 * @param {string} boundaryId - ID of the boundary box
 * @param {Array} boundaryBoxes - Array of boundary boxes
 * @returns {boolean} - True if component should be inside
 */
export const shouldBeInBoundary = (componentId, boundaryId, boundaryBoxes) => {
  const rules = getBoundaryRules(boundaryId, boundaryBoxes);
  if (!rules) return false;

  return rules.mustContain.includes(componentId);
};

/**
 * Check if a component should be outside a specific boundary
 * @param {string} componentId - ID of the component
 * @param {string} boundaryId - ID of the boundary box
 * @param {Array} boundaryBoxes - Array of boundary boxes
 * @returns {boolean} - True if component should be outside
 */
export const shouldBeOutsideBoundary = (componentId, boundaryId, boundaryBoxes) => {
  const rules = getBoundaryRules(boundaryId, boundaryBoxes);
  if (!rules) return false;

  return rules.mustExclude.includes(componentId);
};

/**
 * Log validation errors to console with formatting
 * @param {Object} validationResult - Result from validateBoundaryContainment
 */
export const logValidationErrors = (validationResult) => {
  if (validationResult.isValid) {
    console.log('✅', validationResult.summary.message);
    return;
  }

  console.group('❌ Boundary Containment Validation Errors');

  validationResult.errors.forEach((error, index) => {
    console.group(`Error ${index + 1}: ${error.type}`);
    console.log('Message:', error.message);
    console.log('Fix:', error.fix);
    console.groupEnd();
  });

  if (validationResult.warnings.length > 0) {
    console.group('⚠️ Warnings');
    validationResult.warnings.forEach(warning => {
      console.warn(warning.message);
    });
    console.groupEnd();
  }

  console.groupEnd();
};
