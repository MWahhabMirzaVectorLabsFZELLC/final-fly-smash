import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import perImg from "../assets/person.jfif";
import diamondImg from "../assets/diamond.png";
import goldImg from "../assets/gold.png";
import silverImg from "../assets/silver.png";
import axios from "axios";

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({ score: 0, rank: 0 });
  const username = localStorage.getItem("username");
  const getRankingAward = (score) => {
    if (score >= 100000) {
      return { name: "Diamond", img: diamondImg };
    } else if (score >= 80000) {
      return { name: "Gold", img: goldImg };
    } else if (score >= 60000) {
      return { name: "Silver", img: silverImg };
    } else {
      return { name: "None", img: null };
    }
  };

  const rankingAward = getRankingAward(profileData.score); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `https://flysmash-server.vercel.app/api/profile/${username}`
        );
        if (response.data) {
          setProfileData({
            score: response.data.score || 0,
            rank: response.data.rank || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (username) fetchUserProfile();
  }, [username]);

  return (
    <div
      style={{
        position: "relative",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.75)",
        color: "white",
        padding: "10px",
        margin: "auto",
        marginBottom: "10%",
        maxWidth: "600px",
        height: "100vh",
        zIndex: 10,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "0px",
      }}
    >
      <div className="text-white text-center">
        <h2
          className="font-weight-bold mb-4 text-info"
          style={{ fontSize: "1.5em" }}
        >
          User Profile
        </h2>

        {/* User Info Section */}
        <div className="d-flex flex-column align-items-center mb-4">
          <img
            src={perImg}
            alt="User Profile"
            className="rounded-circle mb-3"
            style={{
              width: "120px",
              height: "120px",
              border: "4px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <h4
            className="mb-1 font-weight-bold text-info"
            style={{ fontSize: "1.5em" }}
          >
            {username || "Guest"}
          </h4>
          <p className="text-info" style={{ fontSize: "1.1em" }}>
            Rank: <span className="text-white">#{profileData.rank}</span>{" "}
            {/* Display the user's rank */}
          </p>
        </div>

        {/* Score Section */}
        <div className="d-flex justify-content-around align-items-center mb-5">
          <div className="d-flex flex-column align-items-center">
            <h5
              className="font-weight-bold text-info"
              style={{ fontSize: "1.2em" }}
            >
              Total Score
            </h5>
            <p style={{ fontSize: "1.1em" }}>{profileData.score} 💎</p>
          </div>

          {/* Ranking Badge */}
          <div className="d-flex flex-column align-items-center">
            <h5
              className="font-weight-bold text-info"
              style={{ fontSize: "1.2em" }}
            >
              Current Rank
            </h5>
            <span
              className="badge badge-primary"
              style={{
                fontSize: "1.4em",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              #{profileData.rank} {/* Display the user's rank in the badge */}
            </span>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="d-flex flex-column align-items-center mb-4">
          <h5
            className="font-weight-bold mb-3 text-info"
            style={{ fontSize: "1.3em" }}
          >
            Basic Information
          </h5>
          <ul
            className="list-unstyled text-left w-75"
            style={{ fontSize: "1.1em" }}
          >
            <li className="d-flex justify-content-between mb-3">
              <span className="font-weight-bold">Username:</span>
              <span>{username || "Guest"}</span>
            </li>

            <li className="d-flex justify-content-between mb-3">
              <span className="font-weight-bold">Ranking Award:</span>{" "}
              <span>
                {rankingAward.name}
                {rankingAward.img && (
                  <img
                    src={rankingAward.img}
                    alt={rankingAward.name}
                    style={{ width: "30px", marginLeft: "2px" }}
                  />
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
