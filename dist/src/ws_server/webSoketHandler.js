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
        var wsListItem = {
            ws: ws,
            playerID: playerID,
        };
        this.wsList.push(wsListItem);
    };
    WebSoketHandler.prototype.delWebSoket = function () { };
    WebSoketHandler.prototype.getWSByPlayerID = function (playerID) {
        var ws = this.wsList.find(function (ws) { return ws.playerID === playerID; });
        if (!ws)
            throw new Error();
        return ws.ws;
    };
    WebSoketHandler.prototype.getPlayerIDByWS = function (ws) {
        this.wsList.forEach(function (item) {
            console.log("ид в базе сокетов", item.playerID);
        });
        var id = this.wsList.find(function (item) { return item.ws === ws; });
        return id;
    };
    WebSoketHandler.prototype.getAllWS = function () {
        return this.wsList;
    };
    WebSoketHandler.instance = null;
    return WebSoketHandler;
}());
exports.WebSoketHandler = WebSoketHandler;
//# sourceMappingURL=webSoketHandler.js.map