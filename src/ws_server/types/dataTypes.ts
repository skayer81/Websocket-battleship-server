export interface PlayerInRoom {
    name: string;
    index: string;
}

export interface Player extends PlayerInRoom{
    password: string;
}

export interface Room {
    roomId: string;
    roomUsers: PlayerInRoom[];
}

export interface Winner {
    id: string;
    name: string;
    wins: number;            
}

export interface Ship {

            position: {
                x: number,
                y: number,
            },
            direction: boolean,
            length: number,
            type: "small"|"medium"|"large"|"huge",
            shots: boolean[];
}

export interface Game{
    
        gameId: string,
        ships?: Ship[],

        indexPlayer:  string, /* id of the player in the current game session */    
}