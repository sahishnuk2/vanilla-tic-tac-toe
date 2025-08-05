export default class View {
  // Elements
  $ = {};
  // List of elements
  $$ = {};

  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.p1wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$.grid = this.#qs('[data-id="grid"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI-Only Event Listeners
    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
    // this.$$.squares.forEach(square => {
    //     square.addEventListener("click", () => handler(square));
    // });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      currentPlayer,
      moves,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearAll();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initialiseMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "It's a Tie!");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  // DOM Helper Methods
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menu.classList.toggle("border");

    const icon = this.#qs("i", this.$.menuBtn);

    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menu.classList.remove("border");

    const icon = this.#qs("i", this.$.menuBtn);
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  #clearAll() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initialiseMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);
      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);

    squareEl.replaceChildren(icon);
  }

  #updateScoreboard(p1wins, p2wins, ties) {
    this.$.p1wins.innerText = `${p1wins} wins`;
    this.$.p2wins.innerText = `${p2wins} wins`;
    this.$.ties.innerText = `${ties}`;
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find elements");
    return el;
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");
    return elList;
  }

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
