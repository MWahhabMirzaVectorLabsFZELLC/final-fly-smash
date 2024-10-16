import React from 'react';
import axios from 'axios';
import "../App.css";

const GameHeader = ({ score, handleLogout }) => {
  const username = localStorage.getItem("username");

  const updateScore = async () => {
    try {
      const response = await axios.post("https://flysmash-server.vercel.app/api/update-score", {
        username, // Make sure this matches the username stored in your database
        score, // Send the current score
      });
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
    <div className="game-header d-flex justify-content-between align-items-center p-3 bg-none text-white" style={{ width: '100vw', position: 'absolute', top: 0 }}>
      <div className="score-display">
        <h3 className='heading'>Score: {score}</h3>
      </div>
      <div className="time-left-display">
        {/* <h3 className='heading'>Time Left: {timeLeft} s</h3> */}
      </div>
    </div>
  );
};

export default GameHeader;
