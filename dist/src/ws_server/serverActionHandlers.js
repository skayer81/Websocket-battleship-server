"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerActionHandlers = void 0;
var roomsHandler_1 = require("./roomsHandler");
var webSoketHandler_1 = require("./webSoketHandler");
var clientActionHandler_1 = require("./clientActionHandler");
var gamesHandler_1 = require("./gamesHandler");
var usersHandler_1 = require("./usersHandler");
var singlePlayHandle_1 = require("./singlePlay/singlePlayHandle");
var ServerActionHandlers = (function () {
  function ServerActionHandlers() {
    var _this = this;
    this.roomsHandler = new roomsHandler_1.RoomsHandler();
    this.webSoketHandler = new webSoketHandler_1.WebSoketHandler();
    this.gamesHandler = new gamesHandler_1.GamesHandler();
    this.usersHandler = new usersHandler_1.UsersHandler();
    this.singlePlayHandler = new singlePlayHandle_1.SinglePlayHandler();
    this.handleRegistration = function (command, ws) {
      return __awaiter(_this, void 0, void 0, function () {
        var _a, name, password, playerID, rooms, winners;
        var _this = this;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              (_a = JSON.parse(command.data)),
                (name = _a.name),
                (password = _a.password);
              return [4, this.usersHandler.isPlayerExist(name)];
            case 1:
              if (!_b.sent()) return [3, 4];
              return [4, this.usersHandler.isPasswordCorrect(name, password)];
            case 2:
              if (!_b.sent()) {
                (0, clientActionHandler_1.clientRegistrationError)(
                  ws,
                  name,
                  "wrong password",
                );
                return [2];
              }
              return [4, this.usersHandler.isUserOnlain(name)];
            case 3:
              if (_b.sent()) {
                (0, clientActionHandler_1.clientRegistrationError)(
                  ws,
                  name,
                  "a user with the same name is already online",
                );
                return [2];
              }
              return [3, 6];
            case 4:
              return [4, this.usersHandler.addPlayer(name, password)];
            case 5:
              _b.sent();
              _b.label = 6;
            case 6:
              return [4, this.usersHandler.getPlayerID(name)];
            case 7:
              playerID = _b.sent();
              return [4, this.usersHandler.setOnlineStatus(playerID, true)];
            case 8:
              _b.sent();
              this.webSoketHandler.addWebSoket(ws, playerID);
              (0, clientActionHandler_1.clientRegistrationSuccest)(
                ws,
                name,
                playerID,
              );
              return [4, this.roomsHandler.getRooms()];
            case 9:
              rooms = _b.sent();
              return [4, this.usersHandler.getWinners()];
            case 10:
              winners = _b.sent();
              this.webSoketHandler.getAllWS().forEach(function (ws) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    (0, clientActionHandler_1.clientUpdateRoom)(ws.ws, rooms);
                    (0, clientActionHandler_1.clientUpdateWinners)(
                      ws.ws,
                      winners,
                    );
                    return [2];
                  });
                });
              });
              return [2];
          }
        });
      });
    };
    this.handleCreateRoom = function (ws) {
      return __awaiter(_this, void 0, void 0, function () {
        var roomId, rooms;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.isUserInRoom(ws)];
            case 1:
              if (_a.sent()) return [2];
              return [4, this.roomsHandler.addRoom()];
            case 2:
              roomId = _a.sent();
              return [4, this.handleAddUserToRoom(roomId, ws)];
            case 3:
              _a.sent();
              return [4, this.roomsHandler.getRooms()];
            case 4:
              rooms = _a.sent();
              console.log("комнаты", rooms);
              this.webSoketHandler.getAllWS().forEach(function (ws) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    (0, clientActionHandler_1.clientUpdateRoom)(ws.ws, rooms);
                    return [2];
                  });
                });
              });
              return [2];
          }
        });
      });
    };
    this.handleAddUserToRoom = function (roomId, ws) {
      return __awaiter(_this, void 0, void 0, function () {
        var userIndex, _a, player1, player2;
        var _this = this;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              return [4, this.isUserInRoom(ws)];
            case 1:
              if (_b.sent()) return [2];
              userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
              return [4, this.roomsHandler.addPlayerToRoom(userIndex, roomId)];
            case 2:
              _b.sent();
              return [4, this.roomsHandler.isRoomFull(roomId)];
            case 3:
              if (!_b.sent()) return [3, 7];
              return [4, this.roomsHandler.getPlayersInRoom(roomId)];
            case 4:
              (_a = _b.sent()), (player1 = _a.player1), (player2 = _a.player2);
              return [4, this.gamesHandler.addGame(player1, player2)];
            case 5:
              _b.sent();
              return [4, this.roomsHandler.delRoom(roomId)];
            case 6:
              _b.sent();
              _b.label = 7;
            case 7:
              this.webSoketHandler.getAllWS().forEach(function (ws) {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a, _b;
                  return __generator(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        _a = clientActionHandler_1.clientUpdateRoom;
                        _b = [ws.ws];
                        return [4, this.roomsHandler.getRooms()];
                      case 1:
                        _a.apply(void 0, _b.concat([_c.sent()]));
                        return [2];
                    }
                  });
                });
              });
              return [2];
          }
        });
      });
    };
    this.handleAddShips = function (data, ws) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.singlePlayHandler.isSinglePlay(data.gameId)];
            case 1:
              if (!_a.sent()) return [3, 4];
              return [
                4,
                this.singlePlayHandler.addShipsToSingleGame(
                  data.gameId,
                  data.indexPlayer,
                  data.ships,
                ),
              ];
            case 2:
              _a.sent();
              return [4, this.singlePlayHandler.startSingleGame(data.gameId)];
            case 3:
              _a.sent();
              return [2];
            case 4:
              return [
                4,
                this.gamesHandler.addShipsToGame(
                  data.gameId,
                  data.indexPlayer,
                  data.ships,
                ),
              ];
            case 5:
              _a.sent();
              return [4, this.gamesHandler.isAllPlayerReady(data.gameId)];
            case 6:
              if (!_a.sent()) return [3, 8];
              return [4, this.gamesHandler.startGame(data.gameId)];
            case 7:
              _a.sent();
              _a.label = 8;
            case 8:
              return [2];
          }
        });
      });
    };
    this.handleAttack = function (data, ws) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.singlePlayHandler.isSinglePlay(data.gameId)];
            case 1:
              if (_a.sent()) {
                this.singlePlayHandler.singleGameAttackAction(
                  data.gameId,
                  data.indexPlayer,
                  data.x,
                  data.y,
                );
                return [2];
              }
              this.gamesHandler.attackAction(
                data.gameId,
                data.indexPlayer,
                data.x,
                data.y,
              );
              return [2];
          }
        });
      });
    };
    this.handlerandomAttack = function (data, ws) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.singlePlayHandler.isSinglePlay(data.gameId)];
            case 1:
              if (_a.sent()) {
                return [2];
              }
              this.gamesHandler.randomAttack(data.gameId, data.indexPlayer);
              return [2];
          }
        });
      });
    };
    this.closeWebSoket = function (ws) {
      return __awaiter(_this, void 0, void 0, function () {
        var playerID;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              playerID = this.webSoketHandler.getPlayerIDByWS(ws);
              return [4, this.usersHandler.setOnlineStatus(playerID, false)];
            case 1:
              _a.sent();
              this.webSoketHandler.delWebSoket(ws);
              this.webSoketHandler.getAllWS().forEach(function (ws) {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a, _b, _c, _d;
                  return __generator(this, function (_e) {
                    switch (_e.label) {
                      case 0:
                        _a = clientActionHandler_1.clientUpdateRoom;
                        _b = [ws.ws];
                        return [4, this.roomsHandler.getRooms()];
                      case 1:
                        _a.apply(void 0, _b.concat([_e.sent()]));
                        _c = clientActionHandler_1.clientUpdateWinners;
                        _d = [ws.ws];
                        return [4, this.usersHandler.getWinners()];
                      case 2:
                        _c.apply(void 0, _d.concat([_e.sent()]));
                        return [2];
                    }
                  });
                });
              });
              return [2];
          }
        });
      });
    };
    this.handleSinglePlay = function (ws) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.singlePlayHandler.addSingleGame(ws)];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
  }
  ServerActionHandlers.prototype.isUserInRoom = function (ws) {
    return __awaiter(this, void 0, void 0, function () {
      var userIndex;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            userIndex = this.webSoketHandler.getPlayerIDByWS(ws);
            return [4, this.roomsHandler.isPlayerInRoom(userIndex)];
          case 1:
            return [2, _a.sent()];
        }
      });
    });
  };
  return ServerActionHandlers;
})();
exports.ServerActionHandlers = ServerActionHandlers;
//# sourceMappingURL=serverActionHandlers.js.map
