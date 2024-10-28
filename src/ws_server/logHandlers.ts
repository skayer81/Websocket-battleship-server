import {
  ClientRequestLogs,
  GameAttackLog,
  GamePlayersName,
  ResponseAttackLog,
  ServerActionLogs,
  ServerResponseErrorsLogs,
  ServerResponseLogs,
  TypesServerAction,
  TypesServerResponseError,
  UserData,
} from "./types/logHandlerTypes";
import {
  TypesClientRequest,
  TypesServerResponse,
} from "./types/typesOfRequestResponse";
import { UsersHandler } from "./usersHandler";

export class ConsoleLog {
  private userHandler = new UsersHandler();
  private clientRequestLogs: ClientRequestLogs = {
    [TypesClientRequest.reg]: (data: UserData) => this.clientRequestReg(data),
    [TypesClientRequest.create_room]: (data: UserData) =>
      this.clientRequestCreateRoom(data),
    [TypesClientRequest.add_ships]: (data: UserData) =>
      this.clientRequestAddShip(data),
    [TypesClientRequest.add_user_to_room]: (data: UserData) =>
      this.clientRequestAddUserToRoom(data),
    [TypesClientRequest.attack]: (data: GameAttackLog) =>
      this.clientRequestAttack(data),
    [TypesClientRequest.randomAttack]: (data: GameAttackLog) =>
      this.clientRequestRandomAttack(data),
    [TypesClientRequest.single_play]: (data: UserData) =>
      this.clientRequestSingleGame(data),
  };

  private serverResponseErrorsLogs: ServerResponseErrorsLogs = {
    [TypesServerResponseError.wrong_password]: (data: UserData) =>
      this.errorWrongPassword(data),
    [TypesServerResponseError.user_is_onlain]: (data: UserData) =>
      this.errorIsOnlain(data),
  };

  private serverResponseLogs: ServerResponseLogs = {
    [TypesServerResponse.reg]: (data: UserData) => this.serverResponseReg(data),
    [TypesServerResponse.update_room]: () => this.serverResponseUpdateRooms(),
    [TypesServerResponse.update_winners]: () =>
      this.serverResponseUpdateWinners(),
    [TypesServerResponse.create_game]: (data: UserData) =>
      this.serverResponseCreateGame(data),
    [TypesServerResponse.turn]: (data: UserData) =>
      this.serverResponseTurn(data),
    [TypesServerResponse.attack]: (data: ResponseAttackLog) =>
      this.serverResponseAttack(data),
    [TypesServerResponse.finish]: (data: UserData) =>
      this.serverResponseFinish(data),
  };

  private serverActionsLogs: ServerActionLogs = {
    [TypesServerAction.add_user]: (data: UserData) => this.serverAddUser(data),
    [TypesServerAction.user_in_base]: (data: UserData) =>
      this.serverUserInBase(data),
    [TypesServerAction.is_user_in_room]: (data: UserData) =>
      this.serverIsUserInRoom(data),
    [TypesServerAction.create_room]: (data: UserData) =>
      this.serverCreateRoom(data),
    [TypesServerAction.add_user_in_room]: (data: UserData) =>
      this.serverAddUserInRoom(data),
    [TypesServerAction.del_room]: (data: GamePlayersName) =>
      this.serverDelRoom(data),
    [TypesServerAction.not_current_player]: (data: GamePlayersName) =>
      this.serverNotCurrentPlayer(data),
    [TypesServerAction.reshot]: (data: GameAttackLog) =>
      this.serverReshot(data),
    [TypesServerAction.random_attack]: (data: GameAttackLog) =>
      this.serverRandomAttack(data),
    [TypesServerAction.killed]: () => this.serverKilled(),
    [TypesServerAction.user_disconnect]: (data: UserData) =>
      this.serverUserDisconnect(data),
  };

  public clientRequest(action: TypesClientRequest, data: {}): void {
    this.clientRequestLogs[action](data);
  }

  public serverErrorResponse(action: TypesServerResponseError, data: {}): void {
    this.serverResponseErrorsLogs[action](data);
  }

  public serverResponse(action: TypesServerResponse, data: {}): void {
    this.serverResponseLogs[action](data);
  }

  public serverAction(action: TypesServerAction, data: {}): void {
    this.serverActionsLogs[action](data);
  }

  private errorWrongPassword(data: UserData) {
    const { name, password } = data;
    this.outputServerError(
      `'${TypesServerResponse.reg}': incorrect password, user named '${name}' has a password not '${password}'`,
    );
  }

  private errorIsOnlain(data: UserData) {
    const { name } = data;
    this.outputServerError(
      `'${TypesServerResponse.reg}': user named '${name}' is already online`,
    );
  }

