import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import GiftBox from "./GiftBox";
import scoreicon from "../assets/Scoreicon.png";
import heart from "../assets/heart.png";

const GameHeader = ({ score, handleLogout, lives, showgift }) => {
  // const [lives, setLives] = useState(3);

  const username = localStorage.getItem("username");

  const updateScore = async () => {
    try {
      const response = await axios.post(
        "https://flysmash-server.vercel.app/api/update-score",
        {
          username, // Make sure this matches the username stored in your database
          score, // Send the current score
        }
      );
      console.log("Score updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating score in backend:", error.response.data);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      updateScore(); // Update score every 5 seconds
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [score]); // Add score as a dependency to ensure the latest score is sent

  return (
    <div className="game-header d-flex justify-content-between align-items-center p-3 bg-none text-white">
      <div className="score-display">
        <img src={scoreicon} alt="" className="heading" /> <span>{score}</span>
      </div>
      <GiftBox />
      <div className="lives-left-display">
        {[...Array(lives)].map((_, i) => (
          <img key={i} src={heart} className="lives-img" alt="heart" />
        ))}
        {/* <img src={heart}  className="lives-img" alt="heart" />
       <img src={heart} className="lives-img"  alt="heart" />
       <img src={heart} className="lives-img"  alt="heart" /> */}
      </div>
    </div>
  );
};

export default GameHeader;
