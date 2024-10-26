import WebSocket from "ws";
// import { WebSoketHandler } from "../webSoketHandler"; //; = require("ws");
import {
  clientCreateGame,
  clientStartGame,
  clientAttack,
  clientTurn,
  clientFinish,
  clientUpdateWinners,
} from "../clientActionHandler";

// import { RoomsHandler } from "../roomsHandler";
import { Ship, Player, Game, SingleGame, Bot } from "../types/gameTypes";
import { GamesHandler } from "../gamesHandler";
import { SinglPlayShips } from "./singlePlayShips";
import { UsersHandler } from "../usersHandler";

export class SinglePlayHandler extends GamesHandler {
  private singleGames: SingleGame[] = [];

  private singlPlayShips = new SinglPlayShips();

  //private usersHandler = new UsersHandler()

  private bot_delay = 0;

  public addSingleGame =   (ws: WebSocket): void => {
    console.log('запустили addSingleGame')
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
        ships: [], //   this.singlPlayShips.getShips(),
        shots: new Set(),
        ws,
      },
      isCurrentPlayer: Math.random() > 0.5,
    };
    let ships = this.singlPlayShips.getShips();
    ships = ships.map((ship) => {
      ship.shots = new Array(ship.length).fill(false);
      return ship;
    });
    game.bot.ships = ships;
    //   this.addShipsToGame(game.gameId, game.bot.indexPlayer, this.singlPlayShips.getShips())
    // getBotShips(){
    this.singleGames.push(game);

    clientCreateGame(ws, game.gameId, game.player.indexPlayer);
  };

  public addShipsToSingleGame =   (
    gameId: string,
    indexPlayer: string,
    ships: Ship[],
  ) => {
    const player = this.singleGames.find(
      (game) => game.gameId === gameId,
    )?.player;
    // ?.players?.find((player) => player.indexPlayer === indexPlayer); //as Player;

    if (!player) {
      throw new Error(
        `Player with index ${indexPlayer} not found in game ${gameId} gameSingleHandler:58`,
      );
    }

    player.ships = ships.map((ship) => {
      ship.shots = new Array(ship.length).fill(false);
      return ship;
    });
  };

  public isSinglePlay =   (gameId: string) : boolean=>
    // console.log(gameId)  ;
    // console.log(this.singleGames)
    this.singleGames.some((game) => game.gameId === gameId);

  public startSingleGame =   (gameId: string) : void=> {
    const game = this.singleGames.find((game) => game.gameId === gameId);
    if (!game) {
      throw new Error();
    }
    // game?.player.forEach((player) => {
    clientStartGame(game.player.ws, game.player.ships, game.player.indexPlayer);
    clientTurn(
      game.player.ws,
      game.isCurrentPlayer ? game.player.indexPlayer : "bot",
    );

    if (!game.isCurrentPlayer) {
      // if (attackResult.status !== 'miss'){
      setTimeout(() => {
        this.botAttackAction(gameId);
      }, this.bot_delay);
      //  }  // this.botAttackAction(game.gameId)
    }
    // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
    // });
  };

  // public singleGameAttackAction =

  private   botAttackAction(gameId: string) : void {
    const game = this.singleGames.find((game) => game.gameId === gameId);
    if (!game) {
      return
      //throw new Error(",kf,kf,kf");
    }

    const { x, y } = this.getRandomShot(game?.bot);

    const attackResult =   this.getAttackResult(
      game.player.ships, // this.getShipsOtherPlayer(game),
      x,
      y,
    );
    clientAttack(game.player.ws, game.bot.indexPlayer, attackResult.status, {
      x,
      y,
    });
    game.bot.shots.add(`${x},${y}`);
    console.log("бот атакует", attackResult.status);
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("корабль пустой");
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

  public singleGameAttackAction =   (
    gameId: string,
    indexPlayer: string,
    x: number,
    y: number,
  ) => {
    const game = this.singleGames.find((game) => game.gameId === gameId);

    //   const isUserTurn = this.test === data.indexPlayer;
    // if(!game) return
    if (!game?.isCurrentPlayer) {
      return;
    }
    if (game.player.shots.has(`${x},${y}`)) {
      clientTurn(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      )
      return;
    }
    // const player = game?.currentPlayer === game.players
    game.player.shots.add(`${x},${y}`);

    const attackResult =   this.getAttackResult(
      game.bot.ships, // this.getShipsOtherPlayer(game),
      x,
      y,
    );

    clientAttack(game.player.ws, game.player.indexPlayer, attackResult.status, {
      x,
      y,
    });

    console.log("игрок атакует ", attackResult);
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("корабль пустой");
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
    if (game) {
    clientTurn(
      game.player.ws,
      game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
    );}
  };

  private isAllShipIsKill(ships: Ship[]) : boolean {
    const result = ships.every((ship) => ship.shots.every(Boolean));
    return result;
  }

  private shipKilled(game: SingleGame, ship: Ship) : void{
    this.missesAroundShipSinglePlay(game, ship);
    const otherPlayerShips = game.isCurrentPlayer
      ? game.bot.ships
      : game.player.ships;
    //if (this.isAllShipIsKill(otherPlayerShips)) {
      clientFinish(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      );

   
      if (game.isCurrentPlayer) {
         this.usersHandler.addWinner(game.player.indexPlayer)
      }
      const winners = this.usersHandler.getWinners()
     this.webSoketHandler.getAllWS().forEach(  (ws) => {
        clientUpdateWinners(ws.ws,winners )
        // ///////////////обновить виннеров clientUpdateWinners
     });
     this.deleteSingleGame(game);
   // }
  }

  private deleteSingleGame(game: SingleGame): void {
    this.singleGames = this.singleGames.filter((element) => element !== game);
  }

  private missesAroundShipSinglePlay(game: SingleGame, ship: Ship) : void{
    type PositionIndex = "x" | "y";
    const widthCoordinate: PositionIndex = ship.direction ? "x" : "y";
    const lengthCoordinate: PositionIndex = ship.direction ? "y" : "x";
    const position = { x: ship.position.x, y: ship.position.y };
    const currentPlayer = game.isCurrentPlayer ? game.player : game.bot;

    const sendMiss = () => {
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
  public playerOffline(playerID: string): void{
    const game = this.singleGames.find(game => game.player.indexPlayer === playerID);
    if (!game){
      return
    }
    //const player = game.players[0].indexPlayer === playerID ? game.players[1] : game.players[0];
   // clientFinish(otherPlayer.ws, otherPlayer.indexPlayer);
    // this.webSoketHandler.addWebSoket(ws, newPlayer.index)
    //  clientRegistration(ws, name, newPlayer.index);Y
     // this.setWinAndcloseGame(game)
     this.deleteSingleGame(game);


  }
}
