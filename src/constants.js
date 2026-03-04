// Shared constants for the architecture diagram tool

// Component card dimensions
export const COMPONENT_WIDTH = 180;
export const COMPONENT_HEIGHT = 110;

// Grid system
export const GRID_SIZE = 20;
export const MIN_SPACING = 40;

// Zone boundary (canvas X coordinate separating public/private zones)
export const ZONE_BOUNDARY_X = 550;

// Boundary box defaults
export const DEFAULT_BOUNDARY_PADDING = 30;

// Default zone labels
export const DEFAULT_ZONE_LABELS = {
  left: '🌐 Internet / Public',
  right: '🔒 Private Network',
};

// Default zone background colors
export const ZONE_COLORS = {
  public: '#dbeafe',
  private: '#f3f4f6',
  privateBorder: '#9ca3af',
};

// Edge styling
export const EDGE_STYLES = {
  default: { stroke: '#94a3b8', strokeWidth: 2 },
  highlighted: { stroke: '#3b82f6', strokeWidth: 3 },
};

// Component type accent colors (left border on cards)
export const TYPE_ACCENT_COLORS = {
  infrastructure: '#3b82f6',
  data: '#10b981',
  security: '#f59e0b',
  integration: '#8b5cf6',
  user: '#6b7280',
  ai: '#ec4899',
};
