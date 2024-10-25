///вынести логику игры в отдельный модуль 24.10  ++++++++++++++++++++++++
//добавить текущего игрока. вебсокеты?? 24.10    ++++++++++++++++++++++++
//проверка на то что игрок уже есть/логин 25.10   +++++++++++++++++++++++
//определить победу - 24.10  ++++++++++++++++++++++++++++++++++++++++++++
//бот для соло игры 
//разобраться с сервером клиента 
//автовыстрелы           ++++++++++++++++++++++++++++++++++++++++++++++++
//заблочить стрельбу по подбитым кораблям   +++++++++++++++++++++++++++++
//уьрать комнату при старте игры 25.10           ++++++++++++++++++++++++
//автодобавление игрока в комнату                             +++++++++++
//заблочить вход в комнату если игрок в комнате 25.10       +++++++++++++
//протестить несколько игр сразу
//удалить сокет из массива при закрытии 25.10            ++++++++++++++++
//баг с первым ходом                 ++++++++++++++++++++++++++++++++++++
//баг с добавлением в сет ходов клеток вокруг корабля +++++++++++++++++++
//баг с автострельбой                      ++++++++++++++++++++++++++++++
//добавить логирование действий сервера 
//типизация событий
//убрать UUIE                              ------------------------
//что делать с игроком когда он в игре но разлогинился? -----------



import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { ServerActionHandlers } from "./serverActionHandlers";
import { WebSoketHandler } from "./webSoketHandler";
//import { SinglPlayField} from './singlePlay/singlePlayShips';


const WS_HOSTNAME = "localhost";
const WS_HTTP_PORT = 3000;
// const wss = new WebSocketServer({
//  host: WS_HOSTNAME,
//  port: WS_HTTP_PORT,
// });

// interface WebSocketWithUserIndex extends WebSocket {
//   index?: string;
// }

export class WSServer {
  wss = new WebSocketServer({
    host: WS_HOSTNAME,
    port: WS_HTTP_PORT,
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
    console.log(`WebSocket server is running on //localhost:${WS_HTTP_PORT}`);
    this.wss.on("connection", (ws) => {
      this.clientConnection(ws);
    });
  };

  clientConnection = (ws: WebSocket) => {
    console.log("New client connected");

    //this.wsHandler.addWebSoket(ws);

    ws.on("message", (message: string) => {
      const action = JSON.parse(message);
      // console.log('Received command:', action);

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
            this.serverActionHandlers.handleSinglePlay(ws)
      }
    });

    ws.on("close", () => {
        this.serverActionHandlers.closeWebSoket(ws);
      console.log("Client disconnected");
    });
  };
}

export const wsserver = new WSServer();
wsserver.runServer();

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
