import React, { useState, useEffect, useRef } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import GameHeader from "./GameHeader";
import Bomb from "./Bomb";
import Freezer from "./Freezer";
import Ant from "./Ant"; // We'll use this as "fly"
import MysteryBox from "./MysteryBox"; // New component for mystery box
import axios from "axios";
import PointsMessage from "./PointsMessage";
import CooldownTimer from "./CooldownTimer";
import Modal from "react-modal";
import NavBar from "./navbar";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import bg from "../assets/bg.jpeg.png";
import sad from "../assets/sad.gif";
import Bee from "../components/Bee";
import Confetti from "react-confetti";

import { gsap } from "gsap"; // Import GSAP

export default function Component({ setToken }) {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(8);
  const [elements, setElements] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [pointsMessage, setPointsMessage] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cooldownStart, setCooldownStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flySpeed, setFlySpeed] = useState(10);
  const [flyFrequency, setFlyFrequency] = useState(1700);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [mysteryBoxCollected, setMysteryBoxCollected] = useState(false);
  const [mysteryBoxScore, setMysteryBoxScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [freezerActive, setFreezerActive] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isBoxOpening, setIsBoxOpening] = useState(false);

  const mysteryBoxRef = useRef(null);
  const mysteryBoxLidRef = useRef(null);
  const mysteryBoxRewardRef = useRef(null);

  const backgroundMusic = useRef(null);
  const audioInstances = useRef(new Map());

  const username = localStorage.getItem("username");

  // let backgroundMusic = null;
  const playBackgroundMusic = (url) => {
    if (!backgroundMusic.current) {
      backgroundMusic.current = new Audio(url);
      backgroundMusic.current.volume = 0.1;
      backgroundMusic.current.loop = true;
      backgroundMusic.current.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic.current) {
      backgroundMusic.current.pause();
      backgroundMusic.current.src = ""; // This should stop the music from playing
      backgroundMusic.current = null; // Clear the reference
    }
  };

  const playSound = (url) => {
    // Check if the game is muted
    if (isMuted) {
      return; // Exit the function if muted
    }

    // Create a new Audio instance and play it
    const audio = new Audio(url);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });

    // Store the audio instance in the Map
    audioInstances.current.set(url, audio);
  };

  const fetchScoreFromBackend = async () => {
    try {
      const response = await axios.get(
        `https://flysmash-server.vercel.app/api/profile/${username}`
      );
      const backendScore = response.data.score;
      setScore(backendScore);
      localStorage.setItem("score", backendScore.toString());
      console.log("Fetched score from backend:", backendScore);
    } catch (error) {
      console.error(
        "Error fetching score from backend:",
        error.response?.data || error.message || error
      );
    }
  };

  useEffect(() => {
    const storedScore = Number(localStorage.getItem("score")) || 0;
    const storedGamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;

    window.onload = () => {
      if (username) {
        fetchScoreFromBackend();
      }
    };

    setScore(storedScore);
    setGamesPlayed(storedGamesPlayed);

    return () => {
      window.onload = null;
    };
  }, [username]);

  useEffect(() => {
    if (isGameActive && !paused && !gameOver) {
      const elementInterval = setInterval(() => {
        generateElements();
      }, flyFrequency);

      const movementInterval = setInterval(() => {
        setElements((prevElements) =>
          prevElements
            .map((element) => {
              const newY = parseFloat(element.y) + (freezerActive ? 0 : 1);

              if (newY > 100) {
                if (element.type === "fly") {
                  endGame();
                }
                return null;
              }

              return { ...element, y: `${newY}vh` };
            })
            .filter(Boolean)
        );
      }, 50);

      return () => {
        clearInterval(elementInterval);
        clearInterval(movementInterval);
      };
    }
  }, [isGameActive, flyFrequency, paused, gameOver, freezerActive]);

  const generateElements = () => {
    const elementType = Math.random();
    const startY = -5;
    const minX = 0;
    const maxX = 90;
    const randomX = Math.random() * (maxX - minX) + minX;

    const mediumSize = 2;
    const flySize = 1;
    const freezerSize = 2;
    const mysteryBoxSize = 3;

    if (elementType < 0.75) {
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: 1,
          size: flySize,
          type: "fly",
        },
      ]);
      setFlySpeed((prevSpeed) => Math.max(prevSpeed + 1, 100));
      setFlyFrequency((prevFrequency) => Math.max(prevFrequency - 10, 200));
    } else if (elementType < 0.85) {
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: -5,
          size: mediumSize,
          type: "bomb",
        },
      ]);
    } else if (elementType < 0.95) {
      // Increased chance for freezer
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: 0,
          size: freezerSize,
          type: "freezer",
        },
      ]);
    } else if (elementType < 0.97) {
      setElements((prevElements) => [
        ...prevElements,

        {
          id: uuidv4(),

          x: `${randomX}vw`,

          y: `${startY}vh`,

          pointValue: 10,

          size: mediumSize,

          type: "bee",
        },
      ]);
    } else if (!mysteryBoxCollected && score >= 20) {
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
          size: mysteryBoxSize,
          type: "mysteryBox",
        },
      ]);
    }
  };

  const handleClick = (index, pointValue, type) => {
    if (paused && type !== "freezer") return;
    if (navigator.vibrate) {
      if (type === "fly") {
        navigator.vibrate([1005, 500, 105]); // Quick double pulse
      } else if (type === "bomb") {
        navigator.vibrate([1300, 100, 300]); // Stronger pulse for bomb
      } else if (type === "freezer") {
        navigator.vibrate([1100, 200, 500]); // Long pulse for freezer
      } else if (type === "mysteryBox") {
        navigator.vibrate([200, 50, 200, 50, 200]); // Rhythmic for mystery box
      }
    }

    // Handle scoring and sound logic
    if (type === "fly") {
      setScore((prevScore) => prevScore + pointValue);
      setPointsMessage(`+${pointValue}`);
      playSound(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav"
      );
    } else if (type === "bomb") {
      setElements((prevElements) =>
        prevElements.filter((el) => el.type !== "fly")
      );
      setPointsMessage("Flies cleared!");
      playSound(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav"
      );
    } else if (type === "bee") {
      setScore((prevScore) => prevScore + 10);

      setPointsMessage("+10 (Bee)");

      playSound(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav"
      );
    } else if (type === "freezer") {
      setFreezerActive(true);
      // Removed sound for freezer
      setTimeout(() => {
        setFreezerActive(false);
      }, 5000);
    } else if (type === "mysteryBox") {
      setMysteryBoxCollected(true);
      setMysteryBoxScore(pointValue);
    }

    setElements((prevElements) => prevElements.filter((_, i) => i !== index));
    setTimeout(() => setPointsMessage(""), 1000);
  };

  const resetGame = () => {
    playBackgroundMusic(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
    );
    setIsGameActive(true);
    setScore(score);
    setElements([]);
    setGameOver(false);
    setIsModalOpen(false);
    setMysteryBoxCollected(false);
    setMysteryBoxScore(0);
  };

  const endGame = () => {
    stopBackgroundMusic();
    playSound(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130657/mixkit-wrong-answer-fail-notification-946_lggn8b.wav"
    );
    setIsGameActive(false);
    setGameOver(true);
    setIsModalOpen(true);

    if (mysteryBoxCollected) {
      setIsBoxOpening(true);
      animateMysteryBox();
    }

    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem("gamesPlayed", newGamesPlayed.toString());

    setElements([]);

    if (newGamesPlayed >= 5) {
      setCooldownStart(Date.now());
    } else {
      setShowPrompt(true);
    }
  };

  const animateMysteryBox = () => {
    const tl = gsap.timeline();

    tl.to(mysteryBoxRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    })
      .to(mysteryBoxRef.current, {
        rotationY: 360,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(mysteryBoxLidRef.current, {
        rotationX: -110,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(mysteryBoxRewardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        onComplete: () => {
          setShowReward(true);
          setTimeout(() => {
            const newScore = score + mysteryBoxScore;
            setScore(newScore);
            localStorage.setItem("score", newScore.toString());
            setShowReward(false);
            setIsBoxOpening(false);
          }, 3000);
        },
      });
  };

  const handleStartGame = () => {
    setBackgroundImage(`url(${bg})`);
    playSound(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav"
    );
    playBackgroundMusic(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
    );
    setGameStarted(true);
    setIsGameActive(true);
    setIsNavbarVisible(false);
  };

  const handlePauseGame = () => {
    stopBackgroundMusic(); // Stop the background music
    setPaused(true);
    setShowPopup(true);
  };

  const handleResumeGame = () => {
    if (!isMuted) {
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    }

    setPaused(false);
    setShowPopup(false);
  };

  const muteGame = () => {
    if (isMuted) {
      // Unmute logic here
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    } else {
      // Mute logic here
      stopBackgroundMusic();
    }
    setIsMuted(!isMuted); // Toggle mute state
  };

  const handleCooldownEnd = () => {
    setIsModalOpen(false);
    setGameStarted(true);
    setGamesPlayed(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleInvite = () => {
    const uniqueToken = uuidv4();
    const inviteLink = `${window.location.origin}/game?inviteToken=${uniqueToken}`;
    alert(`Share this link with your friends: ${inviteLink}`);
  };
  return (
    <div
      className="game-container position-relative"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      {isNavbarVisible && (
        <NavBar
          score={score}
          setScore={setScore}
          rank={rank}
          stopGame={handlePauseGame}
          startGame={handleResumeGame}
          isGameActive={isGameActive}
        />
      )}
      <GameHeader score={score} handleLogout={handleLogout} />

      {!gameStarted ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <button className="start-btn heading" onClick={handleStartGame}>
            <span className="back"></span>
            <span className="front">Play</span>
          </button>
        </div>
      ) : (
        <>
          {elements.map((element, index) => {
            if (element.type === "fly") {
              return (
                <Ant
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                  playSound={playSound}
                />
              );
            } else if (element.type === "bomb") {
              return (
                <Bomb
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                  playSound={playSound}
                />
              );
            } else if (element.type === "bee") {
              return (
                <Bee
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                  playSound={playSound}
                />
              );
            } else if (element.type === "freezer") {
              return (
                <Freezer
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                />
              );
            } else if (element.type === "mysteryBox") {
              return (
                <MysteryBox
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                />
              );
            }
            return null;
          })}

          <div className="icon-container">
            {!gameOver && (
              <div
                onClick={paused ? handleResumeGame : handlePauseGame} // Toggle pause/resume
                style={{ cursor: "pointer", margin: "10px" }}
              >
                {paused ? (
                  <FaPlay size={30} color="white" /> // Show play icon when paused
                ) : (
                  <FaPause size={30} color="white" /> // Show pause icon when playing
                )}
              </div>
            )}
            {!gameOver && (
              <div
                onClick={muteGame}
                style={{ cursor: "pointer", margin: "10px" }}
              >
                {isMuted ? (
                  <IoVolumeMute size={30} color="white" />
                ) : (
                  <IoVolumeHigh size={30} color="white" />
                )}
              </div>
            )}
            {/* Resume button is not shown here since it's in the popup */}
          </div>

          {gameOver && (
            <Modal isOpen={isModalOpen} className="game-over-modal">
              <h2>
                Game Over{" "}
                <span>
                  <img
                    src={sad}
                    alt=""
                    style={{ height: "30px", marginTop: "-8px" }}
                  />
                </span>
              </h2>
              {mysteryBoxCollected && (
                <div className="mystery-box-container" ref={mysteryBoxRef}>
                  <div className="mystery-box">
                    <div className="box-lid" ref={mysteryBoxLidRef}></div>
                    <div className="box-bottom"></div>
                  </div>
                  <div className="mystery-box-reveal" ref={mysteryBoxRewardRef}>
                    {showReward && <Confetti />}
                    <h3>Mystery Box Reward!</h3>
                    <p className="reward-amount">+{mysteryBoxScore} points!</p>
                  </div>
                </div>
              )}
              <p>Final Score: {score}</p>
              <button onClick={resetGame}>Play Again</button>
              <button onClick={() => window.location.reload()}>Home</button>
            </Modal>
          )}

          <PointsMessage pointsMessage={pointsMessage} />

          <Modal
            isOpen={isModalOpen && !gameOver}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
              content: {
                padding: "0",
                marginTop: "35vh",
                marginLeft: "35vw",
                background: "transparent",
                border: "none",
                zIndex: 1000,
              },
            }}
          >
            <CooldownTimer
              cooldownStart={cooldownStart}
              onCooldownEnd={handleCooldownEnd}
              onInvite={handleInvite}
              onClose={() => setIsModalOpen(false)}
            />
          </Modal>
        </>
      )}
      <style jsx>{`
        .mystery-box-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 20px auto;
          transform: scale(0);
        }
        .mystery-box {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .box-lid,
        .box-bottom {
          position: absolute;
          width: 100%;
          height: 100%;
          background: gold;
          border: 2px solid #000;
          box-sizing: border-box;
        }
        .box-lid {
          transform-origin: top;
        }
        .mystery-box-reveal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
        }
        .reward-amount {
          font-size: 24px;
          font-weight: bold;
          color: gold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
