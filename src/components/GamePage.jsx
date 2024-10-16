import React, { useState, useEffect } from "react";
import GameHeader from "./GameHeader";
import Apple from "./Ant"; // This could be changed to Fly if you're working with Fly component
import Bomb from "./Bomb";
import axios from 'axios';
import PointsMessage from "./PointsMessage";
// import PlayAgainPrompt from "./PlayAgainPrompt";
import CooldownTimer from "./CooldownTimer";
import Modal from "react-modal";
import NavBar from "./navbar"; // NavBar import
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import CakeImages from "./CakeImages";
import bg from "../assets/bg.jpeg.png";
import sad from "../assets/sad.gif"
import { playSound } from "../components/sound/PlaySound";
import { generateElements } from "../components/Elements/GenerateElements";

const GamePage = ({ setToken }) => {
  const [backgroundImage, setBackgroundImage] = useState(""); // Add this state
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
  const [paused, setPaused] = useState(false); // Track if the game is paused
  const [gameOver, setGameOver] = useState(false); // Track game over status
  const username = localStorage.getItem("username");
  const [flySpeed, setFlySpeed] = useState(60); // Initial speed of fly element
  const [flyFrequency, setFlyFrequency] = useState(700); // Frequency in ms for fly generation
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  // // Function to play sound
  // const playSound = (url) => {
  //   const audio = new Audio(url);
  //   audio.play().catch((error) => {
  //     console.error("Error playing sound:", error);
  //   });
  // };

  let backgroundMusic = null;
  // Function to play background music at low volume
  const playBackgroundMusic = (url) => {
    if (!backgroundMusic) {
      backgroundMusic = new Audio(url);
      backgroundMusic.volume = 0.1; // Set to low volume
      backgroundMusic.loop = true;  // Loop the music
      backgroundMusic.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
  };

  // Function to stop background music
  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0; // Reset the audio
      backgroundMusic = null;  // Clear reference
    }
  };

// Function to fetch score from backend
const fetchScoreFromBackend = async () => {
  try {
    const response = await axios.get(`https://flysmash-server.vercel.app/?vercelToolbarCode=vxGZhZ2erVHjxo7/api/profile/${username}`);
    const backendScore = response.data.score;

    setScore(backendScore); // Set the score from backend
    localStorage.setItem("score", backendScore); // Update localStorage with backend score
    console.log("Fetched score from backend:", backendScore);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error fetching score from backend:", error.response.data);
    } else {
      console.error("Error fetching score from backend:", error.message || error);
    }
  }
};

