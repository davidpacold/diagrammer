# Claude Code Maintenance Guide for Diagrammer

This guide provides step-by-step instructions for future Claude Code sessions to maintain and modify the architecture diagram components.

## Table of Contents
1. [Quick Reference](#quick-reference)
2. [Adding New Components](#adding-new-components)
3. [Removing Components](#removing-components)
4. [Modifying Existing Components](#modifying-existing-components)
5. [Adding Connections](#adding-connections)
6. [Changing Component Zones](#changing-component-zones)
7. [Testing Changes](#testing-changes)
8. [Deployment](#deployment)

---

## Quick Reference

**Key File**: `src/data/components.js` - This is the ONLY file you need to edit for component changes.

**Component Structure**:
```javascript
{
  id: 'unique-id',              // Unique identifier (lowercase, hyphens)
  type: 'component',            // Always 'component'
  label: 'Display Name',        // What users see
  description: 'Tooltip text',  // Shown on hover
  position: { x: 400, y: 300 }, // Canvas coordinates
  visible: true,                // Show by default (true/false)
  zone: 'private',              // 'public' or 'private'
  icon: '🔧'                    // Emoji icon
}
```

**Connection Structure**:
```javascript
{
  id: 'e1',                     // Unique edge identifier
  source: 'component-id-1',     // Source component ID
  target: 'component-id-2',     // Target component ID
  animated: false,              // Animation (true/false)
  label: 'optional-label'       // Optional edge label
}
```

---

## Adding New Components

### Step 1: Read the components file
```bash
# Read the current components
Read src/data/components.js
```

### Step 2: Add your component to the `initialComponents` array

**Example: Adding a "Kubernetes Cluster" to the private network**

```javascript
// Add this to the initialComponents array in src/data/components.js
{
  id: 'kubernetes',
  type: 'component',
  label: 'Kubernetes Cluster',
  description: 'Container orchestration platform for managing microservices',
  position: { x: 550, y: 450 },  // Place it where you want
  visible: true,
  zone: 'private',  // private network
  icon: '☸️'
}
```

**Positioning Guidelines**:
- Public zone (left side): x values 50-300
- Private zone (right side): x values 400-900
- Y values: 50-600 (top to bottom)
- Space components at least 150px apart

**Icon Selection**:
- Use relevant emojis from: https://emojipedia.org
- Common infrastructure emojis:
  - Servers: 🖥️ 💻 🖧
  - Storage: 💾 🗄️ 📦
  - Network: 🌐 🔌 📡
  - Security: 🔒 🛡️ 🔐
  - Monitoring: 📊 📈 📉
  - Containers: ☸️ 🐳
  - Functions: ⚡ 🔧 ⚙️

### Step 3: Edit the file
```bash
Edit src/data/components.js
# Add the new component object to the initialComponents array
```

### Step 4: Test locally
```bash
npm run dev
# Open http://localhost:3000 and verify the component appears
```

---

## Removing Components

### Step 1: Read the components file
```bash
Read src/data/components.js
```

### Step 2: Identify the component to remove
Find the component object with the `id` you want to remove.

### Step 3: Remove the component AND its connections

**Example: Removing the 'monitoring' component**

1. Remove the component object from `initialComponents`:
```javascript
// DELETE this entire object
{
  id: 'monitoring',
  type: 'component',
  label: 'Monitoring',
  description: 'Observability and logging infrastructure...',
  position: { x: 850, y: 450 },
  visible: true,
  zone: 'private',
  icon: '📊'
}
```

2. Remove ALL connections that reference this ID from `initialConnections`:
```javascript
// DELETE any edge that has source OR target = 'monitoring'
// Example:
{ id: 'e14', source: 'appserver1', target: 'monitoring', animated: false },
```

### Step 4: Edit the file
```bash
Edit src/data/components.js
# Remove the component and all its connections
```

### Step 5: Test
```bash
npm run dev
# Verify component is gone and no broken connections
```

---

## Modifying Existing Components

### To Change a Component's Label, Description, or Icon

**Example: Rename "Redis Cache" to "Memcached"**

```bash
# 1. Read the file
Read src/data/components.js

# 2. Find the component with id: 'cache'
# 3. Edit it
Edit src/data/components.js

# Change:
{
  id: 'cache',
  label: 'Redis Cache',        // OLD
  description: 'In-memory...',  // OLD
  icon: '💾'                    // OLD
}

# To:
{
  id: 'cache',
  label: 'Memcached',           // NEW
  description: 'Distributed memory caching system',  // NEW
  icon: '🔷'                    // NEW
}
```

### To Move a Component

Simply change the `position` values:
```javascript
position: { x: 700, y: 150 }  // OLD
position: { x: 500, y: 250 }  // NEW (moves left and down)
```

### To Change Component Visibility Default

```javascript
visible: true   // Shown by default
visible: false  // Hidden by default
```

---

## Adding Connections

Connections (edges) link components together with lines.

### Step 1: Identify source and target IDs
```bash
Read src/data/components.js
# Note the 'id' values of components you want to connect
```

### Step 2: Add to initialConnections array

**Example: Connect Kubernetes to Database**

```javascript
// Add to initialConnections array
{
  id: 'e15',                      // Increment from last edge ID
  source: 'kubernetes',           // Source component ID
  target: 'database-primary',     // Target component ID
  animated: false,                // Set true for animated flow
  label: 'queries'                // Optional label (can omit)
}
```

### Connection Types:
- **Simple connection**: Just source and target
- **Animated**: Add `animated: true` for moving dashes (shows data flow)
- **Labeled**: Add `label: 'text'` to show text on the edge

---

## Changing Component Zones

To move a component between public (Internet) and private network:

### Example: Move CDN from public to private

```bash
Read src/data/components.js
Edit src/data/components.js

# Find the component:
{
  id: 'cdn',
  zone: 'public'   // OLD
}

# Change to:
{
  id: 'cdn',
  zone: 'private'  // NEW
}

# Also adjust position to be in the private zone (x > 400)
position: { x: 500, y: 100 }  // Move to right side
```

---

## Testing Changes

### Local Testing (Always do this first!)
```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Verify:
#    - New components appear correctly
#    - Removed components are gone
#    - Connections render properly
#    - Toggle checkboxes work
#    - Components are in correct zones (public/private)
#    - Drag and drop works
#    - Tooltips show on hover

# 4. Stop dev server when done
# Press Ctrl+C or kill the process
```

### Build Testing
```bash
# Test production build
npm run build

# Should complete without errors
# Output should show dist/ files created
```

---

## Deployment

### Option 1: Automatic (Recommended)
```bash
# Commit and push changes
git add src/data/components.js
git commit -m "Add Kubernetes component to architecture diagram

Added new Kubernetes component in private network zone with connections to app servers and database.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push

# GitHub Action will automatically deploy to Cloudflare Pages
# Check progress at: https://github.com/davidpacold/diagrammer/actions
```

### Option 2: Manual Deploy
```bash
npm run deploy

# Deploys directly to Cloudflare Pages
# Faster but skips CI/CD
```

### Option 3: Manual Trigger GitHub Action
1. Go to https://github.com/davidpacold/diagrammer/actions
2. Click "Deploy to Cloudflare Pages"
3. Click "Run workflow" → Select branch → "Run workflow"

---

## Common Maintenance Tasks

### Task: Add a new microservice to private network

```bash
# 1. Read current state
Read src/data/components.js

# 2. Add new component
Edit src/data/components.js
# Add to initialComponents:
{
  id: 'auth-service',
  type: 'component',
  label: 'Auth Service',
  description: 'Authentication and authorization microservice',
  position: { x: 550, y: 200 },
  visible: true,
  zone: 'private',
  icon: '🔐'
}

# 3. Add connections (e.g., to API Gateway and Database)
# Add to initialConnections:
{ id: 'e16', source: 'apigateway', target: 'auth-service', animated: false },
{ id: 'e17', source: 'auth-service', target: 'database-primary', animated: false }

# 4. Test
npm run dev

# 5. Deploy
git add src/data/components.js
git commit -m "Add auth service to diagram"
git push
```

### Task: Remove an unused component

```bash
# 1. Read current state
Read src/data/components.js

# 2. Find and note the component ID (e.g., 'storage')

# 3. Edit file - remove component and ALL related connections
Edit src/data/components.js
# Delete component object with id: 'storage'
# Delete all edges where source='storage' OR target='storage'

# 4. Test
npm run dev

# 5. Deploy
git add src/data/components.js
git commit -m "Remove storage component from diagram"
git push
```

### Task: Reorganize diagram layout

```bash
# 1. Read current state
Read src/data/components.js

# 2. Update position values for multiple components
Edit src/data/components.js
# Change position: { x, y } for components you want to move
# Keep public zone: x < 350
# Keep private zone: x > 400

# 3. Test and adjust
npm run dev
# Drag components in UI to find good positions
# Note the positions you like
# Update the file with final positions

# 4. Deploy
git add src/data/components.js
git commit -m "Reorganize diagram layout for better clarity"
git push
```

---

## Troubleshooting

### Components not appearing
- Check `visible: true` is set
- Verify `id` is unique
- Check position is within canvas (x: 0-1000, y: 0-600)

### Connections not showing
- Verify both source and target IDs exist in components
- Check both components have `visible: true`
- Ensure edge `id` is unique

### Components in wrong zone
- Public zone background: Light blue (left side)
- Private zone background: Gray (right side)
- Check `zone: 'public'` or `zone: 'private'`
- Adjust `position.x` to match zone

### Build errors
```bash
# Check for syntax errors
npm run build

# Common issues:
# - Missing comma between array items
# - Unclosed braces {}
# - Invalid JavaScript syntax
```

---

## File Structure Reference

```
src/data/components.js
├── initialComponents []    ← Array of component objects
│   ├── id (required)
│   ├── type (always 'component')
│   ├── label (required)
│   ├── description (required)
│   ├── position { x, y } (required)
│   ├── visible (required)
│   ├── zone (required)
│   └── icon (required)
│
└── initialConnections []   ← Array of edge objects
    ├── id (required)
    ├── source (required)
    ├── target (required)
    ├── animated (optional)
    └── label (optional)
```

---

## Best Practices

1. **Always test locally first** - Run `npm run dev` before committing
2. **Use descriptive commit messages** - Explain what changed and why
3. **Keep component IDs lowercase with hyphens** - e.g., `auth-service`, not `AuthService`
4. **Space components evenly** - Leave at least 150px between components
5. **Clean up connections** - When removing a component, remove all its edges
6. **Use meaningful icons** - Choose emojis that represent the service
7. **Write clear descriptions** - Tooltips should explain what the component does
8. **Check both zones** - Verify components are in the correct public/private zone
9. **Increment edge IDs** - Use sequential IDs like e1, e2, e3...
10. **Document major changes** - Update this guide if you add new patterns

---

## Quick Commands Cheatsheet

```bash
# View current components
Read src/data/components.js

# Edit components
Edit src/data/components.js

# Test locally
npm run dev

# Build for production
npm run build

# Deploy manually
npm run deploy

# Commit changes
git add src/data/components.js
git commit -m "Description of changes"
git push

# Check deployment status
# Visit: https://github.com/davidpacold/diagrammer/actions
```

---

## Support & Resources

- **React Flow Docs**: https://reactflow.dev/
- **Emoji Picker**: https://emojipedia.org
- **Project README**: See `/README.md` for general project info
- **PRD**: See `/PRD.md` for product requirements

---

**Last Updated**: 2025-11-03
**Maintained by**: Claude Code Sessions
