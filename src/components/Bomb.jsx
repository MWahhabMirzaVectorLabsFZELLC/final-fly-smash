import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Bomb = ({ x, y, size, onClick, playSound }) => {
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
        transition: 'opacity 0.2s ease',
        width: "40px",
        height: "40px", 
      }}
    >
      <DotLottieReact
        src="https://lottie.host/9d7d4026-8dd6-48bc-aead-eeeaf99b5fb9/3tseaZCb74.json" 
        loop
        autoplay
        style={{ width: "100%", height: "100%" }} // Make Lottie animation take full size of the div
      />
    </div>
  );
};

export default Bomb;
