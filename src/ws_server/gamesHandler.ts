import { WebSoketHandler } from "./webSoketHandler"; // ; = require("ws");
import {
  clientCreateGame,
  clientStartGame,
  clientAttack,
  clientTurn,
  clientFinish,
  clientUpdateWinners,
} from "./clientActionHandler";

import { RoomsHandler } from "./roomsHandler";
import { Ship, Player, Game, AttackResult } from "./types/gameTypes";
import { UsersHandler } from "./usersHandler";

// const players: Player[] = [];
// const rooms: Room[] = [];

export class GamesHandler {
  // private static instance: DBHandler | null = null;

  // private players: Player[] = [];
  // private rooms: Room[] = [];
  // private winners : Winner[] = [];
  protected webSoketHandler = new WebSoketHandler();

 // private roomsHandler = new RoomsHandler();

  protected usersHandler = new UsersHandler()

  private games: Game[] = [];

  //   constructor() {
  //     if (DBHandler.instance) {
  //       // eslint-disable-next-line no-constructor-return
  //       return DBHandler.instance;
  //     }
  //     DBHandler.instance = this;

  //   }

  //   public isPlayerExist =   (name: string) => {
  //     return this.players.find(player => player.name === name);
  //   }

  //   public addPlayer =   ( name: string, password: string): Promise<Player> => {
  //     const newPlayer = {
  //         name,
  //         password,
  //         index: uuidv4()
  //     }
  //     console.log("новый игрок в базе", newPlayer)
  //     this.players.push(newPlayer);
  //     return newPlayer
  //   }

  //   public getRooms =   () => {
  //     const result =   this.rooms.map(room => ({
  //         roomId: room.roomId,
  //         roomUsers: room.roomUsers.map(player => ({
  //             name: player.name,
  //             index: player.index }))
  //     }))
  //     return this.rooms;
  //    // return result;
  //   }

  //   public getWinners =   () => {
  //     return this.winners
  //   }

  //   public addPlayerToRoom =   (playerIndex: string, roomId: string) => {
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

  // public isRoomFull  =   (roomId: string) => {
  //     return this.rooms.find(room => room.roomId === roomId)?.roomUsers.length === 2
  //   }

  //   public addRoom =   () => {
  //     const newRoom : Room = {
  //         roomId: uuidv4(),
  //         roomUsers: [],
  //     }
  //     this.rooms.push(newRoom)
  //   }

  //   public getPlayersInRoom =   (roomId: string) => {
  //     const room : Room=  this.rooms.find(room => room.roomId === roomId) as Room
  //     return {player1: room.roomUsers[0].index, player2: room.roomUsers[1].index}
  //   }

  //   public getPlayersInGame =   (gameId: string) => {
  //     const game =  this.games.filter(game => game.gameId  === gameId)// as Game[]
  //     return {player1: game[0].indexPlayer, player2: game[1].indexPlayer}
  //   }

  //   public addGame =   (player1: string, player2: string) => {
  //     const gameId = uuidv4();
  //     this.games.push({gameId, indexPlayer: player1})
  //     this.games.push({gameId, indexPlayer: player2})
  //     return gameId;
  //   }

  private createPlayer(playerID: string) :Player {
    return {
      indexPlayer: playerID,
      ws: this.webSoketHandler.getWSByPlayerID(playerID),
      ships: [],
      shots: new Set<string>(),
    };
  }

  public addGame =  (player1ID: string, player2ID: string) : void=> {
    const player1 = this.createPlayer(player1ID);
    const player2 = this.createPlayer(player2ID);
    const currentPlayer = Math.random() > 0.5 ? player1 : player2;
    const game: Game = {
      gameId: crypto.randomUUID(),
      players: [player1, player2],
      currentPlayer,
      //         {
      //         indexPlayer: player1ID,
      //         ws: this.webSoketHandler.getWSByPlayerID(player1ID),
      //         ships: [],
      //         shoots: new Set()
      //     },
      // {
      //     indexPlayer: player2ID,
      //     ws: this.webSoketHandler.getWSByPlayerID(player2ID),
      //     ships: [],
      //     shoots: new Set()
      // }

      // ],

      // },
      // player2:{
      //     indexPlayer: player2ID,
      //     ws: this.webSoketHandler.getWSByPlayerID(player2ID)
      // },
      // currentPlayer: Math.random() > 0.5 ?  : player2ID
    };
    this.games.push(game);

    game.players.forEach((player) => {
      clientCreateGame(player.ws, game.gameId, player.indexPlayer);
    });
    // const gameId = uuidv4();

    //   clientCreateGame(this.webSoketHandler.getWSByPlayerID(player1), gameId, player1  )
    //   clientCreateGame(this.webSoketHandler.getWSByPlayerID(player2), gameId, player2  )

    // this.games.push({gameId, indexPlayer: player1})
    // this.games.push({gameId, indexPlayer: player2})
    //  return gameId;
  };

