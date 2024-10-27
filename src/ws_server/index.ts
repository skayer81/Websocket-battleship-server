import WebSocket, { WebSocketServer } from "ws";
import { ServerActionHandlers } from "./serverActionHandlers";
import { WebSoketHandler } from "./webSoketHandler";

export class WSServer {
  private WS_HOSTNAME = "localhost";
  private WS_HTTP_PORT = 3000;
  private wss = new WebSocketServer({
    host: this.WS_HOSTNAME,
    port: this.WS_HTTP_PORT,
  });
  private userConnectMessage = "New client connected";
    private userDisconnectMessage = "Client disconnected"

  private serverActionHandlers = new ServerActionHandlers();

  private wsHandler = new WebSoketHandler();

  public runServer = () : void => {
    console.log(`\x1b[34mWebSocket server is running on //localhost:${this.WS_HTTP_PORT}\x1b[0m`,
    );
    this.wss.on("connection", (ws) => {
      this.clientConnection(ws);
    });
  };

  private clientConnection = (ws: WebSocket) : void => {
    console.log(`\x1b[34m${this.userConnectMessage}\x1b[0m`);

    ws.on("message", (message: string) => {
      const action = JSON.parse(message);

      switch (action.type) {
        case "reg":
          this.serverActionHandlers.handleRegistration(action, ws);
          break;
        case "create_room":
      
          this.serverActionHandlers.handleCreateRoom(ws);
          break;
        case "add_user_to_room":
          this.serverActionHandlers.handleAddUserToRoom(
            JSON.parse(action.data).indexRoom,
            ws,
          );
          break;
        case "add_ships":
          this.serverActionHandlers.handleAddShips(JSON.parse(action.data), ws);
          break;
        case "attack":
          this.serverActionHandlers.handleAttack(JSON.parse(action.data), ws);
          break;
        case "randomAttack":
          this.serverActionHandlers.handlerandomAttack(
            JSON.parse(action.data),
            ws,
          );
          break;
        case "single_play":
          this.serverActionHandlers.handleSinglePlay(ws);
      }
    });

    ws.on("close", () => {
      this.serverActionHandlers.closeWebSoket(ws);
      console.log(`\x1b[34m${this.userDisconnectMessage}\x1b[0m`);
    });
  };
}
