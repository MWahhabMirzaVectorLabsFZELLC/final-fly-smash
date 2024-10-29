import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Blast from './blast'; // Import the Blast component

const Bomb = ({ x, y, size, onClick, playSound }) => {
  const [exploded, setExploded] = useState(false); // Local state to manage explosion

  const patjana = () => {
    setExploded(true); // Set exploded to true to show blast animation
    // Reset back to the bomb after the explosion animation completes
    setTimeout(() => {
      setExploded(false);
    }, 1000); // Adjust the delay to match the length of the explosion animation
  };

  const handleClick = () => {
    playSound("/src/assets/mixkit-8-bit-bomb-explosion-2811.wav"); // Play sound on bomb click
    onClick(); // Call the onClick handler passed from GamePage (if needed here)
    patjana(); // Call the patjana function to show blast animation
  };

  return (
    <div
    onClick={handleClick}
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
      {exploded ? ( // Conditional rendering based on exploded state
        <Blast /> // Render the Blast component
      ) : (
        <DotLottieReact
          src="https://lottie.host/9d7d4026-8dd6-48bc-aead-eeeaf99b5fb9/3tseaZCb74.json" // Bomb animation
          loop
          autoplay
          style={{ width: "100%", height: "100%" }} // Make Lottie animation take full size of the div
        />
      )}
    </div>
  );
};

export default Bomb;
