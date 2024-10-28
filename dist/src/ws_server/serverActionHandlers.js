"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerActionHandlers = void 0;
var roomsHandler_1 = require("./roomsHandler");
var webSoketHandler_1 = require("./webSoketHandler");
var clientActionHandler_1 = require("./clientActionHandler");
var gamesHandler_1 = require("./gamesHandler");
var usersHandler_1 = require("./usersHandler");
var singlePlayHandle_1 = require("./singlePlay/singlePlayHandle");
var logHandlers_1 = require("./logHandlers");
var typesOfRequestResponse_1 = require("./types/typesOfRequestResponse");
var logHandlerTypes_1 = require("./types/logHandlerTypes");
var ServerActionHandlers = (function () {
  function ServerActionHandlers() {
    var _this = this;
    this.roomsHandler = new roomsHandler_1.RoomsHandler();
    this.webSoketHandler = new webSoketHandler_1.WebSoketHandler();
    this.gamesHandler = new gamesHandler_1.GamesHandler();
    this.usersHandler = new usersHandler_1.UsersHandler();
    this.singlePlayHandler = new singlePlayHandle_1.SinglePlayHandler();
    this.consoleLog = new logHandlers_1.ConsoleLog();
    this.handleRegistration = function (command, ws) {
      var _a = JSON.parse(command.data),
        name = _a.name,
        password = _a.password;
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.reg,
        { name: name, password: password },
      );
      if (_this.usersHandler.isPlayerExist(name)) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.user_in_base,
          { name: name },
        );
        if (!_this.usersHandler.isPasswordCorrect(name, password)) {
          _this.consoleLog.serverErrorResponse(
            logHandlerTypes_1.TypesServerResponseError.wrong_password,
            { name: name, password: password },
          );
          (0, clientActionHandler_1.clientRegistrationError)(
            ws,
            name,
            "incorrect password",
          );
          return;
        }
        if (_this.usersHandler.isUserOnlain(name)) {
          _this.consoleLog.serverErrorResponse(
            logHandlerTypes_1.TypesServerResponseError.user_is_onlain,
            { name: name, password: password },
          );
          (0, clientActionHandler_1.clientRegistrationError)(
            ws,
            name,
            "a user with the same name is already online",
          );
          return;
        }
      } else {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.add_user,
          {
            name: name,
            password: password,
          },
        );
        _this.usersHandler.addPlayer(name, password);
      }
      var playerID = _this.usersHandler.getPlayerID(name);
      _this.usersHandler.setOnlineStatus(playerID, true);
      _this.webSoketHandler.addWebSoket(ws, playerID);
      (0, clientActionHandler_1.clientRegistrationSuccest)(ws, name, playerID);
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.reg,
        { name: name, password: password },
      );
      var rooms = _this.roomsHandler.getRooms();
      var winners = _this.usersHandler.getWinners();
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_room,
        {},
      );
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_winners,
        {},
      );
      _this.webSoketHandler.getAllWS().forEach(function (ws) {
        (0, clientActionHandler_1.clientUpdateRoom)(ws.ws, rooms);
        (0, clientActionHandler_1.clientUpdateWinners)(ws.ws, winners);
      });
    };
    this.handleCreateRoom = function (ws) {
      var userName = _this.usersHandler.getPlayerName(
        _this.webSoketHandler.getPlayerIDByWS(ws),
      );
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.create_room,
        {
          name: userName,
        },
      );
      if (_this.isUserInRoom(ws)) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.is_user_in_room,
          {
            name: userName,
          },
        );
        return;
      }
      var roomId = _this.roomsHandler.addRoom();
      _this.consoleLog.serverAction(
        logHandlerTypes_1.TypesServerAction.create_room,
        {
          name: userName,
        },
      );
      _this.handleAddUserToRoom(roomId, ws, userName);
    };
    this.handleAddUserToRoom = function (roomId, ws, name) {
      var userName = name;
      if (!userName) {
        userName = _this.usersHandler.getPlayerName(
          _this.webSoketHandler.getPlayerIDByWS(ws),
        );
        _this.consoleLog.clientRequest(
          typesOfRequestResponse_1.TypesClientRequest.add_user_to_room,
          {
            name: userName,
          },
        );
      }
      if (_this.isUserInRoom(ws)) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.is_user_in_room,
          {
            name: userName,
          },
        );
        return;
      }
      var userIndex = _this.webSoketHandler.getPlayerIDByWS(ws);
      _this.consoleLog.serverAction(
        logHandlerTypes_1.TypesServerAction.add_user_in_room,
        {
          name: userName,
        },
      );
      _this.roomsHandler.addPlayerToRoom(userIndex, roomId);
      if (_this.roomsHandler.isRoomFull(roomId)) {
        var _a = _this.roomsHandler.getPlayersInRoom(roomId),
          player1 = _a.player1,
          player2 = _a.player2;
        _this.gamesHandler.addGame(player1, player2);
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.del_room,
          {
            player1: _this.usersHandler.getPlayerName(player1),
            player2: _this.usersHandler.getPlayerName(player2),
          },
        );
        _this.roomsHandler.delRoom(roomId);
      }
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_room,
        {},
      );
      _this.webSoketHandler.getAllWS().forEach(function (ws) {
        (0, clientActionHandler_1.clientUpdateRoom)(
          ws.ws,
          _this.roomsHandler.getRooms(),
        );
      });
    };
    this.handleAddShips = function (data, ws) {
      var userName = _this.usersHandler.getPlayerName(
        _this.webSoketHandler.getPlayerIDByWS(ws),
      );
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.add_ships,
        {
          name: userName,
        },
      );
      if (_this.singlePlayHandler.isSinglePlay(data.gameId)) {
        _this.singlePlayHandler.addShipsToSingleGame(
          data.gameId,
          data.indexPlayer,
          data.ships,
        );
        _this.singlePlayHandler.startSingleGame(data.gameId);
        return;
      }
      _this.gamesHandler.addShipsToGame(
        data.gameId,
        data.indexPlayer,
        data.ships,
      );
      if (_this.gamesHandler.isAllPlayerReady(data.gameId)) {
        _this.gamesHandler.startGame(data.gameId);
      }
    };
    this.handleAttack = function (data, ws) {
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.attack,
        {
          attackPlayer: _this.usersHandler.getPlayerName(data.indexPlayer),
          x: data.x,
          y: data.y,
        },
      );
      if (_this.singlePlayHandler.isSinglePlay(data.gameId)) {
        _this.singlePlayHandler.singleGameAttackAction(
          data.gameId,
          data.x,
          data.y,
        );
        return;
      }
      _this.gamesHandler.attackAction(
        data.gameId,
        data.indexPlayer,
        data.x,
        data.y,
      );
    };
    this.handlerandomAttack = function (data, ws) {
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.randomAttack,
        {
          attackPlayer: _this.usersHandler.getPlayerName(data.indexPlayer),
          x: data.x,
          y: data.y,
        },
      );
      if (_this.singlePlayHandler.isSinglePlay(data.gameId)) {
        _this.singlePlayHandler.singleRandomAttack(data.gameId);
        return;
      }
      _this.gamesHandler.randomAttack(data.gameId, data.indexPlayer);
    };
    this.closeWebSoket = function (ws) {
      if (!_this.webSoketHandler.isPlayerInWS(ws)) {
        _this.webSoketHandler.delWebSoket(ws);
        return;
      }
      var playerID = _this.webSoketHandler.getPlayerIDByWS(ws);
      _this.consoleLog.serverAction(
        logHandlerTypes_1.TypesServerAction.user_disconnect,
        {
          name: playerID,
        },
      );
      _this.usersHandler.setOnlineStatus(playerID, false);
      _this.roomsHandler.playerOffline(playerID);
      _this.gamesHandler.playerOffline(playerID);
      _this.singlePlayHandler.playerOffline(playerID);
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_room,
        {},
      );
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_winners,
        {},
      );
      _this.webSoketHandler.getAllWS().forEach(function (ws) {
        (0, clientActionHandler_1.clientUpdateRoom)(
          ws.ws,
          _this.roomsHandler.getRooms(),
        );
        (0, clientActionHandler_1.clientUpdateWinners)(
          ws.ws,
          _this.usersHandler.getWinners(),
        );
      });
    };
    this.handleSinglePlay = function (ws) {
      var name = _this.usersHandler.getPlayerName(
        _this.webSoketHandler.getPlayerIDByWS(ws),
      );
      _this.consoleLog.clientRequest(
        typesOfRequestResponse_1.TypesClientRequest.single_play,
        { name: name },
      );
      _this.roomsHandler.playerOffline(
        _this.webSoketHandler.getPlayerIDByWS(ws),
      );
      _this.singlePlayHandler.addSingleGame(ws);
      _this.consoleLog.serverAction(
        logHandlerTypes_1.TypesServerAction.del_room,
        { player1: name },
      );
      _this.consoleLog.serverResponse(
        typesOfRequestResponse_1.TypesServerResponse.update_room,
        {},
      );
      _this.webSoketHandler.getAllWS().forEach(function (ws) {
        (0, clientActionHandler_1.clientUpdateRoom)(
          ws.ws,
          _this.roomsHandler.getRooms(),
        );
      });
    };
  }
  ServerActionHandlers.prototype.isUserInRoom = function (ws) {
    var userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
    return this.roomsHandler.isPlayerInRoom(userIndex);
  };
  return ServerActionHandlers;
})();
exports.ServerActionHandlers = ServerActionHandlers;
//# sourceMappingURL=serverActionHandlers.js.map
