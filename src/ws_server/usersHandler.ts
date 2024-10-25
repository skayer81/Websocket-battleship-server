import { v4 as uuidv4 } from "uuid";
//import { User, PartialUser } from "src/types";

//import

// interface PlayerInRoom {
//   name: string;
//   index: string;
// }

interface Player {
  name: string;
  index: string;
  password: string;
  wins: number;
  isOnline: boolean
}

// interface Room {
//   roomId: string;
//   roomUsers: PlayerInRoom[];
// }

interface Winner {
  id: string;
  name: string;
  wins: number;
}

// interface Ship {
//   position: {
//     x: number;
//     y: number;
//   };
//   direction: boolean;
//   length: number;
//   type: "small" | "medium" | "large" | "huge";
//   shots: boolean[];
// }

// interface Game {
//   gameId: string;
//   ships?: Ship[];

//   indexPlayer: string /* id of the player in the current game session */;
// }

// const players: Player[] = [];
// const rooms: Room[] = [];

export class UsersHandler {
  private static instance: UsersHandler | null = null;

  private players: Player[] = [];
//   private rooms: Room[] = [];
//   private winners: Winner[] = [];
  // rivate games : Game[] = []

  constructor() {
    if (UsersHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return UsersHandler.instance;
    }
    UsersHandler.instance = this;
    this.players.push({
        name: 'test1',
        index: 'string',
        password: '11111',
        wins: 4,
        isOnline: true
    })
    this.players.push({
        name: 'test2',
        index: 'string',
        password: '11111',
        wins: 3,
        isOnline: false
    })
    this.players.push({
        name: 'test3',
        index: 'string',
        password: '11111',
        wins: 2,
        isOnline: false
    })
  }

  private getPlayerByName = async(name: string) : Promise<Player> => {
    const player =  this.players.find((player) => player.name === name);
    if (!player) throw new Error(`player whit name ${name} is not exist`)
    return player
  }

  private getPlayerByID = async(playerID: string) : Promise<Player> => {
    const player =  this.players.find((player) => player.index === playerID);
    if (!player) throw new Error(`player whit ID ${playerID} is not exist`)
    return player
  }

//   private findPlayerByName = async(name: string) => {
//     const player =  this.players.find((player) => player.name === name);
//     if (!player) throw new Error(`player whit name ${name} is not exist`)
//   }

  public isPlayerExist = async (name: string) : Promise<boolean> => {
    const player =  this.players.find((player) => player.name === name);
    return Boolean(player);
  };

  public isPasswordCorrect = async (name: string, password: string): Promise<boolean> => {
    const player = await this.getPlayerByName(name);
    return player.password === password
  }

  public isUserOnlain = async (name: string): Promise<boolean> => {
    const player = await this.getPlayerByName(name);
    return player.isOnline;
  }

  public getPlayerID = async (name: string): Promise<string> => {
    return (await this.getPlayerByName(name)).index;
  }

  public getPlayerName = async (playerID: string): Promise<string> => {
    return (await this.getPlayerByID(playerID)).name;
  }



  public addPlayer = async (
    name: string,
    password: string,
  ): Promise<void>=> {
    const newPlayer = {
      name,
      password,
      index: uuidv4(),
      wins: 0,
      isOnline: false
    };
    console.log("новый игрок в базе", newPlayer);
    this.players.push(newPlayer);
   // return newPlayer;
  };

  public setOnlineStatus = async ( playerID: string, status: boolean) => {
     (await this.getPlayerByID(playerID)).isOnline = status
  }

//   public getRooms = async () => {
//     const result = this.rooms.map((room) => ({
//       roomId: room.roomId,
//       roomUsers: room.roomUsers.map((player) => ({
//         name: player.name,
//         index: player.index,
//       })),
//     }));
//     return this.rooms;
//     // return result;
//   };

  public getWinners = async () => {
    const winners : Winner[]=  this.players.map((player) => {
        return {
            id: player.index,
            name: `${player.name} ${player.isOnline? '(online)' : ''})`, // this.players.find((user) => user.index === winnerID)?.name ?? "",
            wins: player.wins,
        }
    });
    return winners.sort((a, b) => Number(a.wins > b.wins))
  };

  public addWinner = async (winnerID: string) => {
    // let winner: Winner | undefined = this.winners.find(
    //   (user) => user.id === winnerID,
    // );
    // if (winner) {
    //   winner.wins += 1;
    //   return;
    // }
    // winner = {
    //   id: winnerID,
    //   name: this.players.find((user) => user.index === winnerID)?.name ?? "",
    //   wins: 1,
    // };
    // this.winners.push(winner);
  };

//   public addPlayerToRoom = async (playerIndex: string, roomId: string) => {
//     const room = this.rooms.find((room) => room.roomId === roomId);
//     const player = this.players.find((player) => player.index === playerIndex);
//     room?.roomUsers.push({
//       name: player?.name ?? "",
//       index: player?.index ?? "",
//     });

//     /**
//      * isRoomFull
//      */
//   };
  //   [
  //     {
  //         name: string,
  //         wins: number,
  //     }
  // ],

//   public isRoomFull = async (roomId: string) => {
//     return (
//       this.rooms.find((room) => room.roomId === roomId)?.roomUsers.length === 2
//     );
//   };

//   public addRoom = async () => {
//     const newRoom: Room = {
//       roomId: uuidv4(),
//       roomUsers: [],
//     };
//     this.rooms.push(newRoom);
//   };

//   public getPlayersInRoom = async (roomId: string) => {
//     const room: Room = this.rooms.find(
//       (room) => room.roomId === roomId,
//     ) as Room;
//     return {
//       player1: room.roomUsers[0].index,
//       player2: room.roomUsers[1].index,
//     };
//   };

}