import type { Player, Move } from "./types";
import { DerivedGame, DerivedStats } from "./store.js";

export default class View {
  // Elements
  $: Record<string, Element> = {};
  // List of elements
  $$: Record<string, NodeListOf<Element>> = {};

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

  bindGameResetEvent(handler: (e: Event) => void) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: (e: Event) => void) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: (sq: Element) => void) {
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
  }

  render(game: DerivedGame, stats: DerivedStats) {
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

  #setTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    label.classList.add(player.colorClass);
    label.textContent = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #openModal(message: string) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.textContent = message;
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

  #initialiseMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);
      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");

    icon.classList.add("fa-solid", player.iconClass, player.colorClass);

    squareEl.replaceChildren(icon);
  }

  #updateScoreboard(p1wins: number, p2wins: number, ties: number) {
    this.$.p1wins.textContent = `${p1wins} wins`;
    this.$.p2wins.textContent = `${p2wins} wins`;
    this.$.ties.textContent = `${ties}`;
  }

  #qs(selector: string, parent?: Element) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find elements");
    return el;
  }

  #qsAll(selector: string) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");
    return elList;
  }

  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      if (!event.target || !(event.target instanceof Element)) {
        throw new Error("Event target not found");
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
