# Complete Examples - Component Modifications

This document contains full, copy-paste examples for common component modification tasks.

---

## Example 1: Add a New Microservice (Full Walkthrough)

**Scenario**: Add an "Email Service" to the private network that connects to the API Gateway and Message Queue.

### Step 1: Read the current file
```bash
Read src/data/components.js
```

### Step 2: Prepare your component object
```javascript
{
  id: 'email-service',
  type: 'component',
  label: 'Email Service',
  description: 'Handles email notifications and transactional emails via SendGrid/SES',
  position: { x: 550, y: 500 },
  visible: true,
  zone: 'private',
  icon: '📧'
}
```

### Step 3: Prepare your connections
```javascript
// Connect API Gateway → Email Service
{ id: 'e20', source: 'apigateway', target: 'email-service', animated: false }

// Connect Email Service → Message Queue
{ id: 'e21', source: 'email-service', target: 'messagequeue', animated: true }
```

### Step 4: Edit the file
```bash
Edit src/data/components.js

# In initialComponents array, add the component object
# In initialConnections array, add the connection objects
# Make sure to add commas after the previous last item!
```

### Step 5: Test
```bash
npm run dev
# Verify:
# - Email Service appears in the sidebar under "Private Network"
# - It's positioned correctly on the canvas
# - Lines connect to API Gateway and Message Queue
# - Checkbox toggles visibility
# - Tooltip shows on hover
```

### Step 6: Deploy
```bash
git add src/data/components.js
git commit -m "Add email service to architecture diagram

Added email service component in private network with connections to API Gateway and Message Queue for handling transactional emails.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

---

## Example 2: Remove Multiple Components

**Scenario**: Remove both database replicas to simplify the diagram.

### Step 1: Read and identify
```bash
Read src/data/components.js
# Find component ID: 'database-replica'
```

### Step 2: Edit - Remove component
```bash
Edit src/data/components.js

# Remove this from initialComponents:
{
  id: 'database-replica',
  type: 'component',
  label: 'Database (Replica)',
  description: 'Read-only database replica for scaling read operations',
  position: { x: 850, y: 300 },
  visible: true,
  zone: 'private',
  icon: '🗄️'
}
```

### Step 3: Edit - Remove ALL related connections
```bash
# Still editing src/data/components.js
# Remove from initialConnections:

{ id: 'e9', source: 'database-primary', target: 'database-replica', animated: false, label: 'replication' }
# ^ Remove this entire line
```

### Step 4: Test and deploy
```bash
npm run dev
# Verify replica is gone and no broken connection lines

git add src/data/components.js
git commit -m "Remove database replica to simplify diagram"
git push
```

---

## Example 3: Add Public-Facing Component

**Scenario**: Add a "WAF (Web Application Firewall)" in the public zone before the Load Balancer.

### Component Definition
```javascript
{
  id: 'waf',
  type: 'component',
  label: 'WAF',
  description: 'Web Application Firewall - Cloudflare/AWS WAF for DDoS protection and security',
  position: { x: 100, y: 175 },  // Public zone (x < 350)
  visible: true,
  zone: 'public',  // ← Public network
  icon: '🛡️'
}
```

### Connections
```javascript
// Update existing: CDN → WAF → Load Balancer
{ id: 'e1', source: 'cdn', target: 'waf', animated: false },
{ id: 'e2', source: 'waf', target: 'loadbalancer', animated: false }

// Remove old direct connection:
// { id: 'e1', source: 'cdn', target: 'loadbalancer', animated: false },  ← DELETE
```

### Full Edit Process
```bash
Read src/data/components.js

Edit src/data/components.js
# 1. Add WAF component to initialComponents
# 2. Modify e1 to go from CDN to WAF (change target)
# 3. Change e2 to go from WAF to loadbalancer (change source)

npm run dev
# Test the flow: CDN → WAF → Load Balancer

git add src/data/components.js
git commit -m "Add WAF component in public zone for security"
git push
```

---

## Example 4: Reorganize Layout

**Scenario**: Move all database components to the bottom-right of the diagram.

### Changes Needed
```javascript
// Find these in initialComponents and update positions:

// Database Primary - move down
{
  id: 'database-primary',
  // ... other properties
  position: { x: 750, y: 500 }  // Changed from { x: 700, y: 300 }
}

