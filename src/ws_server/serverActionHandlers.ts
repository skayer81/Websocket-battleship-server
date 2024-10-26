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
// import { Ship } from "./types/dataTypes";
import { GamesHandler } from "./gamesHandler";
import { UsersHandler } from "./usersHandler";
import { SinglePlayHandler } from "./singlePlay/singlePlayHandle";

export class ServerActionHandlers {
   private roomsHandler = new RoomsHandler();

   private  webSoketHandler = new WebSoketHandler();

   private gamesHandler = new GamesHandler();

   private usersHandler = new UsersHandler();

   private singlePlayHandler = new SinglePlayHandler();
  // test = ''

  public handleRegistration =   (command: any, ws: WebSocket) : void => {
    const { name, password } = JSON.parse(command.data);

    // let player;

    if (  this.usersHandler.isPlayerExist(name)) {
      if (!(  this.usersHandler.isPasswordCorrect(name, password))) {
        clientRegistrationError(ws, name, "wrong password");
        return;
      }
      if (  this.usersHandler.isUserOnlain(name)) {
        clientRegistrationError(
          ws,
          name,
          "a user with the same name is already online",
        );
        return;
      }
      //  player =   this.usersHandler.getPlayer(name);        //       this.usersHandler.loginPlayer()
    } else {
        this.usersHandler.addPlayer(name, password);
    }

    const playerID =   this.usersHandler.getPlayerID(name);
      this.usersHandler.setOnlineStatus(playerID, true);

    this.webSoketHandler.addWebSoket(ws, playerID);
    clientRegistrationSuccest(ws, name, playerID);

    const rooms =   this.roomsHandler.getRooms();
    const winners =   this.usersHandler.getWinners();

    this.webSoketHandler.getAllWS().forEach(  (ws) => {
      clientUpdateRoom(ws.ws, rooms);
      clientUpdateWinners(ws.ws, winners);
    });
  };

  private   isUserInRoom(ws: WebSocket) : boolean{
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    return this.roomsHandler.isPlayerInRoom(userIndex);
  }

  public handleCreateRoom =   (ws: WebSocket) : void=> {
    if (  this.isUserInRoom(ws)) {
      return;
    }
    const roomId =   this.roomsHandler.addRoom();
      this.handleAddUserToRoom(roomId, ws);
    const rooms =   this.roomsHandler.getRooms();
    console.log("комнаты", rooms);
    this.webSoketHandler.getAllWS().forEach(  (ws) => {
      clientUpdateRoom(ws.ws, rooms);
    });
  };

  public  handleAddUserToRoom =   (roomId: string, ws: WebSocket) : void => {
    if (  this.isUserInRoom(ws)) {
      return;
    }
    //  console.log("старт добавления")
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    //  console.log("получии индекс")
      this.roomsHandler.addPlayerToRoom(userIndex, roomId);
    //  console.log("добавили в комнату")

    //   console.log("обновили")
    if (  this.roomsHandler.isRoomFull(roomId)) {
      const { player1, player2 } =
          this.roomsHandler.getPlayersInRoom(roomId);
        this.gamesHandler.addGame(player1, player2);
        this.roomsHandler.delRoom(roomId);
      // return;
    }

    this.webSoketHandler.getAllWS().forEach(  (ws) => {
      clientUpdateRoom(ws.ws,   this.roomsHandler.getRooms());
    });
    //   console.log('комната полная')
  };

  public handleAddShips =   (data: any, ws: WebSocket) : void => {
    if (  this.singlePlayHandler.isSinglePlay(data.gameId)) {
        this.singlePlayHandler.addShipsToSingleGame(
        data.gameId,
        data.indexPlayer,
        data.ships,
      );
        this.singlePlayHandler.startSingleGame(data.gameId);
      return;
    }

      this.gamesHandler.addShipsToGame(
      data.gameId,
      data.indexPlayer,
      data.ships,
    );

    if (  this.gamesHandler.isAllPlayerReady(data.gameId)) {
        this.gamesHandler.startGame(data.gameId);
    }
  };

  public handleAttack =   (data: any, ws: WebSocket) : void => {
    if (  this.singlePlayHandler.isSinglePlay(data.gameId)) {
      this.singlePlayHandler.singleGameAttackAction(
        data.gameId,
        data.indexPlayer,
        data.x,
        data.y,
      );
      return;
    }
    this.gamesHandler.attackAction(
      data.gameId,
      data.indexPlayer,
      data.x,
      data.y,
    );
  };

  public handlerandomAttack =   (data: any, ws: WebSocket) : void=> {
    if (  this.singlePlayHandler.isSinglePlay(data.gameId)) {
      //// ///////
      return;
    }
    this.gamesHandler.randomAttack(data.gameId, data.indexPlayer);
  };

  public closeWebSoket =   (ws: WebSocket) : void => {
  //   ws.send(JSON.stringify(
  //   {
  //     type: "diconnect",
  //     data: "",
  //     id: 0,
  //   })
  // )
    if (!this.webSoketHandler.isPlayerInWS(ws)){
      this.webSoketHandler.delWebSoket(ws);
      return
    }

     const playerID = this.webSoketHandler.getPlayerIDByWS(ws);
     this.usersHandler.setOnlineStatus(playerID, false);

     this.roomsHandler.playerOffline(playerID);
     this.gamesHandler.playerOffline(playerID);
     this.singlePlayHandler.playerOffline(playerID);
     this.webSoketHandler.getAllWS().forEach(  (ws) => {
      clientUpdateRoom(ws.ws,   this.roomsHandler.getRooms());
      clientUpdateWinners(ws.ws,   this.usersHandler.getWinners());
    });
  };

  public handleSinglePlay =   (ws: WebSocket) : void => {
    this.roomsHandler.playerOffline(this.webSoketHandler.getPlayerIDByWS(ws));
    this.singlePlayHandler.addSingleGame(ws);
    this.webSoketHandler.getAllWS().forEach(  (ws) => {
      clientUpdateRoom(ws.ws,   this.roomsHandler.getRooms());
    //  clientUpdateWinners(ws.ws,   this.usersHandler.getWinners());
    });
  };
}
