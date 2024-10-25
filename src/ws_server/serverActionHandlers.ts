import WebSocket from "ws";
import { RoomsHandler } from "./roomsHandler";
import { WebSoketHandler } from "./webSoketHandler";
import {
    clientRegistrationSuccest,
  clientUpdateRoom,
  clientUpdateWinners,
  clientRegistrationError,
//   clientCreateGame,
//   clientStartGame,
//   clientAttack,
//   clientTurn,
} from "./clientActionHandler";
//import { Ship } from "./types/dataTypes";
import { GamesHandler } from "./gamesHandler";
import { UsersHandler } from "./usersHandler";
import { SinglePlayHandler } from "./singlePlay/singlePlayHandle";

export class ServerActionHandlers {
    roomsHandler = new RoomsHandler();
  webSoketHandler = new WebSoketHandler();
  gamesHandler = new GamesHandler();
  usersHandler = new UsersHandler()
  singlePlayHandler =  new SinglePlayHandler()
  // test = ''

  handleRegistration = async (command: any, ws: WebSocket) => {
    const { name, password } = JSON.parse(command.data);

   // let player;

    if (await this.usersHandler.isPlayerExist(name)) {
        if (! await this.usersHandler.isPasswordCorrect(name, password) ){
            clientRegistrationError(ws, name, 'wrong password')
            return
        }
        if (await this.usersHandler.isUserOnlain(name) ){
            clientRegistrationError(ws, name, 'a user with the same name is already online')
            return
        }
      //  player = await this.usersHandler.getPlayer(name);        //     await this.usersHandler.loginPlayer()

    }
    else {
        await this.usersHandler.addPlayer(name, password);
    }

    const playerID = await this.usersHandler.getPlayerID(name);
    await this.usersHandler.setOnlineStatus(playerID, true);

      this.webSoketHandler.addWebSoket(ws, playerID);
     clientRegistrationSuccest(ws, name, playerID);

     const rooms =  await this.roomsHandler.getRooms();
     const winners = await this.usersHandler.getWinners()

    this.webSoketHandler.getAllWS().forEach(async (ws) => {
      clientUpdateRoom(ws.ws, rooms);
      clientUpdateWinners(ws.ws, winners);
    });
  };

  private async isUserInRoom(ws: WebSocket){
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    return (await this.roomsHandler.isPlayerInRoom(userIndex))
  }


  handleCreateRoom = async (ws: WebSocket) => {
    if (await this.isUserInRoom(ws)) return
    const roomId = await this.roomsHandler.addRoom();
    await this.handleAddUserToRoom(roomId, ws);
    const rooms = await this.roomsHandler.getRooms()
    console.log('комнаты', rooms)
    this.webSoketHandler.getAllWS().forEach(async (ws) => {
      clientUpdateRoom(ws.ws, rooms);
    });
  };

  handleAddUserToRoom = async (roomId: string, ws: WebSocket) => {
    if (await this.isUserInRoom(ws)) return
  //  console.log("старт добавления")
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
  //  console.log("получии индекс")
    await this.roomsHandler.addPlayerToRoom(userIndex, roomId);
  //  console.log("добавили в комнату")

 //   console.log("обновили")
    if (await this.roomsHandler.isRoomFull(roomId)) {
        const { player1, player2 } = await this.roomsHandler.getPlayersInRoom(roomId);
        await this.gamesHandler.addGame(player1, player2);
        await this.roomsHandler.delRoom(roomId);
     // return;
    }

    this.webSoketHandler.getAllWS().forEach(async (ws) => {
        clientUpdateRoom(ws.ws, await this.roomsHandler.getRooms());
      });
 //   console.log('комната полная')
   



  };


  handleAddShips = async (data: any, ws: WebSocket) => { 
    if ( await this.singlePlayHandler.isSinglePlay(data.gameId)){
        await this.singlePlayHandler.addShipsToSingleGame(
            data.gameId,
            data.indexPlayer,
            data.ships,
          );
          await this.singlePlayHandler.startSingleGame(data.gameId); 
          return  
    }

    await this.gamesHandler.addShipsToGame(
      data.gameId,
      data.indexPlayer,
      data.ships,
    );

    if (await this.gamesHandler.isAllPlayerReady(data.gameId)) {
      await this.gamesHandler.startGame(data.gameId);
    }
  };

  handleAttack = async (data: any, ws: WebSocket) => {
    if ( await this.singlePlayHandler.isSinglePlay(data.gameId)){
        this.singlePlayHandler.singleGameAttackAction(
            data.gameId,
            data.indexPlayer,
            data.x,
            data.y,
        )
        return
    }
    this.gamesHandler.attackAction(
      data.gameId,
      data.indexPlayer,
      data.x,
      data.y,
    );

  };

  handlerandomAttack = async (data: any, ws: WebSocket) => {
    if (await this.singlePlayHandler.isSinglePlay(data.gameId)){
        ///////////
        return
    }
    this.gamesHandler.randomAttack(data.gameId, data.indexPlayer);
  };

  closeWebSoket = async (ws : WebSocket) => {
    const playerID = this.webSoketHandler.getPlayerIDByWS(ws);
    await this.usersHandler.setOnlineStatus(playerID, false);
    this.webSoketHandler.delWebSoket(ws);
    this.webSoketHandler.getAllWS().forEach(async (ws) => {
        clientUpdateRoom(ws.ws, await this.roomsHandler.getRooms());
        clientUpdateWinners(ws.ws, await this.usersHandler.getWinners());
      });
  }

  handleSinglePlay = async (ws : WebSocket) => {
     await this.singlePlayHandler.addSingleGame(ws);
  }


}
