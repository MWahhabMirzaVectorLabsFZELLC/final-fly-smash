import React, { useState, useEffect } from "react";
import { FaSpinner, FaUser, FaTasks } from "react-icons/fa";
import Spinner from "./Spinner"; // Import the Spinner component
import TaskComponent from "./TaskComponent"; // Import TaskComponent
import ProfileComponent from "./ProfileComponent"; // Import the ProfileComponent
import Auth from "./Auth"; // Import Auth component for authentication
import { RxColorWheel } from "react-icons/rx";
import "../NavBar.css";

const NavBar = ({
  setScore,
  score,
  rank,
  stopGame,
  startGame,
  isGameActive,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTasks, setShowTasks] = useState(false); // State to show/hide tasks
  const [showProfile, setShowProfile] = useState(false); // State to show/hide profile
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // If token exists, mark as authenticated
    }
  }, []);

  // Effect to resume the game when all content is closed
  useEffect(() => {
    if (!showSpinner && !showTasks && !showProfile && isGameActive) {
      startGame(); // Resume the game when all navbar content is closed
    }
  }, [showSpinner, showTasks, showProfile, startGame, isGameActive]);

  const toggleSpinner = () => {
    setShowSpinner(!showSpinner);
    setShowTasks(false); // Hide other components
    setShowProfile(false);
    if (isGameActive) stopGame(); // Stop the game when navbar content is opened
  };

  const toggleTasks = () => {
    setShowTasks(!showTasks);
    setShowSpinner(false); // Hide other components
    setShowProfile(false);
    if (isGameActive) stopGame(); // Stop the game when navbar content is opened
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSpinner(false); // Hide other components
    setShowTasks(false);
    if (isGameActive) stopGame(); // Stop the game when navbar content is opened
  };

  // Callback for successful authentication
  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
    setShowProfile(true); // Show profile after successful authentication
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "10vh",
          background: "linear-gradient(135deg, rgba(34, 34, 34, 0.8), rgba(50, 50, 50, 0.8))", // Gradient background
          color: "white",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0",
          boxShadow: "0 -4px 15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(204,204,0, 8)", // Green glow border with increased blur
          zIndex: 10001,
          transition: "background-color 0.3s ease-in-out", // Smooth transition for background
          backdropFilter: "blur(10px)", // Increased blur effect
        }}
      >
        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
            display: "inline-block",
            transform: "scale(1)", // Default scale
            transition: "transform 0.3s ease, color 0.3s ease", // Smooth scaling and color transitions
            color: showSpinner ? "#f39c12" : "#fff", // Change color if active
          }}
          onClick={toggleSpinner}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <RxColorWheel size={25} />
          <span style={{ display: "block", marginTop: "4px" }} className="font">
            Spinner
          </span>
        </div>

        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
            display: "inline-block",
            transform: "scale(1)",
            transition: "transform 0.3s ease, color 0.3s ease",
            color: showTasks ? "#e74c3c" : "#fff", // Change color if active
          }}
          onClick={toggleTasks}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaTasks size={25} />
          <span style={{ display: "block", marginTop: "4px" }} className="font">
            Tasks
          </span>
        </div>

        <div
          style={{
            cursor: "pointer",
            textAlign: "center",
            display: "inline-block",
            transform: "scale(1)",
            transition: "transform 0.3s ease, color 0.3s ease",
            color: showProfile ? "#2ecc71" : "#fff", // Change color if active
          }}
          onClick={toggleProfile}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaUser size={25} />
          <span style={{ display: "block", marginTop: "4px" }} className="font">
            Profile
          </span>
        </div>
      </div>

      {/* Spinner Modal */}
      {showSpinner && (
        <div>
          <Spinner setScore={setScore} /> {/* Show spinner when toggled */}
        </div>
      )}

      {/* Task Modal */}
      {showTasks && (
        <div>
          <TaskComponent score={score} setScore={setScore} /> {/* Show tasks */}
        </div>
      )}

      {/* Profile Modal with Authentication */}
      {showProfile && isAuthenticated ? (
        <div>
          <ProfileComponent
            username={localStorage.getItem("username")}
            score={score}
            rank={rank}
          />{" "}
          {/* Show profile */}
        </div>
      ) : (
        showProfile && (
          <Auth
            setToken={handleAuthSuccess}
          /> /* Show auth if not authenticated */
        )
      )}
    </div>
  );
};

export default NavBar;
