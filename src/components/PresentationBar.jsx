import React from 'react';

const PresentationBar = ({ scene, sceneIndex, totalScenes, onPrev, onNext, onExit }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Prev button */}
        <button
          onClick={onPrev}
          disabled={sceneIndex === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scene content */}
        <div className="flex-1 text-center">
          <div className="text-sm font-bold text-gray-800">{scene.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{scene.description}</div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={sceneIndex === totalScenes - 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next scene"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scene counter + exit */}
        <div className="flex items-center gap-3 ml-2">
          <span className="text-xs text-gray-400 font-medium">
            {sceneIndex + 1}/{totalScenes}
          </span>
          <button
            onClick={onExit}
            className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationBar;
