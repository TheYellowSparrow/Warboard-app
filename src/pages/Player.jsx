import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerDashboard() {
  const navigate = useNavigate();

  const buildingIcons = ["🏭", "🪖", "🎯", "🚜", "✈️", "⭐"];

  const buildingPrices = {
    "Industry": 200,
    "Barracks": 100,
    "Ordnance Foundry": 100,
    "Tank Factory": 100,
    "Plane Factory": 100
  };

  const unitPrices = {
    "Infantry": 200,
    "Mot. Infantry": 400,
    "Paratroopers": 400,
    "Artillery": 300,
    "Mot. Artillery": 500,
    "Anti Tank Cannon": 200,
    "Anti Air": 200,
    "Armored Car": 400,
    "Tank": 400,
    "Interceptor": 250,
    "Bomber": 400
  };

  const initialCities = [];

  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem("player_cities");
    return saved ? JSON.parse(saved) : initialCities;
  });

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("player_balance");
    return saved ? JSON.parse(saved) : 500;
  });

  const [showCities, setShowCities] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showManualMoney, setShowManualMoney] = useState(false);
  const [comintern, setComintern] = useState(false);
  const [axis, setAxis] = useState(false);
  const [basket, setBasket] = useState(() => {
    const saved = localStorage.getItem("player_basket");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("player_cities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem("player_balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("player_basket", JSON.stringify(basket));
  }, [basket]);

  const addCity = () => {
    const newCity = {
      name: `City ${cities.length + 1}`,
      slots: Array(6).fill(0),
      core: "Yes"
    };
    setCities([...cities, newCity]);
  };

  const renameCity = (cityIndex) => {
    const newName = prompt("Enter new city name (max 15 characters):", cities[cityIndex].name);
    if (newName && newName.trim() !== "") {
      if (newName.trim().length > 15) {
        alert("City name must be 15 characters or fewer.");
        return;
      }
      setCities(prev => {
        const updated = [...prev];
        updated[cityIndex] = { ...updated[cityIndex], name: newName.trim() };
        return updated;
      });
    }
  };

  const deleteCity = (cityIndex) => {
    setCities(prev => prev.filter((_, i) => i !== cityIndex));
  };

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

  const nextRound = () => {
    let total = 0;
    cities.forEach(city => {
      total += calculateOutput(city);
    });
    setBalance(prev => prev + total);
  };

  const resetGame = () => {
    localStorage.removeItem("player_cities");
    localStorage.removeItem("player_balance");
    localStorage.removeItem("player_basket");
    setCities([]);
    setBalance(500);
    setBasket({});
  };

  const getAdjustedUnitPrice = (base) => {
    let price = base;
    if (comintern) price *= 0.8;
    if (axis) price *= 1.1;
    return Math.round(price);
  };

  const addToBasket = (item, type) => {
    setBasket(prev => {
      const key = `${type}:${item}`;
      return { ...prev, [key]: (prev[key] || 0) + 1 };
    });
  };

  const removeFromBasket = (item, type) => {
    setBasket(prev => {
      const key = `${type}:${item}`;
      if (!prev[key]) return prev;
      const updated = { ...prev, [key]: prev[key] - 1 };
      if (updated[key] <= 0) delete updated[key];
      return updated;
    });
  };

  const calculateBasketTotal = () => {
    let total = 0;
    for (const [key, qty] of Object.entries(basket)) {
      const [type, name] = key.split(":");
      if (type === "building") total += buildingPrices[name] * qty;
      else if (type === "unit") total += getAdjustedUnitPrice(unitPrices[name]) * qty;
    }
    return total;
  };

  const buyItems = () => {
    const total = calculateBasketTotal();
    if (balance >= total) {
      setBalance(prev => prev - total);
      setBasket({});
    } else {
      alert("Not enough balance!");
    }
  };

    return (
    <div style={{ padding: "2rem", color: "white" }}>
      {/* Balance in top right */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "1.2rem" }}>
        Balance: <strong>{balance}</strong>
      </div>

      <h2>Player Dashboard</h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button style={buttonStyle} onClick={() => setShowCities(!showCities)}>
          {showCities ? "Hide Cities" : "Show Cities"}
        </button>
        {showCities && (
          <button style={buttonStyle} onClick={addCity}>
            Add City
          </button>
        )}
        <button style={buttonStyle} onClick={() => setShowShop(!showShop)}>
          {showShop ? "Close Shop" : "Shop"}
        </button>
        <button style={buttonStyle} onClick={() => setShowManualMoney(!showManualMoney)}>
          {showManualMoney ? "Close Manual Money" : "Manual Money"}
        </button>
        <button style={buttonStyle} onClick={nextRound}>Next Round</button>
        <button style={buttonStyle} onClick={resetGame}>Restart</button>
        <button style={buttonStyle} onClick={() => navigate("/")}>Home</button>
      </div>

      {/* Manual Money Panel */}
      {showManualMoney && (
        <div style={{ backgroundColor: "#222", padding: "0.5rem", marginTop: "0.5rem", borderRadius: "8px" }}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button style={smallButton} onClick={() => setBalance(prev => prev - 10)}>–10</button>
            <button style={smallButton} onClick={() => setBalance(prev => prev - 100)}>–100</button>
            <button style={smallButton} onClick={() => setBalance(prev => prev + 10)}>+10</button>
            <button style={smallButton} onClick={() => setBalance(prev => prev + 100)}>+100</button>
          </div>
        </div>
      )}

      {/* Shop */}
      {showShop && (
        <div style={{ backgroundColor: "#222", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
          {/* Toggles */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "1rem" }}>
            <label>
              <input type="checkbox" checked={comintern} onChange={() => setComintern(!comintern)} /> Comintern (-20% units)
            </label>
            <label>
              <input type="checkbox" checked={axis} onChange={() => setAxis(!axis)} /> Axis (+10% units)
            </label>
          </div>

          {/* Buildings */}
          <h4>Buildings</h4>
          {Object.entries(buildingPrices).map(([name, price]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>{name} - {price}</span>
              <div>
                <button style={smallButton} onClick={() => removeFromBasket(name, "building")}>-</button>
                <span style={{ margin: "0 8px" }}>{basket[`building:${name}`] || 0}</span>
                <button style={smallButton} onClick={() => addToBasket(name, "building")}>+</button>
              </div>
            </div>
          ))}

          {/* Units */}
          <h4>Units</h4>
          {Object.entries(unitPrices).map(([name, price]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>{name} - {getAdjustedUnitPrice(price)}</span>
              <div>
                <button style={smallButton} onClick={() => removeFromBasket(name, "unit")}>-</button>
                <span style={{ margin: "0 8px" }}>{basket[`unit:${name}`] || 0}</span>
                <button style={smallButton} onClick={() => addToBasket(name, "unit")}>+</button>
              </div>
            </div>
          ))}

          {/* Basket Summary */}
          <div style={{ marginTop: "1rem", borderTop: "1px solid #555", paddingTop: "0.5rem" }}>
            <strong>Total: {calculateBasketTotal()}</strong>
            <button style={{ ...buttonStyle, marginLeft: "1rem" }} onClick={buyItems}>Buy</button>
          </div>
        </div>
      )}

      {/* Cities */}
      {showCities && (
        <div style={gridStyle}>
          {cities.map((city, cityIndex) => (
            <div key={cityIndex} style={cityCardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{city.name}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={penButton} onClick={() => renameCity(cityIndex)} title="Rename City">✏️</button>
                  <button style={deleteButton} onClick={() => deleteCity(cityIndex)} title="Delete City">🗑️</button>
                </div>
              </div>

              {/* Core Selector */}
              <div style={coreStyle}>
                <label>Core:</label>
                <select
                  value={city.core}
                  onChange={(e) => changeCore(cityIndex, e.target.value)}
                  style={dropdownStyle}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Output Display */}
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                Output: <strong>{calculateOutput(city)}</strong>
              </div>

              {/* Build Slots */}
              <div style={slotRowStyle}>
                {city.slots.map((level, slotIndex) => (
                  <div key={slotIndex} style={slotStyle}>
                    <div style={{ fontSize: "20px" }}>{buildingIcons[slotIndex]}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button style={smallButton} onClick={() => changeLevel(cityIndex, slotIndex, -1)}>-</button>
                      <span>{level}</span>
                      <button style={smallButton} onClick={() => changeLevel(cityIndex, slotIndex, +1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Styles */
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

const smallButton = {
  padding: "4px 8px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: "4px",
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

const dropdownStyle = {
  fontSize: "14px",
  padding: "2px"
};

const penButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  color: "white"
};

const deleteButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  color: "white"
};