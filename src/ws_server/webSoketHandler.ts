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

  public addWebSoket(ws: WebSocket, playerID: string) {
    const wsListItem = {
      ws,
      playerID,
    };
    this.wsList.push(wsListItem);
  }

  public delWebSoket() {}

  public getWSByPlayerID(playerID: string) {
    const ws = this.wsList.find((ws) => ws.playerID === playerID);
    if (!ws) throw new Error();
    return ws.ws;
  }

  public getPlayerIDByWS(ws: WebSocket) {
    this.wsList.forEach((item) => {
      console.log("ид в базе сокетов", item.playerID);
    });
    const id = this.wsList.find((item) => item.ws === ws);
    return id;
  }

  public getAllWS() {
    return this.wsList;
  }
}
