import React from "react";

const PointsMessage = ({ pointsMessage }) => {
  // Log the pointsMessage to the console for debugging
  console.log(pointsMessage);

  return (
    <div
      className="text-center"
      style={{
        fontSize: "2rem",
        fontWeight: "1000",
        color: "#ffc00",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {pointsMessage}
    </div>
  );
};

export default PointsMessage;
