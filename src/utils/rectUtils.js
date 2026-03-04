/**
 * Rectangle overlap detection with spacing buffer.
 * Shared by layoutUtils, layoutValidator, and positionDebugger.
 */

import { MIN_SPACING } from '../constants';

/**
 * Check if two rectangles overlap (including spacing buffer).
 * @param {{ x: number, y: number, width: number, height: number }} rect1
 * @param {{ x: number, y: number, width: number, height: number }} rect2
 * @returns {boolean}
 */
export const checkOverlap = (rect1, rect2) => {
  const halfSpacing = MIN_SPACING / 2;

  const r1 = {
    x: rect1.x - halfSpacing,
    y: rect1.y - halfSpacing,
    width: rect1.width + MIN_SPACING,
    height: rect1.height + MIN_SPACING,
  };
  const r2 = {
    x: rect2.x - halfSpacing,
    y: rect2.y - halfSpacing,
    width: rect2.width + MIN_SPACING,
    height: rect2.height + MIN_SPACING,
  };

  return !(
    r1.x + r1.width <= r2.x ||
    r2.x + r2.width <= r1.x ||
    r1.y + r1.height <= r2.y ||
    r2.y + r2.height <= r1.y
  );
};
