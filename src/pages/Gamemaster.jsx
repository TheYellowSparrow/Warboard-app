import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Gamemaster() {
  const navigate = useNavigate();

  const [showCities, setShowCities] = useState(true);
  const [showPlayers, setShowPlayers] = useState(true);

  const cityList = [
    "Tromso", "Helsinki", "Stockholm", "Oslo", "London", "Leningrad", "Stalingrad", "Moscow", "Kyiv", "Talinn",
    "Hamburg", "Berlin", "Amsterdam", "Warsaw", "Cologne", "Paris", "Toulouse", "Milan", "Rome", "Tunis",
    "Sarajevo", "Budapest", "Bucharest", "Sofia", "Arta", "Istanbul", "Adana", "Yerevan", "Baghdad", "Damascus",
    "Madrid", "Lisbon", "Gibraltar", "Marrakech", "Algiers"
  ];

  const buildingIcons = ["🏭", "🪖", "🎯", "🚜", "✈️", "⭐"];
  const playerColors = ["🔵", "🔴", "⚫", "🟢", "🟡", "🟤", "🟠"];

  const initialCities = cityList.map((_, index) => {
  let ownerIndex = Math.floor(index / 5); // 0 for first 5, 1 for next 5, etc.
  return {
    slots: Array(6).fill(0),
    colourIndex: ownerIndex,
    core: "Yes"
  };
});;

  const initialPlayers = playerColors.map(() => ({ balance: 500 }));

  const [cities, setCities] = useState(() => {
  const saved = localStorage.getItem("gm_cities");
  return saved ? JSON.parse(saved) : initialCities;
});

const [players, setPlayers] = useState(() => {
  const saved = localStorage.getItem("gm_players");
  return saved ? JSON.parse(saved) : initialPlayers;
});

useEffect(() => {
  localStorage.setItem("gm_cities", JSON.stringify(cities));
}, [cities]);

useEffect(() => {
  localStorage.setItem("gm_players", JSON.stringify(players));
}, [players]);

  const changeLevel = (cityIndex, slotIndex, delta) => {
    setCities(prev => {
      const updated = [...prev];
      const newLevel = Math.min(3, Math.max(0, updated[cityIndex].slots[slotIndex] + delta));
      updated[cityIndex] = {
        ...updated[cityIndex],
        slots: updated[cityIndex].slots.map((lvl, i) => i === slotIndex ? newLevel : lvl)
      };
      return updated;
    });
  };

  const changeColour = (cityIndex, newIndex) => {
    setCities(prev => {
      const updated = [...prev];
      updated[cityIndex] = { ...updated[cityIndex], colourIndex: newIndex };
      return updated;
    });
  };

  const changeCore = (cityIndex, newCore) => {
    setCities(prev => {
      const updated = [...prev];
      updated[cityIndex] = { ...updated[cityIndex], core: newCore };
      return updated;
    });
  };

  const calculateOutput = (city) => {
    const base = city.core === "Yes" ? 100 : 50;
    const industryLevel = city.slots[0];
    const bonusPerLevel = city.core === "Yes" ? 20 : 10;
    return base + (industryLevel * bonusPerLevel);
  };

  const adjustBalance = (playerIndex, delta) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[playerIndex] = {
        ...updated[playerIndex],
        balance: updated[playerIndex].balance + delta
      };
      return updated;
    });
  };
const resetGame = () => {
  localStorage.removeItem("gm_cities");
  localStorage.removeItem("gm_players");
  setCities(initialCities);
  setPlayers(initialPlayers);
};


  const nextRound = () => {
    setPlayers(prev => {
      const updated = [...prev];
      cities.forEach(city => {
        const owner = city.colourIndex;
        updated[owner].balance += calculateOutput(city);
      });
      return updated;
    });
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Game Master</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button style={buttonStyle} onClick={() => setShowCities(!showCities)}>
          {showCities ? "Hide Cities" : "Show Cities"}
        </button>
        <button style={buttonStyle} onClick={() => setShowPlayers(!showPlayers)}>
          {showPlayers ? "Hide Players" : "Show Players"}
        </button>
        <button style={buttonStyle} onClick={nextRound}>Next Round</button>
        <button style={buttonStyle} onClick={() => navigate("/")}>Home</button>
        <button style={buttonStyle} onClick={resetGame}>
  Restart Game
</button>
      </div>

      {showCities && (
        <div style={gridStyle}>
          {cityList.map((name, i) => (
            <div key={i} style={cityCardStyle}>
              <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{name}</h3>

              <div style={colourSlotStyle}>
                <span style={{ fontSize: "24px" }}>{playerColors[cities[i].colourIndex]}</span>
                <select
                  value={cities[i].colourIndex}
                  onChange={(e) => changeColour(i, parseInt(e.target.value))}
                  style={dropdownStyle}
                >
                  {playerColors.map((emoji, index) => (
                    <option key={index} value={index}>{emoji}</option>
                  ))}
                </select>
              </div>

              <div style={coreStyle}>
                <label>Core:</label>
                <select
                  value={cities[i].core}
                  onChange={(e) => changeCore(i, e.target.value)}
                  style={dropdownStyle}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                Output: <strong>{calculateOutput(cities[i])}</strong>
              </div>

              <div style={slotRowStyle}>
                {cities[i].slots.map((level, j) => (
                  <div key={j} style={slotStyle}>
                    <div style={{ fontSize: "20px" }}>{buildingIcons[j]}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button style={smallButton} onClick={() => changeLevel(i, j, -1)}>-</button>
                      <span>{level}</span>
                      <button style={smallButton} onClick={() => changeLevel(i, j, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPlayers && (
        <div style={{ marginTop: "2rem" }}>
          <div style={playerGridStyle}>
            {players.map((player, i) => (
              <div key={i} style={playerCardStyle}>
                <div style={{ fontSize: "24px", textAlign: "center" }}>{playerColors[i]}</div>
                <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
                  Balance: <strong>{player.balance}</strong>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "6px",
                  marginTop: "0.5rem"
                }}>
                  <button style={smallButton} onClick={() => adjustBalance(i, -10)}>–10</button>
                  <button style={smallButton} onClick={() => adjustBalance(i, -100)}>–100</button>
                  <button style={smallButton} onClick={() => adjustBalance(i, 10)}>+10</button>
                  <button style={smallButton} onClick={() => adjustBalance(i, 100)}>+100</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Styles */
const buttonStyle = {
  padding: "10px 16px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4e524e",
  color: "white"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "15px",
  marginTop: "1rem"
};

const cityCardStyle = {
  backgroundColor: "#333",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #555"
};

const colourSlotStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginBottom: "0.5rem"
};

const coreStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  marginTop: "0.5rem"
};

const slotRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  justifyContent: "center",
  marginTop: "0.5rem"
};

const slotStyle = {
  backgroundColor: "#eee",
  color: "#000",
  padding: "5px",
  borderRadius: "5px",
  textAlign: "center",
  fontWeight: "bold",
  border: "1px solid #ccc",
  width: "55px"
};

const smallButton = {
  padding: "6px 8px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#4e524e",
  color: "white"
};

const dropdownStyle = {
  fontSize: "14px",
  padding: "2px"
};

const playerGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "15px",
  marginTop: "1rem"
};

const playerCardStyle = {
  backgroundColor: "#444",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #666",
  color: "white"
};
