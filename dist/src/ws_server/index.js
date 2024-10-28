"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
var ws_1 = require("ws");
var serverActionHandlers_1 = require("./serverActionHandlers");
var webSoketHandler_1 = require("./webSoketHandler");
var WSServer = (function () {
  function WSServer(WS_PORT) {
    var _this = this;
    this.WS_HOSTNAME = "localhost";
    this.userConnectMessage = "New client connected";
    this.userDisconnectMessage = "Client disconnected";
    this.serverActionHandlers =
      new serverActionHandlers_1.ServerActionHandlers();
    this.wsHandler = new webSoketHandler_1.WebSoketHandler();
    this.runServer = function () {
      console.log(
        "\u001B[34mWebSocket server is running on //localhost:".concat(
          _this.WS_PORT,
          "\u001B[0m",
        ),
      );
      _this.wss.on("connection", function (ws) {
        _this.clientConnection(ws);
      });
    };
    this.clientConnection = function (ws) {
      console.log("\u001B[34m".concat(_this.userConnectMessage, "\u001B[0m"));
      ws.on("message", function (message) {
        var action = JSON.parse(message);
        switch (action.type) {
          case "reg":
            _this.serverActionHandlers.handleRegistration(action, ws);
            break;
          case "create_room":
            _this.serverActionHandlers.handleCreateRoom(ws);
            break;
          case "add_user_to_room":
            _this.serverActionHandlers.handleAddUserToRoom(
              JSON.parse(action.data).indexRoom,
              ws,
            );
            break;
          case "add_ships":
            _this.serverActionHandlers.handleAddShips(
              JSON.parse(action.data),
              ws,
            );
            break;
          case "attack":
            _this.serverActionHandlers.handleAttack(
              JSON.parse(action.data),
              ws,
            );
            break;
          case "randomAttack":
            _this.serverActionHandlers.handlerandomAttack(
              JSON.parse(action.data),
              ws,
            );
            break;
          case "single_play":
            _this.serverActionHandlers.handleSinglePlay(ws);
        }
      });
      ws.on("close", function () {
        _this.serverActionHandlers.closeWebSoket(ws);
        console.log(
          "\u001B[34m".concat(_this.userDisconnectMessage, "\u001B[0m"),
        );
      });
    };
    this.WS_PORT = WS_PORT;
    this.wss = new ws_1.WebSocketServer({
      host: this.WS_HOSTNAME,
      port: WS_PORT,
    });
  }
  return WSServer;
})();
exports.WSServer = WSServer;
//# sourceMappingURL=index.js.map
