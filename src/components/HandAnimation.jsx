import React from "react";
import Lottie from "lottie-react";
import hand from '../json/hand_anim.json'

const HandAnimation = ({x, y}) => {
    return(
        <div
        style={{
            position: "absolute",
            cursor: "pointer",
            transition: "opacity 0.2s",
            width: "25rem",
            height: "25rem",
            top: "30rem",
            left: "-4rem",
        }}
      >
        {/* Use dotLottiePlayer for the fly animation */}
        <Lottie
          animationData={hand}
          // loop
          // autoplay
          style={{ width: "100%", height: "100%" }} // The animation will fill the container
        />
      </div>
    );
};

export default HandAnimation;