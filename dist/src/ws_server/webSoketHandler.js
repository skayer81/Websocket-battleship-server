"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSoketHandler = void 0;
var WebSoketHandler = (function () {
  function WebSoketHandler() {
    this.wsList = [];
    if (WebSoketHandler.instance) {
      return WebSoketHandler.instance;
    }
    WebSoketHandler.instance = this;
  }
  WebSoketHandler.prototype.addWebSoket = function (ws, playerID) {
    if (playerID === void 0) {
      playerID = "";
    }
    var wsListItem = {
      ws: ws,
      playerID: playerID,
    };
    this.wsList.push(wsListItem);
  };
  WebSoketHandler.prototype.delWebSoket = function (ws) {
    this.wsList = this.wsList.filter(function (element) {
      return element.ws !== ws;
    });
  };
  WebSoketHandler.prototype.getWSByPlayerID = function (playerID) {
    var ws = this.wsList.find(function (ws) {
      return ws.playerID === playerID;
    });
    if (!ws) throw new Error();
    return ws.ws;
  };
  WebSoketHandler.prototype.getPlayerIDByWS = function (ws) {
    var _a;
    this.wsList.forEach(function (item) {});
    var playerID =
      (_a = this.wsList.find(function (item) {
        return item.ws === ws;
      })) === null || _a === void 0
        ? void 0
        : _a.playerID;
    if (!playerID) throw new Error();
    return playerID;
  };
  WebSoketHandler.prototype.getAllWS = function () {
    return this.wsList;
  };
  WebSoketHandler.instance = null;
  return WebSoketHandler;
})();
exports.WebSoketHandler = WebSoketHandler;
//# sourceMappingURL=webSoketHandler.js.map
