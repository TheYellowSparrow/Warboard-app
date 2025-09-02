import { useNavigate } from "react-router-dom";

export default function Howtouse() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem", color: "white", position: "relative" }}>
      {/* Home Button */}
      <button
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          padding: "8px 14px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#4e524e",
          color: "white",
          cursor: "pointer"
        }}
        onClick={() => navigate("/")}
      >
        Home
      </button>

      <h2 style={{ marginBottom: "1rem" }}>How to Use the App</h2>

      <div style={{ lineHeight: "1.5", fontSize: "14px", maxWidth: "800px" }}>
        <p>
          This app is designed to help manage your strategy game in real time, whether you’re the Gamemaster or a player.
          It keeps track of cities, buildings, units, and player balances, and it works seamlessly on mobile devices.
        </p>

        <h3>Gamemaster Page</h3>
        <p>
          The Gamemaster view lets you see and manage <strong>all cities</strong> in the game. You can:
        </p>
        <ul>
          <li>Toggle visibility of the city list</li>
          <li>Change building levels for each city</li>
          <li>Set the city’s core status</li>
          <li>Assign ownership by player colour</li>
          <li>Automatically add each city’s output to the owning player’s balance with <em>Next Round</em></li>
        </ul>

        <h3>Player Dashboard</h3>
        <p>
          Each player has their own dashboard to manage their cities and balance. You can:
        </p>
        <ul>
          <li>Show or hide your cities</li>
          <li>Add new cities (with default settings)</li>
          <li>Rename cities (max 15 characters)</li>
          <li>Delete cities you no longer control</li>
          <li>Adjust building levels and core status</li>
          <li>See each city’s output and total it into your balance with <em>Next Round</em></li>
        </ul>

        <h3>Shop</h3>
        <p>
          The shop lets you purchase buildings and units. You can:
        </p>
        <ul>
          <li>Open the shop from the main button row</li>
          <li>Toggle <strong>Comintern</strong> (-20% unit prices) or <strong>Axis</strong> (+10% unit prices)</li>
          <li>Add or remove items from your basket</li>
          <li>See the total cost and buy if you have enough balance</li>
        </ul>

        <h3>Manual Money</h3>
        <p>
          Use the Manual Money button to quickly adjust your balance for trades or special events:
        </p>
        <ul>
          <li>-10, -100, +10, +100 buttons adjust your balance instantly</li>
          <li>All changes are saved automatically</li>
        </ul>

        <h3>Persistence</h3>
        <p>
          All your data — cities, balances, and even your shop basket — is saved in your browser’s local storage.
          This means you can refresh or close the app and pick up right where you left off.
        </p>

        <h3>Tips for Mobile Use</h3>
        <ul>
          <li>Buttons are large enough for touch input</li>
          <li>Scroll to see all your cities or shop items</li>
          <li>Use the Home button to quickly return to the main menu</li>
        </ul>

        <p>
          With these tools, you can run your game smoothly without losing track of resources or city stats.
          Whether you’re managing the whole map or just your own empire, the app keeps everything organised and up to date.
          <br></br>
          <br></br>
        </p>

        <p>
  You can read the full rules in my{" "}
  <a 
    href="https://docs.google.com/document/d/1MZV8_ZXXcG3VI_SXNwmRnDwBozoVvqRodCowFi93Gj4/edit?usp=sharing" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "#4da3ff", textDecoration: "underline" }}
  >
    Google Docs guide
  </a>.
</p>
      </div>
    </div>
  );
}
