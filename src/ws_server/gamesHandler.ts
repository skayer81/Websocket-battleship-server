import { WebSoketHandler } from "./webSoketHandler"; 
import {
  clientCreateGame,
  clientStartGame,
  clientAttack,
  clientTurn,
  clientFinish,
  clientUpdateWinners,
} from "./clientActionHandler";

import { RoomsHandler } from "./roomsHandler";
import { Ship, Player, Game, AttackResult } from "./types/gameTypes";
import { UsersHandler } from "./usersHandler";
import { ConsoleLog } from "./logHandlers";
import { TypesClientRequest, TypesServerResponse } from "./types/typesOfRequestResponse";
import { TypesServerAction } from "./types/logHandlerTypes";

export class GamesHandler {

  protected webSoketHandler = new WebSoketHandler();

  protected usersHandler = new UsersHandler();

  protected consoleLog = new ConsoleLog()

  private games: Game[] = [];


  private createPlayer(playerID: string): Player {
    return {
      indexPlayer: playerID,
      ws: this.webSoketHandler.getWSByPlayerID(playerID),
      ships: [],
      shots: new Set<string>(),
    };
  }

  public addGame = (player1ID: string, player2ID: string): void => {
    const player1 = this.createPlayer(player1ID);
    const player2 = this.createPlayer(player2ID);
    const currentPlayer = Math.random() > 0.5 ? player1 : player2;
    const game: Game = {
      gameId: crypto.randomUUID(),
      players: [player1, player2],
      currentPlayer,
    };
    this.games.push(game);

    game.players.forEach((player) => {
      clientCreateGame(player.ws, game.gameId, player.indexPlayer);
      this.consoleLog.serverResponse(TypesServerResponse.create_game, {name: this.usersHandler.getPlayerName(player.indexPlayer)})

    });
  };

  public addShipsToGame = (
    gameId: string,
    indexPlayer: string,
    ships: Ship[],
  ): void => {
    const player = this.games
      .find((game) => game.gameId === gameId)
      ?.players?.find((player) => player.indexPlayer === indexPlayer); // as Player;

    if (!player) {
      throw new Error(
        `Player with index ${indexPlayer} not found in game ${gameId} gameHandler:185`,
      );
    }

    player.ships = ships.map((ship) => {
      ship.shots = new Array(ship.length).fill(false);
      return ship;
    });
  };

  public isAllPlayerReady = (gameId: string): boolean => {
    const players = this.games.find((game) => game.gameId === gameId)?.players;
    if (!players) { throw new Error(); }
    return players.every((player) => player.ships.length > 0);
  };

  public startGame = (gameId: string) => {
    const game = this.games.find((game) => game.gameId === gameId);
    game?.players.forEach((player) => {
      clientStartGame(player.ws, player.ships, player.indexPlayer);
      clientTurn(player.ws, game.currentPlayer.indexPlayer);
    });
  };

  private getShipsOtherPlayer(game: Game): Ship[] {

    const result = game.players.find(
      (player) => player !== game.currentPlayer,
    )?.ships;
    if (!result || result.length === 0) {
      throw new Error();
    }

    return result;
  }

  private isAllShipKill(game: Game): boolean {
    const ships = this.getShipsOtherPlayer(game);
    const result = ships.every((ship) => ship.shots.every(Boolean));
    return result;
  }

  protected getRandomShot(player: Player): { x: number; y: number } {
    let shot: { x: number; y: number };
    do {
      shot = {
        x: Math.floor(Math.random() * 10), 
        y: Math.floor(Math.random() * 10), 
      };
    } while (player.shots.has(`${shot.x},${shot.y}`)); 

    return shot; 
  }

  public attackAction = (
    gameId: string,
    indexPlayer: string,
    x: number,
    y: number,
  ) => {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) throw new Error(`game ${gameId} is not found`);

    const attackPlayer = this.usersHandler.getPlayerName(game.currentPlayer.indexPlayer);
    const targetPlayer = this.usersHandler.getPlayerName(game.currentPlayer === game.players[0] ? game.players[1].indexPlayer : game.players[0].indexPlayer );

    if (!(game.currentPlayer.indexPlayer === indexPlayer)) {
      this.consoleLog.serverAction(TypesServerAction.not_current_player, {player1 : attackPlayer, player2: targetPlayer}) 
      return;
    }
    if (game.currentPlayer.shots.has(`${x},${y}`)) {
        this.consoleLog.serverAction(TypesServerAction.reshot,       
          {attackPlayer, 
          targetPlayer, 
          x,
          y
        });
        clientTurn(game.currentPlayer.ws, game.currentPlayer.indexPlayer);
      return;
    }
    game.currentPlayer.shots.add(`${x},${y}`);

