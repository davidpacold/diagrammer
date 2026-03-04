# Demo Showstopper + Visual Refinement Design

**Goal:** Transform the architecture diagram tool from a functional demo into a visually impressive, narrative-driven sales tool that wins deals.

**Context:** Sales engineers use this to walk prospects through Airia's deployment architectures (Shared SaaS, Dedicated SaaS, Customer Hosted). The tool needs to support live storytelling, visual impact, and on-the-fly customization.

---

## 1. Animated Data Flow

When a user clicks a component, animated particles travel along connection paths showing data direction.

- Small circles (4px) follow SVG edge paths from source to target
- Multiple dots stagger along the path for a continuous stream effect
- Color matches highlight color (blue/indigo)
- Animation runs ~5 seconds then loops gently until selection clears
- Implementation: Custom ReactFlow edge component with SVG `<animateMotion>`

## 2. Presentation Mode (Scenes)

A scene-based walkthrough mode for structured demos.

- Each preset defines an array of `scenes` in its data file
- A scene specifies: which components are visible, which node to auto-select, and a title/description
- Bottom bar UI: scene title, description, prev/next arrows, scene counter (e.g., 2/4)
- Transitions animate with fitView between scenes
- Keyboard navigation: left/right arrows, Escape to exit
- Data model addition to presets:
  ```js
  scenes: [
    { title: 'Customer Entry', visible: ['customer-1', 'cdn'], select: 'cdn', description: '...' },
  ]
  ```

## 3. Quick Label Editing

Double-click any component card to edit its label inline.

- Label text becomes an input field, pre-selected for replacement
- Enter/click away to save, Escape to cancel
- Persists in current session, resets on preset change
- URL share link preserves custom labels
- New reducer action: `RENAME_COMPONENT`

## 4. Connection Line Polish

Visual improvements to edge rendering.

- **Edge labels**: Optional text labels (e.g., "HTTPS", "API", "gRPC")
- **Line styles**: Solid (primary flow), dashed (optional/BYOK), dotted (monitoring)
- **Better routing**: Smarter path offsets for parallel edges
- **Edge colors**: Blue for managed, gray for external, green for customer connections
- Data model: Add optional `style` and `label` fields to connections

## 5. Component Card Redesign

Richer visual design for component nodes.

- **Icon upgrade**: Larger icons (24px) with colored background circles
- **Type hierarchy**: Different card styles by category (platform/core stronger, external lighter, users distinguished)
- **Hover effects**: Subtle scale + shadow on hover
- **Badge redesign**: Move zone badge to small pill at bottom of card
- **Status indicators**: Small colored dots for connection status

## 6. Layout Engine Improvements

Smarter automatic positioning.

- **Column-based auto-layout**: Position components in logical columns (customers -> CDN -> platform -> services)
- **Smarter overlap resolution**: Column-aware algorithm instead of force-directed
- **Consistent spacing**: Uniform vertical spacing within columns
- **Boundary-aware positioning**: New components inside a boundary auto-position in next available slot
