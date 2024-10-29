import React, { useEffect, useRef } from "react";
import axios from "axios";
import "../App.css";
import GiftBox from "./GiftBox";
import scoreicon from "../assets/Scoreicon.png";
import heart from "../assets/heart.png";

const GameHeader = ({ score, handleLogout, lives = 3, showgift }) => {
  const username = localStorage.getItem("username");
  const previousScoreRef = useRef(score); // Track previous score to detect changes

  const updateScore = async () => {
    try {
      const response = await axios.post(
        "https://flysmash-server.vercel.app/api/update-score",
        {
          username,
          score,
        }
      );
      console.log("Score updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating score in backend:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    // Only update if score has changed
    if (score !== previousScoreRef.current) {
      updateScore();
      previousScoreRef.current = score;
    }
  }, [score]); // Run only when `score` changes

  const validLives = Math.max(0, parseInt(lives) || 0);

  return (
    <div className="game-header d-flex justify-content-between align-items-center p-3 bg-none text-white">
      <div className="score-display">
        <img src={scoreicon} alt="" className="heading" /> <span>{score}</span>
      </div>
      <GiftBox />
      <div className="lives-left-display">
        {[...Array(validLives)].map((_, i) => (
          <img key={i} src={heart} className="lives-img" alt="heart" />
        ))}
      </div>
    </div>
  );
};

export default GameHeader;
