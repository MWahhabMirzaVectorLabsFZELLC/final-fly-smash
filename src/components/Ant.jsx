import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Fly = ({ x, y, onClick }) => {
  const [splashVisible, setSplashVisible] = useState(false);

  const playSound = () => {
    const audio = new Audio("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav");
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 100);
  };

  const handleClick = () => {
    playSound();
    onClick();

    // Show the splash animation
    setSplashVisible(true);

    // Hide the splash animation after 500ms
    setTimeout(() => setSplashVisible(false), 500);
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
        transform: "rotate(180deg)",
        width: "70px",
        height: "70px",
      }}
    >
      {/* Fly animation */}
      <DotLottieReact
        src="https://lottie.host/0a9ff839-baf7-493c-955b-a300b9b8990c/3rt0G6Lr48.json"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />

      {/* Water splash animation on click */}
      {splashVisible && (
        <div
          style={{
            position: "absolute",
            top: "-25px", // Adjust positioning for visual effect
            left: "-25px",
            width: "120px",
            height: "120px",
            pointerEvents: "none", // Ensure clicks pass through to the Fly component
          }}
        >
          <DotLottieReact
            src="https://lottie.host/5d49e017-6b3f-4412-b267-2e4b51ef840a/B47kEBOvrs.json" // Replace with actual water splash animation URL
            autoplay
            loop={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default Fly;
