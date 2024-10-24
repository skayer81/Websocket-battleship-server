import { v4 as uuidv4 } from "uuid";
import { WebSoketHandler } from "./webSoketHandler" //; = require("ws");
import { clientCreateGame, clientStartGame , clientAttack, clientTurn} from "./clientActionHandler";
import WebSocket from 'ws';
//import { User, PartialUser } from "src/types";

//import  


// interface PlayerInRoom {
//     name: string;
//     index: string;
// }

// interface Player extends PlayerInRoom{
//     password: string;
// }

// interface Room {
//     roomId: string;
//     roomUsers: PlayerInRoom[];
// }

// interface Winner {
//     id: string;
//     name: string;
//     wins: number;            
// }

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

interface Player{
    indexPlayer: string
    ships: Ship[] | [],
    ws: WebSocket
}

interface Game{
    
        gameId: string,
        players: [Player, Player]
        // player1: {
        //     indexPlayer: string
        //     ships?: Ship[],
        //     ws: WebSocket
        // } 
        // player2: {
        //     ships?: Ship[],
        //     indexPlayer: string,
        //     ws: WebSocket
        // }
        currentPlayer: string;
       // ships?: Ship[],

       // indexPlayer:  string, /* id of the player in the current game session */    
}

//const players: Player[] = [];
//const rooms: Room[] = [];

export class GamesHandler {


  //private static instance: DBHandler | null = null;

 // private players: Player[] = [];
 // private rooms: Room[] = [];
  //private winners : Winner[] = [];
  webSoketHandler = new WebSoketHandler()

  private games : Game[] = []

//   constructor() {
//     if (DBHandler.instance) {
//       // eslint-disable-next-line no-constructor-return
//       return DBHandler.instance;
//     }
//     DBHandler.instance = this;

//   } 

//   public isPlayerExist = async (name: string) => {
//     return this.players.find(player => player.name === name);
//   }

//   public addPlayer = async ( name: string, password: string): Promise<Player> => {
//     const newPlayer = {
//         name,
//         password,
//         index: uuidv4()
//     }
//     console.log("новый игрок в базе", newPlayer)
//     this.players.push(newPlayer);
//     return newPlayer
//   }

//   public getRooms = async () => {
//     const result =   this.rooms.map(room => ({
//         roomId: room.roomId,
//         roomUsers: room.roomUsers.map(player => ({
//             name: player.name,
//             index: player.index }))
//     }))
//     return this.rooms;
//    // return result;
//   }

//   public getWinners = async () => {
//     return this.winners
//   }

//   public addPlayerToRoom = async (playerIndex: string, roomId: string) => {
//     const room  = this.rooms.find((room) => room.roomId === roomId);
//     const player = this.players.find( player => player.index === playerIndex)
//     room?.roomUsers.push({
//         name: player?.name ?? '',
//         index: player?.index ?? ''

//     })

   /**
    * isRoomFull
    */

 // }
//   [
//     {
//         name: string,
//         wins: number,
//     }
// ],

// public isRoomFull  = async (roomId: string) => {
//     return this.rooms.find(room => room.roomId === roomId)?.roomUsers.length === 2
//   } 

//   public addRoom = async () => {
//     const newRoom : Room = {
//         roomId: uuidv4(),
//         roomUsers: [],
//     }
//     this.rooms.push(newRoom)
//   }

//   public getPlayersInRoom = async (roomId: string) => {
//     const room : Room=  this.rooms.find(room => room.roomId === roomId) as Room
//     return {player1: room.roomUsers[0].index, player2: room.roomUsers[1].index}
//   }

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

    public addGame = async (player1ID: string, player2ID: string) => {
        const game: Game = 
        {
            gameId : uuidv4(),
            players:[ {
                indexPlayer: player1ID,
                ws: this.webSoketHandler.getWSByPlayerID(player1ID),
                ships: []
            },  
        {
            indexPlayer: player2ID,
            ws: this.webSoketHandler.getWSByPlayerID(player2ID),
            ships: []
        }
        
        ],

            // },
            // player2:{
            //     indexPlayer: player2ID,
            //     ws: this.webSoketHandler.getWSByPlayerID(player2ID)
            // },
            currentPlayer: Math.random() > 0.5 ? player1ID : player2ID
        }
        this.games.push(game)
        
        game.players.forEach((player) => {
            clientCreateGame(player.ws , game.gameId, player.indexPlayer)
        })
       // const gameId = uuidv4();
        
     //   clientCreateGame(this.webSoketHandler.getWSByPlayerID(player1), gameId, player1  )
     //   clientCreateGame(this.webSoketHandler.getWSByPlayerID(player2), gameId, player2  )

       // this.games.push({gameId, indexPlayer: player1})
        //this.games.push({gameId, indexPlayer: player2})
      //  return gameId;
      }

