import WebSocket from "ws";

import {
  clientCreateGame,
  clientStartGame,
  clientAttack,
  clientTurn,
  clientFinish,
  clientUpdateWinners,
} from "../clientActionHandler";

import { Ship, SingleGame } from "../types/gameTypes";
import { GamesHandler } from "../gamesHandler";
import { SinglPlayShips } from "./singlePlayShips";
import { TypesServerAction } from "../types/logHandlerTypes";
import { TypesServerResponse } from "../types/typesOfRequestResponse";

export class SinglePlayHandler extends GamesHandler {
  private singleGames: SingleGame[] = [];

  private singlPlayShips = new SinglPlayShips();

  private bot_delay = 1000;

  public addSingleGame = (ws: WebSocket): void => {
    const game: SingleGame = {
      gameId: crypto.randomUUID(),
      player: {
        indexPlayer: this.webSoketHandler.getPlayerIDByWS(ws),
        ships: [],
        ws,
        shots: new Set(),
      },
      bot: {
        indexPlayer: "bot",
        ships: [],
        shots: new Set(),
        ws,
      },
      isCurrentPlayer: Math.random() > 0.5,
    };
    let ships = this.singlPlayShips.getShips();
    ships = ships.map((ship) => {
      ship.shots = new Array<boolean>(ship.length).fill(false);
      return ship;
    });
    game.bot.ships = ships;
    this.singleGames.push(game);

    clientCreateGame(ws, game.gameId, game.player.indexPlayer);
  };

  public addShipsToSingleGame = (
    gameId: string,
    indexPlayer: string,
    ships: Ship[],
  ): void => {
    const player = this.singleGames.find(
      (game) => game.gameId === gameId,
    )?.player;

    if (!player) {
      throw new Error(
        `Player with index ${indexPlayer} not found in game ${gameId} gameSingleHandler:58`,
      );
    }

    player.ships = ships.map((ship) => {
      ship.shots = new Array<boolean>(ship.length).fill(false);
      return ship;
    });
  };

  public isSinglePlay = (gameId: string): boolean =>
    this.singleGames.some((game) => game.gameId === gameId);

  public startSingleGame = (gameId: string): void => {
    const game = this.singleGames.find((game) => game.gameId === gameId);
    if (!game) {
      throw new Error("single game is not found");
    }
    clientStartGame(game.player.ws, game.player.ships, game.player.indexPlayer);
    clientTurn(
      game.player.ws,
      game.isCurrentPlayer ? game.player.indexPlayer : "bot",
    );

    if (!game.isCurrentPlayer) {
      setTimeout(() => {
        this.botAttackAction(gameId);
      }, this.bot_delay);
    }
  };

