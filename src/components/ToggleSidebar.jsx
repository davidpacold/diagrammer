import React from 'react';
import PresetSelector from './PresetSelector';

const ToggleSidebar = ({ components, onToggle, currentPreset, onPresetChange }) => {
  // Group components by zone
  const publicComponents = components.filter(c => c.zone === 'public');
  const privateComponents = components.filter(c => c.zone === 'private');

  // Check if we're in dedicated-saas mode
  const isDedicatedSaas = currentPreset === 'dedicated-saas';

  // For dedicated-saas, group company components
  const getCompanyGroups = () => {
    if (!isDedicatedSaas) return null;

    const companies = ['a', 'b', 'c'];
    return companies.map(company => {
      const companyId = company.toUpperCase();
      const userComponent = components.find(c => c.id === `company-${company}-users`);
      const cdnComponent = components.find(c => c.id === `cdn-company-${company}`);
      const platformComponent = components.find(c => c.id === `airia-platform-company-${company}`);

      const allComponents = [userComponent, cdnComponent, platformComponent].filter(Boolean);
      const allVisible = allComponents.every(c => c.visible);
      const someVisible = allComponents.some(c => c.visible);

      return {
        id: `company-${company}`,
        label: `Company ${companyId}`,
        icon: '🏢',
        components: allComponents,
        allVisible,
        someVisible
      };
    });
  };

  const handleCompanyToggle = (companyGroup) => {
    // Toggle all components in the group to match the opposite of current state
    const newState = !companyGroup.allVisible;
    companyGroup.components.forEach(component => {
      if (component.visible !== newState) {
        onToggle(component.id);
      }
    });
  };

  const renderComponentList = (componentList, title) => {
    // Filter out company components if in dedicated-saas mode
    let filteredList = componentList;
    if (isDedicatedSaas) {
      filteredList = componentList.filter(c =>
        !c.id.includes('company-a-users') &&
        !c.id.includes('company-b-users') &&
        !c.id.includes('company-c-users') &&
        !c.id.includes('cdn-company-') &&
        !c.id.includes('airia-platform-company-')
      );
    }

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{title}</h3>
        <div className="space-y-2">
          {filteredList.map((component) => (
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
  };

  const renderCompanyGroups = () => {
    const companyGroups = getCompanyGroups();
    if (!companyGroups) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Companies</h3>
        <div className="space-y-2">
          {companyGroups.map((group) => (
            <label
              key={group.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={group.allVisible}
                ref={el => {
                  if (el) el.indeterminate = group.someVisible && !group.allVisible;
                }}
                onChange={() => handleCompanyToggle(group)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xl">{group.icon}</span>
              <span className="text-sm font-medium text-gray-800">{group.label}</span>
              <span className="text-xs text-gray-500 ml-auto">
                ({group.components.filter(c => c.visible).length}/{group.components.length})
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Architecture Diagram</h2>

      <PresetSelector currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Components</h3>

      {isDedicatedSaas && renderCompanyGroups()}
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
