import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { WebSoketHandler } from "../webSoketHandler"; //; = require("ws");
import {
  clientCreateGame,
  clientStartGame,
  clientAttack,
  clientTurn,
  clientFinish,
  clientUpdateWinners,
} from "../clientActionHandler";

import { RoomsHandler } from "../roomsHandler";
import { Ship, Player, Game, SingleGame, Bot } from "../types/gameTypes";
import { GamesHandler } from "../gamesHandler";
import { SinglPlayShips } from "./singlePlayShips";


export class SinglePlayHandler extends GamesHandler {
  singleGames : SingleGame[] = [];
  singlPlayShips = new SinglPlayShips()
  bot_delay = 1000

  public addSingleGame = async(ws: WebSocket) : Promise<void> => {
     const game : SingleGame = {
       gameId: uuidv4(),
       player: {
        indexPlayer: this.webSoketHandler.getPlayerIDByWS(ws),
        ships: [],
        ws,
        shots: new Set()
       },
       bot :{
        indexPlayer: 'bot',
        ships: [], //   this.singlPlayShips.getShips(),
        shots: new Set(),
        ws
       },
       isCurrentPlayer: Math.random() > 0.5 
     }
     let  ships = this.singlPlayShips.getShips();
     ships = ships.map((ship) => {
      ship.shots = new Array(ship.length).fill(false);
      return ship;
    });
    game.bot.ships = ships;
    // await this.addShipsToGame(game.gameId, game.bot.indexPlayer, this.singlPlayShips.getShips())
     //getBotShips(){
     this.singleGames.push(game)

     clientCreateGame(ws, game.gameId, game.player.indexPlayer)
     }

     public addShipsToSingleGame =  async (gameId: string, indexPlayer: string, ships: Ship[]) => {
      const player = this.singleGames
      .find((game) => game.gameId === gameId)?.player
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
     }

     

    public  isSinglePlay = async (gameId: string) => {
      // console.log(gameId)  ;
      // console.log(this.singleGames)
        return this.singleGames.some((game) => game.gameId === gameId)
    }

    public startSingleGame = async (gameId: string) => {
      const game = this.singleGames.find((game) => game.gameId === gameId);
      if(!game) throw new Error()
     // game?.player.forEach((player) => {
        clientStartGame(game.player.ws, game.player.ships, game.player.indexPlayer);
        clientTurn(game.player.ws, game.isCurrentPlayer ? game.player.indexPlayer : 'bot');

        if (!game.isCurrentPlayer){
         // if (attackResult.status !== 'miss'){
            setTimeout(() => {
              this.botAttackAction(gameId)
            }, this.bot_delay)
         //  }  // this.botAttackAction(game.gameId)
        }
        // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
     // });
       }

    // public singleGameAttackAction =   

     private async botAttackAction(gameId: string){
      const game = this.singleGames.find((game) => game.gameId === gameId);
      if (!game) throw new Error(',kf,kf,kf')

      const { x, y } = this.getRandomShot(game?.bot);

       const attackResult = await this.getAttackResult(
        game.player.ships, //this.getShipsOtherPlayer(game),
       x,
       y,
     );
     clientAttack(game.player.ws, game.bot.indexPlayer,
      attackResult.status,
      { x, y },
    );
    game.bot.shots.add(`${x},${y}`);
     console.log('бот атакует', attackResult.status)
     if (attackResult.status === "killed") {
      if (!attackResult.ship) throw new Error("корабль пустой");
      this.shipKilled(game, attackResult.ship)
     }  


     if (attackResult.status === "miss") {
       game.isCurrentPlayer = true 
       }
      clientTurn(game.player.ws, game.isCurrentPlayer ?   game.player.indexPlayer : game.bot.indexPlayer );
     if (attackResult.status !== 'miss'){
      setTimeout(() => {
        this.botAttackAction(gameId)
      }, this.bot_delay)
     }      

     }


