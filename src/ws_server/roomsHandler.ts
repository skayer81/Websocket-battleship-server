import { UsersHandler } from "./usersHandler";
// import { User, PartialUser } from "src/types";

// import

interface PlayerInRoom {
  name: string;
  index: string;
}

interface Room {
  roomId: string;
  roomUsers: PlayerInRoom[];
}

// interface Winner {
//   id: string;
//   name: string;
//   wins: number;
// }

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

export class RoomsHandler {
  private static instance: RoomsHandler | null = null;

  private usersHandler = new UsersHandler();

  // private players: Player[] = [];
  private rooms: Room[] = [];
  // private winners: Winner[] = [];
  // rivate games : Game[] = []

  constructor() {
    if (RoomsHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return RoomsHandler.instance;
    }
    RoomsHandler.instance = this;
  }

  // public isPlayerExist =   (name: string) => {
  //   return this.players.find((player) => player.name === name);
  // };

  // public addPlayer =   (
  //   name: string,
  //   password: string,
  // ): Promise<Player> => {
  //   const newPlayer = {
  //     name,
  //     password,
  //     index: uuidv4(),
  //   };
  //   console.log("новый игрок в базе", newPlayer);
  //   this.players.push(newPlayer);
  //   return newPlayer;
  // };

  public getRooms =  () : Room[] => {
    const result = this.rooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((player) => ({
        name: player.name,
        index: player.index,
      })),
    }));
    return this.rooms;
    // return result;
  };

  // public getWinners =   () => {
  //   return this.winners;
  // };

  // public addWinner =   (winnerID: string) => {
  //   let winner: Winner | undefined = this.winners.find(
  //     (user) => user.id === winnerID,
  //   );
  //   if (winner) {
  //     winner.wins += 1;
  //     return;
  //   }
  //   winner = {
  //     id: winnerID,
  //     name: this.players.find((user) => user.index === winnerID)?.name ?? "",
  //     wins: 1,
  //   };
  //   this.winners.push(winner);
  // };

  public addPlayerToRoom =   (playerIndex: string, roomId: string) : void=> {
    const room = this.rooms.find((room) => room.roomId === roomId);
    const playerName =   this.usersHandler.getPlayerName(playerIndex); // = this.players.find((player) => player.index === playerIndex);
    room?.roomUsers.push({
      name: playerName,
      index: playerIndex,
    });

    /**
     * isRoomFull
     */
  };
  //   [
  //     {
  //         name: string,
  //         wins: number,
  //     }
  // ],

  public isRoomFull =  (roomId: string) : boolean=>
    this.rooms.find((room) => room.roomId === roomId)?.roomUsers.length === 2;

  public addRoom =  () : string => {
    const newRoom: Room = {
      roomId: crypto.randomUUID(),
      roomUsers: [],
    };
    this.rooms.push(newRoom);
    return newRoom.roomId;
  };

  public getPlayersInRoom =  (roomId: string) : {player1: string, player2: string} => {
    const room: Room = this.rooms.find(
      (room) => room.roomId === roomId,
    ) as Room;
    return {
      player1: room.roomUsers[0].index,
      player2: room.roomUsers[1].index,
    };
  };

  public isPlayerInRoom  = (playerID: string): boolean =>
    // return Boolean(this.rooms.find(room => room.roomUsers.find(user => user.index === playerID)))
    this.rooms.some((room) =>
      room.roomUsers.some((user) => user.index === playerID),
    );

  public delRoom =  (roomId: string): void => {
    this.rooms = this.rooms.filter((room) => room.roomId !== roomId);
  };

  public playerOffline = (playerID: string): void => {
    this.rooms = this.rooms.filter((room) => room.roomUsers[0].index  !== playerID);
  }
}
