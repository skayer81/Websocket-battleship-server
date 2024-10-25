import { v4 as uuidv4 } from "uuid";
//import { User, PartialUser } from "src/types";

//import  


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

interface Ship {

            position: {
                x: number,
                y: number,
            },
            direction: boolean,
            length: number,
            type: "small"|"medium"|"large"|"huge",
            shots: boolean[];
}

interface Game{
    
        gameId: string,
        ships?: Ship[],

        indexPlayer:  string, /* id of the player in the current game session */    
}

//const players: Player[] = [];
//const rooms: Room[] = [];

export class DBHandler {


  private static instance: DBHandler | null = null;

  private players: Player[] = [];
  private rooms: Room[] = [];
  private winners : Winner[] = [];
  //rivate games : Game[] = []

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

  public addWinner = async (winnerID: string) => {
    let winner : Winner|undefined = this.winners.find(user => user.id === winnerID)
    if (winner) {
        winner.wins += 1;
        return
    }
    winner = 
     {
        id: winnerID,
        name: this.players.find(user => user.index === winnerID)?.name ?? '' , 
        wins: 1
    }
    this.winners.push(winner)


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

//   public getPlayersInGame = async (gameId: string) => {
//     const game =  this.games.filter(game => game.gameId  === gameId)// as Game[]
//     return {player1: game[0].indexPlayer, player2: game[1].indexPlayer}
//   }

  
//   public addGame = async (player1: string, player2: string) => {
//     const gameId = uuidv4();
//     this.games.push({gameId, indexPlayer: player1})
//     this.games.push({gameId, indexPlayer: player2})
//     return gameId;
//   }

//   public addShipsToGame = async (gameId: string, indexPlayer: string, ships : any) => {
//     const game = this.games.find(game => game.gameId === gameId && game.indexPlayer === indexPlayer) as Game
//     game.ships = ships;
//     ships.forEach((ship: Ship) => {
//         ship.shots = new Array(ship.length).fill(false);
//     })
//   }

//   public isGameReadyStart = async (gameId: string) => {
//     console.log("this.games", this.games)
//     return this.games.filter(game => game.gameId === gameId && game.ships).length === 2
//   }

//   public getShipsPlayersOfGame = async (gameId: string) => {
//     const game = this.games.filter(game => game.gameId === gameId)
//     return {shipsPlayer1: game[0], shipsPlayer2: game[1]}
//   }

//   public getAttackResult = async (gameId: string, indexPlayer: string, x: number , y: number) => {
//     const game = this.games.find(game => game.gameId === gameId && game.indexPlayer !== indexPlayer);
//     const ships = game?.ships;
//     console.log(ships);
//     console.log(x, y)
//     if (!ships) throw new Error("не найдены кораблики")
//     let result: {status: string, ship: Ship | null } = {status: 'miss',
//             ship: null
//     };

//     for (let ship of ships) {
//         if (!ship.direction){
//             if ((x >= ship.position.x) && (x < (ship.position.x + ship.length)) && y === ship.position.y) {
//                 console.log("не дирекшее", ship);
//                 ship.shots[x - ship.position.x] = true;
//                 result.status = 'shot';
//                 if (ship.shots.every((item)=> item)) {result.status = 'killed'
//                     result.ship = ship
//                 }

//                 // return true; // Попадание
//              }
//         }
//         else {

//             if ((y >= ship.position.y) && (y < (ship.position.y + ship.length)) && x === ship.position.x) {
//                 console.log("дирекшее", ship)
//                 ship.shots[y - ship.position.y] = true;
//                 result.status = 'shot';
//                 if (ship.shots.every((item)=> item)) {result.status = 'killed'
//                     result.ship = ship
//                 }

//                //  return true; // Попадание
//              }
//         }

//     }
//     return result; 


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
 //}
