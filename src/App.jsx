import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import logo from "./images/warboardlogo.png";
import Gamemaster from "./pages/Gamemaster";
import Player from "./pages/Player";
import HowToUse from "./pages/How-to-use";

export default function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Home / Menu */}
      <Route
        path="/"
        element={
          <div style={containerStyle}>
            <img src={logo} alt="My picture" className="wblogo" />
            <h1>warboard manager</h1>

            <button style={buttonStyle} onClick={() => navigate("/gamemaster")}>
              Game Master
            </button>
            <button style={buttonStyle} onClick={() => navigate("/player")}>
              Player
            </button>
            <button style={buttonStyle} onClick={() => navigate("/howtouse")}>
              How to Use
            </button>
          </div>
        }
      />

      {/* Other pages */}
      <Route path="/gamemaster" element={<Gamemaster />} />
      <Route path="/player" element={<Player />} />
      <Route path="/howtouse" element={<HowToUse />} />
    </Routes>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
  gap: "20px",
  backgroundColor: "#ffffffff"
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "30px",
  cursor: "pointer",
  borderRadius: "8px",
  minWidth: "250px",
  border: "none",
  backgroundColor: "#4e524eff",
  color: "white"
};
