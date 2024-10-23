import WebSocket from 'ws';
import { DBHandler } from './dataBaseHandler';
import { WebSoketHandler } from './webSoketHandler';

interface WebSocketWithUserIndex extends WebSocket  {
    index?: string;
}

export class ServerActionHandlers{

    dbHandler = new DBHandler();
    webSoketHandler = new WebSoketHandler()

    handleRegistration = async (command: any, ws: WebSocket) => {

       // const existingPlayer = players.find(player => player.name === name);
    
       // if (this.dbHandler.isPlayerExist(name)) {
            // ws.send(JSON.stringify({
            //     type: 'reg',
            //     data: JSON.stringify({
            //         name,
            //         index: existingPlayer.index,
            //         error: true,
            //         errorText: 'Player already exists'
            //     }),
            //     id: 0
            // }));
            // return;

        const { name, password } = JSON.parse(command.data);
        
        const newPlayer = await this.dbHandler.addPlayer( name, password)//, index: players.length };
           //ws.index = newPlayer.index;
           console.log("индекс при добавлении", newPlayer.index)
           console.log("дфнные при добавлении", name, password)
           this.webSoketHandler.addWebSoket(ws, newPlayer.index)
         //  console.log(ws.index)
           // players.push(newPlayer);
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify( {
                    name,
                    index: newPlayer.index,
                    error: false,
                    errorText: ''
                }),
                id: 0
            }));

            this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {
                ws.ws.send(JSON.stringify({
                    type: 'update_room',
                    data: JSON.stringify(await this.dbHandler.getRooms()),
                id: 0 }));
              
              ws.ws.send(JSON.stringify({
                type: 'update_winners',
                data: JSON.stringify(await this.dbHandler.getWinners()),
               id: 0 })); 


            });


      }



    //   type: "update_winners",
    //   data:
    //       [
    //           {
    //               name: string,
    //               wins: number,
    //           }
    //       ],
    //   id: 0,

    
    
    handleCreateRoom = async (ws: WebSocket) => {
       await this.dbHandler.addRoom()
       // const roomId = `${rooms.length + 1}`;
       // const newRoom: Room = { id: roomId, players: [] };
       // rooms.push(newRoom);

       this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {
        ws.ws.send(JSON.stringify({
            type: 'update_room',
            data: JSON.stringify(await this.dbHandler.getRooms()),
        id: 0 }));
      
    //   ws.ws.send(JSON.stringify({
    //     type: 'update_winners',
    //     data: JSON.stringify(await this.dbHandler.getRooms()),
    //    id: 0 })); 


    });
        
    // const test = JSON.stringify({
    //     type: 'update_room',
    //     data: JSON.stringify(await this.dbHandler.getRooms()),
    // id: 0 })

    // console.log(test)
    //     ws.send(test);
      }
    
    
    handleAddUserToRoom = async (roomId: string, ws: WebSocket) => {

        const userIndex = this.webSoketHandler.getPlayerIDByWS(ws)?.playerID || '';
        console.log("userIndex при обновлении комнат", userIndex)
       await this.dbHandler.addPlayerToRoom(userIndex, roomId);
        // const r = JSON.stringify({
        //     type: 'update_room',
        //     data: JSON.stringify(await this.dbHandler.getRooms()),
        // id: 0 })
        // console.log(r)
        // ws.send(r);
        this.webSoketHandler.getAllWS().forEach(async( ws)  =>  {
            ws.ws.send(JSON.stringify({
                type: 'update_room',
                data: JSON.stringify(await this.dbHandler.getRooms()),
            id: 0 }));
        })
        // console.log('roomId', roomId)
        // console.log('проверка', !this.dbHandler.isRoomFull(roomId))
        // console.log("rjvyfns", this.dbHandler.getRooms())
        if ( ! await this.dbHandler.isRoomFull(roomId)){return}

        const {player1 , player2} = await this.dbHandler.getPlayersInRoom(roomId)

        const gameId = this.dbHandler.addGame(player1 , player2); 

        const ws1 = this.webSoketHandler.getWSByPlayerID(player1)   
        const ws2 = this.webSoketHandler.getWSByPlayerID(player2)

        ws1.send(JSON.stringify({
            type: 'create_game',
            data: JSON.stringify({
                idGame: gameId,  
                idPlayer: player1
            }),
        id: 0 }));

        
        ws2.send(JSON.stringify({
            type: 'create_game',
            data: JSON.stringify({
                idGame: gameId,  
                idPlayer: player2
            }),
        id: 0 }));

        // {
        //     type: "create_game", //send for both players in the room, after they are connected to the room
        //     data:
        //         {
        //             idGame: <number | string>,  
        //             idPlayer: <number | string>, /* generated by server id for player in the game session, not enemy (unique id for every player) */
        //         },
        //     id: 0,
        // }



      }
        // const room =  rooms.find(r => r.id === roomId);
        // if (room) {
        //     // Add player to room logic 
        //     ws.send(JSON.stringify({
        //         type: 'create_game',
        //         data: JSON.stringify({
        //             idGame: room.id,
        //             idPlayer: room.players.length + 1 // Example player ID
        //         }),
        //         id: 0 }));
        // }
    


    // type: "add_user_to_room",
    // data:
    //     {
    //         indexRoom: number | string,
    //     },
    // id: 0,




    
    handleAddShips = (data: any, ws: WebSocket) => {
        // Logic to handle adding ships to the game board
         ws.send(JSON.stringify({
            type: 'start_game',
            data: JSON.stringify({
                ships: data.ships,
                currentPlayerIndex: data.indexPlayer
            }),
            id: 0 }));
    }
    
    handleAttack = (data: any, ws: WebSocket) => {
        // Logic to handle attack
        ws.send(JSON.stringify({
            type: 'attack',
            data: JSON.stringify({
                position: { x: data.x, y: data.y },
                currentPlayer: data.indexPlayer,
                status: 'miss' // Example status 
                }),
            id: 0 }));
    }




}