// Load scores and games played from localStorage on initial render
useEffect(() => {
  const storedScore = Number(localStorage.getItem("score")) || 0;
  const storedGamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;

  // Fetch score from backend every time the window is loaded
  window.onload = () => {
    if (username) {
      fetchScoreFromBackend();
    }
  };

  setScore(storedScore);
  setGamesPlayed(storedGamesPlayed);

  // Cleanup the window.onload event listener when the component unmounts
  return () => {
    window.onload = null;
  };
}, [username]);


  // Handle game timing and element generation
  useEffect(() => {
    if (isGameActive && !paused && !gameOver) {
      // Generate elements at a dynamic frequency based on flyFrequency
      const elementInterval = setInterval(() => {
        generateElements();
      }, flyFrequency);

      // Move elements and check if any apple reaches the bottom of the screen
      const movementInterval = setInterval(() => {
        setElements((prevElements) =>
          prevElements
            .map((element) => {
              const newY = parseFloat(element.y) + 1;

              // Check if an apple reaches the bottom (100vh)
              if (newY > 100 && element.type === "apple") {
                overGame(); // Trigger custom game over
                return null; // Remove the element
              }

              return { ...element, y: `${newY}vh` };
            })
            .filter(Boolean) // Filter out any null elements
        );
      }, 1000);

      // Cleanup both intervals on component unmount or on re-render
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

    if (elementType < 0.9) {
      const randomSize = Math.floor(Math.random() * 3) + 1;
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: randomSize,
          size: randomSize,
          type: "apple",
        },
      ]);
    } else if (elementType < 0.97) {
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
    } else {
      setElements((prevElements) => [
        ...prevElements,
        {
          id: uuidv4(),
          x: `${randomX}vw`,
          y: `${startY}vh`,
          pointValue: 0,
          size: flySize,
          type: "fly",
        },
      ]);
      // Increase fly generation frequency and speed as more flies are generated
      setFlySpeed((prevSpeed) => Math.max(prevSpeed + 2, 100));
      setFlyFrequency((prevFrequency) => Math.max(prevFrequency - 100, 200));
    }
  };
  const handleClick = (index, pointValue, type) => {
    if (type === "apple") {
      setScore((prevScore) => prevScore + pointValue);
      setPointsMessage(`+${pointValue}`);
      playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130562/mixkit-sword-cutting-flesh-2788_t4ozqi.wav");
    } else if (type === "bomb") {  // Corrected this part
      setScore((prevScore) => prevScore + 5);
      setElements((prevElements) => prevElements.slice(0, -3)); // Remove last 3 elements
      setPointsMessage("+5 (Bomb)");
      playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130511/mixkit-8-bit-bomb-explosion-2811_b3dvxe.wav");
    }

    // Remove the clicked element
    setElements((prevElements) => prevElements.filter((_, i) => i !== index));
    setTimeout(() => setPointsMessage(""), 1000); // Clear the message after 1 second
  };
  // Handle element falling speed
  useEffect(() => {
    if (isGameActive && !paused && !gameOver) {
      const fallInterval = setInterval(() => {
        setElements((prevElements) =>
          prevElements
            .map((element) => {
              const newY = parseFloat(element.y) + 1;
              if (newY > 100 && element.type === "fly") {
                endGame(); // End game when the fly reaches the bottom
                return null;
              }
              return { ...element, y: `${newY}vh` };
            })
            .filter(Boolean)
        );
      }, 50); // 50ms for smoother animation

      return () => clearInterval(fallInterval);
    }
  }, [isGameActive, paused, gameOver]);

  const resetGame = () => {
    setIsGameActive(true); // Start a new game
    // setTimeLeft(30); // Reset timer
    setScore(score); // Reset score
    setElements([]); // Clear all elements
    setGameOver(false); // Reset game over state
    setIsModalOpen(false); // Close the modal
  };


  const endGame = () => {
    stopBackgroundMusic();  // Stop background music when game ends
    playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130657/mixkit-wrong-answer-fail-notification-946_lggn8b.wav"); // Play end game sound
    setIsGameActive(false);
    setGameOver(true);
    localStorage.setItem("score", score);
    localStorage.setItem("gamesPlayed", gamesPlayed + 1);
    setElements([]);

    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);

    if (newGamesPlayed >= 5) {
      setIsModalOpen(true);
      setCooldownStart(Date.now());
    } else {
      setShowPrompt(true);
    }
  };

  const handleStartGame = () => {
    setBackgroundImage(`url(${bg})`);
    playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130608/mixkit-winning-a-coin-video-game-2069_sksjwk.wav"); // Play start game sound
    // playBackgroundMusic("/public/8-bit-retro-game-music-233964.mp3"); // Start background music
    playBackgroundMusic("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130397/8-bit-retro-game-music-233964_tygt63.mp3"); // Start background music
    setGameStarted(true);
    setIsGameActive(true);
    setIsNavbarVisible(false);
  };



  const handlePauseGame = () => {
    setPaused(true); // Pause the game
    stopBackgroundMusic(); // Stop background music on pause
  };

  const handleResumeGame = () => {
    setPaused(false); // Resume the game immediately

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

  const overGame = () => {
    playSound("https://res.cloudinary.com/dvaf37ode/video/upload/v1728130657/mixkit-wrong-answer-fail-notification-946_lggn8b.wav"); // Play sound when the game ends
    setIsGameActive(false); // Stop the game
    setGameOver(true); // Set game over state
    setIsModalOpen(true); // Show the game over modal
    setElements([]); // Clear elements
  };

  const handleInvite = () => {
    const uniqueToken = uuidv4(); // Generate a unique token
    const inviteLink = `${window.location.origin}/game?inviteToken=${uniqueToken}`; // Construct the invite link

    // Show the invite link in a prompt or modal
    alert(`Share this link with your friends: ${inviteLink}`);
  };
  return (
    <div
      className="game-container position-relative"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: backgroundImage, // Set the background image
        backgroundSize: "cover", // Optional: cover the entire area
        transition: "background-image 0.5s ease-in-out", // Add transition for the background image
      }}
    >
      {isGameActive && <CakeImages />}
      {isNavbarVisible && (
        <NavBar
          score={score}
          setScore={setScore}
          rank={rank}
          stopGame={handlePauseGame} // Stop the game on NavBar interaction
          startGame={handleResumeGame} // Resume the game
          isGameActive={isGameActive} // Track if game is active
        />
      )}
      <GameHeader
        score={score}
        // timeLeft={timeLeft}
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
            if (element.type === "apple") {
              return (
                <Apple
                  key={index}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                  playSound={playSound} // Pass playSound to Apple
                />
              );
            } else if (element.type === "bomb") {
              return (
                <Bomb
                  key={index}
                  x={element.x}
                  y={element.y}
                  size={element.size}
                  onClick={() =>
                    handleClick(index, element.pointValue, element.type)
                  }
                  playSound={playSound} // Pass playSound to Bomb
                />
              );
            }

          })}


          {/* Game Over Modal */}
          {gameOver && (
            <Modal isOpen={isModalOpen} className="game-over-modal">
              <h2>Game Over <span><img src={sad} alt="" style={{ height: "30px", marginTop: "-8px" }} /></span> </h2>

              <button onClick={resetGame}>Play Again</button>
              <button onClick={() => window.location.reload()}>Home</button>

            </Modal>
          )}

          {/* Points Message */}
          <PointsMessage pointsMessage={pointsMessage} />

       

          {/* Cooldown Modal */}
          <Modal
            isOpen={isModalOpen && !gameOver} // Ensure this modal doesn't show if game is over
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Background blur
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
};

export default GamePage;
