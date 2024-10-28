import React, { useState, useEffect, useRef } from "react";
import GameHeader from "./GameHeader";
import NavBar from "./navbar";
import Bomb from "./Bomb";
import Freezer from "./Freezer";
import Ant from "./Ant"; // We'll use this as "fly"
import MysteryBox from "./MysteryBox"; // New component for mystery box
import axios from "axios";
import PointsMessage from "./PointsMessage";
import CooldownTimer from "./CooldownTimer";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import pause from '../assets/Pausebutton.png';
import bg from '../assets/Whitebackground_.png';
import sad from "../assets/sad.gif";
import Bee from "../components/Bee";
import Bug from "./bug1";
import Confetti from "react-confetti";
import Menu from "./menu";
import { gsap } from "gsap"; // Import GSAP
import PopupPause from "./PopupPause"; // Adjust the path as necessary
import playagainbtn from "../assets/button3.png";
import homebtn from "../assets/button1.png";
import CakesBar from "./CakesBar";
export default function Component({ setToken }) {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
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
  const [missedCount, setMissedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flySpeed, setFlySpeed] = useState(10);
  const [flyFrequency, setFlyFrequency] = useState(1700);
  const [mysteryBoxCollected, setMysteryBoxCollected] = useState(false);
  const [mysteryBoxScore, setMysteryBoxScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [freezerActive, setFreezerActive] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isBoxOpening, setIsBoxOpening] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const mysteryBoxRef = useRef(null);
  const mysteryBoxLidRef = useRef(null);
  const mysteryBoxRewardRef = useRef(null);
  const backgroundMusic = useRef(null);
  const audioInstances = useRef(new Map());
  const username = localStorage.getItem("username");
  Modal.setAppElement("#root");
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
    // Load mute state from localStorage when component mounts
    const savedMuteState = localStorage.getItem("isMuted");
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

 

  useEffect(() => {
    // Save mute state to localStorage whenever it changes
    localStorage.setItem("isMuted", JSON.stringify(isMuted));

    // Apply mute state to all audio elements
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      audio.muted = isMuted;
    });
  }, [isMuted]);

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
                if (["fly", "bee", "bug"].includes(element.type)) {
                  setMissedCount((prevMissedCount) => prevMissedCount + 1);
                  setLives(lives - 1);
                }
                return null; // Element missed, remove it from the list
              }

              return { ...element, y: `${newY}vh` };
            })
            .filter(Boolean)
        );

        if (missedCount >= 6) {
          endGame();
        }
      }, 50);

      return () => {
        clearInterval(elementInterval);
        clearInterval(movementInterval);
      };
    }
  }, [
    isGameActive,
    flyFrequency,
    paused,
    gameOver,
    freezerActive,
    missedCount,
  ]);

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
      // Fly generation logic
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
      // Bomb generation logic
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
      // Freezer generation logic
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
      // Bee generation logic
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
    } else if (elementType < 0.99) {
      // Bug generation logic
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: 50,
          size: mediumSize,
          type: "bug",
        },
      ]);
    } else if (!mysteryBoxCollected && score >= 20) {
      // Mystery Box generation logic
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

    // Vibration logic for different element types
    if (navigator.vibrate) {
      switch (type) {
        case "fly":
          navigator.vibrate([100, 500, 100]);
          break;
        case "bomb":
          navigator.vibrate([300, 100, 300]);
          break;
        case "freezer":
          navigator.vibrate([200, 200, 500]);
          break;
        case "mysteryBox":
          navigator.vibrate([200, 50, 200, 50, 200]);
          break;
        case "bug":
          navigator.vibrate([100, 50, 200, 50, 200]);
          break;
        default:
          break;
      }
    }

    // Scoring, sound, and effect logic for each element type
    switch (type) {
      case "fly":
        setScore((prevScore) => prevScore + pointValue);
        setPointsMessage(`+${pointValue}`);
        playSound(
          "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav"
        );
        break;

      case "bomb":
        setElements((prevElements) =>
          prevElements.filter((el) => el.type !== "fly")
        );
        setPointsMessage("Flies cleared!");
        playSound(
          "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav"
        );
        break;

      case "bee":
        setScore((prevScore) => prevScore + 10);
        setPointsMessage("+10 (Bee)");
        playSound(
          "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav"
        );
        break;

      case "bug":
        setScore((prevScore) => prevScore + 50);
        setPointsMessage("+50 (Bug)");
        playSound(
          "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav"
        );
        break;

      case "freezer":
        setFreezerActive(true);
        setTimeout(() => setFreezerActive(false), 3000);
        break;

      case "mysteryBox":
        setMysteryBoxCollected(true);
        setMysteryBoxScore(pointValue);
        break;

      default:
        break;
    }

    // Remove only the clicked element after a specified timeout
    setTimeout(() => {
      setElements((prevElements) => prevElements.filter((_, i) => i !== index));
    }, 300);

    // Clear points message after 0.5 seconds
    setTimeout(() => setPointsMessage(""), 500);
  };

  const resetGame = () => {
    if (!isMuted) {
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    }

    setBackgroundImage(`url(${bg})`);
    playSound(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav"
    );
    setIsGameActive(true);
    setScore(score);
    setElements([]);
    setGameOver(false);
    setLives(3);
    // setIsNavbarVisible(true);
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
    setMissedCount(0);
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
    if (!isMuted) {
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    }

    setBackgroundImage(`url(${bg})`);
    playSound(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav"
    );
    setGameStarted(true);
    setIsGameActive(true);
    setIsNavbarVisible(false);
  };
  const handleGoHome = () => {
    stopBackgroundMusic(); // Function to stop background music
    setIsGameActive(false);
    setIsNavbarVisible(true);
    setGameStarted(false);
    setPaused(false); // Ensure the game is not paused
    setIsMenuVisible(false); // Hide the menu
    setBackgroundImage(""); // Reset background image if needed
    // Additional logic for going home, if required
    console.log("Navigating to home...");
  };

  const handlePauseGame = () => {
    stopBackgroundMusic(); // Stop the background music
    setPaused(true);
    setIsMenuVisible(true); // Show the menu when paused
  };

  const handleResumeGame = () => {
    if (!isMuted) {
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    }

    setBackgroundImage(`url(${bg})`);
    playSound(
      "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav"
    );

    setGameStarted(true);
    setIsGameActive(true);
    setIsMenuVisible(false); // Hide the menu on resume
    setPaused(false);
    setShowPopup(false);
  };

  const handleMuteToggle = () => {
    setIsMuted((prevMuted) => !prevMuted); // Toggle mute state

    if (isMuted) {
      // Unmute logic: play music
      playBackgroundMusic(
        "https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"
      );
    } else {
      // Mute logic: stop music
      stopBackgroundMusic();
    }
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
        height: "110vh",
        overflow: "hidden",
        backgroundImage: backgroundImage,
        backgroundSize: "auto",
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
      <GameHeader score={score} handleLogout={handleLogout} lives={lives} />

      {!gameStarted ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
         

          <Menu
            onResumeClick={handleResumeGame}
            handleStartGame={handleStartGame}
            score={score}
            setScore={setScore}
            rank={rank}
            stopGame={handlePauseGame}
            startGame={handleResumeGame}
            isGameActive={isGameActive}
          />
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
            } else if (element.type === "bug") {
              // Render Bug component here
              return (
                <Bug
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
          <div className="cakes-bar-div">
            <CakesBar />
          </div>

          <div className="icon-container">
            {!gameOver && !paused && (
               <div
               onClick={handlePauseGame} // Only allow pause action when not paused
               style={{ cursor: "pointer", margin: "40px 10px 10px 10px" }}
             >
               <img 
                 src={pause} 
                 alt="Pause" 
                 style={{ width: "20px", height: "20px" }} // Adjust size as needed
               />
               {/* Always show pause image when playing */}
             </div>
            
            )}

            <PopupPause
              isVisible={isMenuVisible}
              onResume={handleResumeGame}
              onHome={handleGoHome}
              isMuted={isMuted}
              onMuteToggle={handleMuteToggle}
            />
            
            {/* Resume button is not shown here since it's in the popup */}
          </div>

          {gameOver && (
            <Modal isOpen={isModalOpen} className="game-over-modal">
              <span>
                <img
                  src={sad}
                  alt=""
                  style={{ height: "56px", marginTop: "-8px" }}
                />
              </span>
              <h2>Game Over </h2>
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
              <span className="game-over-span">
                <button onClick={resetGame} className="play-again-btn1">
                  <img src={playagainbtn} alt="play again" />
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="home-btn2"
                >
                  <img src={homebtn} alt="home" />
                </button>
              </span>
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
