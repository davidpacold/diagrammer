import React from 'react';
import { presetList } from '../data/presets';

const PresetSelector = ({ currentPreset, onPresetChange }) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
        Deployment Type
      </h3>

      <div className="space-y-2">
        {presetList.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentPreset === preset.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
            }`}
          >
            <div className="font-semibold text-sm">{preset.name}</div>
            <div className={`text-xs mt-1 ${
              currentPreset === preset.id ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {preset.description}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500 italic">
        Select a preset to load best-practice configuration
      </div>
    </div>
  );
};

export default PresetSelector;
