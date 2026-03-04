import React, { useState, useId } from 'react';

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={content ? id : undefined}
    >
      {children}
      {visible && content && (
        <div
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-[220px] z-50 pointer-events-none leading-relaxed"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
