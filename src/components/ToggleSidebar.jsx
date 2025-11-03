import React from 'react';

const ToggleSidebar = ({ components, onToggle }) => {
  // Group components by zone
  const publicComponents = components.filter(c => c.zone === 'public');
  const privateComponents = components.filter(c => c.zone === 'private');

  const renderComponentList = (componentList, title) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{title}</h3>
      <div className="space-y-2">
        {componentList.map((component) => (
          <label
            key={component.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={component.visible}
              onChange={() => onToggle(component.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xl">{component.icon}</span>
            <span className="text-sm font-medium text-gray-800">{component.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Components</h2>

      {renderComponentList(publicComponents, 'Public / Internet')}
      {renderComponentList(privateComponents, 'Private Network')}

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Toggle components to show/hide them on the diagram. Drag components to reposition.
        </p>
      </div>
    </div>
  );
};

export default ToggleSidebar;
