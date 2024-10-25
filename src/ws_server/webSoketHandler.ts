import WebSocket from "ws";

type WSListItem = {
  ws: WebSocket;
  playerID?: string;
};

export class WebSoketHandler {
  private wsList: Array<WSListItem> = [];
  

  private static instance: WebSoketHandler | null = null;

  constructor() {
    if (WebSoketHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return WebSoketHandler.instance;
    }
    WebSoketHandler.instance = this;
  }

  public addWebSoket(ws: WebSocket, playerID = '') {
    const wsListItem = {
      ws,
      playerID,
    };
    this.wsList.push(wsListItem);
  }

  public delWebSoket(ws: WebSocket) {
    this.wsList = this.wsList.filter(element => element.ws !== ws);
  }



//   function removeElement(arr, value) {
//     return arr.filter(element => element !== value);
// }

// // Пример использования
// const originalArray = [1, 2, 3, 4, 5];
// const newArray = removeElement(originalArray, 3);
// console.log(newArray); // Вывод: [1, 2, 4, 5]



  public getWSByPlayerID(playerID: string) {
    const ws = this.wsList.find((ws) => ws.playerID === playerID);
    if (!ws) throw new Error();
    return ws.ws;
  }

  public getPlayerIDByWS(ws: WebSocket) {
    this.wsList.forEach((item) => {
     // console.log("ид в базе сокетов", item.playerID);
    });
    const playerID = this.wsList.find((item) => item.ws === ws)?.playerID;
    if (!playerID) throw new Error()
    return playerID;
  }

  public getAllWS() {
    return this.wsList;
  }
}
