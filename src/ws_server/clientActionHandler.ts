// export class clientActionHandler{

// }

import { Room, Winner, Ship } from './types/dataTypes';


import WebSocket from 'ws';


export function clientRegistration(ws: WebSocket, name: string, index: string){
    ws.send(JSON.stringify({
        type: 'reg',
        data: JSON.stringify( {
            name,
            index,
            error: false,
            errorText: ''
        }),
        id: 0
    }));
}

export function clientUpdateRoom(ws: WebSocket, rooms: Room[]){
    ws.send(JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(rooms),
    id: 0 }));
}

export function clientUpdateWinners(ws: WebSocket, winners: Winner[]){
    ws.send(JSON.stringify({
        type: 'update_winners',
        data: JSON.stringify(winners),
    id: 0 }));
}

export function clientCreateGame(ws: WebSocket, idGame: string, idPlayer: string ){
    ws.send(JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
            idGame,  
            idPlayer
        }),
    id: 0 }));
}

export function clientStartGame(ws: WebSocket, ships: Ship[], currentPlayerIndex: string ){
    ws.send(JSON.stringify({
        type: 'start_game',
        data: JSON.stringify({
            ships,
            currentPlayerIndex
        }),
        id: 0 }));
}

export function clientAttack(ws: WebSocket, currentPlayer: string, status: string, position:{x:number, y: number}){
    console.log('отправка на клиент атаки')
    ws.send(JSON.stringify({
        type: 'attack',
        data: JSON.stringify({
            position,
            currentPlayer,
            status  
            }),
        id: 0 }));
}


export function clientTurn(ws: WebSocket, currentPlayer: string ){
    ws.send(JSON.stringify({
        type: 'start_game',
        data: JSON.stringify({
        //position: { x: data.x, y: data.y },
        currentPlayer
       // status: attackstatus ? "shot" : 'miss' // Example status 
        }),
    id: 0 })); 
}

