import { GameState, Player } from "./types";

export const players: Player[] = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },

  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

export function derivedStats(state: GameState) {
  return {
    playerWithStats: players.map((player) => {
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

export function derivedGame(state: GameState) {
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
  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
      .filter((x) => x.player.id === player.id)
      .map((x) => x.squareId);
    for (const pattern of winningPatterns) {
      if (pattern.every((x) => selectedSquareIds.includes(x))) {
        winner = player;
      }
    }
  }

  const currentPlayer = players[state.currentGameMoves.length % 2];
  return {
    currentPlayer,
    moves: state.currentGameMoves,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  };
}
