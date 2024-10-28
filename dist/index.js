"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./src/http_server/index");
var index_2 = require("./src/ws_server/index");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var HTTP_PORT = 8000;
var WS_PORT = Number(process.env.PORT) || 3000;
index_1.httpServer.listen(HTTP_PORT);
var text = "Hello, for convenience, logs of different colors: ";
var text2 = "blue - internal server logic";
var text3 = "yellow - requests from the client";
var text4 = "green - server responses";
var text5 = "red - server response with login error";
console.log("\n", text);
console.log("\u001B[34m".concat(text2, "\u001B[0m"));
console.log("\u001B[33m".concat(text3, "\u001B[0m"));
console.log("\u001B[32m".concat(text4, "\u001B[0m"));
console.log("\u001B[31m".concat(text5, "\u001B[0m\n"));
console.log(
  "\u001B[34mStart static http server on the ".concat(
    HTTP_PORT,
    " port!\u001B[0m",
  ),
);
var wsserver = new index_2.WSServer(WS_PORT);
wsserver.runServer();
//# sourceMappingURL=index.js.map
