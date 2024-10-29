import React from "react";
import gift from '../json/gift.json';
import Lottie from "lottie-react";

const Gift =() =>{
    return(
        <div
        style={{
          position: "absolute",
          cursor: "pointer",
          transition: "opacity 0.2s",
          width: "102px",
          height: "104px",
        //   left: x,
        //   top: y,
        }}
      >
        {/* Use dotLottiePlayer for the fly animation */}
        <Lottie
          animationData={gift}
          // loop
          // autoplay
          style={{ width: "100%", height: "100%" }} // The animation will fill the container
        />
      </div>
    )
}

export default Gift;