  private clientRequestReg(data: UserData) {
    const { name, password } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.reg}': a user with the name '${name}' and password '${password}' is trying to register`,
    );
  }

  private clientRequestCreateRoom(data: UserData) {
    const { name } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.create_room}': user '${name}' wants to create a room`,
    );
  }

  private clientRequestAddShip(data: UserData) {
    const { name } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.add_ships}': user '${name}' added ships to the field`,
    );
  }

  private clientRequestAddUserToRoom(data: UserData) {
    const { name } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.add_user_to_room}': user '${name}' tries to enter the room`,
    );
  }

  private clientRequestAttack(data: GameAttackLog) {
    const { attackPlayer, x, y } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.attack}': player '${attackPlayer}' attacks at the coordinates (${x}:${y})`,
    );
  }

  private clientRequestRandomAttack(data: GameAttackLog) {
    const { attackPlayer } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.randomAttack}': player '${attackPlayer}' makes a random attack`,
    );
  }

  private clientRequestSingleGame(data: UserData) {
    const { name } = data;
    this.outputClientReguest(
      `'${TypesClientRequest.single_play}': player ${name} starts a single player game with a bot`,
    );
  }

  private serverResponseReg(data: UserData) {
    const { name, password } = data;
    this.outputServerResponse(
      `'${TypesServerResponse.reg}': a user with the name '${name}' and password '${password}' is now online`,
    );
  }

  private serverResponseUpdateRooms() {
    this.outputServerResponse(
      `'${TypesServerResponse.update_room}': updating rooms for all users`,
    );
  }

  private serverResponseUpdateWinners() {
    this.outputServerResponse(
      `'${TypesServerResponse.update_winners}': updating winners for all users`,
    );
  }

  private serverResponseCreateGame(data: UserData) {
    const { name } = data;
    this.outputServerResponse(
      `'${TypesServerResponse.create_game}': a game was created for the user '${name}'`,
    );
  }

  private serverResponseTurn(data: UserData) {
    const { name } = data;
    const userName =
      name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerResponse(
      `'${TypesServerResponse.turn}': now it's player ${userName}'s turn`,
    );
  }

  private serverResponseAttack(data: ResponseAttackLog) {
    const { name, status, x, y } = data;
    const userName =
      name === "bot" ? name : this.userHandler.getPlayerName(name);

    this.outputServerResponse(
      `'${TypesServerResponse.attack}': player ${userName} fired at coordinates (${x}:${y}) with the result: ${status}`,
    );
  }

  private serverResponseFinish(data: UserData) {
    const { name } = data;
    const userName =
      name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerResponse(
      `'${TypesServerResponse.finish}': player ${userName} won`,
    );
  }

  private serverAddUser(data: UserData) {
    const { name, password } = data;
    this.outputServerActions(
      `add new user with the name '${name}' and password '${password}' to the database`,
    );
  }

  private serverUserInBase(data: UserData) {
    const { name } = data;
    this.outputServerActions(
      `a user named  '${name}' is already in the database`,
    );
  }

  private serverIsUserInRoom(data: UserData) {
    const { name } = data;
    this.outputServerActions(
      `it is impossible, since the user '${name}' is already in the room`,
    );
  }

  private serverCreateRoom(data: UserData) {
    const { name } = data;
    this.outputServerActions(`a room was created by the user  '${name}'`);
  }

  private serverAddUserInRoom(data: UserData) {
    const { name } = data;
    this.outputServerActions(`user '${name}' added to the room`);
  }

  private serverDelRoom(data: GamePlayersName) {
    const { player1, player2 } = data;
    if (!player2) {
      this.outputServerActions(
        `removing the room with the user '${player1}' if it exists`,
      );
      return;
    }
    this.outputServerActions(
      `removing the room with the users '${player1}' and '${player2}'`,
    );
  }

  private serverNotCurrentPlayer(data: GamePlayersName) {
    const { player1, player2 } = data;
    this.outputServerActions(
      `Now it's the player's turn: '${player1}', not '${player2}'`,
    );
  }

  private serverReshot(data: GameAttackLog) {
    const { targetPlayer, x, y } = data;
    this.outputServerActions(
      `player '${targetPlayer}' has already shot at the coordinates (${x}:${y})`,
    );
  }

  private serverRandomAttack(data: GameAttackLog) {
    const { targetPlayer, x, y } = data;
    this.outputServerActions(
      `server selected the coordinates for the attack of the player '${targetPlayer}': (${x}:${y})`,
    );
  }

  private serverKilled() {
    //  const {targetPlayer, x , y} = data;
    this.outputServerActions(
      `send state "miss" for all cells around killed ship`,
    );
  }

  private serverUserDisconnect(data: UserData) {
    const { name } = data;
    const userName =
      name === "bot" ? name : this.userHandler.getPlayerName(name);
    this.outputServerActions(
      `delete the room and the game with the player ${userName} if they exist, set the status to offline`,
    );
  }

  private outputClientReguest(message: string) {
    console.log(`\x1b[33m msg to Server: ${message}\x1b[0m`);
  }

  private outputServerResponse(message: string) {
    console.log(`\x1b[32m msg to Client: ${message}\x1b[0m`);
  }

  private outputServerError(message: string) {
    console.log(`\x1b[31m msg to Client: ${message}\x1b[0m`);
  }

  private outputServerActions(message: string) {
    console.log(`\x1b[34m ${message}\x1b[0m`);
  }
}
