import React from 'react';

const Freezer = ({ x, y, size, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        fontSize: `${size}rem`,
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
      }}
    >
      ❄️ {/* Freezer (snowflake) emoji */}
    </div>
  );
};

export default Freezer;