// Database Replica - move down
{
  id: 'database-replica',
  // ... other properties
  position: { x: 850, y: 500 }  // Changed from { x: 850, y: 300 }
}
```

### Edit Process
```bash
Read src/data/components.js

Edit src/data/components.js
# Update position values for both database components

npm run dev
# Visually verify new positions look good

git add src/data/components.js
git commit -m "Reorganize database components to bottom-right"
git push
```

---

## Example 5: Add Data Flow Animation

**Scenario**: Show animated data flow from App Servers → Database to visualize writes.

### Changes
```bash
Read src/data/components.js

Edit src/data/components.js

# Find these edges and change animated: false to true:
{ id: 'e7', source: 'appserver1', target: 'database-primary', animated: true },   // was false
{ id: 'e8', source: 'appserver2', target: 'database-primary', animated: true },   // was false

npm run dev
# You should see moving dashes on these connections

git add src/data/components.js
git commit -m "Add animation to database write connections"
git push
```

---

## Example 6: Change Component Zone

**Scenario**: Move API Gateway from private to public zone (edge deployment scenario).

### Changes
```javascript
// In initialComponents, find apigateway:
{
  id: 'apigateway',
  // ...
  position: { x: 250, y: 150 },  // Move to public zone (x < 350)
  zone: 'public',                 // Change from 'private'
  // ...
}
```

### Edit Process
```bash
Read src/data/components.js

Edit src/data/components.js
# 1. Change zone: 'private' → zone: 'public'
# 2. Update position.x to be < 350 (public zone)

npm run dev
# Verify API Gateway appears in left (blue) zone
# Check sidebar shows it under "Public / Internet"

git add src/data/components.js
git commit -m "Move API Gateway to public zone for edge deployment"
git push
```

---

## Example 7: Add Multiple Related Components at Once

**Scenario**: Add a complete microservices setup - Auth Service, User Service, and Notification Service.

### Components
```javascript
// Add all three to initialComponents array:

{
  id: 'auth-service',
  type: 'component',
  label: 'Auth Service',
  description: 'Authentication and authorization microservice using JWT',
  position: { x: 500, y: 250 },
  visible: true,
  zone: 'private',
  icon: '🔐'
},
{
  id: 'user-service',
  type: 'component',
  label: 'User Service',
  description: 'User profile management and account operations',
  position: { x: 600, y: 250 },
  visible: true,
  zone: 'private',
  icon: '👤'
},
{
  id: 'notification-service',
  type: 'component',
  label: 'Notification Service',
  description: 'Push notifications, SMS, and in-app messaging',
  position: { x: 550, y: 350 },
  visible: true,
  zone: 'private',
  icon: '🔔'
}
```

### Connections
```javascript
// Add to initialConnections array:

// API Gateway connects to all services
{ id: 'e20', source: 'apigateway', target: 'auth-service', animated: false },
{ id: 'e21', source: 'apigateway', target: 'user-service', animated: false },
{ id: 'e22', source: 'apigateway', target: 'notification-service', animated: false },

// Services connect to database
{ id: 'e23', source: 'auth-service', target: 'database-primary', animated: false },
{ id: 'e24', source: 'user-service', target: 'database-primary', animated: false },

// Notification service uses message queue
{ id: 'e25', source: 'notification-service', target: 'messagequeue', animated: true },

// User service calls notification service
{ id: 'e26', source: 'user-service', target: 'notification-service', animated: false }
```

### Full Process
```bash
Read src/data/components.js

Edit src/data/components.js
# 1. Add all 3 components to initialComponents
# 2. Add all 7 connections to initialConnections

npm run dev
# Verify all components and connections work

git add src/data/components.js
git commit -m "Add microservices architecture: auth, user, and notification services

Adds three new microservices with appropriate connections to API Gateway, database, and message queue.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

---

## Example 8: Update Component Details (Label, Icon, Description)

**Scenario**: Rebrand "Redis Cache" to "ElastiCache" with updated description.

### Changes
```javascript
// Find in initialComponents:
{
  id: 'cache',  // Keep ID the same!
  type: 'component',
  label: 'ElastiCache',  // Changed from 'Redis Cache'
  description: 'AWS ElastiCache for Redis - Managed in-memory data store and cache',  // Updated
  position: { x: 700, y: 150 },
  visible: true,
  zone: 'private',
  icon: '⚡'  // Changed from '💾'
}
```

