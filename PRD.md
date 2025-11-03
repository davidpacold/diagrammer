# Product Requirements Document: CloudFlare Architecture Diagram Tool

## 1. Overview

An interactive web-based system architecture diagram tool that allows users to visualize cloud infrastructure components with toggleable visibility, drag-and-drop positioning, and detailed component information.

## 2. Product Goals

- Provide an intuitive way to visualize system architecture
- Allow users to customize their view by toggling component visibility
- Enable interactive exploration through drag-and-drop and tooltips
- Serve as a foundation for more complex diagram tools

## 3. Target Users

- Software engineers and architects
- DevOps and infrastructure teams
- Technical documentation creators
- Anyone needing to visualize system architecture

## 4. Core Features

### 4.1 Component Visibility Toggle
- **Description**: Sidebar panel with checkboxes to show/hide architectural components
- **Behavior**:
  - Checkboxes for each component type
  - Instant visibility updates when toggled
  - Visual feedback for toggle state
- **Priority**: P0 (Must Have)

### 4.2 Drag and Drop
- **Description**: Users can reposition diagram elements on the canvas
- **Behavior**:
  - Click and drag any visible component
  - Components maintain their connections/edges during drag
  - Smooth animation during movement
- **Priority**: P0 (Must Have)

### 4.3 Component Tooltips
- **Description**: Hover over components to see detailed information
- **Behavior**:
  - Tooltip appears on hover with ~200ms delay
  - Shows component name, type, and description
  - Tooltip follows cursor or anchors to component
- **Priority**: P0 (Must Have)

### 4.4 Session-Based State
- **Description**: All user interactions are ephemeral
- **Behavior**:
  - No persistence between sessions
  - Page refresh resets to default state
  - Simplifies initial implementation
- **Priority**: P0 (Must Have)

### 4.5 Split Background (Public/Private Network)
- **Description**: Canvas background visually divided into two zones
- **Behavior**:
  - Left side: "Internet" / Public Network zone (lighter background)
  - Right side: "Private Network" zone (slightly different shade)
  - Labels at top or bottom indicating each zone
  - Components can be positioned in either zone based on their network exposure
  - Visual separator (subtle line or gradient) between zones
- **Priority**: P0 (Must Have)

## 5. Initial Component Set

The following architectural components will be included in the initial release:

1. **Load Balancer**: Distributes incoming traffic across multiple servers
2. **API Gateway**: Single entry point for API requests, handles routing and authentication
3. **Application Servers**: Backend application processing nodes
4. **Database (Primary)**: Main database for read/write operations
5. **Database (Replica)**: Read-only database replica for scaling reads
6. **Cache Layer (Redis)**: In-memory data store for caching
7. **Message Queue**: Asynchronous message processing (e.g., RabbitMQ, SQS)
8. **CDN**: Content delivery network for static assets
9. **Storage (S3/R2)**: Object storage for files and media
10. **Monitoring/Logging**: Observability and logging infrastructure

## 6. Technical Architecture

### 6.1 Frontend Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Diagram Library**: React Flow (or ReactFlow)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/JSX (can migrate to TypeScript later)

### 6.2 Hosting & Deployment
- **Hosting**: Cloudflare Pages
- **Build**: Vite build output deployed to Pages
- **Future**: Cloudflare Workers for API endpoints if needed

### 6.3 State Management
- **Approach**: React useState/useReducer
- **Scope**: Client-side only, no external state management library needed initially

### 6.4 Data Model
```javascript
{
  id: string,          // Unique identifier
  type: string,        // Component type (e.g., 'loadbalancer', 'database')
  label: string,       // Display name
  description: string, // Tooltip content
  position: { x, y },  // Canvas position
  visible: boolean,    // Toggle state
  icon: string,        // Icon/visual representation
  zone: string,        // 'public' or 'private' - which network zone
  connections: []      // Array of connected component IDs
}
```

## 7. User Interface

### 7.1 Layout
```
+------------------+----------------------------------+
|                  |     Internet    |  Private Net   |
|   Toggle Panel   |   (Public)      |                |
|                  +-----------------+----------------+
|  [ ] Load Bal.   |                 |                |
|  [x] API Gate    |   [CDN]  [LB]   |  [App] [DB]    |
|  [x] App Server  |                 |                |
|  [ ] Database    |   [Components]  |  [Components]  |
|  ...             |                 |                |
|                  |                 |                |
+------------------+-----------------+----------------+
```

### 7.2 Visual Design
- Clean, modern interface
- Clear component icons/shapes
- Distinct visual styles for different component types
- Smooth animations and transitions
- Responsive layout (desktop-first, mobile-friendly)
- **Background zones**:
  - Public/Internet zone: Light blue/gray background (#f0f4f8 or similar)
  - Private Network zone: Slightly warmer/darker shade (#e8ecf0 or similar)
  - Subtle vertical divider line between zones
  - Zone labels at the top of canvas

## 8. Future Enhancements (Out of Scope for V1)

- User-configurable components
- Save/load diagram configurations
- Export to PNG/SVG
- Share diagrams via URL
- Multiple diagram templates
- Real-time collaboration
- Custom theming
- Zoom and pan controls
- Component search/filter
- Connection customization

## 9. Success Metrics

- Page load time < 2 seconds
- Smooth drag interactions (60fps)
- Toggle response time < 100ms
- Zero runtime errors
- Works on modern browsers (Chrome, Firefox, Safari, Edge)

## 10. Timeline & Milestones

### Phase 1: Foundation (Current)
- Project setup and configuration
- Basic React + Vite + React Flow integration
- Static component definitions

### Phase 2: Core Features
- Implement toggle sidebar
- Add drag-and-drop functionality
- Create custom component nodes
- Add tooltips

### Phase 3: Polish & Deploy
- Styling and visual refinement
- Testing and bug fixes
- Cloudflare Pages deployment
- Documentation

## 11. Dependencies

- Node.js 18+
- npm or yarn
- Cloudflare account (for Pages deployment)
- Wrangler CLI

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| React Flow learning curve | Medium | Use official docs and examples |
| Cloudflare Pages compatibility | Low | Vite builds are well-supported |
| Performance with many components | Medium | Start with 10 components, optimize later |
| Browser compatibility | Low | Use modern browsers, polyfills if needed |

## 13. Open Questions

- Should components have multiple "layers" or categories?
- Do we want pre-defined layouts/arrangements?
- Should connections between components be editable?

---

**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Owner**: David Pacold
