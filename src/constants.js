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

// Default viewport position
export const DEFAULT_VIEWPORT = { x: 150, y: 50, zoom: 0.7 };

// Edge styling
export const EDGE_STYLES = {
  default: { stroke: '#94a3b8', strokeWidth: 2 },
  highlighted: { stroke: '#3b82f6', strokeWidth: 3 },
  dashed: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '6 3' },
  dotted: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '2 4' },
};

export const EDGE_COLORS = {
  managed: '#4f46e5',   // Indigo for Airia-managed connections
  external: '#94a3b8',  // Gray for external services
  customer: '#10b981',  // Green for customer connections
  byok: '#f59e0b',      // Amber for BYOK connections
};

// Icon background colors for card redesign
export const ICON_BG_COLORS = {
  users: 'bg-gray-100',
  globe: 'bg-blue-100',
  layers: 'bg-indigo-100',
  key: 'bg-amber-100',
  cpu: 'bg-pink-100',
  database: 'bg-emerald-100',
  shield: 'bg-amber-100',
  link: 'bg-violet-100',
  server: 'bg-blue-100',
  monitor: 'bg-amber-100',
  message: 'bg-violet-100',
  box: 'bg-emerald-100',
  scale: 'bg-blue-100',
  door: 'bg-blue-100',
  memory: 'bg-emerald-100',
  eye: 'bg-pink-100',
  network: 'bg-blue-100',
};

// Icon-based accent colors (left border on component cards)
export const CATEGORY_COLORS = {
  users: '#6b7280',
  globe: '#3b82f6',
  layers: '#4f46e5',
  key: '#f59e0b',
  cpu: '#ec4899',
  database: '#10b981',
  shield: '#f59e0b',
  link: '#8b5cf6',
  server: '#3b82f6',
  scale: '#3b82f6',
  door: '#3b82f6',
  memory: '#10b981',
  message: '#8b5cf6',
  box: '#10b981',
  monitor: '#f59e0b',
  eye: '#ec4899',
  network: '#3b82f6',
};
