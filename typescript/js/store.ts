import type { Player, GameState } from "./types";

const initialValue: GameState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};

export default class Store extends EventTarget {
  #state = initialValue;

  constructor(
    private readonly storageKey: string,
    private readonly players: Player[]
  ) {
    super();
    // this.storageKey = storageKey;
    // this.players = players;
  }

  #getState(): GameState {
    //return this.#state;
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }

  #saveState(stateOrFn: GameState | ((prev: GameState) => GameState)) {
    const prevState = this.#getState();

    let newState = null;
    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("invalid param type");
        break;
    }

    //this.#state = newState;
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }

  get game() {
    const state = this.#getState();

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    for (const player of this.players) {
      const selectedSquareIds = state.currentGameMoves
        .filter((x) => x.player.id === player.id)
        .map((x) => x.squareId);
      for (const pattern of winningPatterns) {
        if (pattern.every((x) => selectedSquareIds.includes(x))) {
          winner = player;
        }
      }
    }

    const currentPlayer = this.players[state.currentGameMoves.length % 2];
    return {
      currentPlayer,
      moves: state.currentGameMoves,
      status: {
        isComplete: winner != null || state.currentGameMoves.length === 9,
        winner,
      },
    };
  }

  playerMove(squareId: number) {
    const state = this.#getState();
    const stateClone = structuredClone(state);

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  get stats() {
    const state = this.#getState();

    return {
      playerWithStats: this.players.map((player) => {
        const wins = state.history.currentRoundGames.filter(
          (game) => game.status.winner?.id === player.id
        ).length;

        return {
          ...player,
          wins,
        };
      }),
      ties: state.history.currentRoundGames.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }

  reset() {
    const stateClone = structuredClone(this.#getState()) as GameState;

    const { status, moves } = this.game;

    if (status.isComplete) {
      stateClone.history.currentRoundGames.push({
        moves,
        status,
      });
    }

    stateClone.currentGameMoves = [];

    this.#saveState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#saveState(stateClone);
  }
}
