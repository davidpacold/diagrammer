# Quick Edit Guide - Component Changes

**For Claude Code**: This is a condensed reference for making quick component changes.

---

## 🚀 The Essentials

**File to Edit**: `src/data/components.js` (that's it!)

**Always**:
1. `Read src/data/components.js` first
2. `Edit src/data/components.js` to make changes
3. `npm run dev` to test
4. Commit and push when ready

---

## ➕ Add Component Template

```javascript
// Copy this and customize
{
  id: 'your-service-name',           // lowercase-with-hyphens
  type: 'component',                  // don't change
  label: 'Your Service Name',         // display name
  description: 'What this does',      // tooltip on hover
  position: { x: 500, y: 300 },      // where to place it
  visible: true,                      // show by default
  zone: 'private',                    // 'public' or 'private'
  icon: '🔧'                          // emoji
}
```

**Zones**:
- `zone: 'public'` → Left side (Internet) → `x: 50-300`
- `zone: 'private'` → Right side (Private Network) → `x: 400-900`

---

## 🔗 Add Connection Template

```javascript
// Copy this and customize
{
  id: 'e##',                          // increment number
  source: 'source-component-id',      // from component
  target: 'target-component-id',      // to component
  animated: false                     // true for animated line
}
```

---

## ❌ Remove Component

1. Delete the component object from `initialComponents`
2. Delete ALL edges in `initialConnections` where:
   - `source: 'component-id'` OR
   - `target: 'component-id'`

---

## 📝 Common Icons

| Service Type | Emoji |
|--------------|-------|
| API/Gateway | 🚪 🔌 |
| Server | 🖥️ 💻 |
| Database | 🗄️ 🐘 |
| Cache | 💾 ⚡ |
| Storage | 📦 🪣 |
| CDN | 🌐 📡 |
| Load Balancer | ⚖️ 🔀 |
| Queue | 📬 📨 |
| Monitoring | 📊 📈 |
| Auth | 🔐 🔒 |
| Container/K8s | ☸️ 🐳 |

---

## 🧪 Test & Deploy

```bash
# Test locally
npm run dev
# Open http://localhost:3000

# Build check
npm run build

# Commit
git add src/data/components.js
git commit -m "Add/remove/update components"
git push

# Manual deploy (optional)
npm run deploy
```

---

## ⚡ Example: Add Redis Cluster

```javascript
// Add to initialComponents array
{
  id: 'redis-cluster',
  type: 'component',
  label: 'Redis Cluster',
  description: 'Distributed cache with high availability',
  position: { x: 700, y: 200 },
  visible: true,
  zone: 'private',
  icon: '💎'
}

// Add connections to initialConnections array
{ id: 'e20', source: 'appserver1', target: 'redis-cluster', animated: false },
{ id: 'e21', source: 'appserver2', target: 'redis-cluster', animated: false }
```

---

## ⚡ Example: Remove Message Queue

```javascript
// 1. Remove from initialComponents
{
  id: 'messagequeue',  // ← DELETE this entire object
  type: 'component',
  // ...
}

// 2. Remove from initialConnections (all edges with messagequeue)
{ id: 'e10', source: 'appserver1', target: 'messagequeue', ... },  // ← DELETE
{ id: 'e11', source: 'appserver2', target: 'messagequeue', ... },  // ← DELETE
```

---

See `.claude/MAINTENANCE.md` for full documentation.
