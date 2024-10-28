"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersHandler = void 0;
var UsersHandler = (function () {
  function UsersHandler() {
    var _this = this;
    this.players = [];
    this.getPlayerByName = function (name) {
      var player = _this.players.find(function (player) {
        return player.name === name;
      });
      if (!player) {
        throw new Error("player whit name ".concat(name, " is not exist"));
      }
      return player;
    };
    this.getPlayerByID = function (playerID) {
      var player = _this.players.find(function (player) {
        return player.index === playerID;
      });
      if (!player) {
        throw new Error("player whit ID ".concat(playerID, " is not exist"));
      }
      return player;
    };
    this.isPlayerExist = function (name) {
      var player = _this.players.find(function (player) {
        return player.name === name;
      });
      return Boolean(player);
    };
    this.isPasswordCorrect = function (name, password) {
      var player = _this.getPlayerByName(name);
      return player.password === password;
    };
    this.isUserOnlain = function (name) {
      var player = _this.getPlayerByName(name);
      return player.isOnline;
    };
    this.getPlayerID = function (name) {
      return _this.getPlayerByName(name).index;
    };
    this.getPlayerName = function (playerID) {
      return _this.getPlayerByID(playerID).name;
    };
    this.addPlayer = function (name, password) {
      var newPlayer = {
        name: name,
        password: password,
        index: crypto.randomUUID(),
        wins: 0,
        isOnline: false,
      };
      _this.players.push(newPlayer);
    };
    this.setOnlineStatus = function (playerID, status) {
      _this.getPlayerByID(playerID).isOnline = status;
    };
    this.getWinners = function () {
      var winners = _this.sortPlayers(_this.players).map(function (player) {
        return {
          id: player.index,
          name: ""
            .concat(player.name, " ")
            .concat(player.isOnline ? "(online)" : ""),
          wins: player.wins,
        };
      });
      return winners.sort(function (a, b) {
        return Number(a.wins > b.wins);
      });
    };
    this.addWinner = function (winnerID) {
      var user = _this.getPlayerByID(winnerID);
      user.wins += 1;
    };
    if (UsersHandler.instance) {
      return UsersHandler.instance;
    }
    UsersHandler.instance = this;
  }
  UsersHandler.prototype.sortPlayers = function (players) {
    return players.sort(function (a, b) {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };
  UsersHandler.instance = null;
  return UsersHandler;
})();
exports.UsersHandler = UsersHandler;
//# sourceMappingURL=usersHandler.js.map
