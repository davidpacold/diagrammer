import { useMemo } from 'react';
import { ZONE_BOUNDARY_X, DEFAULT_BOUNDARY_PADDING, ZONE_COLORS, COMPONENT_WIDTH, COMPONENT_HEIGHT } from '../constants';

/**
 * Calculate position based on positioning metadata (relative to boundary boxes).
 */
const calculatePosition = (component, boundaryBoxes) => {
  if (!component.positioning?.relativeTo) {
    return component.position;
  }

  const boundaryBox = boundaryBoxes.find(box => box.id === component.positioning.relativeTo);
  if (!boundaryBox) {
    return component.position;
  }

  const { placement, offsetX = 0, offsetY = 0 } = component.positioning;

  switch (placement) {
    case 'below':
      return { x: boundaryBox.x + offsetX, y: boundaryBox.y + boundaryBox.height + offsetY };
    case 'right':
      return { x: boundaryBox.x + boundaryBox.width + offsetX, y: boundaryBox.y + offsetY };
    case 'above':
      return { x: boundaryBox.x + offsetX, y: boundaryBox.y - offsetY };
    case 'left':
      return { x: boundaryBox.x - offsetX, y: boundaryBox.y + offsetY };
    default:
      return component.position;
  }
};

/**
 * Build zone background nodes from zoneDefinitions or fallback to defaults.
 */
const buildZoneBackgroundNodes = (zoneDefinitions) => {
  if (zoneDefinitions) {
    return Object.entries(zoneDefinitions).map(([zoneName, zoneDef]) => ({
      id: `zone-${zoneName}`,
      type: 'zoneBackground',
      position: { x: zoneDef.x, y: zoneDef.y },
      data: {
        width: zoneDef.width,
        height: zoneDef.height,
        color: zoneDef.backgroundColor,
        opacity: zoneDef.opacity,
        showBorder: zoneDef.showBorder,
        borderColor: zoneDef.borderColor,
      },
      draggable: false,
      selectable: false,
      zIndex: -10,
    }));
  }

  return [
    {
      id: 'zone-public',
      type: 'zoneBackground',
      position: { x: -5000, y: -5000 },
      data: {
        width: 5000 + ZONE_BOUNDARY_X,
        height: 10000,
        color: ZONE_COLORS.public,
        opacity: 0.3,
      },
      draggable: false,
      selectable: false,
      zIndex: -10,
    },
    {
      id: 'zone-private',
      type: 'zoneBackground',
      position: { x: ZONE_BOUNDARY_X, y: -5000 },
      data: {
        width: 5000,
        height: 10000,
        color: ZONE_COLORS.private,
        opacity: 0.3,
        showBorder: true,
        borderColor: ZONE_COLORS.privateBorder,
      },
      draggable: false,
      selectable: false,
      zIndex: -10,
    },
  ];
};

/**
 * Build boundary box nodes with dynamic sizing based on visible children.
 * Auto-scales to tightly surround active components.
 */
const buildBoundaryBoxNodes = (boundaryBoxes, components) => {
  return boundaryBoxes
    .filter((box) => {
      // Hide boundary box if no children are visible
      const hasVisibleChildren = components.some(c => c.visible && c.parentBoundary === box.id);
      return hasVisibleChildren;
    })
    .map((box) => {
      const childComponents = components.filter(c => c.visible && c.parentBoundary === box.id);
      const PADDING = box.padding || DEFAULT_BOUNDARY_PADDING;

      const childPositions = childComponents.map(c => c.position);
      const maxX = Math.max(...childPositions.map(p => p.x));
      const maxY = Math.max(...childPositions.map(p => p.y));

      // Tight fit: size to exactly contain visible children + padding
      const width = maxX + COMPONENT_WIDTH + PADDING;
      const height = maxY + COMPONENT_HEIGHT + PADDING;

      return {
        id: box.id || `boundary-${box.label}`,
        type: 'boundaryBox',
        position: { x: box.x, y: box.y },
        data: { label: box.label, width, height, color: box.color },
        draggable: false,
        selectable: false,
        zIndex: -1,
        style: { width, height },
      };
    });
};

/**
 * Hook that builds React Flow nodes from component data.
 */
export const useNodes = ({ components, connectedNodes, selectedNodeId, boundaryBoxes, zoneDefinitions }) => {
  return useMemo(() => {

    const componentNodes = components
      .filter(c => c.visible)
      .map(c => {
        const node = {
          id: c.id,
          type: 'component',
          position: calculatePosition(c, boundaryBoxes),
          data: {
            label: c.label,
            description: c.description,
            icon: c.icon,
            zone: c.zone,
            parentBoundary: c.parentBoundary,
            isSelected: selectedNodeId === c.id,
            isConnected: connectedNodes.has(c.id),
            badgeLabel: c.parentBoundary
              ? (boundaryBoxes.find(b => b.id === c.parentBoundary)?.badgeLabel || 'External')
              : (c.zone === 'private' ? 'Internal' : 'External'),
            badgeColor: c.parentBoundary
              ? (boundaryBoxes.find(b => b.id === c.parentBoundary)?.badgeColor || 'green')
              : (c.zone === 'private' ? 'blue' : 'green'),
          },
        };

        if (c.parentBoundary) {
          node.parentNode = c.parentBoundary;
          node.extent = 'parent';
        }

        return node;
      });

    const zoneBackgroundNodes = buildZoneBackgroundNodes(zoneDefinitions);
    const boundaryBoxNodes = buildBoundaryBoxNodes(boundaryBoxes, components);

    return [...zoneBackgroundNodes, ...boundaryBoxNodes, ...componentNodes];
  }, [components, connectedNodes, selectedNodeId, boundaryBoxes, zoneDefinitions]);
};
