import "./App.css";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <main>
        <div className="grid" data-id="grid">
          <div className="turn" data-id="turn">
            <i className="fa-solid fa-x yellow"></i>
            <p className="yellow">Player 1, you're up!</p>
          </div>
          <div className="menu" data-id="menu">
            <button className="menu-btn" data-id="menu-btn">
              Actions
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div className="items border hidden" data-id="menu-items">
              <button data-id="reset-btn">Reset</button>
              <button data-id="new-round-btn">New Round</button>
            </div>
          </div>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            return (
              <div key={squareId} className="square shadow" data-id="square">
                <i className="fa-solid fa-x turquoise"></i>
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span data-id="p1-wins">0 Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span data-id="ties">0</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span data-id="p2-wins">0 Wins</span>
          </div>
        </div>
      </main>

      <Footer />

      <div className="modal hidden" data-id="modal">
        <div className="modal-contents">
          <p data-id="modal-text">Player 1 wins!</p>
          <button data-id="modal-btn">Play Again</button>
        </div>
      </div>
      <script src="./dist/script.js" type="module"></script>
    </>
  );
}
