# Architecture Diagram Tool

An interactive system architecture diagram tool built with React and Cloudflare Pages. Toggle component visibility, drag elements, and explore system architecture with an intuitive split-view interface showing public (Internet) and private network zones.

## Features

- 🎯 **Deployment Presets**: Choose from 3 pre-configured architectures (Shared SaaS, Dedicated SaaS, Customer Hosted)
- 🎛️ **Toggle Visibility**: Show/hide architectural components via sidebar checkboxes
- 🖱️ **Drag & Drop**: Reposition components on the canvas
- 📊 **Split View**: Visual separation between public (Internet) and private network zones
- 💬 **Tooltips**: Hover over components to see detailed descriptions
- ⚡ **Fast & Responsive**: Built with Vite and React Flow
- 🌐 **Cloudflare Hosted**: Deployed on Cloudflare Pages for global performance

## Deployment Presets

Choose from three pre-configured best-practice architectures:

### 1. Shared SaaS
Multi-tenant shared infrastructure optimized for cost-efficiency. All customers share:
- Single load balancer and API gateway
- Shared application server pool
- Multi-tenant database with row-level security
- Shared cache and storage with namespace isolation

**Best for**: Early-stage SaaS, cost-sensitive deployments

### 2. Dedicated SaaS (Default)
Single-tenant dedicated infrastructure with isolated resources per customer:
- Dedicated load balancer and API gateway
- Multiple dedicated application servers
- Dedicated database with read replica
- Dedicated cache, queue, and storage
- Customer-specific monitoring

**Best for**: Enterprise SaaS, compliance requirements, performance-sensitive workloads

### 3. Customer Hosted
On-premises or customer VPC deployment with full customer control:
- VPN gateway and firewall
- Customer-managed load balancer
- 3+ application servers
- Customer-managed database cluster with backup
- Self-hosted monitoring and backup systems
- Local storage infrastructure

**Best for**: Banking/healthcare, air-gapped environments, data sovereignty requirements

## Components Included

Components vary by deployment preset. See the preset selector in the app for specific details.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd diagrammer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Development

### Project Structure

```
diagrammer/
├── src/
│   ├── components/
│   │   ├── ComponentNode.jsx    # Custom node component
│   │   ├── DiagramCanvas.jsx    # Main canvas with React Flow
│   │   └── ToggleSidebar.jsx    # Sidebar with toggle controls
│   ├── data/
│   │   └── components.js        # Component definitions
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD for Cloudflare Pages
├── package.json
├── vite.config.js
├── tailwind.config.js
└── wrangler.toml               # Cloudflare configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Cloudflare Pages

## Deployment

### Cloudflare Pages

#### Automatic Deployment (Recommended)

The project includes a GitHub Action that automatically deploys to Cloudflare Pages on pushes to the `main` branch.

**Setup:**

1. Create a Cloudflare Pages project named `architecture-diagram`
2. Add the following secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

3. Push to `main` branch - deployment happens automatically!

#### Manual Deployment

```bash
npm run build
npx wrangler pages deploy dist
```

## Customization

### Adding New Components

Edit `src/data/components.js`:

```javascript
{
  id: 'my-component',
  type: 'component',
  label: 'My Component',
  description: 'Description for tooltip',
  position: { x: 100, y: 100 },
  visible: true,
  zone: 'public', // or 'private'
  icon: '🎯'
}
```

### Adding Connections

Edit `src/data/components.js`:

```javascript
{
  id: 'e1',
  source: 'component-a',
  target: 'component-b',
  animated: false
}
```

### Styling

- Modify `tailwind.config.js` for Tailwind customization
- Edit component styles in individual `.jsx` files
- Update background colors in `DiagramCanvas.jsx` for zone styling

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Flow** - Diagram and node-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Cloudflare Pages** - Hosting and deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Roadmap

- [ ] Export diagram as PNG/SVG
- [ ] Save/load diagram configurations
- [ ] User-editable components
- [ ] Multiple diagram templates
- [ ] Custom theming
- [ ] Zoom and pan controls
- [ ] Component search/filter

---

Built with ❤️ using React and Cloudflare
