import React, { useState, useId } from 'react';
import PresetSelector from './PresetSelector';
import { iconMap } from './icons';

const CollapsibleSection = ({ title, count, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex items-center justify-between w-full text-[10px] font-semibold text-gray-400 uppercase tracking-wider py-1.5 hover:text-gray-600 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <svg
            aria-hidden="true"
            className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : 'rotate-0'}`}
            fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          {title}
        </span>
        {count !== undefined && (
          <span className="text-[9px] text-gray-300 font-normal">{count}</span>
        )}
      </button>
      {open && <div id={sectionId} className="pb-1">{children}</div>}
    </div>
  );
};

const ComponentRow = ({ component, onToggle, compact }) => (
  <label
    className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group"
  >
    <input
      type="checkbox"
      checked={component.visible}
      onChange={() => onToggle(component.id)}
      className="w-3 h-3 text-indigo-600 rounded border-gray-300 focus:ring-1 focus:ring-indigo-500"
    />
    {!compact && iconMap[component.icon] && React.createElement(iconMap[component.icon], {
      size: 14,
      className: `shrink-0 ${component.visible ? 'text-gray-500' : 'text-gray-300'}`,
    })}
    <span className={`text-[11px] truncate ${component.visible ? 'text-gray-700' : 'text-gray-400'}`}>
      {component.label}
    </span>
  </label>
);

const GroupRow = ({ group, onToggle }) => (
  <label
    className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
  >
    <input
      type="checkbox"
      checked={group.allVisible}
      ref={el => { if (el) el.indeterminate = group.someVisible && !group.allVisible; }}
      onChange={() => onToggle(group)}
      className="w-3 h-3 text-indigo-600 rounded border-gray-300 focus:ring-1 focus:ring-indigo-500"
    />
    {iconMap[group.icon] && React.createElement(iconMap[group.icon], {
      size: 14,
      className: 'text-gray-500 shrink-0',
    })}
    <span className="text-[11px] text-gray-700 truncate">{group.label}</span>
    <span className="text-[9px] text-gray-300 ml-auto">
      {group.components.filter(c => c.visible).length}/{group.components.length}
    </span>
  </label>
);

const ToggleSidebar = ({ components, onToggle, onToggleMany, onShowAll, onHideAll, currentPreset, onPresetChange, onCopyLink, linkCopied, componentGroups = [] }) => {
  const publicComponents = components.filter(c => c.zone === 'public');
  const privateComponents = components.filter(c => c.zone === 'private');

  const groupedComponentIds = new Set(componentGroups.flatMap(g => g.componentIds));

  const resolveGroups = () => {
    if (componentGroups.length === 0) return null;
    return componentGroups.map(group => {
      const groupComponents = group.componentIds
        .map(id => components.find(c => c.id === id))
        .filter(Boolean);
      return {
        ...group,
        components: groupComponents,
        allVisible: groupComponents.every(c => c.visible),
        someVisible: groupComponents.some(c => c.visible),
      };
    });
  };

  const handleGroupToggle = (group) => {
    const newState = !group.allVisible;
    const idsToToggle = group.components
      .filter(c => c.visible !== newState)
      .map(c => c.id);
    if (idsToToggle.length > 0) onToggleMany(idsToToggle, newState);
  };

  const filteredPublic = publicComponents.filter(c => !groupedComponentIds.has(c.id));
  const filteredPrivate = privateComponents.filter(c => !groupedComponentIds.has(c.id));
  const visibleCount = components.filter(c => c.visible).length;
  const groups = resolveGroups();

  return (
    <div className="w-56 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">Airia Architecture</h2>
        </div>
        <PresetSelector currentPreset={currentPreset} onPresetChange={onPresetChange} />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Components
            <span className="text-gray-300 font-normal ml-1">{visibleCount}/{components.length}</span>
          </span>
          <div className="flex gap-0.5">
            <button
              onClick={onShowAll}
              aria-label="Show all components"
              className="text-[10px] px-1.5 py-0.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              All
            </button>
            <button
              onClick={onHideAll}
              aria-label="Hide all components"
              className="text-[10px] px-1.5 py-0.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              None
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable component list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3">
        {groups && (
          <CollapsibleSection
            title="Tenants"
            count={groups.reduce((n, g) => n + g.components.filter(c => c.visible).length, 0)}
          >
            {groups.map(group => (
              <GroupRow key={group.id} group={group} onToggle={handleGroupToggle} />
            ))}
          </CollapsibleSection>
        )}

        <CollapsibleSection
          title="Public"
          count={`${filteredPublic.filter(c => c.visible).length}/${filteredPublic.length}`}
        >
          {filteredPublic.map(c => (
            <ComponentRow key={c.id} component={c} onToggle={onToggle} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Private"
          count={`${filteredPrivate.filter(c => c.visible).length}/${filteredPrivate.length}`}
          defaultOpen={filteredPrivate.some(c => c.visible)}
        >
          {filteredPrivate.map(c => (
            <ComponentRow key={c.id} component={c} onToggle={onToggle} />
          ))}
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100">
        {onCopyLink && (
          <button
            onClick={onCopyLink}
            className="w-full text-[11px] px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md transition-colors flex items-center justify-center gap-1"
          >
            {linkCopied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Share view
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ToggleSidebar;
