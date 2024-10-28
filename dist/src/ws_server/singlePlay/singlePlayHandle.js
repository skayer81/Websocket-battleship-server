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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinglePlayHandler = void 0;
var clientActionHandler_1 = require("../clientActionHandler");
var gamesHandler_1 = require("../gamesHandler");
var singlePlayShips_1 = require("./singlePlayShips");
var logHandlerTypes_1 = require("../types/logHandlerTypes");
var typesOfRequestResponse_1 = require("../types/typesOfRequestResponse");
var SinglePlayHandler = (function (_super) {
  __extends(SinglePlayHandler, _super);
  function SinglePlayHandler() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.singleGames = [];
    _this.singlPlayShips = new singlePlayShips_1.SinglPlayShips();
    _this.bot_delay = 1000;
    _this.addSingleGame = function (ws) {
      var game = {
        gameId: crypto.randomUUID(),
        player: {
          indexPlayer: _this.webSoketHandler.getPlayerIDByWS(ws),
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
      var ships = _this.singlPlayShips.getShips();
      ships = ships.map(function (ship) {
        ship.shots = new Array(ship.length).fill(false);
        return ship;
      });
      game.bot.ships = ships;
      _this.singleGames.push(game);
      (0, clientActionHandler_1.clientCreateGame)(
        ws,
        game.gameId,
        game.player.indexPlayer,
      );
    };
    _this.addShipsToSingleGame = function (gameId, indexPlayer, ships) {
      var _a;
      var player =
        (_a = _this.singleGames.find(function (game) {
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
    };
    _this.isSinglePlay = function (gameId) {
      return _this.singleGames.some(function (game) {
        return game.gameId === gameId;
      });
    };
    _this.startSingleGame = function (gameId) {
      var game = _this.singleGames.find(function (game) {
        return game.gameId === gameId;
      });
      if (!game) {
        throw new Error();
      }
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
        }, _this.bot_delay);
      }
    };
    _this.singleGameAttackAction = function (gameId, x, y) {
      var game = _this.singleGames.find(function (game) {
        return game.gameId === gameId;
      });
      if (!game) throw new Error("singleGame is not found");
      var player = _this.usersHandler.getPlayerName(game.player.indexPlayer);
      if (!game.isCurrentPlayer) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.not_current_player,
          {
            player1: player,
            player2: "bot",
          },
        );
        return;
      }
      if (game.player.shots.has("".concat(x, ",").concat(y))) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.reshot,
          {
            attackPlayer: "bot",
            targetPlayer: player,
            x: x,
            y: y,
          },
        );
        (0, clientActionHandler_1.clientTurn)(
          game.player.ws,
          game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
        );
        return;
      }
      game.player.shots.add("".concat(x, ",").concat(y));
      var attackResult = _this.getAttackResult(game.bot.ships, x, y);
      (0, clientActionHandler_1.clientAttack)(
        game.player.ws,
        game.player.indexPlayer,
        attackResult.status,
        {
          x: x,
          y: y,
        },
      );
      if (attackResult.status === "killed") {
        if (!attackResult.ship) {
          throw new Error("корабль пустой");
        }
        _this.shipKilled(game, attackResult.ship);
      }
      if (attackResult.status === "miss") {
        game.isCurrentPlayer = false;
        setTimeout(function () {
          _this.botAttackAction(gameId);
        }, _this.bot_delay);
      }
      if (game) {
        (0, clientActionHandler_1.clientTurn)(
          game.player.ws,
          game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
        );
      }
    };
    return _this;
  }
  SinglePlayHandler.prototype.botAttackAction = function (gameId) {
    var _this = this;
    var game = this.singleGames.find(function (game) {
      return game.gameId === gameId;
    });
    if (!game) {
      return;
    }
    var _a = this.getRandomShot(
        game === null || game === void 0 ? void 0 : game.bot,
      ),
      x = _a.x,
      y = _a.y;
    var attackResult = this.getAttackResult(game.player.ships, x, y);
    (0, clientActionHandler_1.clientAttack)(
      game.player.ws,
      game.bot.indexPlayer,
      attackResult.status,
      {
        x: x,
        y: y,
      },
    );
    game.bot.shots.add("".concat(x, ",").concat(y));
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("корабль пустой");
      }
      this.shipKilled(game, attackResult.ship);
    }
    if (attackResult.status === "miss") {
      game.isCurrentPlayer = true;
    }
    (0, clientActionHandler_1.clientTurn)(
      game.player.ws,
      game.isCurrentPlayer ? game.player.indexPlayer : game.bot.indexPlayer,
    );
    if (attackResult.status !== "miss") {
      setTimeout(function () {
        _this.botAttackAction(gameId);
      }, this.bot_delay);
    }
  };
  SinglePlayHandler.prototype.isAllShipIsKill = function (ships) {
    var result = ships.every(function (ship) {
      return ship.shots.every(Boolean);
    });
    return result;
  };
  SinglePlayHandler.prototype.shipKilled = function (game, ship) {
    this.consoleLog.serverAction(
      logHandlerTypes_1.TypesServerAction.killed,
      {},
    );
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
        this.usersHandler.addWinner(game.player.indexPlayer);
        this.consoleLog.serverResponse(
          typesOfRequestResponse_1.TypesServerResponse.update_winners,
          {},
        );
        var winners_1 = this.usersHandler.getWinners();
        this.webSoketHandler.getAllWS().forEach(function (ws) {
          (0, clientActionHandler_1.clientUpdateWinners)(ws.ws, winners_1);
        });
      }
      this.deleteSingleGame(game);
    }
  };
  SinglePlayHandler.prototype.deleteSingleGame = function (game) {
    this.singleGames = this.singleGames.filter(function (element) {
      return element !== game;
    });
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
  SinglePlayHandler.prototype.playerOffline = function (playerID) {
    var game = this.singleGames.find(function (game) {
      return game.player.indexPlayer === playerID;
    });
    if (!game) {
      return;
    }
    this.deleteSingleGame(game);
  };
  SinglePlayHandler.prototype.singleRandomAttack = function (gameId) {
    var game = this.singleGames.find(function (game) {
      return game.gameId === gameId;
    });
    var _a = this.getRandomShot(game.player),
      x = _a.x,
      y = _a.y;
    this.consoleLog.serverAction(
      logHandlerTypes_1.TypesServerAction.random_attack,
      {
        targetPlayer: game.player.indexPlayer,
        x: x,
        y: y,
      },
    );
    this.singleGameAttackAction(gameId, x, y);
  };
  return SinglePlayHandler;
})(gamesHandler_1.GamesHandler);
exports.SinglePlayHandler = SinglePlayHandler;
//# sourceMappingURL=singlePlayHandle.js.map
