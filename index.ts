import { httpServer } from "./src/http_server/index";
import { WSServer } from "./src/ws_server/index";

const HTTP_PORT = 8000;
httpServer.listen(HTTP_PORT);




const text = 'Hello, for convenience, logs of different colors: '
const text2 = 'blue - internal server logic'
const text3 = 'yellow - requests from the client'
const text4 = 'green - server responses'
const text5 = 'red - server response with login error'

 console.log(`\n`,text);
 console.log(`\x1b[34m${text2}\x1b[0m`);
 console.log(`\x1b[33m${text3}\x1b[0m`);
 console.log(`\x1b[32m${text4}\x1b[0m`);
console.log(`\x1b[31m${text5}\x1b[0m\n`);




console.log(`\x1b[34mStart static http server on the ${HTTP_PORT} port!\x1b[0m`);


const wsserver = new WSServer();
wsserver.runServer();





