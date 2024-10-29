import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon from react-icons

const COOLDOWN_TIME = 5 * 60 * 1000; // 15 minutes in milliseconds

const CooldownTimer = ({ cooldownStart, onCooldownEnd, onInvite, onClose }) => {
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(COOLDOWN_TIME);

  useEffect(() => {
    const interval = setInterval(() => {
      const timePassed = Date.now() - cooldownStart;
      const timeRemaining = COOLDOWN_TIME - timePassed;

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setCooldownTimeLeft(0);
        onCooldownEnd(); // Notify parent that cooldown is over
      } else {
        setCooldownTimeLeft(timeRemaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownStart, onCooldownEnd]);

  // Format time in mm:ss
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Inline styles for the modal content
  const modalContentStyle = {
    top: "50%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)", // Adjust for centering
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    width: "90%", // Make modal responsive to screen size
    maxWidth: "300px", // Max width for larger screens
    textAlign: "center", // Center align text
    position: "fixed", // Fixed position to keep modal in view
    zIndex: 1000, // Ensure it's on top
  };

  // Inline styles for the close icon
  const closeIconStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    color: "#333", // Change color if needed
  };

  return (
    <div style={modalContentStyle}>
      <FaTimes style={closeIconStyle} onClick={onClose} /> {/* Close icon */}
      <p>
        You have played 5 games. Please wait for {formatTime(cooldownTimeLeft)}{" "}
        to play{" "}
      </p>
      <button
        onClick={onInvite}
        className="btn btn-primary"
        style={{ marginTop: "20px", marginBottom: "0px" }}
      >
        Invite Friends
      </button>
    </div>
  );
};

export default CooldownTimer;
