import React, { useState } from 'react';
import PresetSelector from './PresetSelector';
import { iconMap } from './icons';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 uppercase mb-2 hover:text-gray-800 transition-colors"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && children}
    </div>
  );
};

const ToggleSidebar = ({ components, onToggle, onShowAll, onHideAll, currentPreset, onPresetChange }) => {
  const publicComponents = components.filter(c => c.zone === 'public');
  const privateComponents = components.filter(c => c.zone === 'private');
  const isDedicatedSaas = currentPreset === 'dedicated-saas';

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
        icon: 'server',
        components: allComponents,
        allVisible,
        someVisible
      };
    });
  };

  const handleCompanyToggle = (companyGroup) => {
    const newState = !companyGroup.allVisible;
    companyGroup.components.forEach(component => {
      if (component.visible !== newState) {
        onToggle(component.id);
      }
    });
  };

  const renderComponentList = (componentList) => {
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
      <div className="space-y-1">
        {filteredList.map((component) => (
          <label
            key={component.id}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={component.visible}
              onChange={() => onToggle(component.id)}
              className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            {iconMap[component.icon]
              ? React.createElement(iconMap[component.icon], { size: 18, className: 'text-gray-500 shrink-0' })
              : <span className="text-lg">{component.icon}</span>
            }
            <span className="text-xs font-medium text-gray-700 truncate">{component.label}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderCompanyGroups = () => {
    const companyGroups = getCompanyGroups();
    if (!companyGroups) return null;

    return (
      <CollapsibleSection title="Companies">
        <div className="space-y-1">
          {companyGroups.map((group) => (
            <label
              key={group.id}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={group.allVisible}
                ref={el => {
                  if (el) el.indeterminate = group.someVisible && !group.allVisible;
                }}
                onChange={() => handleCompanyToggle(group)}
                className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              {iconMap[group.icon]
                ? React.createElement(iconMap[group.icon], { size: 18, className: 'text-gray-500 shrink-0' })
                : <span className="text-lg">{group.icon}</span>
              }
              <span className="text-xs font-medium text-gray-700">{group.label}</span>
              <span className="text-[10px] text-gray-400 ml-auto">
                {group.components.filter(c => c.visible).length}/{group.components.length}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    );
  };

  const visibleCount = components.filter(c => c.visible).length;

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto flex flex-col">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">Airia</h2>
        <p className="text-xs text-gray-500 mt-0.5">Architecture Diagram</p>
      </div>

      <PresetSelector currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Components
          <span className="text-xs text-gray-400 font-normal ml-1.5">
            {visibleCount}/{components.length}
          </span>
        </h3>
        <div className="flex gap-1">
          <button
            onClick={onShowAll}
            className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            All
          </button>
          <button
            onClick={onHideAll}
            className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            None
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {isDedicatedSaas && renderCompanyGroups()}
        <CollapsibleSection title="Public / Internet">
          {renderComponentList(publicComponents)}
        </CollapsibleSection>
        <CollapsibleSection title="Private Network">
          {renderComponentList(privateComponents)}
        </CollapsibleSection>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Toggle components to show or hide. Click a node on the canvas to trace its downstream connections.
        </p>
      </div>
    </div>
  );
};

export default ToggleSidebar;
