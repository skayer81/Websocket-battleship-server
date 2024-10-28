import WebSocket from "ws";
import { RoomsHandler } from "./roomsHandler";
import { WebSoketHandler } from "./webSoketHandler";
import {
  clientRegistrationSuccest,
  clientUpdateRoom,
  clientUpdateWinners,
  clientRegistrationError,
} from "./clientActionHandler";
import { GamesHandler } from "./gamesHandler";
import { UsersHandler } from "./usersHandler";
import { SinglePlayHandler } from "./singlePlay/singlePlayHandle";
import { ConsoleLog } from "./logHandlers";
import {
  TypesClientRequest,
  TypesServerResponse,
} from "./types/typesOfRequestResponse";
import {
  TypesServerAction,
  TypesServerResponseError,
} from "./types/logHandlerTypes";

export class ServerActionHandlers {
  private roomsHandler = new RoomsHandler();

  private webSoketHandler = new WebSoketHandler();

  private gamesHandler = new GamesHandler();

  private usersHandler = new UsersHandler();

  private singlePlayHandler = new SinglePlayHandler();

  private consoleLog = new ConsoleLog();

  public handleRegistration = (command: any, ws: WebSocket): void => {
    const { name, password } = JSON.parse(command.data);

    this.consoleLog.clientRequest(TypesClientRequest.reg, { name, password });

    if (this.usersHandler.isPlayerExist(name)) {
      this.consoleLog.serverAction(TypesServerAction.user_in_base, { name });
      if (!this.usersHandler.isPasswordCorrect(name, password)) {
        this.consoleLog.serverErrorResponse(
          TypesServerResponseError.wrong_password,
          { name, password },
        );
        clientRegistrationError(ws, name, "incorrect password");
        return;
      }
      if (this.usersHandler.isUserOnlain(name)) {
        this.consoleLog.serverErrorResponse(
          TypesServerResponseError.user_is_onlain,
          { name, password },
        );
        clientRegistrationError(
          ws,
          name,
          "a user with the same name is already online",
        );
        return;
      }
    } else {
      this.consoleLog.serverAction(TypesServerAction.add_user, {
        name,
        password,
      });
      this.usersHandler.addPlayer(name, password);
    }

    const playerID = this.usersHandler.getPlayerID(name);
    this.usersHandler.setOnlineStatus(playerID, true);

    this.webSoketHandler.addWebSoket(ws, playerID);
    clientRegistrationSuccest(ws, name, playerID);
    this.consoleLog.serverResponse(TypesServerResponse.reg, { name, password });

    const rooms = this.roomsHandler.getRooms();
    const winners = this.usersHandler.getWinners();

    this.consoleLog.serverResponse(TypesServerResponse.update_room, {});
    this.consoleLog.serverResponse(TypesServerResponse.update_winners, {});

    this.webSoketHandler.getAllWS().forEach((ws) => {
      clientUpdateRoom(ws.ws, rooms);
      clientUpdateWinners(ws.ws, winners);
    });
  };

  private isUserInRoom(ws: WebSocket): boolean {
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    return this.roomsHandler.isPlayerInRoom(userIndex);
  }

  public handleCreateRoom = (ws: WebSocket): void => {
    const userName = this.usersHandler.getPlayerName(
      this.webSoketHandler.getPlayerIDByWS(ws),
    );
    this.consoleLog.clientRequest(TypesClientRequest.create_room, {
      name: userName,
    });
    if (this.isUserInRoom(ws)) {
      this.consoleLog.serverAction(TypesServerAction.is_user_in_room, {
        name: userName,
      });
      return;
    }
    const roomId = this.roomsHandler.addRoom();
    this.consoleLog.serverAction(TypesServerAction.create_room, {
      name: userName,
    });
    this.handleAddUserToRoom(roomId, ws, userName);
  };