  public addShipsToGame =   (
    gameId: string,
    indexPlayer: string,
    ships: Ship[],
  ) : void => {
    const player = this.games
      .find((game) => game.gameId === gameId)
      ?.players?.find((player) => player.indexPlayer === indexPlayer); // as Player;

    if (!player) {
      throw new Error(
        `Player with index ${indexPlayer} not found in game ${gameId} gameHandler:185`,
      );
    }

    player.ships = ships.map((ship) => {
      ship.shots = new Array(ship.length).fill(false);
      return ship;
    });
  };

  public isAllPlayerReady =   (gameId: string) : boolean => {
    const players = this.games.find((game) => game.gameId === gameId)?.players;
    if (!players) throw new Error()
    return players.every((player) => player.ships.length > 0);
  };

  public startGame =   (gameId: string) => {
    const game = this.games.find((game) => game.gameId === gameId);
    game?.players.forEach((player) => {
      clientStartGame(player.ws, player.ships, player.indexPlayer);
      clientTurn(player.ws, game.currentPlayer.indexPlayer);
      // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
    });
    //  clientTurn(game?.players[0].ws, game.currentPlayer.indexPlayer);
    // clientTurn(game.players[1].ws, game.currentPlayer.indexPlayer);

    // const isGameReadyStart =   this.gamesHandler.isGameReadyStart(data.gameId)
    // if (!isGameReadyStart) return

    // this.gamesHandler.startGame()

    // const {shipsPlayer1, shipsPlayer2} =    this.dbHandler.getShipsPlayersOfGame(data.gameId);

    // const ws1 = this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer)
    // const ws2 = this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer)

    // if (!shipsPlayer1.ships || !shipsPlayer2.ships) throw new Error("нет кораблей")

    // clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer), shipsPlayer1.ships, shipsPlayer1.indexPlayer)
    // clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer), shipsPlayer2.ships, shipsPlayer1.indexPlayer)
  };

  private getShipsOtherPlayer(game: Game) : Ship[] {
    // const result = game.players.find(player => player.indexPlayer !== game.currentPlayer)?.ships
    const result = game.players.find(
      (player) => player !== game.currentPlayer,
    )?.ships;
    if (!result || result.length === 0) {
      throw new Error();
    }

    return result;
  }

  private isAllShipKill(game: Game): boolean {
    const ships = this.getShipsOtherPlayer(game);
    const result = ships.every((ship) => ship.shots.every(Boolean));
    return result;
  }

  protected getRandomShot(player: Player): { x: number; y: number } {
    let shot: { x: number; y: number };
    do {
      shot = {
        x: Math.floor(Math.random() * 10), // this.fieldSize),
        y: Math.floor(Math.random() * 10), // this.fieldSize),
      };
    } while (player.shots.has(`${shot.x},${shot.y}`)); // Проверка на уникальность

    // this.shots.add(`${shot.x},${shot.y}`); // Сохранение выстрела
    return shot; // Возврат уникальных координат
  }

  public attackAction =   (
    gameId: string,
    indexPlayer: string,
    x: number,
    y: number,
  ) => {
    const game = this.games.find((game) => game.gameId === gameId);

    //   const isUserTurn = this.test === data.indexPlayer;
    if (!(game?.currentPlayer.indexPlayer === indexPlayer)) {
      return;
    }
    if (game.currentPlayer.shots.has(`${x},${y}`)) {
      //  clientTurn(game.players[0].ws, game.currentPlayer.indexPlayer);
      //   clientTurn(game.players[1].ws, game.currentPlayer.indexPlayer);
      return;
    }
    // const player = game?.currentPlayer === game.players
    game.currentPlayer.shots.add(`${x},${y}`);

    const attackResult =   this.getAttackResult(
      this.getShipsOtherPlayer(game),
      x,
      y,
    );

    // const {player1 , player2} =   this.dbHandler.getPlayersInGame(gameId);

    // const ws1 =  this.webSoketHandler.getWSByPlayerID(player1)
    // const ws2 = this.webSoketHandler.getWSByPlayerID(player2)

    //    const game = this.games.find(game => game.gameId === gameId);
    game.players.forEach((player) => {
      //  clientStartGame(player.ws, player.ships, player.indexPlayer)
      clientAttack(
        player.ws,
        game.currentPlayer.indexPlayer,
        attackResult.status,
        { x, y },
      );
      // clientAttack(player.ws, indexPlayer, attackResult.status, {x:data.x, y:data.y})

      // clientCreateGame(player.ws , game.gameId, player.indexPlayer)
    });

    // clientAttack(ws1, indexPlayer, attackResult.status, {x:data.x, y:data.y})
    // clientAttack(ws2, indexPlayer, attackResult.status, {x:data.x, y:data.y})
    if (attackResult.status === "killed") {
      if (!attackResult.ship) {
        throw new Error("корабль пустой");
      }
      this.missesAroundShip(game, attackResult.ship);
      if (this.isAllShipKill(game)) {
        clientFinish(game.players[0].ws, game.currentPlayer.indexPlayer);
        clientFinish(game.players[1].ws, game.currentPlayer.indexPlayer);
        // this.webSoketHandler.addWebSoket(ws, newPlayer.index)
        //  clientRegistration(ws, name, newPlayer.index);





       
          this.usersHandler.addWinner(game.currentPlayer.indexPlayer)
       
       const winners = this.usersHandler.getWinners()
       this.webSoketHandler.getAllWS().forEach(  (ws) => {
          clientUpdateWinners(ws.ws,winners )
         // ///////////////обновить виннеров clientUpdateWinners
      });
      this.deleteGame(game);












        //    this.dbHandler.addWinner(game.currentPlayer.indexPlayer);
        // const winners =   this.dbHandler.getWinners();

        // this.webSoketHandler.getAllWS().forEach(  (ws) => {
        //   //  clientUpdateRoom(ws.ws,   this.dbHandler.getRooms());
        //      clientUpdateWinners(ws.ws, thi);
        // });
        // this.webSoketHandler.getAllWS.
        // clientUpdateWinners(ws.ws,   this.dbHandler.getWinners())
      }
    }

    if (attackResult.status === "miss") {
      game.currentPlayer =
        game.currentPlayer === game.players[0]
          ? game.players[1]
          : game.players[0];
    }

    clientTurn(game.players[0].ws, game.currentPlayer.indexPlayer);
    clientTurn(game.players[1].ws, game.currentPlayer.indexPlayer);
    //  game.currentPlayer.shots.add(`${x},${y}`);
    // game.currentPlayer.shoots.add
    //  clientTurn(ws2, this.test)
  };

