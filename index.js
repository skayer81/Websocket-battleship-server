import { httpServer } from "./src/http_server/index.js";
import { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

 const WS_HOSTNAME = 'localhost';
 const WS_HTTP_PORT = 3000;
const wss = new WebSocketServer({
    host: WS_HOSTNAME,
    port: WS_HTTP_PORT,
  });

console.log('WebSocket server is running on ws://localhost:3000');

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        const test = ({
            type: "reg",
            data: JSON.stringify(
                {
                    name: "myname",
                    index: 123,
                    error: false,
                    errorText: '',
                }),
            id: 0,
        })
        ws.send(JSON.stringify(test));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

