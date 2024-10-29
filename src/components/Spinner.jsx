import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import WheelComponent from "react-wheel-of-prizes";
// import GameHeader from "./GameHeader";
import HandAnimation from "./HandAnimation";
import yourImage from "../assets/game-spinner.png"; // Update with your actual image path

const Spinner = ({ setScore, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [applesWon, setApplesWon] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPartyItems, setShowPartyItems] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [remainingSpins, setRemainingSpins] = useState(3); // Daily spins limit
  const [showhand, setShowHand] = useState(true);
  const wheelRef = useRef(null);

  const segments = [
    "100💎 ",
    "200 💎 ",
    "300💎 ",
    "400💎 ",
    "500💎 ",
    "0🥲",
    "0😕",
    "Try Again🫣",
    "1 Extra Spin🥳",
    "100💎 ",
    "200💎 ",
    "300💎 ",
  ];

  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#FF5733",
    "#FFC300",
    "#DAF7A6",
    "#C70039",
    "#900C3F",
    "#581845",
    "#1C2833",
  ];

  useEffect(() => {
    const remainingTime = localStorage.getItem("remainingTime");
    const spinsLeft = localStorage.getItem("remainingSpins");

    if (remainingTime) {
      const timeDifference = Math.max(0, remainingTime - Date.now());
      setTimeLeft(timeDifference);
      if (timeDifference > 0) {
        setIsDisabled(true);
        startCountdown(timeDifference);
      }
    }

    setRemainingSpins(spinsLeft ? parseInt(spinsLeft) : 3);

    const adjustCanvasSize = () => {
      const canvas = wheelRef.current?.querySelector("#canvas");
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "90%";
      }
    };

    adjustCanvasSize();
    window.addEventListener("resize", adjustCanvasSize);

    return () => {
      window.removeEventListener("resize", adjustCanvasSize);
    };
  }, []);

  const startCountdown = (duration) => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setIsDisabled(false);
          localStorage.removeItem("remainingTime");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const onFinished = (winner) => {
    setSpinning(false);
    let applesWon = 0;

    if (winner === "Try Again" || winner === "0") {
      applesWon = 0;
    } else if (winner === "1 Extra Spin") {
      applesWon = 0;
      alert("You got an extra spin!");
      setRemainingSpins((prev) => Math.min(prev + 1, 3)); // Increase spins but limit to 3
    } else {
      applesWon = parseInt(winner);
    }

    if (applesWon > 0) {
      setScore((prevScore) => prevScore + applesWon);
      localStorage.setItem(
        "score",
        (parseInt(localStorage.getItem("score")) || 0) + applesWon
      );
      setShowConfetti(true);
      setShowPartyItems(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowPartyItems(false);
      }, 5000);
    }

    setRemainingSpins((prev) => {
      const newSpins = prev - 1;
      localStorage.setItem("remainingSpins", newSpins);
      if (newSpins <= 0) {
        alert("You have used all your spins for today!");
        setIsDisabled(true);
      }
      return newSpins;
    });

    const countdownTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    const unlockTime = Date.now() + countdownTime;
    localStorage.setItem("remainingTime", unlockTime);
    startCountdown(countdownTime);
  };

  return (
    <div
      style={{
        textAlign: "center",
        margin: "0",
        background: "rgba(255, 255, 255, 0.28)",
        backdropFilter: "blur(9.6px)",
        WebkitBackdropFilter: "blur(9.6px)",
        position: "relative",
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "100",
      }}
    >
      <img
        src={yourImage}
        alt="Game Header"
        style={{ position: "absolute", top: "10%", zIndex: 1 }}
      />

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {showPartyItems && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translate(-50%, -50%)`,
                fontSize: "1.5rem",
                pointerEvents: "none",
                color: "gold",
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div
        ref={wheelRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "39%",
          fontSize: "2rem",
          overflow: "hidden",
          left: "15%",
        }}
      >
        <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={onFinished}
          primaryColor="black"
          contrastColor="white"
          isOnlyOnce={true}
          size={300}
          upDuration={100}
          downDuration={400}
          fontFamily="bold"
          disabled={spinning || isDisabled || remainingSpins <= 0}
        />
      </div>
      <HandAnimation />
    </div>
  );
};

export default Spinner;