  private botAttackAction(gameId: string): void {
    const game = this.singleGames.find((game) => game.gameId === gameId);
    if (!game) {
      return;
    }

    const { x, y } = this.getRandomShot(game?.bot);

    const attackResult = this.getAttackResult(game.player.ships, x, y);
    clientAttack(game.player.ws, game.bot.indexPlayer, attackResult.status, {
      x,
      y,
    });
    game.bot.shots.add(`${x},${y}`);
    // console.log("бот атакует", attackResult.status);
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("ship is empty");
      }
      this.shipKilled(game, attackResult.ship);
    }

    if (attackResult.status === "miss") {
      game.isCurrentPlayer = true;
    }
    clientTurn(
      game.player.ws,
      game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
    );
    if (attackResult.status !== "miss") {
      setTimeout(() => {
        this.botAttackAction(gameId);
      }, this.bot_delay);
    }
  }

  public singleGameAttackAction = (
    gameId: string,
    // indexPlayer: string,
    x: number,
    y: number,
  ): void => {
    const game = this.singleGames.find((game) => game.gameId === gameId);
    if (!game) throw new Error("singleGame is not found");
    const player = this.usersHandler.getPlayerName(game.player.indexPlayer);

    if (!game.isCurrentPlayer) {
      this.consoleLog.serverAction(TypesServerAction.not_current_player, {
        player1: "bot",
        player2: player,
      });

      return;
    }
    if (game.player.shots.has(`${x},${y}`)) {
      this.consoleLog.serverAction(TypesServerAction.reshot, {
        attackPlayer: "bot",
        targetPlayer: player,
        x,
        y,
      });
      clientTurn(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      );
      return;
    }
    // const player = game?.currentPlayer === game.players
    game.player.shots.add(`${x},${y}`);

    const attackResult = this.getAttackResult(
      game.bot.ships, // this.getShipsOtherPlayer(game),
      x,
      y,
    );

    clientAttack(game.player.ws, game.player.indexPlayer, attackResult.status, {
      x,
      y,
    });

    // console.log("игрок атакует ", attackResult);
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("ship is not found");
      }
      this.shipKilled(game, attackResult.ship);
    }

    // if (this.isAllShipIsKill(game.bot.ships)) {
    //   return

    // }

    if (attackResult.status === "miss") {
      game.isCurrentPlayer = false;
      setTimeout(() => {
        this.botAttackAction(gameId);
      }, this.bot_delay);
    }
    if (this.singleGames.includes(game)) {
      clientTurn(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      );
    }
  };

  private isAllShipIsKill(ships: Ship[]): boolean {
    const result = ships.every((ship) => ship.shots.every(Boolean));
    return result;
  }

  private shipKilled(game: SingleGame, ship: Ship): void {
    this.consoleLog.serverAction(TypesServerAction.killed, {});
    this.missesAroundShipSinglePlay(game, ship);

    const otherPlayerShips = game.isCurrentPlayer
      ? game.bot.ships
      : game.player.ships;
    if (this.isAllShipIsKill(otherPlayerShips)) {
      clientFinish(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      );

      if (game.isCurrentPlayer) {
        this.usersHandler.addWinner(game.player.indexPlayer);
        this.consoleLog.serverResponse(TypesServerResponse.update_winners, {});
        const winners = this.usersHandler.getWinners();
        this.webSoketHandler.getAllWS().forEach((ws) => {
          clientUpdateWinners(ws.ws, winners);
        });
      }

      this.deleteSingleGame(game);
    }
  }

  private deleteSingleGame(game: SingleGame): void {
    this.singleGames = this.singleGames.filter((element) => element !== game);
  }

  private missesAroundShipSinglePlay(game: SingleGame, ship: Ship): void {
    type PositionIndex = "x" | "y";
    const widthCoordinate: PositionIndex = ship.direction ? "x" : "y";
    const lengthCoordinate: PositionIndex = ship.direction ? "y" : "x";
    const position = { x: ship.position.x, y: ship.position.y };
    const currentPlayer = game.isCurrentPlayer ? game.player : game.bot;

    const sendMiss = (): void => {
      clientAttack(game.player.ws, currentPlayer.indexPlayer, "miss", position);
      currentPlayer.shots.add(`${position.x},${position.y}`);
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
  public playerOffline(playerID: string): void {
    const game = this.singleGames.find(
      (game) => game.player.indexPlayer === playerID,
    );
    if (!game) {
      return;
    }
    // const player = game.players[0].indexPlayer === playerID ? game.players[1] : game.players[0];
    // clientFinish(otherPlayer.ws, otherPlayer.indexPlayer);
    // this.webSoketHandler.addWebSoket(ws, newPlayer.index)
    //  clientRegistration(ws, name, newPlayer.index);Y
    // this.setWinAndcloseGame(game)
    this.deleteSingleGame(game);
  }
  public singleRandomAttack(gameId: string): void {
    const game = this.singleGames.find(
      (game) => game.gameId === gameId,
    ) as SingleGame;
    // const otherPlayer = game.currentPlayer === game.players[0] ? game.players[1] : game.players[0]

    const { x, y } = this.getRandomShot(game.player);
    this.consoleLog.serverAction(TypesServerAction.random_attack, {
      targetPlayer: this.usersHandler.getPlayerName(game.player.indexPlayer),
      x,
      y,
    });
    this.singleGameAttackAction(gameId, x, y);
  }
}