    const attackResult = this.getAttackResult(
      this.getShipsOtherPlayer(game),
      x,
      y,
    );

    game.players.forEach((player) => {
      clientAttack(
        player.ws,
        game.currentPlayer.indexPlayer,
        attackResult.status,
        { x, y },
      );
    });

    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("корабль пустой");
      }
      this.consoleLog.serverAction(TypesServerAction.killed, {})
      this.missesAroundShip(game, attackResult.ship);
      if (this.isAllShipKill(game)) {
        clientFinish(game.players[0].ws, game.currentPlayer.indexPlayer);
        clientFinish(game.players[1].ws, game.currentPlayer.indexPlayer);

        this.setWinAndcloseGame(game);

         this.deleteGame(game);
      }
    }
  if(game){  
    if (attackResult.status === "miss") {
      game.currentPlayer =
        game.currentPlayer === game.players[0]
          ? game.players[1]
          : game.players[0];
    }

    clientTurn(game.players[0].ws, game.currentPlayer.indexPlayer);
    clientTurn(game.players[1].ws, game.currentPlayer.indexPlayer);
  }
  };

  protected setWinAndcloseGame(game: Game) {
    this.usersHandler.addWinner(game.currentPlayer.indexPlayer);

    const winners = this.usersHandler.getWinners();
    this.consoleLog.serverResponse(TypesServerResponse.update_winners, {})
    this.webSoketHandler.getAllWS().forEach((ws) => {
      clientUpdateWinners(ws.ws, winners);
    });
    this.deleteGame(game);
  }

  public randomAttack = (gameId: string, playerIndex: string) => {
    const game = this.games.find((game) => game.gameId === gameId) as Game;
    
    
    const { x, y } = this.getRandomShot(game.currentPlayer);
    this.consoleLog.serverAction(TypesServerAction.random_attack, {targetPlayer: game.currentPlayer.indexPlayer, x , y})
    this.attackAction(gameId, playerIndex, x, y);
  };

  private missesAroundShip(game: Game, ship: Ship) {
    type PositionIndex = "x" | "y";
    const widthCoordinate: PositionIndex = ship.direction ? "x" : "y";
    const lengthCoordinate: PositionIndex = ship.direction ? "y" : "x";
    const position = { x: ship.position.x, y: ship.position.y };

    const sendMiss = () => {
      clientAttack(
        game.players[0].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      clientAttack(
        game.players[1].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      game.currentPlayer.shots.add(`${position.x},${position.y}`);
    };

    for (
      let i = ship.position[lengthCoordinate] - 1;
      i <= ship.position[lengthCoordinate] + ship.length;
      i++
    ) {
      position[lengthCoordinate] = i;
      position[widthCoordinate] = ship.position[widthCoordinate] - 1;
      sendMiss(); 
      position[widthCoordinate] = ship.position[widthCoordinate] + 1;
      sendMiss(); 
    }

    position[lengthCoordinate] = ship.position[lengthCoordinate] - 1;
    position[widthCoordinate] = ship.position[widthCoordinate];
    sendMiss();
    position[lengthCoordinate] = ship.position[lengthCoordinate] + ship.length;
    sendMiss();
    }

  
  public getAttackResult = (
    ships: Ship[],
    x: number,
    y: number,
  ): AttackResult => {
    const result: AttackResult = {
      status: "miss",
      ship: null,
    };

    for (const ship of ships) {
      const hit = this.checkHit(ship, x, y);
      if (hit) {
        ship.shots[hit.index] = true;
        result.status = "shot";

        if (ship.shots.every(Boolean)) {
          result.status = "killed";
          result.ship = ship;
        }

        break; 
      }
    }

    return result;
  };

  private checkHit(ship: Ship, x: number, y: number): { index: number } | null {
    if (!ship.direction) {

      if (
        x >= ship.position.x &&
        x < ship.position.x + ship.length &&
        y === ship.position.y
      ) {
        return { index: x - ship.position.x };
      }
    } else {

      if (
        y >= ship.position.y &&
        y < ship.position.y + ship.length &&
        x === ship.position.x
      ) {
        return { index: y - ship.position.y };
      }
    }
    return null; 
  }

  private deleteGame(game: Game): void {
    this.games = this.games.filter((element) => element !== game);
  }

  public playerOffline(playerID: string): void {
    const game = this.games.find(
      (game) =>
        game.players[0].indexPlayer === playerID ||
        game.players[1].indexPlayer === playerID,
    );
    if (!game) {
      return;
    }
    const otherPlayer =
      game.players[0].indexPlayer === playerID
        ? game.players[1]
        : game.players[0];
    clientFinish(otherPlayer.ws, otherPlayer.indexPlayer);
    this.setWinAndcloseGame(game);
  }

 
}
