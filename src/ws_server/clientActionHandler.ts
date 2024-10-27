import WebSocket from "ws";
import { Room, Winner, Ship } from "./types/dataTypes";
import { ConsoleLog } from "./logHandlers";
import { TypesServerResponse } from "./types/typesOfRequestResponse";

export function clientRegistrationSuccest(
  ws: WebSocket,
  name: string,
  index: string,
) : void {
  ws.send(
    JSON.stringify({
      type: "reg",
      data: JSON.stringify({
        name,
        index,
        error: false,
        errorText: "",
      }),
      id: 0,
    }),
  );
}

export function clientRegistrationError(
  ws: WebSocket,
  name: string,
  errorText: string,
) : void{
  ws.send(
    JSON.stringify({
      type: "reg",
      data: JSON.stringify({
        name,
        index: "",
        error: true,
        errorText,
      }),
      id: 0,
    }),
  );
}

export function clientUpdateRoom(ws: WebSocket, rooms: Room[]) : void {
  ws.send(
    JSON.stringify({
      type: "update_room",
      data: JSON.stringify(rooms),
      id: 0,
    }),
  );
}

export function clientUpdateWinners(ws: WebSocket, winners: Winner[]) : void {
  ws.send(
    JSON.stringify({
      type: "update_winners",
      data: JSON.stringify(winners),
      id: 0,
    }),
  );
}

export function clientCreateGame(
  ws: WebSocket,
  idGame: string,
  idPlayer: string,
) : void {
  ws.send(
    JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame,
        idPlayer,
      }),
      id: 0,
    }),
  );
}

export function clientStartGame(
  ws: WebSocket,
  ships: Ship[],
  currentPlayerIndex: string,
) : void {
  ws.send(
    JSON.stringify({
      type: "start_game",
      data: JSON.stringify({
        ships,
        currentPlayerIndex,
      }),
      id: 0,
    }),
  );
}

export function clientAttack(
  ws: WebSocket,
  currentPlayer: string,
  status: string,
  position: { x: number; y: number },
) : void {
 // console.log("отправка на клиент атаки");
  
 const consoleLog = new ConsoleLog();
 consoleLog.serverResponse(TypesServerResponse.attack, {name: currentPlayer, status, x: position.x, y: position.y}) 

  ws.send(
    JSON.stringify({
      type: "attack",
      data: JSON.stringify({
        position,
        currentPlayer,
        status,
      }),
      id: 0,
    }),
  );
}

export function clientTurn(ws: WebSocket, currentPlayer: string) : void {
  const consoleLog = new ConsoleLog();
  consoleLog.serverResponse(TypesServerResponse.turn, {name: currentPlayer})
  ws.send(
    JSON.stringify({
      type: "turn",
      data: JSON.stringify({
        currentPlayer,
      }),
      id: 0,
    }),
  );
}

export function clientFinish(ws: WebSocket, winPlayer: string) : void {
  const consoleLog = new ConsoleLog();
  consoleLog.serverResponse(TypesServerResponse.finish, {name: winPlayer})
  ws.send(
    JSON.stringify({
      type: "finish",
      data: JSON.stringify({
        winPlayer,
      }),
      id: 0,
    }),
  );
}
