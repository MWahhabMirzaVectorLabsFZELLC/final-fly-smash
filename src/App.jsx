import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import GamePage from "./components/GamePage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import backgroundImage from "./assets/Whitebackground_.png";

const App = () => {
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };

  return (
    <div
      style={containerStyle}
      className="game-container container-fluid d-flex flex-column justify-content-center align-items-center bg-light"
    >
      <GamePage />
    </div>
  );
};

export default App;
