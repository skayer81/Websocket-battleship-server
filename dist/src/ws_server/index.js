"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsserver = exports.WSServer = void 0;
var ws_1 = require("ws");
var serverActionHandlers_1 = require("./serverActionHandlers");
var webSoketHandler_1 = require("./webSoketHandler");
var WS_HOSTNAME = "localhost";
var WS_HTTP_PORT = 3000;
var WSServer = (function () {
    function WSServer() {
        var _this = this;
        this.wss = new ws_1.WebSocketServer({
            host: WS_HOSTNAME,
            port: WS_HTTP_PORT,
        });
        this.serverActionHandlers = new serverActionHandlers_1.ServerActionHandlers();
        this.wsHandler = new webSoketHandler_1.WebSoketHandler();
        this.runServer = function () {
            console.log("WebSocket server is running on //localhost:".concat(WS_HTTP_PORT));
            _this.wss.on("connection", function (ws) {
                _this.clientConnection(ws);
            });
        };
        this.clientConnection = function (ws) {
            console.log("New client connected");
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
                        _this.serverActionHandlers.handleAddUserToRoom(JSON.parse(action.data).indexRoom, ws);
                        break;
                    case "add_ships":
                        _this.serverActionHandlers.handleAddShips(JSON.parse(action.data), ws);
                        break;
                    case "attack":
                        _this.serverActionHandlers.handleAttack(JSON.parse(action.data), ws);
                        break;
                    case "randomAttack":
                        _this.serverActionHandlers.handlerandomAttack(JSON.parse(action.data), ws);
                        break;
                }
            });
            ws.on("close", function () {
                console.log("Client disconnected");
            });
        };
    }
    return WSServer;
}());
exports.WSServer = WSServer;
exports.wsserver = new WSServer();
exports.wsserver.runServer();
//# sourceMappingURL=index.js.map