  public randomAttack =   (gameId: string, playerIndex: string) => {
    const game = this.games.find((game) => game.gameId === gameId) as Game;
    // const otherPlayer = game.currentPlayer === game.players[0] ? game.players[1] : game.players[0]

    const { x, y } = this.getRandomShot(game.currentPlayer);
    this.attackAction(gameId, playerIndex, x, y);
    // const
  };

  private missesAroundShip(game: Game, ship: Ship) {
    type PositionIndex = "x" | "y";
    const widthCoordinate: PositionIndex = ship.direction ? "x" : "y";
    const lengthCoordinate: PositionIndex = ship.direction ? "y" : "x";
    const position = { x: ship.position.x, y: ship.position.y };

    const sendMiss = () => {
      // position.x = x;
      // position.y = y;
      clientAttack(
        game.players[0].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      clientAttack(
        game.players[1].ws,
        game.currentPlayer.indexPlayer,
        "miss",
        position,
      );
      game.currentPlayer.shots.add(`${position.x},${position.y}`);
    };

    // Обрабатываем промахи вокруг корабля
    for (
      let i = ship.position[lengthCoordinate] - 1;
      i <= ship.position[lengthCoordinate] + ship.length;
      i++
    ) {
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

  //   public addShipsToGame =   (gameId: string, indexPlayer: string, ships : any) => {
  //     const game = this.games.find(game => game.gameId === gameId) as Game
  //     const player = game.players.find(player => player.indexPlayer === indexPlayer) as Player
  //    // const player = this.games.reduce(() => {} ) find(game => game.gameId === gameId) as Game
  //    player.ships = ships;
  //     ships.forEach((ship: Ship) => {
  //         ship.shots = new Array(ship.length).fill(false);
  //     })
  //   }

  //   public isGameReadyStart =   (gameId: string) => {
  //     console.log("this.games", this.games)
  //     return this.games.filter(game => game.gameId === gameId && game.ships).length === 2
  //   }

  //   public getShipsPlayersOfGame =   (gameId: string) => {
  //     const game = this.games.filter((game) => game.gameId === gameId);
  //     return { shipsPlayer1: game[0], shipsPlayer2: game[1] };
  //   };

  public getAttackResult =   (ships: Ship[], x: number, y: number) : AttackResult=> {
    //  const game = this.games.find(game => game.gameId === gameId && game.indexPlayer !== indexPlayer);

    // if (!game || !game.ships) {
    //     throw new Error("Не найдены кораблики");
    // }

    // const ships = game.ships;
    const result: AttackResult = {
      status: "miss",
      ship: null,
    };

    for (const ship of ships) {
      const hit = this.checkHit(ship, x, y);
      if (hit) {
        ship.shots[hit.index] = true;
        result.status = "shot";

        if (ship.shots.every(Boolean)) {
          result.status = "killed";
          result.ship = ship;
        }

        break; // Выход из цикла, если попали в корабль
      }
    }

    return result;
  };

  private checkHit(ship: Ship, x: number, y: number): {index: number } | null {
    if (!ship.direction) {
      // Горизонтальный корабль
      if (
        x >= ship.position.x &&
        x < ship.position.x + ship.length &&
        y === ship.position.y
      ) {
        return { index: x - ship.position.x };
      }
    } else {
      // Вертикальный корабль
      if (
        y >= ship.position.y &&
        y < ship.position.y + ship.length &&
        x === ship.position.x
      ) {
        return { index: y - ship.position.y };
      }
    }
    return null; // Не попали
  }

  private deleteGame(game: Game): void {
    this.games = this.games.filter((element) => element !== game);
  }

  //   public getAttackResult =   (gameId: string, indexPlayer: string, x: number , y: number) => {
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
