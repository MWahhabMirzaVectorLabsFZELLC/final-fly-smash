import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Spinner from "./Spinner"; // Adjust path as needed
import TaskComponent from "./TaskComponent"; // Adjust path as needed
import ProfileComponent from "./ProfileComponent"; // Adjust path as needed
import Auth from "./Auth"; // Adjust path as needed

// Importing images of buttons
import menuebar from "../assets/Menu Button.png";
import startgamebtn from "../assets/StartGame Button.png";
import resumebtn from "../assets/Resume Button.png";
import exitbtn from "../assets/Exitpanel.png";
import panel from "../assets/jaffar.png";
import spinner from "../assets/spinner logo.png";
import profile from "../assets/profilelogo1.png";
import task from "../assets/tasklogo1.png";

const GameButtons = ({
  handleStartGame,
  onResumeClick,
  onNewGameClick,
  setScore,
  score,
  rank,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  const toggleSpinner = () => {
    setShowSpinner(!showSpinner);
    setShowTasks(false);
    setShowProfile(false);
    setShowPopup(false);
  };

  const toggleTasks = () => {
    setShowTasks(!showTasks);
    setShowSpinner(false);
    setShowProfile(false);
    setShowPopup(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSpinner(false);
    setShowTasks(false);
    setShowPopup(false);
  };

  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
    setShowProfile(true);
  };

  return (
    <div className="button-container">
      <main>
        
        <button onClick={handleStartGame}>
          <img src={startgamebtn} style={{ width: "13rem" }} alt="Start Game" />
        </button>
        <button onClick={onResumeClick}>
          <img src={resumebtn} style={{ width: "13rem" }} alt="Resume" />
        </button>
        <button
          onClick={onResumeClick}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={exitbtn} style={{ width: "9rem" }} alt="Exit" />
        </button>

        {/* Popup Menu */}
        {showPopup && (
          <div className="popup-menu">
            <img src={panel} alt="Popup Background" className="popup-background" />
            <div className="close" onClick={togglePopup}>✖</div>
            <div className="dropdown-item" onClick={toggleSpinner}>
              <img src={spinner} alt="Spinner" /> Spinner
            </div>
            <div className="dropdown-item" onClick={toggleTasks}>
              <img src={task} alt="Task" /> Task
            </div>
            <div className="dropdown-item" onClick={toggleProfile}>
              <img src={profile} alt="Profile" /> Profile
            </div>
          </div>
        )}

        {/* Overlay Container with unified background */}
        {(showSpinner || showTasks || showProfile) && (
          <div className="overlay-container">
            <div className="overlay-component">
              <button className="close-button" onClick={() => {
                setShowSpinner(false);
                setShowTasks(false);
                setShowProfile(false);
              }}>
                <FaTimes />
              </button>
              {showSpinner && <Spinner setScore={setScore} />}
              {showTasks && (
                <div className="task-component">
                  <TaskComponent score={score} setScore={setScore} />
                </div>
              )}
              {showProfile && (
                isAuthenticated ? (
                  <ProfileComponent
                    username={localStorage.getItem("username")}
                    score={score}
                    rank={rank}
                  />
                ) : (
                  <Auth setToken={handleAuthSuccess} />
                )
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .button-container {
          height: 100%;
          display: flex;
          justify-content: top;
          align-items: center;
          position: relative;
         
          perspective: 1000px;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transform: rotatex(10deg);
          animation: rotateAngle 6s linear infinite;
          z-index: 1;
       
        }

        button {
          cursor: pointer;
          background: transparent;
          border: none
          position: relative;
          margin-bottom: 1rem;
        }

        .close {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          align-self: flex-end;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .dropdown-item {
          padding: 6px 8px;
          cursor: pointer;
          color: white;
          font-size: 14px;
          background: linear-gradient(45deg, #e1803c, #a34a0b);
          background-color: #884312;
          font-weight: bold;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          transition: background-color 0.2s;
          box-shadow: 0 3px 2px 1px #4e342e;
          margin: 20px 0px;
          border-radius: 18px;
        }

        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .overlay-container {
          position: fixed;
          top: -10;
          left: -10;
          width: 80vw;
          height: 50vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .overlay-component {
          background: url(${panel});
          background-size: cover;
          background-position: center;
          border-radius: 15px;
          padding: 2rem;
          width: 90%;
          height: 90%;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
          z-index: 10;
        }

        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .task-component {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 1rem;
        }

        // @keyframes rotateAngle {
        //   from { transform: rotateX(10deg) rotateY(0deg); }
        //   to { transform: rotateX(10deg) rotateY(360deg); }
        // }
      `}</style>
    </div>
  );
};

export default GameButtons;
