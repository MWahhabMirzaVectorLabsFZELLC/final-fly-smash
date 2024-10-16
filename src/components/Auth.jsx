import React, { useState } from "react";
import "../App.css";
import axios from "axios";

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [uniqueKey, setUniqueKey] = useState(""); // State for unique key

  const handleStart = async () => {
    if (username) {
      // Store username in localStorage
      localStorage.setItem("username", username);

      // Send username and unique key to backend
      try {
        const response = await axios.post("https://flysmash-server.vercel.app/?vercelToolbarCode=vxGZhZ2erVHjxo7/api/auth", {
          username,
          uniqueKey: uniqueKey || undefined, // Send unique key if provided
          score: 0, // Initial score
        });

        if (response.data.message === "Invalid unique key") {
          alert("Incorrect unique key. Please try again.");
        } else if (response.data.message === "User created successfully") {
          // User was created, display unique key
          alert(`Your unique key is: ${response.data.uniqueKey}. Please save it for later.`);
          localStorage.setItem("token", "logged_in");
          setToken("logged_in");
          localStorage.setItem("score", "0");
        } else {
          // User authenticated successfully
          alert("User authenticated successfully.");
          localStorage.setItem("token", "logged_in");
          setToken("logged_in");
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div className="auth-container d-flex flex-column justify-content-center align-items-center vh-100 w-100">
      <div className="w-30">
        <h2 className="text-white mb-4">Enter Username</h2>
        <input
          className="form-control mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Unique Key (if you have one)"
          onChange={(e) => setUniqueKey(e.target.value)}
        />
        <button
          className="btn btn-primary text-white font-weight-bolder"
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Auth;
