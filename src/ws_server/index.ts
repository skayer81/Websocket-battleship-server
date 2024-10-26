// разобраться с сервером клиента                      +++++++++++++++++++
// добавить логирование действий сервера
// типизация событий
// что делать с игроком когда он в игре но разлогинился? ++++++++++++++++++
//автовыстрелы в соло игре?? проетстировать
import WebSocket, { WebSocketServer } from "ws";
import { ServerActionHandlers } from "./serverActionHandlers";
import { WebSoketHandler } from "./webSoketHandler";
// import { SinglPlayField} from './singlePlay/singlePlayShips';


// const wss = new WebSocketServer({
//  host: WS_HOSTNAME,
//  port: WS_HTTP_PORT,
// });

// interface WebSocketWithUserIndex extends WebSocket {
//   index?: string;
// }

export class WSServer {
   WS_HOSTNAME = "localhost";
 WS_HTTP_PORT = 3000;
  wss = new WebSocketServer({
    host: this.WS_HOSTNAME,
    port: this.WS_HTTP_PORT,
  });

  serverActionHandlers = new ServerActionHandlers();

  wsHandler = new WebSoketHandler();

  //   constructor(){
  //     const game = new SinglPlayField();
  // // game.randomizeShips();
  // // game.printField();
  // console.log(game.getShips())
  //   }

  runServer = () => {
    console.log(`WebSocket server is running on //localhost:${this.WS_HTTP_PORT}`);
    this.wss.on("connection", (ws) => {
      this.clientConnection(ws);
    });
  };

  clientConnection = (ws: WebSocket) => {
    console.log("New client connected");

    // this.wsHandler.addWebSoket(ws);

    ws.on("message", (message: string) => {
      const action = JSON.parse(message);
      // console.log('Received command:', action);

      switch (action.type) {
        case "reg":
          this.serverActionHandlers.handleRegistration(action, ws);
          break;
        case "create_room":
          console.log('создаем комнату')
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
          console.log('создаем одиночную игру')
          this.serverActionHandlers.handleSinglePlay(ws);
      }
    });

    ws.on("close", () => {
      this.serverActionHandlers.closeWebSoket(ws);
      console.log("Client disconnected");
    });
  };
}

//export const wsserver = new WSServer();
//wsserver.runServer();

// export function test(){
// wss.on('connection', (ws) => {
//  console.log('New client connected');

//  ws.on('message', (message) => {
//      console.log(`Received message: ${message}`);
//      const test = ({
//          type: "reg",
//          data: JSON.stringify(
//              {
//                  name: "myname",
//                  index: 123,
//                  error: false,
//                  errorText: '',
//              }),
//          id: 0,
//      })
//      ws.send(JSON.stringify(test));
//  });

//  ws.on('close', () => {
//      console.log('Client disconnected');
//  });
// });}
