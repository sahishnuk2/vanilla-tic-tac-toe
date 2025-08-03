export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type Moves = {
  squareId: number;
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Game = {
  moves: Moves[];
  status: GameStatus;
};

export type GameState = {
  currentGameMoves: Moves[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};
