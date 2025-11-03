import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import DiagramCanvas from './components/DiagramCanvas';
import ToggleSidebar from './components/ToggleSidebar';
import { initialComponents, initialConnections } from './data/components';

function App() {
  const [components, setComponents] = useState(initialComponents);

  // Convert components to React Flow nodes
  const nodes = useMemo(() => {
    return components
      .filter(c => c.visible)
      .map(c => ({
        id: c.id,
        type: 'component',
        position: c.position,
        data: {
          label: c.label,
          description: c.description,
          icon: c.icon,
          zone: c.zone,
        },
      }));
  }, [components]);

  // Filter edges to only show those between visible nodes
  const edges = useMemo(() => {
    const visibleIds = new Set(components.filter(c => c.visible).map(c => c.id));
    return initialConnections.filter(
      edge => visibleIds.has(edge.source) && visibleIds.has(edge.target)
    );
  }, [components]);

  // Handle node position changes (drag)
  const onNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        setComponents(prev =>
          prev.map(c =>
            c.id === change.id
              ? { ...c, position: change.position }
              : c
          )
        );
      }
    });
  }, []);

  // Handle edge changes (if needed)
  const onEdgesChange = useCallback((changes) => {
    // For now, we're not handling edge changes
    // This could be extended to support custom connections
  }, []);

  // Toggle component visibility
  const handleToggle = useCallback((id) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, visible: !c.visible } : c
      )
    );
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen">
        <ToggleSidebar components={components} onToggle={handleToggle} />
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
