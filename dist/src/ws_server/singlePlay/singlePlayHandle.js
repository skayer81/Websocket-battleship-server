"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null",
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.SinglePlayHandler = void 0;
var uuid_1 = require("uuid");
var clientActionHandler_1 = require("../clientActionHandler");
var gamesHandler_1 = require("../gamesHandler");
var singlePlayShips_1 = require("./singlePlayShips");
var SinglePlayHandler = (function (_super) {
  __extends(SinglePlayHandler, _super);
  function SinglePlayHandler() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.singleGames = [];
    _this.singlPlayShips = new singlePlayShips_1.SinglPlayShips();
    _this.bot_delay = 1000;
    _this.addSingleGame = function (ws) {
      return __awaiter(_this, void 0, void 0, function () {
        var game, ships;
        return __generator(this, function (_a) {
          game = {
            gameId: (0, uuid_1.v4)(),
            player: {
              indexPlayer: this.webSoketHandler.getPlayerIDByWS(ws),
              ships: [],
              ws: ws,
              shots: new Set(),
            },
            bot: {
              indexPlayer: "bot",
              ships: [],
              shots: new Set(),
              ws: ws,
            },
            isCurrentPlayer: Math.random() > 0.5,
          };
          ships = this.singlPlayShips.getShips();
          ships = ships.map(function (ship) {
            ship.shots = new Array(ship.length).fill(false);
            return ship;
          });
          game.bot.ships = ships;
          this.singleGames.push(game);
          (0, clientActionHandler_1.clientCreateGame)(
            ws,
            game.gameId,
            game.player.indexPlayer,
          );
          return [2];
        });
      });
    };
    _this.addShipsToSingleGame = function (gameId, indexPlayer, ships) {
      return __awaiter(_this, void 0, void 0, function () {
        var player;
        var _a;
        return __generator(this, function (_b) {
          player =
            (_a = this.singleGames.find(function (game) {
              return game.gameId === gameId;
            })) === null || _a === void 0
              ? void 0
              : _a.player;
          if (!player) {
            throw new Error(
              "Player with index "
                .concat(indexPlayer, " not found in game ")
                .concat(gameId, " gameSingleHandler:58"),
            );
          }
          player.ships = ships.map(function (ship) {
            ship.shots = new Array(ship.length).fill(false);
            return ship;
          });
          return [2];
        });
      });
    };
    _this.isSinglePlay = function (gameId) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2,
            this.singleGames.some(function (game) {
              return game.gameId === gameId;
            }),
          ];
        });
      });
    };
    _this.startSingleGame = function (gameId) {
      return __awaiter(_this, void 0, void 0, function () {
        var game;
        var _this = this;
        return __generator(this, function (_a) {
          game = this.singleGames.find(function (game) {
            return game.gameId === gameId;
          });
          if (!game) throw new Error();
          (0, clientActionHandler_1.clientStartGame)(
            game.player.ws,
            game.player.ships,
            game.player.indexPlayer,
          );
          (0, clientActionHandler_1.clientTurn)(
            game.player.ws,
            game.isCurrentPlayer ? game.player.indexPlayer : "bot",
          );
          if (!game.isCurrentPlayer) {
            setTimeout(function () {
              _this.botAttackAction(gameId);
            }, this.bot_delay);
          }
          return [2];
        });
      });
    };
    _this.singleGameAttackAction = function (gameId, indexPlayer, x, y) {
      return __awaiter(_this, void 0, void 0, function () {
        var game, attackResult;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              game = this.singleGames.find(function (game) {
                return game.gameId === gameId;
              });
              if (
                !(game === null || game === void 0
                  ? void 0
                  : game.isCurrentPlayer)
              )
                return [2];
              if (game.player.shots.has("".concat(x, ",").concat(y))) {
                return [2];
              }
              game.player.shots.add("".concat(x, ",").concat(y));
              return [4, this.getAttackResult(game.bot.ships, x, y)];
            case 1:
              attackResult = _a.sent();
              (0, clientActionHandler_1.clientAttack)(
                game.player.ws,
                game.player.indexPlayer,
                attackResult.status,
                { x: x, y: y },
              );
              console.log("игрок атакует ", attackResult);
              if (attackResult.status === "killed") {
                if (!attackResult.ship) throw new Error("корабль пустой");
                this.shipKilled(game, attackResult.ship);
              }
              if (attackResult.status === "miss") {
                game.isCurrentPlayer = false;
                setTimeout(function () {
                  _this.botAttackAction(gameId);
                }, this.bot_delay);
              }
              (0, clientActionHandler_1.clientTurn)(
                game.player.ws,
                game.isCurrentPlayer
                  ? game.player.indexPlayer
                  : game.bot.indexPlayer,
              );
              return [2];
          }
        });
      });
    };
    return _this;
  }
  SinglePlayHandler.prototype.botAttackAction = function (gameId) {
    return __awaiter(this, void 0, void 0, function () {
      var game, _a, x, y, attackResult;
      var _this = this;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            game = this.singleGames.find(function (game) {
              return game.gameId === gameId;
            });
            if (!game) throw new Error(",kf,kf,kf");
            (_a = this.getRandomShot(
              game === null || game === void 0 ? void 0 : game.bot,
            )),
              (x = _a.x),
              (y = _a.y);
            return [4, this.getAttackResult(game.player.ships, x, y)];
          case 1:
            attackResult = _b.sent();
            (0, clientActionHandler_1.clientAttack)(
              game.player.ws,
              game.bot.indexPlayer,
              attackResult.status,
              { x: x, y: y },
            );
            game.bot.shots.add("".concat(x, ",").concat(y));
            console.log("бот атакует", attackResult.status);
            if (attackResult.status === "killed") {
              if (!attackResult.ship) throw new Error("корабль пустой");
              this.shipKilled(game, attackResult.ship);
            }
            if (attackResult.status === "miss") {
              game.isCurrentPlayer = true;
            }
            (0, clientActionHandler_1.clientTurn)(
              game.player.ws,
              game.isCurrentPlayer
                ? game.player.indexPlayer
                : game.bot.indexPlayer,
            );
            if (attackResult.status !== "miss") {
              setTimeout(function () {
                _this.botAttackAction(gameId);
              }, this.bot_delay);
            }
            return [2];
        }
      });
    });
  };
  SinglePlayHandler.prototype.isAllShipIsKill = function (ships) {
    var result = ships.every(function (ship) {
      return ship.shots.every(Boolean);
    });
    return result;
  };
  SinglePlayHandler.prototype.shipKilled = function (game, ship) {
    var _this = this;
    this.missesAroundShipSinglePlay(game, ship);
    var otherPlayerShips = game.isCurrentPlayer
      ? game.bot.ships
      : game.player.ships;
    if (this.isAllShipIsKill(otherPlayerShips)) {
      (0, clientActionHandler_1.clientFinish)(
        game.player.ws,
        game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
      );
      if (game.isCurrentPlayer) {
      }
      this.webSoketHandler.getAllWS().forEach(function (ws) {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2];
          });
        });
      });
    }
  };
  SinglePlayHandler.prototype.missesAroundShipSinglePlay = function (
    game,
    ship,
  ) {
    var widthCoordinate = ship.direction ? "x" : "y";
    var lengthCoordinate = ship.direction ? "y" : "x";
    var position = { x: ship.position.x, y: ship.position.y };
    var currentPlayer = game.isCurrentPlayer ? game.player : game.bot;
    var sendMiss = function () {
      (0, clientActionHandler_1.clientAttack)(
        game.player.ws,
        currentPlayer.indexPlayer,
        "miss",
        position,
      );
      currentPlayer.shots.add("".concat(position.x, ",").concat(position.y));
    };
    for (
      var i = ship.position[lengthCoordinate] - 1;
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
  };
  return SinglePlayHandler;
})(gamesHandler_1.GamesHandler);
exports.SinglePlayHandler = SinglePlayHandler;
//# sourceMappingURL=singlePlayHandle.js.map
