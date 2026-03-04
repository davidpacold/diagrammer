import React, { useState, useId } from 'react';
import PresetSelector from './PresetSelector';
import { iconMap } from './icons';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 uppercase mb-2 hover:text-gray-800 transition-colors"
      >
        {title}
        <svg
          aria-hidden="true"
          className={`w-4 h-4 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div id={sectionId}>{children}</div>}
    </div>
  );
};

const ToggleSidebar = ({ components, onToggle, onShowAll, onHideAll, currentPreset, onPresetChange, onCopyLink, linkCopied, componentGroups = [] }) => {
  const publicComponents = components.filter(c => c.zone === 'public');
  const privateComponents = components.filter(c => c.zone === 'private');

  // Build set of component IDs that belong to any group (excluded from zone lists)
  const groupedComponentIds = new Set(componentGroups.flatMap(g => g.componentIds));

  const resolveGroups = () => {
    if (componentGroups.length === 0) return null;

    return componentGroups.map(group => {
      const groupComponents = group.componentIds
        .map(id => components.find(c => c.id === id))
        .filter(Boolean);
      const allVisible = groupComponents.every(c => c.visible);
      const someVisible = groupComponents.some(c => c.visible);

      return { ...group, components: groupComponents, allVisible, someVisible };
    });
  };

  const handleGroupToggle = (group) => {
    const newState = !group.allVisible;
    group.components.forEach(component => {
      if (component.visible !== newState) {
        onToggle(component.id);
      }
    });
  };

  const renderComponentList = (componentList) => {
    const filteredList = componentList.filter(c => !groupedComponentIds.has(c.id));

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

  const renderComponentGroups = () => {
    const groups = resolveGroups();
    if (!groups) return null;

    return (
      <CollapsibleSection title="Groups">
        <div className="space-y-1">
          {groups.map((group) => (
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
                onChange={() => handleGroupToggle(group)}
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
            aria-label="Show all components"
            className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            All
          </button>
          <button
            onClick={onHideAll}
            aria-label="Hide all components"
            className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            None
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {componentGroups.length > 0 && renderComponentGroups()}
        <CollapsibleSection title="Public / Internet">
          {renderComponentList(publicComponents)}
        </CollapsibleSection>
        <CollapsibleSection title="Private Network">
          {renderComponentList(privateComponents)}
        </CollapsibleSection>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
        {onCopyLink && (
          <button
            onClick={onCopyLink}
            className="w-full text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            {linkCopied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Share this view
              </>
            )}
          </button>
        )}
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Toggle components to show or hide. Click a node to trace connections.
        </p>
      </div>
    </div>
  );
};

export default ToggleSidebar;
