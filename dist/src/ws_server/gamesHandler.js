"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesHandler = void 0;
var uuid_1 = require("uuid");
var webSoketHandler_1 = require("./webSoketHandler");
var clientActionHandler_1 = require("./clientActionHandler");
var dataBaseHandler_1 = require("./dataBaseHandler");
var GamesHandler = (function () {
    function GamesHandler() {
        var _this = this;
        this.webSoketHandler = new webSoketHandler_1.WebSoketHandler();
        this.dbHandler = new dataBaseHandler_1.DBHandler();
        this.games = [];
        this.addGame = function (player1ID, player2ID) { return __awaiter(_this, void 0, void 0, function () {
            var player1, player2, currentPlayer, game;
            return __generator(this, function (_a) {
                player1 = this.createPlayer(player1ID);
                player2 = this.createPlayer(player2ID);
                currentPlayer = Math.random() > 0.5 ? player1 : player2;
                game = {
                    gameId: (0, uuid_1.v4)(),
                    players: [player1, player2],
                    currentPlayer: currentPlayer,
                };
                this.games.push(game);
                game.players.forEach(function (player) {
                    (0, clientActionHandler_1.clientCreateGame)(player.ws, game.gameId, player.indexPlayer);
                });
                return [2];
            });
        }); };
        this.addShipsToGame = function (gameId, indexPlayer, ships) { return __awaiter(_this, void 0, void 0, function () {
            var player;
            var _a, _b;
            return __generator(this, function (_c) {
                player = (_b = (_a = this.games
                    .find(function (game) { return game.gameId === gameId; })) === null || _a === void 0 ? void 0 : _a.players) === null || _b === void 0 ? void 0 : _b.find(function (player) { return player.indexPlayer === indexPlayer; });
                if (!player) {
                    throw new Error("Player with index ".concat(indexPlayer, " not found in game ").concat(gameId));
                }
                player.ships = ships.map(function (ship) {
                    ship.shots = new Array(ship.length).fill(false);
                    return ship;
                });
                return [2];
            });
        }); };
        this.isAllPlayerReady = function (gameId) { return __awaiter(_this, void 0, void 0, function () {
            var players;
            var _a;
            return __generator(this, function (_b) {
                players = (_a = this.games.find(function (game) { return game.gameId === gameId; })) === null || _a === void 0 ? void 0 : _a.players;
                return [2, players === null || players === void 0 ? void 0 : players.every(function (player) { return player.ships.length > 0; })];
            });
        }); };
        this.startGame = function (gameId) { return __awaiter(_this, void 0, void 0, function () {
            var game;
            return __generator(this, function (_a) {
                game = this.games.find(function (game) { return game.gameId === gameId; });
                game === null || game === void 0 ? void 0 : game.players.forEach(function (player) {
                    (0, clientActionHandler_1.clientStartGame)(player.ws, player.ships, player.indexPlayer);
                    (0, clientActionHandler_1.clientTurn)(player.ws, game.currentPlayer.indexPlayer);
                });
                return [2];
            });
        }); };
        this.attackAction = function (gameId, indexPlayer, x, y) { return __awaiter(_this, void 0, void 0, function () {
            var game, attackResult, winners_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = this.games.find(function (game) { return game.gameId === gameId; });
                        if (!((game === null || game === void 0 ? void 0 : game.currentPlayer.indexPlayer) === indexPlayer))
                            return [2];
                        if (game.currentPlayer.shots.has("".concat(x, ",").concat(y))) {
                            return [2];
                        }
                        game.currentPlayer.shots.add("".concat(x, ",").concat(y));
                        return [4, this.getAttackResult(this.getShipsOtherPlayer(game), x, y)];
                    case 1:
                        attackResult = _a.sent();
                        game.players.forEach(function (player) {
                            (0, clientActionHandler_1.clientAttack)(player.ws, game.currentPlayer.indexPlayer, attackResult.status, { x: x, y: y });
                        });
                        if (!(attackResult.status === "killed")) return [3, 4];
                        if (!attackResult.ship)
                            throw new Error("корабль пустой");
                        this.missesAroundShip(game, attackResult.ship);
                        if (!this.isAllShipKill(game)) return [3, 4];
                        (0, clientActionHandler_1.clientFinish)(game.players[0].ws, game.currentPlayer.indexPlayer);
                        (0, clientActionHandler_1.clientFinish)(game.players[1].ws, game.currentPlayer.indexPlayer);
                        return [4, this.dbHandler.addWinner(game.currentPlayer.indexPlayer)];
                    case 2:
                        _a.sent();
                        return [4, this.dbHandler.getWinners()];
                    case 3:
                        winners_1 = _a.sent();
                        this.webSoketHandler.getAllWS().forEach(function (ws) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                (0, clientActionHandler_1.clientUpdateWinners)(ws.ws, winners_1);
                                return [2];
                            });
                        }); });
                        _a.label = 4;
                    case 4:
                        if (attackResult.status === "miss") {
                            game.currentPlayer =
                                game.currentPlayer === game.players[0]
                                    ? game.players[1]
                                    : game.players[0];
                        }
                        (0, clientActionHandler_1.clientTurn)(game.players[0].ws, game.currentPlayer.indexPlayer);
                        (0, clientActionHandler_1.clientTurn)(game.players[1].ws, game.currentPlayer.indexPlayer);
                        return [2];
                }
            });
        }); };
        this.randomAttack = function (gameId, playerIndex) { return __awaiter(_this, void 0, void 0, function () {
            var game, _a, x, y;
            return __generator(this, function (_b) {
                game = this.games.find(function (game) { return game.gameId === gameId; });
                _a = this.getRandomShot(game.currentPlayer), x = _a.x, y = _a.y;
                this.attackAction(gameId, playerIndex, x, y);
                return [2];
            });
        }); };
        this.getAttackResult = function (ships, x, y) { return __awaiter(_this, void 0, void 0, function () {
            var result, _i, ships_1, ship, hit;
            return __generator(this, function (_a) {
                result = {
                    status: "miss",
                    ship: null,
                };
                for (_i = 0, ships_1 = ships; _i < ships_1.length; _i++) {
                    ship = ships_1[_i];
                    hit = this.checkHit(ship, x, y);
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
                return [2, result];
            });
        }); };
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
        var result = (_a = game.players.find(function (player) { return player !== game.currentPlayer; })) === null || _a === void 0 ? void 0 : _a.ships;
        if (!result || result.length === 0)
            throw new Error();
        return result;
    };
    GamesHandler.prototype.isAllShipKill = function (game) {
        var ships = this.getShipsOtherPlayer(game);
        var result = ships.every(function (ship) { return ship.shots.every(Boolean); });
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
    GamesHandler.prototype.missesAroundShip = function (game, ship) {
        var widthCoordinate = ship.direction ? "x" : "y";
        var lengthCoordinate = ship.direction ? "y" : "x";
        var position = { x: ship.position.x, y: ship.position.y };
        var sendMiss = function () {
            (0, clientActionHandler_1.clientAttack)(game.players[0].ws, game.currentPlayer.indexPlayer, "miss", position);
            (0, clientActionHandler_1.clientAttack)(game.players[1].ws, game.currentPlayer.indexPlayer, "miss", position);
            game.currentPlayer.shots.add("".concat(position.x, ",").concat(position.y));
        };
        for (var i = ship.position[lengthCoordinate] - 1; i <= ship.position[lengthCoordinate] + ship.length; i++) {
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
            if (x >= ship.position.x &&
                x < ship.position.x + ship.length &&
                y === ship.position.y) {
                return { index: x - ship.position.x };
            }
        }
        else {
            if (y >= ship.position.y &&
                y < ship.position.y + ship.length &&
                x === ship.position.x) {
                return { index: y - ship.position.y };
            }
        }
        return null;
    };
    return GamesHandler;
}());
exports.GamesHandler = GamesHandler;
//# sourceMappingURL=gamesHandler.js.map