      public addShipsToGame = async (gameId: string, indexPlayer: string, ships: Ship[]) => {
        const player = this.games
            .find(game => game.gameId === gameId)?.players
            ?.find(player => player.indexPlayer === indexPlayer) //as Player;
    
        if (!player) {
            throw new Error(`Player with index ${indexPlayer} not found in game ${gameId}`);
        }
    
        player.ships = ships.map(ship => {
            ship.shots = new Array(ship.length).fill(false);
            return ship; 
        });
    }

    public isAllPlayerReady = async(gameId: string) => {
        const players = this.games.find(game => game.gameId === gameId)?.players
        return players?.every(player => player.ships.length > 0)
    }    

    public startGame = async (gameId: string) => {

        const game = this.games.find(game => game.gameId === gameId);
        game?.players.forEach((player) => {
            
            clientStartGame(player.ws, player.ships, player.indexPlayer)
    
           // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
        })

        //const isGameReadyStart = await this.gamesHandler.isGameReadyStart(data.gameId)
        //if (!isGameReadyStart) return

        //this.gamesHandler.startGame()

        //const {shipsPlayer1, shipsPlayer2} =  await this.dbHandler.getShipsPlayersOfGame(data.gameId);

       // const ws1 = this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer)   
       // const ws2 = this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer)

        // if (!shipsPlayer1.ships || !shipsPlayer2.ships) throw new Error("нет кораблей")

        // clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer), shipsPlayer1.ships, shipsPlayer1.indexPlayer)
        // clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer), shipsPlayer2.ships, shipsPlayer1.indexPlayer)



    }

   private getShipsPlayer(game: Game){
     const result = game.players.find(player => player.indexPlayer !== game.currentPlayer)?.ships
     if (!result || result.length === 0) throw new Error()

return result    }



    public attackAction = async(gameId: string, indexPlayer: string, x:number , y:number) => {
        const game = this.games.find(game => game.gameId === gameId);

     //   const isUserTurn = this.test === data.indexPlayer;
        if ( !(game?.currentPlayer === indexPlayer )) return

        const attackResult =  await this.getAttackResult(this.getShipsPlayer(game) , x , y)

       // const {player1 , player2} = await this.dbHandler.getPlayersInGame(gameId);

       // const ws1 =  this.webSoketHandler.getWSByPlayerID(player1)   
       // const ws2 = this.webSoketHandler.getWSByPlayerID(player2)

   //    const game = this.games.find(game => game.gameId === gameId);
       game.players.forEach((player) => {
           
         //  clientStartGame(player.ws, player.ships, player.indexPlayer)
           clientAttack(player.ws, game.currentPlayer, attackResult.status, {x, y})
          // clientAttack(player.ws, indexPlayer, attackResult.status, {x:data.x, y:data.y})
   
          // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
       })



        // clientAttack(ws1, indexPlayer, attackResult.status, {x:data.x, y:data.y})
        // clientAttack(ws2, indexPlayer, attackResult.status, {x:data.x, y:data.y})
        if (attackResult.status === 'killed'){
            if (!attackResult.ship) throw new Error ("корабль пустой")
            this.missesAroundShip(game, attackResult.ship)  
        }

          if (attackResult.status === 'miss'){
            game.currentPlayer = (game.currentPlayer === game.players[0].indexPlayer)  ? game.players[1].indexPlayer :  game.players[0].indexPlayer; 
          }      



           clientTurn(game.players[0].ws,game.currentPlayer)
           clientTurn(game.players[1].ws,game.currentPlayer)
         //  clientTurn(ws2, this.test)

    }

    private missesAroundShip(game: Game, ship: Ship) {
        type PositionIndex = 'x' | 'y';
        const widthCoordinate: PositionIndex = ship.direction ? 'x' : 'y'; 
        const lengthCoordinate: PositionIndex = ship.direction ? 'y' : 'x';
        const position = { x: ship.position.x, y: ship.position.y };
    
        // Функция для отправки сообщения о промахе
        const sendMiss = () => {
           // position.x = x;
           // position.y = y;
            clientAttack(game.players[0].ws, game.currentPlayer, 'miss', position);
            clientAttack(game.players[1].ws, game.currentPlayer, 'miss', position);
        };
    
        // Обрабатываем промахи вокруг корабля
        for (let i = ship.position[lengthCoordinate] - 1; i <= ship.position[lengthCoordinate] + ship.length; i++) {
            position[lengthCoordinate] = i;  
           // position[widthСoordinate] = ship.position[widthСoordinate] - 1;
            position[widthCoordinate] = ship.position[widthCoordinate] - 1;
            sendMiss(); // Левый промах
            position[widthCoordinate] = ship.position[widthCoordinate] + 1;
            sendMiss(); // Правый промах
        }

             position[lengthCoordinate] = ship.position[lengthCoordinate] - 1; 
             position[widthCoordinate] = ship.position[widthCoordinate];
             sendMiss();
          //   clientAttack(ws1, indexPlayer, 'miss', position)
           //  clientAttack(ws2, indexPlayer, 'miss', position)
             position[lengthCoordinate] = ship.position[lengthCoordinate] + ship.length;  
             sendMiss();
      //       clientAttack(ws1, indexPlayer, 'miss', position)
        //     clientAttack(ws2, indexPlayer, 'miss', position)
    
        // Промахи над и под кораблем
    //    sendMiss(ship.position[widthCoordinate], ship.position[lengthCoordinate] - 1); // Промах над
     //   sendMiss(ship.position[widthCoordinate], ship.position[lengthCoordinate] + ship.length); // Промах под
    }
    

