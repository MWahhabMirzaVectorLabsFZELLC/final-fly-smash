import React from "react";
import Lottie from "lottie-react";
import giftbox from '../json/mysterybox.json'

const GiftBox = () => {
    return(
        <div
        style={{
          position: "absolute",
          cursor: "pointer",
          transition: "opacity 0.2s",
          width: "102px",
          height: "104px",
          left: "9rem",
          top: "-1.5rem",
        }}
      >
        {/* Use dotLottiePlayer for the fly animation */}
        <Lottie
          animationData={giftbox}
          // loop
          // autoplay
          style={{ width: "100%", height: "100%" }} // The animation will fill the container
        />
      </div>
    );
};

export default GiftBox;