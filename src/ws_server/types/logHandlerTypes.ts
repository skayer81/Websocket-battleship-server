import { TypesClientRequest, TypesServerResponse } from "./typesOfRequestResponse";

export enum TypesServerResponseError {
    wrong_password = "wrong_password",
    user_is_onlain = "user_is_onlain",
  }

  export enum TypesServerAction {
    user_in_base = "user_in_base",
    add_user = "add_user",
    is_user_in_room = "is_user_in_room",
    create_room = "create_room",
    add_user_in_room = "add_user_in_room",
    del_room = "del_room",
    not_current_player = "not_current_player",
    reshot = "reshot",
    random_attack = "random_attack",
    killed = 'killed',
    new_connection = 'new_connection',
    user_disconnect = "user_disconnect",

  }

export  type UserData = {
    name: string, password?: string
}

export type GamePlayersName = {
    player1: string,
    player2: string
}
export type GameAttackLog = 
{attackPlayer: string,
    targetPlayer: string,
    x: number,
    y: number
  }

export type ResponseAttackLog =  {name: string, status: string, x :string, y: string}  

export type ClientRequestLogs = {
    [key in TypesClientRequest]?: any;
};

export type ServerResponseLogs = {
    [key in TypesServerResponse]?: any; 
};

export type ServerResponseErrorsLogs = {
    [key in TypesServerResponseError]?: any; 
};
  
export type ServerActionLogs = {
    [key in TypesServerAction]?: any; 
};
  