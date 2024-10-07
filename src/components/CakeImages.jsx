import React from "react";
import "../App.css";
import cake1 from "../assets/cake1.png";
import cake2 from "../assets/cake2.png";
import cake3 from "../assets/cake3.png";
import cake4 from "../assets/cake4.png";
import cake5 from "../assets/cake5.png";
import cake6 from "../assets/cake6.png";

const CakeImages = () => {
    
  const cakeImages = [cake1, cake2, cake3, cake4, cake5, cake6];

  return (
    <div className="cake-images-container">
      {cakeImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Cake ${index + 1}`}
          className="cake-image"
        />
      ))}
    </div>
  );
};

export default CakeImages;
