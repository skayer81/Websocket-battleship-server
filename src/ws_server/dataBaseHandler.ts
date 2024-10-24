import { v4 as uuidv4 } from "uuid";
//import { User, PartialUser } from "src/types";



interface PlayerInRoom {
    name: string;
    index: string;
}

interface Player extends PlayerInRoom{
    password: string;
}

interface Room {
    roomId: string;
    roomUsers: PlayerInRoom[];
}

interface Winner {
    id: string;
    name: string;
    wins: number;            
}

interface Game{
    
        gameId: string,
        ships?:
            [
                {
                    position: {
                        x: number,
                        y: number,
                    },
                    direction: boolean,
                    length: number,
                    type: "small"|"medium"|"large"|"huge",
                }
            ],
        indexPlayer:  string, /* id of the player in the current game session */    
}

//const players: Player[] = [];
//const rooms: Room[] = [];

export class DBHandler {


  private static instance: DBHandler | null = null;

  private players: Player[] = [];
  private rooms: Room[] = [];
  private winners : Winner[] = [];
  private games : Game[] = []

  constructor() {
    if (DBHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return DBHandler.instance;
    }
    DBHandler.instance = this;

  } 

  public isPlayerExist = async (name: string) => {
    return this.players.find(player => player.name === name);
  }

  public addPlayer = async ( name: string, password: string): Promise<Player> => {
    const newPlayer = {
        name,
        password,
        index: uuidv4()
    }
    console.log("новый игрок в базе", newPlayer)
    this.players.push(newPlayer);
    return newPlayer
  }

  public getRooms = async () => {
    const result =   this.rooms.map(room => ({
        roomId: room.roomId,
        roomUsers: room.roomUsers.map(player => ({
            name: player.name,
            index: player.index }))
    }))
    return this.rooms;
   // return result;
  }

  public getWinners = async () => {
    return this.winners
  }

  public addPlayerToRoom = async (playerIndex: string, roomId: string) => {
    const room  = this.rooms.find((room) => room.roomId === roomId);
    const player = this.players.find( player => player.index === playerIndex)
    room?.roomUsers.push({
        name: player?.name ?? '',
        index: player?.index ?? ''

    })

   /**
    * isRoomFull
    */

  }
//   [
//     {
//         name: string,
//         wins: number,
//     }
// ],

public isRoomFull  = async (roomId: string) => {
    return this.rooms.find(room => room.roomId === roomId)?.roomUsers.length === 2
  } 

  public addRoom = async () => {
    const newRoom : Room = {
        roomId: uuidv4(),
        roomUsers: [],
    }
    this.rooms.push(newRoom)
  }

  public getPlayersInRoom = async (roomId: string) => {
    const room : Room=  this.rooms.find(room => room.roomId === roomId) as Room
    return {player1: room.roomUsers[0].index, player2: room.roomUsers[1].index}
  }

  public addGame = async (player1: string, player2: string) => {
    const gameId = uuidv4();
    this.games.push({gameId, indexPlayer: player1})
    this.games.push({gameId, indexPlayer: player2})
    return gameId;
  }

  public addShipsToGame = async (gameId: string, indexPlayer: string, ships : any) => {
    const game = this.games.find(game => game.gameId === gameId && game.indexPlayer === indexPlayer) as Game
    game.ships = ships
  }

  public isGameReadyStart = async (gameId: string) => {
    return this.games.filter(game => game.gameId === gameId).length === 2
  }

  public getShipsPlayersOfGame = async (gameId: string) => {
    const game = this.games.filter(game => game.gameId === gameId)
    return {shipsPlayer1: game[0], shipsPlayer2: game[1]}
  }
  // const roomId = `${rooms.length + 1}`;
  // const newRoom: Room = { id: roomId, players: [] };
  // rooms.push(newRoom);



//   public addUser = (user: User): User => {
//     const addingUser = user;
//     addingUser.id = uuidv4();
//     this.users.push(user);
//     return user;
//   };

//   public getUserByID = (userId: string): User | undefined =>
//     this.users.find((user) => user.id === userId);

//   public findUserByID = (userId: string): number =>
//     this.users.findIndex((user) => user.id === userId);

//   public getAllUsers = (): User[] => this.users;

//   public delUserByID = (userId: string): void => {
//     const index = this.findUserByID(userId);
//     if (index !== -1) {
//       this.users.splice(index, 1);
//     }
//   };

//   public uppdateUser = (userID: string, userData: PartialUser): User => {
//     const userIndex = this.findUserByID(userID)
//     const { username, age, hobbies } = userData;
//     const updatedUser = {
//       ...this.users[userIndex],
//       username:
//         username !== undefined ? username : this.users[userIndex].username,
//       age: age !== undefined ? age : this.users[userIndex].age,
//       hobbies: hobbies !== undefined ? hobbies : this.users[userIndex].hobbies,
//     };
//     this.users[userIndex] = updatedUser;
//     return updatedUser;
//   };
 }
