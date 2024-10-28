"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsHandler = void 0;
var usersHandler_1 = require("./usersHandler");
var RoomsHandler = (function () {
  function RoomsHandler() {
    var _this = this;
    this.usersHandler = new usersHandler_1.UsersHandler();
    this.rooms = [];
    this.getRooms = function () {
      var result = _this.rooms.map(function (room) {
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
      return _this.rooms;
    };
    this.addPlayerToRoom = function (playerIndex, roomId) {
      var room = _this.rooms.find(function (room) {
        return room.roomId === roomId;
      });
      var playerName = _this.usersHandler.getPlayerName(playerIndex);
      room === null || room === void 0
        ? void 0
        : room.roomUsers.push({
            name: playerName,
            index: playerIndex,
          });
    };
    this.isRoomFull = function (roomId) {
      var _a;
      return (
        ((_a = _this.rooms.find(function (room) {
          return room.roomId === roomId;
        })) === null || _a === void 0
          ? void 0
          : _a.roomUsers.length) === 2
      );
    };
    this.addRoom = function () {
      var newRoom = {
        roomId: crypto.randomUUID(),
        roomUsers: [],
      };
      _this.rooms.push(newRoom);
      return newRoom.roomId;
    };
    this.getPlayersInRoom = function (roomId) {
      var room = _this.rooms.find(function (room) {
        return room.roomId === roomId;
      });
      return {
        player1: room.roomUsers[0].index,
        player2: room.roomUsers[1].index,
      };
    };
    this.isPlayerInRoom = function (playerID) {
      return _this.rooms.some(function (room) {
        return room.roomUsers.some(function (user) {
          return user.index === playerID;
        });
      });
    };
    this.delRoom = function (roomId) {
      _this.rooms = _this.rooms.filter(function (room) {
        return room.roomId !== roomId;
      });
    };
    this.playerOffline = function (playerID) {
      _this.rooms = _this.rooms.filter(function (room) {
        return room.roomUsers[0].index !== playerID;
      });
    };
    if (RoomsHandler.instance) {
      return RoomsHandler.instance;
    }
    RoomsHandler.instance = this;
  }
  RoomsHandler.instance = null;
  return RoomsHandler;
})();
exports.RoomsHandler = RoomsHandler;
//# sourceMappingURL=roomsHandler.js.map
