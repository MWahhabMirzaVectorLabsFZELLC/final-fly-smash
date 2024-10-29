import React from "react";
import Lottie from "lottie-react";
import bombsmash from '../json/bombsmasheffect.json'

const BombSmash = ({x, y}) => {
    return(
        <div
        style={{
          position: "absolute",
          top: y,
          left: x,
          cursor: "pointer",
          transition: "opacity 0.2s ease",
        //   transform: "rotate(180deg)", // Rotate the entire container 180 degrees
          width: "50px", // Set a fixed width for the bee smash
          height: "50px", // Set a fixed height for the bee smash
        }}
      >
        {/* Use dotLottiePlayer for the fly animation */}
        <Lottie
          animationData={bombsmash}
          // loop
          // autoplay
          style={{ width: "100%", height: "100%" }} // The animation will fill the container
        />
      </div>
    );
};

export default BombSmash;