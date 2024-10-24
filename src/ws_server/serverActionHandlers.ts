import WebSocket from 'ws';
import { DBHandler } from './dataBaseHandler';
import { WebSoketHandler } from './webSoketHandler';
import { clientRegistration, clientUpdateRoom, clientUpdateWinners, clientCreateGame, clientStartGame , clientAttack, clientTurn } from './clientActionHandler';
import {Ship } from './types/dataTypes'
import { GamesHandler } from './gamesHandler';

export class ServerActionHandlers{

    dbHandler = new DBHandler();
    webSoketHandler = new WebSoketHandler();
    gamesHandler = new GamesHandler()
   // test = ''

    handleRegistration = async (command: any, ws: WebSocket) => {


        const { name, password } = JSON.parse(command.data);
        
        const newPlayer = await this.dbHandler.addPlayer( name, password)//, index: players.length };
           this.webSoketHandler.addWebSoket(ws, newPlayer.index)
            clientRegistration(ws, name, newPlayer.index);

            this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {

                clientUpdateRoom(ws.ws, await this.dbHandler.getRooms());
                clientUpdateWinners(ws.ws, await this.dbHandler.getWinners())

            });


      }


    
    
    handleCreateRoom = async (ws: WebSocket) => {
       await this.dbHandler.addRoom()

       this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {
        clientUpdateRoom(ws.ws, await this.dbHandler.getRooms());

    });
        
      }
    
    
    handleAddUserToRoom = async (roomId: string, ws: WebSocket) => {

        const userIndex = this.webSoketHandler.getPlayerIDByWS(ws)?.playerID || '';
       await this.dbHandler.addPlayerToRoom(userIndex, roomId);
        this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {
            clientUpdateRoom(ws.ws, await this.dbHandler.getRooms());
        })
        if ( ! await this.dbHandler.isRoomFull(roomId)){return}

        const {player1 , player2} = await this.dbHandler.getPlayersInRoom(roomId)

        await this.gamesHandler.addGame(player1 , player2);

       // const gameId = await this.dbHandler.addGame(player1 , player2); 
       // const ws2 = this.webSoketHandler.getWSByPlayerID(player2)

      //  clientCreateGame(this.webSoketHandler.getWSByPlayerID(player1), gameId, player1  )
      //  clientCreateGame(this.webSoketHandler.getWSByPlayerID(player2), gameId, player2  )


      }
    
    handleAddShips = async (data: any, ws: WebSocket) => {

         await this.gamesHandler.addShipsToGame(data.gameId, data.indexPlayer, data.ships)

         if (await this.gamesHandler.isAllPlayerReady(data.gameId)) {
           await  this.gamesHandler.startGame(data.gameId)
         }

    //      const isGameReadyStart = await this.gamesHandler.isGameReadyStart(data.gameId)
    //      if (!isGameReadyStart) return

    //      this.gamesHandler.startGame()

    //      const {shipsPlayer1, shipsPlayer2} =  await this.dbHandler.getShipsPlayersOfGame(data.gameId);

    //     // const ws1 = this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer)   
    //     // const ws2 = this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer)

    //      if (!shipsPlayer1.ships || !shipsPlayer2.ships) throw new Error("нет кораблей")

    //      clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer1.indexPlayer), shipsPlayer1.ships, shipsPlayer1.indexPlayer)
    //      clientStartGame(this.webSoketHandler.getWSByPlayerID(shipsPlayer2.indexPlayer), shipsPlayer2.ships, shipsPlayer1.indexPlayer)
    //    //   this.test = shipsPlayer1.indexPlayer    
    }
    
    handleAttack = async (data: any, ws: WebSocket) => {

        this.gamesHandler.attackAction(data.gameId, data.indexPlayer, data.x , data.y)

        // const isUserTurn = this.test === data.indexPlayer;
        // if ( !isUserTurn) return
        // const gameId = data.gameId;
        // const indexPlayer = data.indexPlayer
        // const attackResult =  await this.dbHandler.getAttackResult(gameId, indexPlayer, data.x , data.y)
        // const {player1 , player2} = await this.dbHandler.getPlayersInGame(gameId);

        // const ws1 =  this.webSoketHandler.getWSByPlayerID(player1)   
        // const ws2 = this.webSoketHandler.getWSByPlayerID(player2)

        // clientAttack(ws1, indexPlayer, attackResult.status, {x:data.x, y:data.y})
        // clientAttack(ws2, indexPlayer, attackResult.status, {x:data.x, y:data.y})

        //   if (attackResult.status === 'miss'){
        //     this.test = (indexPlayer === player1)  ? player2 : player1; 
        //   }      

        //   if (attackResult.status === 'killed'){
        //     if (!attackResult.ship) throw new Error ("корабль пустой")
        //     this.missesAroundShip(ws1, ws2, indexPlayer, attackResult.ship)  
        // }

        //    clientTurn(ws1, this.test)
        //    clientTurn(ws2, this.test)
           
    }

    // missesAroundShip(ws1: WebSocket, ws2: WebSocket, indexPlayer: string, ship: Ship){
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

     }
