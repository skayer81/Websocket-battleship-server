import WebSocket from "ws";

type WSListItem = {
  ws: WebSocket;
  playerID?: string;
};

export class WebSoketHandler {
  private wsList: WSListItem[] = [];

  private static instance: WebSoketHandler | null = null;

  constructor() {
    if (WebSoketHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return WebSoketHandler.instance;
    }
    WebSoketHandler.instance = this;
  }

  public addWebSoket(ws: WebSocket, playerID = "") : void {
    const wsListItem = {
      ws,
      playerID,
    };
    this.wsList.push(wsListItem);
  }

  public delWebSoket(ws: WebSocket) : void {
    this.wsList = this.wsList.filter((element) => element.ws !== ws);
  }

  //   function removeElement(arr, value) {
  //     return arr.filter(element => element !== value);
  // }

  // // Пример использования
  // const originalArray = [1, 2, 3, 4, 5];
  // const newArray = removeElement(originalArray, 3);
  // console.log(newArray); // Вывод: [1, 2, 4, 5]

  public getWSByPlayerID(playerID: string) : WebSocket {
    const ws = this.wsList.find((item) => item.playerID === playerID);
    if (!ws) {
      throw new Error();
    }
    return ws.ws;
  }

  public getPlayerIDByWS(ws: WebSocket) : string {
    // this.wsList.forEach((item) => {
    //   // console.log("ид в базе сокетов", item.playerID);
    // });
    const playerID = this.wsList.find((item) => item.ws === ws)?.playerID;
    if (!playerID) {
      throw new Error('playerID in WebSoketHandler is not found');
    }
    return playerID;
  }

  public isPlayerInWS(ws: WebSocket) : boolean {
    // this.wsList.forEach((item) => {
    //   // console.log("ид в базе сокетов", item.playerID);
    // });
    const playerID = this.wsList.find((item) => item.ws === ws)?.playerID;
    if (!playerID) {
      return false
    }
    return true;
  }

  public getAllWS() : WSListItem[] {
    return this.wsList;
  }
}
