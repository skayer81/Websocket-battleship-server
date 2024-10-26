// import  httpServer  from "./src/http_server/index.js";
// import { wsserver , test } from "./src/ws_server/index";
// import ws from "./src/ws_server/testServer";

// const HTTP_PORT = 8181;

//  console.log(`Start static http server on the ${HTTP_PORT} port!`);
// wsserver.runServer()
// test()
//  httpServer.listen(HTTP_PORT);
import { httpServer } from "./src/http_server/index";
// import { wsserver , test } from "./src/ws_server/index";
//import ws from "./src/ws_server/testServer"

const HTTP_PORT = 8000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
// wsserver.runServer()
// test()
httpServer.listen(HTTP_PORT);


import { WSServer } from "./src/ws_server/index";


const wsserver = new WSServer();
wsserver.runServer();
