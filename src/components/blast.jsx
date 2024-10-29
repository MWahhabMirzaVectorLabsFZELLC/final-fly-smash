import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const blast = ({ x, y, size, onClick, playSound }) => {
  const handleClick = () => {
    playSound("/src/assets/mixkit-8-bit-bomb-explosion-2811.wav"); // Play sound on bomb click
    onClick(); // Call the onClick handler passed from GamePage
  };

  return (
    <div
      onClick={handleClick} // Use the new handleClick function
      style={{
        position: 'absolute',
        top: y,
        left: x,
        fontSize: `${size}rem`,
        cursor: 'pointer',
        transition: 'opacity 0.5s ease',
        width: "100px",
        height: "100px", 
      }}
    >
      <DotLottieReact
        src="https://lottie.host/e0959b7c-cfca-441e-84d9-3c4fa3867816/wzqocU57UW.json" 
        loop
        autoplay
        style={{ width: "100%", height: "100%" }} // Make Lottie animation take full size of the div
      />
    </div>
  );
};

export default blast;
