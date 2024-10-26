// import { User, PartialUser } from "src/types";

// import

// interface PlayerInRoom {
//   name: string;
//   index: string;
// }

interface Player {
  name: string;
  index: string;
  password: string;
  wins: number;
  isOnline: boolean;
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

  private players: Player[] = [    { name: "Alice", index: "1", password: "pass1", wins: 5, isOnline: true },
    { name: "Bob", index: "2", password: "pass2", wins: 3, isOnline: false },
    { name: "Charlie", index: "3", password: "pass3", wins: 5, isOnline: false },
    { name: "David", index: "4", password: "pass4", wins: 3, isOnline: true },
    { name: "Eve", index: "5", password: "pass5", wins: 5, isOnline: true }];
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
      name: "test1",
      index: "string",
      password: "11111",
      wins: 4,
      isOnline: true,
    });
    this.players.push({
      name: "test2",
      index: "string",
      password: "11111",
      wins: 3,
      isOnline: false,
    });
    this.players.push({
      name: "test3",
      index: "string",
      password: "11111",
      wins: 2,
      isOnline: false,
    });
  }

  private getPlayerByName =  (name: string): Player => {
    const player = this.players.find((player) => player.name === name);
    if (!player) {
      throw new Error(`player whit name ${name} is not exist`);
    }
    return player;
  };

  private getPlayerByID =  (playerID: string): Player => {
    const player = this.players.find((player) => player.index === playerID);
    if (!player) {
      throw new Error(`player whit ID ${playerID} is not exist`);
    }
    return player;
  };

  //   private findPlayerByName =  (name: string) => {
  //     const player =  this.players.find((player) => player.name === name);
  //     if (!player) throw new Error(`player whit name ${name} is not exist`)
  //   }

  public isPlayerExist =  (name: string): boolean => {
    const player = this.players.find((player) => player.name === name);
    return Boolean(player);
  };

  public isPasswordCorrect =  (
    name: string,
    password: string,
  ): boolean => {
    const player = this.getPlayerByName(name);
    return player.password === password;
  };

  public isUserOnlain =  (name: string): boolean => {
    const player =  this.getPlayerByName(name);
    return player.isOnline;
  };

  public getPlayerID =  (name: string): string =>
    ( this.getPlayerByName(name)).index;

  public getPlayerName =  (playerID: string): string =>
    ( this.getPlayerByID(playerID)).name;

  public addPlayer = (name: string, password: string): void => {
    const newPlayer = {
      name,
      password,
      index: crypto.randomUUID(),
      wins: 0,
      isOnline: false,
    };
    console.log("новый игрок в базе", newPlayer);
    this.players.push(newPlayer);
    // return newPlayer;
  };

  public setOnlineStatus = (playerID: string, status: boolean) : void => {
   this.getPlayerByID(playerID).isOnline = status;
  };

  //   public getRooms =   () => {
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


  private sortPlayers(players: Player[]): Player[] {
    return players.sort((a, b) => {
        if (b.wins !== a.wins) {
            return b.wins - a.wins; 
        }
        if (a.isOnline !== b.isOnline) {
            return a.isOnline ? -1 : 1; 
        }
        return a.name.localeCompare(b.name);
    });
}


  public getWinners =  () : Winner[] => {
    const winners: Winner[] = this.sortPlayers(this.players).map((player) => ({
      id: player.index,
      name: `${player.name} ${player.isOnline ? "(online)" : ""}`, // this.players.find((user) => user.index === winnerID)?.name ?? "",
      wins: player.wins,
    }));
    return winners.sort((a, b) => Number(a.wins > b.wins));
  };

  public addWinner =  (winnerID: string) : void=> {
    let user = this.getPlayerByID(winnerID)
    user.wins += 1;
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

  //   public addPlayerToRoom =   (playerIndex: string, roomId: string) => {
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

  //   public isRoomFull =   (roomId: string) => {
  //     return (
  //       this.rooms.find((room) => room.roomId === roomId)?.roomUsers.length === 2
  //     );
  //   };

  //   public addRoom =   () => {
  //     const newRoom: Room = {
  //       roomId: uuidv4(),
  //       roomUsers: [],
  //     };
  //     this.rooms.push(newRoom);
  //   };

  //   public getPlayersInRoom =   (roomId: string) => {
  //     const room: Room = this.rooms.find(
  //       (room) => room.roomId === roomId,
  //     ) as Room;
  //     return {
  //       player1: room.roomUsers[0].index,
  //       player2: room.roomUsers[1].index,
  //     };
  //   };
}
