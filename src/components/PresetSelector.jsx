import React from 'react';
import { presetList } from '../data/presets';

const PresetSelector = ({ currentPreset, onPresetChange }) => {
  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Deployment
      </h3>
      <div className="flex gap-1">
        {presetList.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            title={preset.description}
            className={`flex-1 text-center px-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
              currentPreset === preset.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;
