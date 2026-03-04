import React from 'react';

const defaultProps = {
  size: 24,
  className: '',
};

function svgProps(size, className) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
  };
}

// Globe — circle with meridian lines (CDN)
export function GlobeIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// Server — rectangle with internal lines (app servers)
export function ServerIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

// Database — cylinder shape
export function DatabaseIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 5v14a9 3 0 0 1-18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

// Shield — shield outline (security/SIEM)
export function ShieldIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// Cloud — cloud shape
export function CloudIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

// Users — two person silhouettes
export function UsersIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Key — key shape (auth services)
export function KeyIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

// Link — chain link (integrations)
export function LinkIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// Monitor — screen with chart line (monitoring)
export function MonitorIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <polyline points="7 13 10 10 13 12 17 8" />
    </svg>
  );
}

// Message — envelope (message queue)
export function MessageIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

// Box — cube shape (storage/containers)
export function BoxIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

// Cpu — CPU chip (AI/LLM)
export function CpuIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

// Layers — stacked layers (platform)
export function LayersIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// Scale — balance scale (load balancer)
export function ScaleIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="4 7 12 3 20 7" />
      <path d="M4 7l-2 9h8L8 7" />
      <path d="M20 7l-2 9h8l-2-9" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

// Door — door/gate shape (API gateway)
export function DoorIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <circle cx="15.5" cy="12" r="1" />
    </svg>
  );
}

// Memory — memory chip (cache/Redis)
export function MemoryIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="4" y="6" width="16" height="12" rx="1" />
      <path d="M7 6V4" />
      <path d="M10 6V4" />
      <path d="M14 6V4" />
      <path d="M17 6V4" />
      <path d="M7 18v2" />
      <path d="M10 18v2" />
      <path d="M14 18v2" />
      <path d="M17 18v2" />
      <path d="M8 10h2v4H8z" />
      <path d="M14 10h2v4h-2z" />
    </svg>
  );
}

// Eye — eye shape (vision model)
export function EyeIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Network — network nodes (ingress/network)
export function NetworkIcon({ size = 24, className = '' }) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
      <line x1="5" y1="16" x2="19" y2="16" />
    </svg>
  );
}

export const iconMap = {
  globe: GlobeIcon,
  server: ServerIcon,
  database: DatabaseIcon,
  shield: ShieldIcon,
  cloud: CloudIcon,
  users: UsersIcon,
  key: KeyIcon,
  link: LinkIcon,
  monitor: MonitorIcon,
  message: MessageIcon,
  box: BoxIcon,
  cpu: CpuIcon,
  layers: LayersIcon,
  scale: ScaleIcon,
  door: DoorIcon,
  memory: MemoryIcon,
  eye: EyeIcon,
  network: NetworkIcon,
};