    //  private missesAroundShip(ship: Ship){
    //     type PositionIndex = 'x'|'y';
    //     let   widthСoordinate: PositionIndex = ship.direction ? 'x' : 'y'; 
    //     let   lengthCoordinate: PositionIndex =  ship.direction ? 'y' : 'x';
    //     const position = {
    //         x: ship.position.x, 
    //         y: ship.position.y,  
    //     };
    //     for (let i = ship.position[lengthCoordinate] - 1; 
    //          i <= ship.position[lengthCoordinate] + ship.length; i++){

    //      position[lengthCoordinate] = i;  
    //      position[widthСoordinate] = ship.position[widthСoordinate] - 1;

    //      clientAttack(ws1, indexPlayer, 'miss', position)
    //      clientAttack(ws2, indexPlayer, 'miss', position)

    //      position[widthСoordinate] = ship.position[widthСoordinate] + 1;

    //      clientAttack(ws1, indexPlayer, 'miss', position)
    //      clientAttack(ws2, indexPlayer, 'miss', position)

    //          }     
    //          position[lengthCoordinate] = ship.position[lengthCoordinate] - 1; 
    //          position[widthСoordinate] = ship.position[widthСoordinate];
    //          clientAttack(ws1, indexPlayer, 'miss', position)
    //          clientAttack(ws2, indexPlayer, 'miss', position)
    //          position[lengthCoordinate] = ship.position[lengthCoordinate] + ship.length;  
    //          clientAttack(ws1, indexPlayer, 'miss', position)
    //          clientAttack(ws2, indexPlayer, 'miss', position)
    //         }

    // }

    

//   public addShipsToGame = async (gameId: string, indexPlayer: string, ships : any) => {
//     const game = this.games.find(game => game.gameId === gameId) as Game
//     const player = game.players.find(player => player.indexPlayer === indexPlayer) as Player
//    // const player = this.games.reduce(() => {} ) find(game => game.gameId === gameId) as Game
//    player.ships = ships;
//     ships.forEach((ship: Ship) => {
//         ship.shots = new Array(ship.length).fill(false);
//     })
//   }

//   public isGameReadyStart = async (gameId: string) => {
//     console.log("this.games", this.games)
//     return this.games.filter(game => game.gameId === gameId && game.ships).length === 2
//   }

  public getShipsPlayersOfGame = async (gameId: string) => {
    const game = this.games.filter(game => game.gameId === gameId)
    return {shipsPlayer1: game[0], shipsPlayer2: game[1]}
  }

  public getAttackResult = async (ships: Ship[], x: number, y: number) => {
  //  const game = this.games.find(game => game.gameId === gameId && game.indexPlayer !== indexPlayer);
    
    // if (!game || !game.ships) {
    //     throw new Error("Не найдены кораблики");
    // }

    //const ships = game.ships;
    let result: { status: string; ship: Ship | null } = { status: 'miss', ship: null };

    for (const ship of ships) {
        const hit = this.checkHit(ship, x, y);
        if (hit) {
            ship.shots[hit.index] = true;
            result.status = 'shot';

            if (ship.shots.every(Boolean)) {
                result.status = 'killed';
                result.ship = ship;
            }

            break; // Выход из цикла, если попали в корабль
        }
    }

    return result;
}

private checkHit(ship: Ship, x: number, y: number) {
    if (!ship.direction) { // Горизонтальный корабль
        if (x >= ship.position.x && x < (ship.position.x + ship.length) && y === ship.position.y) {
            return { index: x - ship.position.x };
        }
    } else { // Вертикальный корабль
        if (y >= ship.position.y && y < (ship.position.y + ship.length) && x === ship.position.x) {
            return { index: y - ship.position.y };
        }
    }
    return null; // Не попали
}


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


//   }
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