### Edit Process
```bash
Read src/data/components.js

Edit src/data/components.js
# Update label, description, and icon
# DO NOT change the id!

npm run dev
# Verify new label shows in sidebar and canvas
# Check tooltip shows updated description

git add src/data/components.js
git commit -m "Update cache component to ElastiCache branding"
git push
```

---

## Example 9: Hide Components by Default

**Scenario**: Add optional monitoring components that are hidden by default.

### Components
```javascript
{
  id: 'prometheus',
  type: 'component',
  label: 'Prometheus',
  description: 'Metrics collection and time-series database',
  position: { x: 800, y: 500 },
  visible: false,  // ← Hidden by default
  zone: 'private',
  icon: '📊'
},
{
  id: 'grafana',
  type: 'component',
  label: 'Grafana',
  description: 'Metrics visualization and dashboarding',
  position: { x: 900, y: 500 },
  visible: false,  // ← Hidden by default
  zone: 'private',
  icon: '📈'
}
```

### Connections
```javascript
{ id: 'e27', source: 'prometheus', target: 'grafana', animated: false }
```

### Result
- Components appear in sidebar but unchecked
- Users can toggle them on to see monitoring stack
- Keeps default view cleaner

---

## Example 10: Complete Component Replacement

**Scenario**: Replace "Message Queue" with "Kafka" (different technology, same role).

### Step 1: Note existing connections
```bash
Read src/data/components.js
# Find all edges with source or target = 'messagequeue'
# You'll need to update these!
```

### Step 2: Remove old component
```javascript
// DELETE from initialComponents:
{
  id: 'messagequeue',
  // ...
}
```

### Step 3: Add new component
```javascript
// ADD to initialComponents:
{
  id: 'kafka',
  type: 'component',
  label: 'Apache Kafka',
  description: 'Distributed event streaming platform for high-throughput message processing',
  position: { x: 700, y: 450 },  // Same position as old queue
  visible: true,
  zone: 'private',
  icon: '📨'
}
```

### Step 4: Update all connections
```javascript
// Find and UPDATE in initialConnections:
// OLD:
{ id: 'e10', source: 'appserver1', target: 'messagequeue', animated: false },
{ id: 'e11', source: 'appserver2', target: 'messagequeue', animated: false },

// NEW:
{ id: 'e10', source: 'appserver1', target: 'kafka', animated: false },
{ id: 'e11', source: 'appserver2', target: 'kafka', animated: false },
```

### Full Process
```bash
Read src/data/components.js

Edit src/data/components.js
# 1. Remove messagequeue component
# 2. Add kafka component
# 3. Update all connections from 'messagequeue' to 'kafka'

npm run dev
# Test thoroughly - check all connections work

git add src/data/components.js
git commit -m "Replace message queue with Apache Kafka

Migrated from generic message queue to Apache Kafka for better event streaming capabilities.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

---

## Testing Checklist

After ANY component change, verify:

- [ ] Component appears on canvas in correct position
- [ ] Component appears in sidebar under correct zone
- [ ] Icon displays correctly
- [ ] Label is readable
- [ ] Tooltip shows on hover with correct description
- [ ] Checkbox toggles visibility on/off
- [ ] All connections render correctly
- [ ] No broken/dangling connection lines
- [ ] Drag and drop works
- [ ] Build succeeds: `npm run build`
- [ ] Dev server runs without errors

---

## Common Patterns

### Pattern: Public → Private Flow
```javascript
// Internet traffic flow
{ id: 'e1', source: 'cdn', target: 'loadbalancer', animated: false },
{ id: 'e2', source: 'loadbalancer', target: 'apigateway', animated: false },
```

### Pattern: Service → Database
```javascript
{ id: 'eX', source: 'service-name', target: 'database-primary', animated: false }
```

### Pattern: Async Processing
```javascript
{ id: 'eX', source: 'service-name', target: 'messagequeue', animated: true }  // animated!
```

### Pattern: Caching Layer
```javascript
{ id: 'eX', source: 'app-server', target: 'cache', animated: false },
{ id: 'eY', source: 'cache', target: 'database-primary', animated: false }  // cache miss
```

---

For more details, see `.claude/MAINTENANCE.md`
