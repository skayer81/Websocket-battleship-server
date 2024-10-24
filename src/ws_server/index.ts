///вынести логику игры в отдельный модуль 24.10  ++++++++++
//добавить текущего игрока. вебсокеты?? 24.10    ++++++++++++
//проверка на то что игрок уже есть/логин 25.10
//определить победу - 24.10
//бот для соло игры 25.10
//разобраться с сервером клиента
//автовыстрелы
//заблочить стрельбу по подбитым кораблям

import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { ServerActionHandlers } from './serverActionHandlers';
import { WebSoketHandler } from './webSoketHandler';

const WS_HOSTNAME = 'localhost';
const WS_HTTP_PORT = 3000;
// const wss = new WebSocketServer({
//  host: WS_HOSTNAME,
//  port: WS_HTTP_PORT,
// });

interface WebSocketWithUserIndex extends WebSocket  {
    index?: string;
}

export class WSServer {

    wss =  new WebSocketServer({
        host: WS_HOSTNAME,
        port: WS_HTTP_PORT,
       });;

    serverActionHandlers = new ServerActionHandlers();  
    wsHandler = new WebSoketHandler() 

    runServer = () => {
        console.log(`WebSocket server is running on //localhost:${WS_HTTP_PORT}`);   
        this.wss.on('connection', (ws) => {this.clientConnection(ws)})
    }

    clientConnection = (ws : WebSocket) => {
        console.log('New client connected');


        ws.on('message', (message: string) => {
            const action = JSON.parse(message);
           // console.log('Received command:', action);
    
            switch (action.type) {
                case 'reg':
                    this.serverActionHandlers.handleRegistration(action, ws);
                    break;
                case 'create_room':
                    this.serverActionHandlers.handleCreateRoom(ws);
                    break;
                case 'add_user_to_room':
                    this.serverActionHandlers.handleAddUserToRoom(JSON.parse(action.data).indexRoom, ws);
                    break;
                case 'add_ships':
                    this.serverActionHandlers.handleAddShips(JSON.parse(action.data), ws);
                    break;
                case 'attack':
                    this.serverActionHandlers.handleAttack(JSON.parse(action.data), ws);
                    break;
                                }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    }
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