     public singleGameAttackAction = async (
      gameId: string,
      indexPlayer: string,
      x: number,
      y: number,
    ) => {
      const game = this.singleGames.find((game) => game.gameId === gameId);
  
      //   const isUserTurn = this.test === data.indexPlayer;
      //if(!game) return
      if (!(game?.isCurrentPlayer)) return;
      if (game.player.shots.has(`${x},${y}`)) {
        return;
      }
      // const player = game?.currentPlayer === game.players
      game.player.shots.add(`${x},${y}`);
  
      const attackResult = await this.getAttackResult(
         game.bot.ships, //this.getShipsOtherPlayer(game),
        x,
        y,
      );
  
      clientAttack(game.player.ws, game.player.indexPlayer,
        attackResult.status,
        { x, y },
      );

      console.log('игрок атакует ', attackResult)
      // const {player1 , player2} = await this.dbHandler.getPlayersInGame(gameId);
  
      // const ws1 =  this.webSoketHandler.getWSByPlayerID(player1)
      // const ws2 = this.webSoketHandler.getWSByPlayerID(player2)
  
      //    const game = this.games.find(game => game.gameId === gameId);
      // game.players.forEach((player) => {
      //   //  clientStartGame(player.ws, player.ships, player.indexPlayer)
      //   clientAttack(
      //     player.ws,
      //     game.currentPlayer.indexPlayer,
      //     attackResult.status,
      //     { x, y },
      //   );
        // clientAttack(player.ws, indexPlayer, attackResult.status, {x:data.x, y:data.y})
  
        // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
     // });
  
      // clientAttack(ws1, indexPlayer, attackResult.status, {x:data.x, y:data.y})
      // clientAttack(ws2, indexPlayer, attackResult.status, {x:data.x, y:data.y})
      /////////////////////////////////////////////////
       if (attackResult.status === "killed") {
        if (!attackResult.ship) throw new Error("корабль пустой");
        this.shipKilled(game, attackResult.ship)
       }  
    
      //   this.missesAroundShip(game, attackResult.ship);
      //   if (this.isAllShipKill(game)) {
      //     clientFinish(game.players[0].ws, game.currentPlayer.indexPlayer);
      //     clientFinish(game.players[1].ws, game.currentPlayer.indexPlayer);
      /////////////////////////////////////////    
          // this.webSoketHandler.addWebSoket(ws, newPlayer.index)
          //  clientRegistration(ws, name, newPlayer.index);
  
        //  await this.dbHandler.addWinner(game.currentPlayer.indexPlayer);
         // const winners = await this.dbHandler.getWinners();
  
      //    this.webSoketHandler.getAllWS().forEach(async (ws) => {
            //  clientUpdateRoom(ws.ws, await this.dbHandler.getRooms());
       //     clientUpdateWinners(ws.ws, winners);
       //   });
          //this.webSoketHandler.getAllWS.
          // clientUpdateWinners(ws.ws, await this.dbHandler.getWinners())

                if (attackResult.status === "miss") {
        game.isCurrentPlayer = false
       // if (attackResult.status !== 'miss'){
          setTimeout(() => {
            this.botAttackAction(gameId)
          }, this.bot_delay)
       //  } 
        }
        clientTurn(game.player.ws, game.isCurrentPlayer ?   game.player.indexPlayer : game.bot.indexPlayer );


       // this.botAttackAction(gameId)

      //  clientTurn(game.players[1].ws, game.currentPlayer.indexPlayer);
      }

      private isAllShipIsKill(ships: Ship[]) {
        //const ships = this.getShipsOtherPlayer(game);
        const result = ships.every((ship) => ship.shots.every(Boolean));
        return result;
      }

      private shipKilled(game:SingleGame , ship: Ship){
      //  if (!attackResult.ship) throw new Error("корабль пустой");
        this.missesAroundShipSinglePlay(game, ship);
        const otherPlayerShips = game.isCurrentPlayer ?  game.bot.ships : game.player.ships;
        if (this.isAllShipIsKill(otherPlayerShips)) {
          clientFinish(game.player.ws, game.isCurrentPlayer? game.player.indexPlayer : game.bot.indexPlayer);
         // clientFinish(game.players[1].ws, game.currentPlayer.indexPlayer);
 
          this.webSoketHandler.getAllWS().forEach(async (ws) => {
            //  clientUpdateRoom(ws.ws, await this.dbHandler.getRooms());
       //     clientUpdateWinners(ws.ws, winners);
          });
      }
      // if (attackResult.status === "killed") {

      //     //this.webSoketHandler.getAllWS.
      //     // clientUpdateWinners(ws.ws, await this.dbHandler.getWinners())
      //   }
      }

      private missesAroundShipSinglePlay(game: SingleGame, ship: Ship) {
        type PositionIndex = "x" | "y";
        const widthCoordinate: PositionIndex = ship.direction ? "x" : "y";
        const lengthCoordinate: PositionIndex = ship.direction ? "y" : "x";
        const position = { x: ship.position.x, y: ship.position.y };
        const currentPlayer = game.isCurrentPlayer ? game.player : game.bot;
    
        const sendMiss = () => {
          // position.x = x;
          // position.y = y;
          clientAttack(
            game.player.ws,
            currentPlayer.indexPlayer,
            "miss",
            position,
          );
          // clientAttack(
          //   game.players[1].ws,
          //   game.currentPlayer.indexPlayer,
          //   "miss",
          //   position,
          // );
          currentPlayer.shots.add(`${position.x},${position.y}`);
        };
    
        // Обрабатываем промахи вокруг корабля
        for (
          let i = ship.position[lengthCoordinate] - 1;
          i <= ship.position[lengthCoordinate] + ship.length;
          i++
        ) {
          position[lengthCoordinate] = i;
          // position[widthСoordinate] = ship.position[widthСoordinate] - 1;
          position[widthCoordinate] = ship.position[widthCoordinate] - 1;
          sendMiss(); // Левый промах
          position[widthCoordinate] = ship.position[widthCoordinate] + 1;
          sendMiss(); // Правый промах
        }
    
        position[lengthCoordinate] = ship.position[lengthCoordinate] - 1;
        position[widthCoordinate] = ship.position[widthCoordinate];
        sendMiss();
        //   clientAttack(ws1, indexPlayer, 'miss', position)
        //  clientAttack(ws2, indexPlayer, 'miss', position)
        position[lengthCoordinate] = ship.position[lengthCoordinate] + ship.length;
        sendMiss();
        //       clientAttack(ws1, indexPlayer, 'miss', position)
        //     clientAttack(ws2, indexPlayer, 'miss', position)
    
        // Промахи над и под кораблем
        //    sendMiss(ship.position[widthCoordinate], ship.position[lengthCoordinate] - 1); // Промах над
        //   sendMiss(ship.position[widthCoordinate], ship.position[lengthCoordinate] + ship.length); // Промах под
      }
    




  

  

      //  game.currentPlayer.shots.add(`${x},${y}`);
      // game.currentPlayer.shoots.add
      //  clientTurn(ws2, this.test)
    };
  

  









