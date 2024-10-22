import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Fly = ({ x, y, onClick }) => {
  const playSound = () => {
    const audio = new Audio("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav"); // Path to your sound file
    audio.play();
    setTimeout(() => {
      audio.pause(); // Ensure sound does not play longer than 1 second
      audio.currentTime = 0; // Reset sound position
    }, 100); // 1 second duration
  };

  const handleClick = () => {
    playSound(); // Play sound when the fly is clicked
    onClick(); // Call the onClick handler passed from the parent
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: y,
        left: x,
        cursor: "pointer",
        transition: "opacity 0.2s ease",
        transform: "rotate(180deg)", // Rotate the entire container 180 degrees
        width: "50px", // Set a fixed width for the fly
        height: "50px", // Set a fixed height for the fly
      }}
    >
      {/* Use dotLottiePlayer for the fly animation */}
      <DotLottieReact
        src="https://lottie.host/0a9ff839-baf7-493c-955b-a300b9b8990c/3rt0G6Lr48.json"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }} // The animation will fill the container
      />
    </div>
  );
};

export default Fly;
