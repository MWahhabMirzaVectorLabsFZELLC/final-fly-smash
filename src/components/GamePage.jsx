import React, { useState, useEffect } from "react";
import GameHeader from "./GameHeader";
import Bomb from "./Bomb";
import Freezer from "./Freezer";
import Ant from "./Ant";  // We'll use this as "fly"
import MysteryBox from "./MysteryBox";  // New component for mystery box
import axios from 'axios';
import PointsMessage from "./PointsMessage";
import CooldownTimer from "./CooldownTimer";
import Modal from "react-modal";
import NavBar from "./navbar";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import bg from "../assets/bg.jpeg.png";
import sad from "../assets/sad.gif";
import { playSound } from "../components/sound/PlaySound";

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

  const username = localStorage.getItem("username");

  let backgroundMusic = null;

  const playBackgroundMusic = (url) => {
    if (!backgroundMusic) {
      backgroundMusic = new Audio(url);
      backgroundMusic.volume = 0.1;
      backgroundMusic.loop = true;
      backgroundMusic.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      backgroundMusic = null;
    }
  };

  const fetchScoreFromBackend = async () => {
    try {
      const response = await axios.get(`https://flysmash-server.vercel.app/api/profile/${username}`);
      const backendScore = response.data.score;
      setScore(backendScore);
      localStorage.setItem("score", backendScore.toString());
      console.log("Fetched score from backend:", backendScore);
    } catch (error) {
      console.error("Error fetching score from backend:", error.response?.data || error.message || error);
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
              const newY = parseFloat(element.y) + 1;

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
  }, [isGameActive, flyFrequency, paused, gameOver]);

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

    if (elementType < 0.80) {
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
    } else if (elementType < 0.90) {
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
    } else if (!mysteryBoxCollected && score === 20) {
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
    // Vibration logic based on element type
    if (navigator.vibrate) {
      if (type === "fly") {
        navigator.vibrate(1500); // Short vibration for catching a fly
      } else if (type === "bomb") {
        navigator.vibrate(1500); // Longer pattern for bombs
      } else if (type === "freezer") {
        navigator.vibrate(1500); // Continuous vibration for freezer
      } else if (type === "mysteryBox") {
        navigator.vibrate([300, 100, 300]); // Distinct pattern for mystery box
      }
    }
  
    if (type === "fly") {
      setScore((prevScore) => prevScore + pointValue);
      setPointsMessage(`+${pointValue}`);
      playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav");
    } else if (type === "bomb") {
      setScore((prevScore) => prevScore + 5);
      setElements((prevElements) => prevElements.slice(0, -3));
      setPointsMessage("+5 (Bomb)");
      playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav");
    } else if (type === "freezer") {
      if (!paused) {
        setPaused(true);
        playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav");
        setTimeout(() => {
          setPaused(false);
        }, 5000);
      }
    } else if (type === "mysteryBox") {
      setMysteryBoxCollected(true);
      setMysteryBoxScore(pointValue);
      playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav");
    }
  
    setElements((prevElements) => prevElements.filter((_, i) => i !== index));
    setTimeout(() => setPointsMessage(""), 1000);
  };
  

  const resetGame = () => {
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
    playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130657/mixkit-wrong-answer-fail-notification-946_lggn8b.wav");
    setIsGameActive(false);
    setGameOver(true);

    const newScore = score + mysteryBoxScore;
    setScore(newScore);
    localStorage.setItem("score", newScore.toString());

    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem("gamesPlayed", newGamesPlayed.toString());

    setElements([]);

    if (newGamesPlayed >= 5) {
      setIsModalOpen(true);
      setCooldownStart(Date.now());
    } else {
      setShowPrompt(true);
    }
  };

  const handleStartGame = () => {
    setBackgroundImage(`url(${bg})`);
    playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav");
    playBackgroundMusic("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3");
    setGameStarted(true);
    setIsGameActive(true);
    setIsNavbarVisible(false);
  };

  const handlePauseGame = () => {
    setPaused(true);
    stopBackgroundMusic();
  };

  const handleResumeGame = () => {
    setPaused(false);
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
      <GameHeader
        score={score}
        handleLogout={handleLogout}
      />

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
                  onClick={() => handleClick(index, element.pointValue, element.type)}
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
                  onClick={() => handleClick(index, element.pointValue, element.type)}
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
                  onClick={() => handleClick(index, element.pointValue, element.type)}
                />
              );
            } else if (element.type === "mysteryBox") {
              return (
                <MysteryBox
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() => handleClick(index, element.pointValue, element.type)}
                />
              );
            }
            return null;
          })}

          {gameOver && (
            <Modal isOpen={isModalOpen} className="game-over-modal">
              <h2>Game Over <span><img src={sad} alt="" style={{ height: "30px", marginTop: "-8px" }} /></span></h2>
              {mysteryBoxCollected && (
                <p>Mystery Box Bonus: +{mysteryBoxScore} points!</p>
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
    </div>
  );
}
