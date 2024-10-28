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
exports.DBHandler = void 0;
var uuid_1 = require("uuid");
var DBHandler = (function () {
  function DBHandler() {
    var _this = this;
    this.players = [];
    this.rooms = [];
    this.winners = [];
    this.isPlayerExist = function (name) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2,
            this.players.find(function (player) {
              return player.name === name;
            }),
          ];
        });
      });
    };
    this.addPlayer = function (name, password) {
      return __awaiter(_this, void 0, void 0, function () {
        var newPlayer;
        return __generator(this, function (_a) {
          newPlayer = {
            name: name,
            password: password,
            index: (0, uuid_1.v4)(),
          };
          console.log("новый игрок в базе", newPlayer);
          this.players.push(newPlayer);
          return [2, newPlayer];
        });
      });
    };
    this.getRooms = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
          result = this.rooms.map(function (room) {
            return {
              roomId: room.roomId,
              roomUsers: room.roomUsers.map(function (player) {
                return {
                  name: player.name,
                  index: player.index,
                };
              }),
            };
          });
          return [2, this.rooms];
        });
      });
    };
    this.getWinners = function () {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2, this.winners];
        });
      });
    };
    this.addWinner = function (winnerID) {
      return __awaiter(_this, void 0, void 0, function () {
        var winner;
        var _a, _b;
        return __generator(this, function (_c) {
          winner = this.winners.find(function (user) {
            return user.id === winnerID;
          });
          if (winner) {
            winner.wins += 1;
            return [2];
          }
          winner = {
            id: winnerID,
            name:
              (_b =
                (_a = this.players.find(function (user) {
                  return user.index === winnerID;
                })) === null || _a === void 0
                  ? void 0
                  : _a.name) !== null && _b !== void 0
                ? _b
                : "",
            wins: 1,
          };
          this.winners.push(winner);
          return [2];
        });
      });
    };
    this.addPlayerToRoom = function (playerIndex, roomId) {
      return __awaiter(_this, void 0, void 0, function () {
        var room, player;
        var _a, _b;
        return __generator(this, function (_c) {
          room = this.rooms.find(function (room) {
            return room.roomId === roomId;
          });
          player = this.players.find(function (player) {
            return player.index === playerIndex;
          });
          room === null || room === void 0
            ? void 0
            : room.roomUsers.push({
                name:
                  (_a =
                    player === null || player === void 0
                      ? void 0
                      : player.name) !== null && _a !== void 0
                    ? _a
                    : "",
                index:
                  (_b =
                    player === null || player === void 0
                      ? void 0
                      : player.index) !== null && _b !== void 0
                    ? _b
                    : "",
              });
          return [2];
        });
      });
    };
    this.isRoomFull = function (roomId) {
      return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
          return [
            2,
            ((_a = this.rooms.find(function (room) {
              return room.roomId === roomId;
            })) === null || _a === void 0
              ? void 0
              : _a.roomUsers.length) === 2,
          ];
        });
      });
    };
    this.addRoom = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var newRoom;
        return __generator(this, function (_a) {
          newRoom = {
            roomId: (0, uuid_1.v4)(),
            roomUsers: [],
          };
          this.rooms.push(newRoom);
          return [2];
        });
      });
    };
    this.getPlayersInRoom = function (roomId) {
      return __awaiter(_this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
          room = this.rooms.find(function (room) {
            return room.roomId === roomId;
          });
          return [
            2,
            {
              player1: room.roomUsers[0].index,
              player2: room.roomUsers[1].index,
            },
          ];
        });
      });
    };
    if (DBHandler.instance) {
      return DBHandler.instance;
    }
    DBHandler.instance = this;
  }
  DBHandler.instance = null;
  return DBHandler;
})();
exports.DBHandler = DBHandler;
//# sourceMappingURL=dataBaseHandler.js.map
