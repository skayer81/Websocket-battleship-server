import WebSocket from "ws";

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
  shots: boolean[];
}

export interface Player {
  indexPlayer: string;
  ships: Ship[] | [];
  ws: WebSocket;
  shots: Set<string>;
}

export interface Bot {
  indexPlayer: "bot";
  ships: Ship[] | [];
  ws: WebSocket;
  shots: Set<string>;
}

export interface Game {
  gameId: string;
  players: [Player, Player];
  currentPlayer: Player;
}

export interface SingleGame {
  gameId: string;
  player: Player;
  bot: Bot;
  isCurrentPlayer: boolean;
}

export interface AttackResult {
  status: string;
  ship: Ship | null;
}
