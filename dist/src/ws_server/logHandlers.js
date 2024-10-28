"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLog = void 0;
var logHandlerTypes_1 = require("./types/logHandlerTypes");
var typesOfRequestResponse_1 = require("./types/typesOfRequestResponse");
var usersHandler_1 = require("./usersHandler");
var ConsoleLog = (function () {
  function ConsoleLog() {
    var _a, _b, _c, _d;
    var _this = this;
    this.userHandler = new usersHandler_1.UsersHandler();
    this.clientRequestLogs =
      ((_a = {}),
      (_a[typesOfRequestResponse_1.TypesClientRequest.reg] = function (data) {
        return _this.clientRequestReg(data);
      }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.create_room] = function (
        data,
      ) {
        return _this.clientRequestCreateRoom(data);
      }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.add_ships] = function (
        data,
      ) {
        return _this.clientRequestAddShip(data);
      }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.add_user_to_room] =
        function (data) {
          return _this.clientRequestAddUserToRoom(data);
        }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.attack] = function (
        data,
      ) {
        return _this.clientRequestAttack(data);
      }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.randomAttack] = function (
        data,
      ) {
        return _this.clientRequestRandomAttack(data);
      }),
      (_a[typesOfRequestResponse_1.TypesClientRequest.single_play] = function (
        data,
      ) {
        return _this.clientRequestSingleGame(data);
      }),
      _a);
    this.serverResponseErrorsLogs =
      ((_b = {}),
      (_b[logHandlerTypes_1.TypesServerResponseError.wrong_password] =
        function (data) {
          return _this.errorWrongPassword(data);
        }),
      (_b[logHandlerTypes_1.TypesServerResponseError.user_is_onlain] =
        function (data) {
          return _this.errorIsOnlain(data);
        }),
      _b);
    this.serverResponseLogs =
      ((_c = {}),
      (_c[typesOfRequestResponse_1.TypesServerResponse.reg] = function (data) {
        return _this.serverResponseReg(data);
      }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.update_room] =
        function () {
          return _this.serverResponseUpdateRooms();
        }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.update_winners] =
        function () {
          return _this.serverResponseUpdateWinners();
        }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.create_game] = function (
        data,
      ) {
        return _this.serverResponseCreateGame(data);
      }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.turn] = function (data) {
        return _this.serverResponseTurn(data);
      }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.attack] = function (
        data,
      ) {
        return _this.serverResponseAttack(data);
      }),
      (_c[typesOfRequestResponse_1.TypesServerResponse.finish] = function (
        data,
      ) {
        return _this.serverResponseFinish(data);
      }),
      _c);
    this.serverActionsLogs =
      ((_d = {}),
      (_d[logHandlerTypes_1.TypesServerAction.add_user] = function (data) {
        return _this.serverAddUser(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.user_in_base] = function (data) {
        return _this.serverUserInBase(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.is_user_in_room] = function (
        data,
      ) {
        return _this.serverIsUserInRoom(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.create_room] = function (data) {
        return _this.serverCreateRoom(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.add_user_in_room] = function (
        data,
      ) {
        return _this.serverAddUserInRoom(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.del_room] = function (data) {
        return _this.serverDelRoom(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.not_current_player] = function (
        data,
      ) {
        return _this.serverNotCurrentPlayer(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.reshot] = function (data) {
        return _this.serverReshot(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.random_attack] = function (data) {
        return _this.serverRandomAttack(data);
      }),
      (_d[logHandlerTypes_1.TypesServerAction.killed] = function () {
        return _this.serverKilled();
      }),
      (_d[logHandlerTypes_1.TypesServerAction.user_disconnect] = function (
        data,
      ) {
        return _this.serverUserDisconnect(data);
      }),
      _d);
  }
  ConsoleLog.prototype.clientRequest = function (action, data) {
    this.clientRequestLogs[action](data);
  };
  ConsoleLog.prototype.serverErrorResponse = function (action, data) {
    this.serverResponseErrorsLogs[action](data);
  };
  ConsoleLog.prototype.serverResponse = function (action, data) {
    this.serverResponseLogs[action](data);
  };
  ConsoleLog.prototype.serverAction = function (action, data) {
    this.serverActionsLogs[action](data);
  };
  ConsoleLog.prototype.errorWrongPassword = function (data) {
    var name = data.name,
      password = data.password;
    this.outputServerError(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.reg,
          "': incorrect password, user named '",
        )
        .concat(name, "' has password '")
        .concat(password, "'"),
    );
  };
  ConsoleLog.prototype.errorIsOnlain = function (data) {
    var name = data.name;
    this.outputServerError(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.reg,
          "': user named '",
        )
        .concat(name, "' is already online"),
    );
  };
  ConsoleLog.prototype.clientRequestReg = function (data) {
    var name = data.name,
      password = data.password;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.reg,
          "': a user with the name '",
        )
        .concat(name, "' and password '")
        .concat(password, "' is trying to register"),
    );
  };
  ConsoleLog.prototype.clientRequestCreateRoom = function (data) {
    var name = data.name;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.create_room,
          "': user '",
        )
        .concat(name, "' wants to create a room"),
    );
  };
  ConsoleLog.prototype.clientRequestAddShip = function (data) {
    var name = data.name;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.add_ships,
          "': user '",
        )
        .concat(name, "' added ships to the field"),
    );
  };
  ConsoleLog.prototype.clientRequestAddUserToRoom = function (data) {
    var name = data.name;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.add_user_to_room,
          "': user '",
        )
        .concat(name, "' tries to enter the room"),
    );
  };
  ConsoleLog.prototype.clientRequestAttack = function (data) {
    var attackPlayer = data.attackPlayer,
      x = data.x,
      y = data.y;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.attack,
          "': player '",
        )
        .concat(attackPlayer, "' attacks at the coordinates (")
        .concat(x, ":")
        .concat(y, ")"),
    );
  };
  ConsoleLog.prototype.clientRequestRandomAttack = function (data) {
    var attackPlayer = data.attackPlayer;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.randomAttack,
          "': player '",
        )
        .concat(attackPlayer, "' makes a random attack"),
    );
  };
  ConsoleLog.prototype.clientRequestSingleGame = function (data) {
    var name = data.name;
    this.outputClientReguest(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesClientRequest.single_play,
          "': player ",
        )
        .concat(name, " starts a single player game with a bot"),
    );
  };
  ConsoleLog.prototype.serverResponseReg = function (data) {
    var name = data.name,
      password = data.password;
    this.outputServerResponse(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.reg,
          "': a user with the name '",
        )
        .concat(name, "' and password '")
        .concat(password, "' is now online"),
    );
  };
  ConsoleLog.prototype.serverResponseUpdateRooms = function () {
    this.outputServerResponse(
      "'".concat(
        typesOfRequestResponse_1.TypesServerResponse.update_room,
        "': updating rooms for all users",
      ),
    );
  };
  ConsoleLog.prototype.serverResponseUpdateWinners = function () {
    this.outputServerResponse(
      "'".concat(
        typesOfRequestResponse_1.TypesServerResponse.update_winners,
        "': updating winners for all users",
      ),
    );
  };
  ConsoleLog.prototype.serverResponseCreateGame = function (data) {
    var name = data.name;
    this.outputServerResponse(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.create_game,
          "': a game was created for the user '",
        )
        .concat(name, "'"),
    );
  };
  ConsoleLog.prototype.serverResponseTurn = function (data) {
    var name = data.name;
    var userName = name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerResponse(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.turn,
          "': now it's player ",
        )
        .concat(userName, "'s turn"),
    );
  };
  ConsoleLog.prototype.serverResponseAttack = function (data) {
    var name = data.name,
      status = data.status,
      x = data.x,
      y = data.y;
    var userName = name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerResponse(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.attack,
          "': player ",
        )
        .concat(userName, " fired at coordinates (")
        .concat(x, ":")
        .concat(y, ") with the result: ")
        .concat(status),
    );
  };
  ConsoleLog.prototype.serverResponseFinish = function (data) {
    var name = data.name;
    var userName = name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerResponse(
      "'"
        .concat(
          typesOfRequestResponse_1.TypesServerResponse.finish,
          "': player ",
        )
        .concat(userName, " won"),
    );
  };
  ConsoleLog.prototype.serverAddUser = function (data) {
    var name = data.name,
      password = data.password;
    this.outputServerActions(
      "add new user with the name '"
        .concat(name, "' and password '")
        .concat(password, "' to the database"),
    );
  };
  ConsoleLog.prototype.serverUserInBase = function (data) {
    var name = data.name;
    this.outputServerActions(
      "a user named  '".concat(name, "' is already in the database"),
    );
  };
  ConsoleLog.prototype.serverIsUserInRoom = function (data) {
    var name = data.name;
    this.outputServerActions(
      "it is impossible, since the user '".concat(
        name,
        "' is already in the room",
      ),
    );
  };
  ConsoleLog.prototype.serverCreateRoom = function (data) {
    var name = data.name;
    this.outputServerActions(
      "a room was created by the user  '".concat(name, "'"),
    );
  };
  ConsoleLog.prototype.serverAddUserInRoom = function (data) {
    var name = data.name;
    this.outputServerActions("user '".concat(name, "' added to the room"));
  };
  ConsoleLog.prototype.serverDelRoom = function (data) {
    var player1 = data.player1,
      player2 = data.player2;
    if (!player2) {
      this.outputServerActions(
        "removing the room with the user '".concat(player1, "' if it exists"),
      );
      return;
    }
    this.outputServerActions(
      "removing the room with the users '"
        .concat(player1, "' and '")
        .concat(player2, "'"),
    );
  };
  ConsoleLog.prototype.serverNotCurrentPlayer = function (data) {
    var player1 = data.player1,
      player2 = data.player2;
    this.outputServerActions(
      "Now it's the player's turn: '"
        .concat(player1, "', not '")
        .concat(player2, "'"),
    );
  };
  ConsoleLog.prototype.serverReshot = function (data) {
    var targetPlayer = data.targetPlayer,
      x = data.x,
      y = data.y;
    this.outputServerActions(
      "player '"
        .concat(targetPlayer, "' has already shot at the coordinates (")
        .concat(x, ":")
        .concat(y, ")"),
    );
  };
  ConsoleLog.prototype.serverRandomAttack = function (data) {
    var targetPlayer = data.targetPlayer,
      x = data.x,
      y = data.y;
    this.outputServerActions(
      "server selected the coordinates for the attack of the player '"
        .concat(targetPlayer, "': (")
        .concat(x, ":")
        .concat(y, ")"),
    );
  };
  ConsoleLog.prototype.serverKilled = function () {
    this.outputServerActions(
      'send state "miss" for all cells around killed ship',
    );
  };
  ConsoleLog.prototype.serverUserDisconnect = function (data) {
    var name = data.name;
    var userName = name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerActions(
      "delete the room and the game with the player ".concat(
        userName,
        " if they exist, set the status to offline",
      ),
    );
  };
  ConsoleLog.prototype.outputClientReguest = function (message) {
    console.log("\u001B[33m msg to Server: ".concat(message, "\u001B[0m"));
  };
  ConsoleLog.prototype.outputServerResponse = function (message) {
    console.log("\u001B[32m msg to Client: ".concat(message, "\u001B[0m"));
  };
  ConsoleLog.prototype.outputServerError = function (message) {
    console.log("\u001B[31m msg to Client: ".concat(message, "\u001B[0m"));
  };
  ConsoleLog.prototype.outputServerActions = function (message) {
    console.log("\u001B[34m ".concat(message, "\u001B[0m"));
  };
  return ConsoleLog;
})();
exports.ConsoleLog = ConsoleLog;
//# sourceMappingURL=logHandlers.js.map
