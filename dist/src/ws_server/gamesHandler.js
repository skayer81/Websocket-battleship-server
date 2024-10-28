"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesHandler = void 0;
var webSoketHandler_1 = require("./webSoketHandler");
var clientActionHandler_1 = require("./clientActionHandler");
var usersHandler_1 = require("./usersHandler");
var logHandlers_1 = require("./logHandlers");
var typesOfRequestResponse_1 = require("./types/typesOfRequestResponse");
var logHandlerTypes_1 = require("./types/logHandlerTypes");
var GamesHandler = (function () {
  function GamesHandler() {
    var _this = this;
    this.webSoketHandler = new webSoketHandler_1.WebSoketHandler();
    this.usersHandler = new usersHandler_1.UsersHandler();
    this.consoleLog = new logHandlers_1.ConsoleLog();
    this.games = [];
    this.addGame = function (player1ID, player2ID) {
      var player1 = _this.createPlayer(player1ID);
      var player2 = _this.createPlayer(player2ID);
      var currentPlayer = Math.random() > 0.5 ? player1 : player2;
      var game = {
        gameId: crypto.randomUUID(),
        players: [player1, player2],
        currentPlayer: currentPlayer,
      };
      _this.games.push(game);
      game.players.forEach(function (player) {
        (0, clientActionHandler_1.clientCreateGame)(
          player.ws,
          game.gameId,
          player.indexPlayer,
        );
        _this.consoleLog.serverResponse(
          typesOfRequestResponse_1.TypesServerResponse.create_game,
          {
            name: _this.usersHandler.getPlayerName(player.indexPlayer),
          },
        );
      });
    };
    this.addShipsToGame = function (gameId, indexPlayer, ships) {
      var _a, _b;
      var player =
        (_b =
          (_a = _this.games.find(function (game) {
            return game.gameId === gameId;
          })) === null || _a === void 0
            ? void 0
            : _a.players) === null || _b === void 0
          ? void 0
          : _b.find(function (player) {
              return player.indexPlayer === indexPlayer;
            });
      if (!player) {
        throw new Error(
          "Player with index "
            .concat(indexPlayer, " not found in game ")
            .concat(gameId, " gameHandler:185"),
        );
      }
      player.ships = ships.map(function (ship) {
        ship.shots = new Array(ship.length).fill(false);
        return ship;
      });
    };
    this.isAllPlayerReady = function (gameId) {
      var _a;
      var players =
        (_a = _this.games.find(function (game) {
          return game.gameId === gameId;
        })) === null || _a === void 0
          ? void 0
          : _a.players;
      if (!players) {
        throw new Error();
      }
      return players.every(function (player) {
        return player.ships.length > 0;
      });
    };
    this.startGame = function (gameId) {
      var game = _this.games.find(function (game) {
        return game.gameId === gameId;
      });
      game === null || game === void 0
        ? void 0
        : game.players.forEach(function (player) {
            (0, clientActionHandler_1.clientStartGame)(
              player.ws,
              player.ships,
              player.indexPlayer,
            );
            (0, clientActionHandler_1.clientTurn)(
              player.ws,
              game.currentPlayer.indexPlayer,
            );
          });
    };
    this.attackAction = function (gameId, indexPlayer, x, y) {
      var game = _this.games.find(function (game) {
        return game.gameId === gameId;
      });
      if (!game) throw new Error("game ".concat(gameId, " is not found"));
      var attackPlayer = _this.usersHandler.getPlayerName(
        game.currentPlayer.indexPlayer,
      );
      var targetPlayer = _this.usersHandler.getPlayerName(
        game.currentPlayer === game.players[0]
          ? game.players[1].indexPlayer
          : game.players[0].indexPlayer,
      );
      if (!(game.currentPlayer.indexPlayer === indexPlayer)) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.not_current_player,
          {
            player1: attackPlayer,
            player2: targetPlayer,
          },
        );
        return;
      }
      if (game.currentPlayer.shots.has("".concat(x, ",").concat(y))) {
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.reshot,
          {
            attackPlayer: attackPlayer,
            targetPlayer: targetPlayer,
            x: x,
            y: y,
          },
        );
        (0, clientActionHandler_1.clientTurn)(
          game.currentPlayer.ws,
          game.currentPlayer.indexPlayer,
        );
        return;
      }
      game.currentPlayer.shots.add("".concat(x, ",").concat(y));
      var attackResult = _this.getAttackResult(
        _this.getShipsOtherPlayer(game),
        x,
        y,
      );
      game.players.forEach(function (player) {
        (0, clientActionHandler_1.clientAttack)(
          player.ws,
          game.currentPlayer.indexPlayer,
          attackResult.status,
          { x: x, y: y },
        );
      });
      if (attackResult.status === "killed") {
        if (!attackResult.ship) {
          throw new Error("корабль пустой");
        }
        _this.consoleLog.serverAction(
          logHandlerTypes_1.TypesServerAction.killed,
          {},
        );
        _this.missesAroundShip(game, attackResult.ship);
        if (_this.isAllShipKill(game)) {
          (0, clientActionHandler_1.clientFinish)(
            game.players[0].ws,
            game.currentPlayer.indexPlayer,
          );
          (0, clientActionHandler_1.clientFinish)(
            game.players[1].ws,
            game.currentPlayer.indexPlayer,
          );
          _this.setWinAndcloseGame(game);
          _this.deleteGame(game);
        }
      }
      if (game) {
        if (attackResult.status === "miss") {
          game.currentPlayer =
            game.currentPlayer === game.players[0]
              ? game.players[1]
              : game.players[0];
        }
        (0, clientActionHandler_1.clientTurn)(
          game.players[0].ws,
          game.currentPlayer.indexPlayer,
        );
        (0, clientActionHandler_1.clientTurn)(
          game.players[1].ws,
          game.currentPlayer.indexPlayer,
        );
      }
    };
    this.randomAttack = function (gameId, playerIndex) {
      var game = _this.games.find(function (game) {
        return game.gameId === gameId;
      });
      var _a = _this.getRandomShot(game.currentPlayer),
        x = _a.x,
        y = _a.y;
      _this.consoleLog.serverAction(
        logHandlerTypes_1.TypesServerAction.random_attack,
        {
          targetPlayer: game.currentPlayer.indexPlayer,
          x: x,
          y: y,
        },
      );
      _this.attackAction(gameId, playerIndex, x, y);
    };
    this.getAttackResult = function (ships, x, y) {
      var result = {
        status: "miss",
        ship: null,
      };
      for (var _i = 0, ships_1 = ships; _i < ships_1.length; _i++) {
        var ship = ships_1[_i];
        var hit = _this.checkHit(ship, x, y);
        if (hit) {
          ship.shots[hit.index] = true;
          result.status = "shot";
          if (ship.shots.every(Boolean)) {
            result.status = "killed";
            result.ship = ship;
          }
          break;
        }
      }
      return result;
    };
  }
  GamesHandler.prototype.createPlayer = function (playerID) {
    return {
      indexPlayer: playerID,
      ws: this.webSoketHandler.getWSByPlayerID(playerID),
      ships: [],
      shots: new Set(),
    };
  };
  GamesHandler.prototype.getShipsOtherPlayer = function (game) {
    var _a;
    var result =
      (_a = game.players.find(function (player) {
        return player !== game.currentPlayer;
      })) === null || _a === void 0
        ? void 0
        : _a.ships;
    if (!result || result.length === 0) {
      throw new Error();
    }
    return result;
  };
  GamesHandler.prototype.isAllShipKill = function (game) {
    var ships = this.getShipsOtherPlayer(game);
    var result = ships.every(function (ship) {
      return ship.shots.every(Boolean);
    });
    return result;
  };
  GamesHandler.prototype.getRandomShot = function (player) {
    var shot;
    do {
      shot = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
      };
    } while (player.shots.has("".concat(shot.x, ",").concat(shot.y)));
    return shot;
  };
  GamesHandler.prototype.setWinAndcloseGame = function (game) {
    this.usersHandler.addWinner(game.currentPlayer.indexPlayer);
    var winners = this.usersHandler.getWinners();
    this.consoleLog.serverResponse(
      typesOfRequestResponse_1.TypesServerResponse.update_winners,
      {},
    );
    this.webSoketHandler.getAllWS().forEach(function (ws) {
      (0, clientActionHandler_1.clientUpdateWinners)(ws.ws, winners);
    });
    this.deleteGame(game);
  };
  GamesHandler.prototype.missesAroundShip = function (game, ship) {
    var widthCoordinate = ship.direction ? "x" : "y";
    var lengthCoordinate = ship.direction ? "y" : "x";
    var position = { x: ship.position.x, y: ship.position.y };
    var sendMiss = function () {
      (0, clientActionHandler_1.clientAttack)(
        game.players[0].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      (0, clientActionHandler_1.clientAttack)(
        game.players[1].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      game.currentPlayer.shots.add(
        "".concat(position.x, ",").concat(position.y),
      );
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
  GamesHandler.prototype.checkHit = function (ship, x, y) {
    if (!ship.direction) {
      if (
        x >= ship.position.x &&
        x < ship.position.x + ship.length &&
        y === ship.position.y
      ) {
        return { index: x - ship.position.x };
      }
    } else {
      if (
        y >= ship.position.y &&
        y < ship.position.y + ship.length &&
        x === ship.position.x
      ) {
        return { index: y - ship.position.y };
      }
    }
    return null;
  };
  GamesHandler.prototype.deleteGame = function (game) {
    this.games = this.games.filter(function (element) {
      return element !== game;
    });
  };
  GamesHandler.prototype.playerOffline = function (playerID) {
    var game = this.games.find(function (game) {
      return (
        game.players[0].indexPlayer === playerID ||
        game.players[1].indexPlayer === playerID
      );
    });
    if (!game) {
      return;
    }
    var otherPlayer =
      game.players[0].indexPlayer === playerID
        ? game.players[1]
        : game.players[0];
    (0, clientActionHandler_1.clientFinish)(
      otherPlayer.ws,
      otherPlayer.indexPlayer,
    );
    this.setWinAndcloseGame(game);
  };
  return GamesHandler;
})();
exports.GamesHandler = GamesHandler;
//# sourceMappingURL=gamesHandler.js.map