  public handleAddUserToRoom = (
    roomId: string,
    ws: WebSocket,
    name?: string,
  ): void => {
    let userName = name;
    if (!userName) {
      userName = this.usersHandler.getPlayerName(
        this.webSoketHandler.getPlayerIDByWS(ws),
      );
      this.consoleLog.clientRequest(TypesClientRequest.add_user_to_room, {
        name: userName,
      });
    }

    if (this.isUserInRoom(ws)) {
      this.consoleLog.serverAction(TypesServerAction.is_user_in_room, {
        name: userName,
      });
      return;
    }
    const userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    this.consoleLog.serverAction(TypesServerAction.add_user_in_room, {
      name: userName,
    });
    this.roomsHandler.addPlayerToRoom(userIndex, roomId);
    if (this.roomsHandler.isRoomFull(roomId)) {
      const { player1, player2 } = this.roomsHandler.getPlayersInRoom(roomId);
      this.gamesHandler.addGame(player1, player2);
      this.consoleLog.serverAction(TypesServerAction.del_room, {
        player1: this.usersHandler.getPlayerName(player1),
        player2: this.usersHandler.getPlayerName(player2),
      });
      this.roomsHandler.delRoom(roomId);
    }
    this.consoleLog.serverResponse(TypesServerResponse.update_room, {});
    this.webSoketHandler.getAllWS().forEach((ws) => {
      clientUpdateRoom(ws.ws, this.roomsHandler.getRooms());
    });
  };

  public handleAddShips = (data: any, ws: WebSocket): void => {
    const userName = this.usersHandler.getPlayerName(
      this.webSoketHandler.getPlayerIDByWS(ws),
    );
    this.consoleLog.clientRequest(TypesClientRequest.add_ships, {
      name: userName,
    });
    if (this.singlePlayHandler.isSinglePlay(data.gameId)) {
      this.singlePlayHandler.addShipsToSingleGame(
        data.gameId,
        data.indexPlayer,
        data.ships,
      );
      this.singlePlayHandler.startSingleGame(data.gameId);
      return;
    }

    this.gamesHandler.addShipsToGame(data.gameId, data.indexPlayer, data.ships);

    if (this.gamesHandler.isAllPlayerReady(data.gameId)) {
      this.gamesHandler.startGame(data.gameId);
    }
  };

  public handleAttack = (data: any, ws: WebSocket): void => {
    this.consoleLog.clientRequest(TypesClientRequest.attack, {
      attackPlayer: this.usersHandler.getPlayerName(data.indexPlayer),
      x: data.x,
      y: data.y,
    });

    if (this.singlePlayHandler.isSinglePlay(data.gameId)) {
      this.singlePlayHandler.singleGameAttackAction(
        data.gameId,
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

  public handlerandomAttack = (data: any, ws: WebSocket): void => {
    this.consoleLog.clientRequest(TypesClientRequest.randomAttack, {
      attackPlayer: this.usersHandler.getPlayerName(data.indexPlayer),
      x: data.x,
      y: data.y,
    });
    if (this.singlePlayHandler.isSinglePlay(data.gameId)) {
      this.singlePlayHandler.singleRandomAttack(data.gameId);
      return;
    }
    this.gamesHandler.randomAttack(data.gameId, data.indexPlayer);
  };

  public closeWebSoket = (ws: WebSocket): void => {
    if (!this.webSoketHandler.isPlayerInWS(ws)) {
      this.webSoketHandler.delWebSoket(ws);
      return;
    }

    const playerID = this.webSoketHandler.getPlayerIDByWS(ws);
    this.consoleLog.serverAction(TypesServerAction.user_disconnect, {
      name: playerID,
    });
    this.usersHandler.setOnlineStatus(playerID, false);
    this.roomsHandler.playerOffline(playerID);
    this.gamesHandler.playerOffline(playerID);
    this.singlePlayHandler.playerOffline(playerID);
    this.consoleLog.serverResponse(TypesServerResponse.update_room, {});
    this.consoleLog.serverResponse(TypesServerResponse.update_winners, {});
    this.webSoketHandler.getAllWS().forEach((ws) => {
      clientUpdateRoom(ws.ws, this.roomsHandler.getRooms());
      clientUpdateWinners(ws.ws, this.usersHandler.getWinners());
    });
  };

  public handleSinglePlay = (ws: WebSocket): void => {
    const name = this.usersHandler.getPlayerName(
      this.webSoketHandler.getPlayerIDByWS(ws),
    );
    this.consoleLog.clientRequest(TypesClientRequest.single_play, { name });
    this.roomsHandler.playerOffline(this.webSoketHandler.getPlayerIDByWS(ws));
    this.singlePlayHandler.addSingleGame(ws);
    this.consoleLog.serverAction(TypesServerAction.del_room, { player1: name });
    this.consoleLog.serverResponse(TypesServerResponse.update_room, {});
    this.webSoketHandler.getAllWS().forEach((ws) => {
      clientUpdateRoom(ws.ws, this.roomsHandler.getRooms());
    });
  };
}
