import { StrictMode } from "react";
import ReactDOM from "react-dom"; // Change this line
import App from "./App.jsx";
import "./index.css";
import './fonts/fonts.css';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
