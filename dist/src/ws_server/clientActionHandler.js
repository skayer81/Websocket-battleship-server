"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRegistration = clientRegistration;
exports.clientUpdateRoom = clientUpdateRoom;
exports.clientUpdateWinners = clientUpdateWinners;
exports.clientCreateGame = clientCreateGame;
exports.clientStartGame = clientStartGame;
exports.clientAttack = clientAttack;
exports.clientTurn = clientTurn;
exports.clientFinish = clientFinish;
function clientRegistration(ws, name, index) {
    ws.send(JSON.stringify({
        type: "reg",
        data: JSON.stringify({
            name: name,
            index: index,
            error: false,
            errorText: "",
        }),
        id: 0,
    }));
}
function clientUpdateRoom(ws, rooms) {
    ws.send(JSON.stringify({
        type: "update_room",
        data: JSON.stringify(rooms),
        id: 0,
    }));
}
function clientUpdateWinners(ws, winners) {
    ws.send(JSON.stringify({
        type: "update_winners",
        data: JSON.stringify(winners),
        id: 0,
    }));
}
function clientCreateGame(ws, idGame, idPlayer) {
    ws.send(JSON.stringify({
        type: "create_game",
        data: JSON.stringify({
            idGame: idGame,
            idPlayer: idPlayer,
        }),
        id: 0,
    }));
}
function clientStartGame(ws, ships, currentPlayerIndex) {
    ws.send(JSON.stringify({
        type: "start_game",
        data: JSON.stringify({
            ships: ships,
            currentPlayerIndex: currentPlayerIndex,
        }),
        id: 0,
    }));
}
function clientAttack(ws, currentPlayer, status, position) {
    console.log("отправка на клиент атаки");
    ws.send(JSON.stringify({
        type: "attack",
        data: JSON.stringify({
            position: position,
            currentPlayer: currentPlayer,
            status: status,
        }),
        id: 0,
    }));
}
function clientTurn(ws, currentPlayer) {
    ws.send(JSON.stringify({
        type: "turn",
        data: JSON.stringify({
            currentPlayer: currentPlayer,
        }),
        id: 0,
    }));
}
function clientFinish(ws, winPlayer) {
    ws.send(JSON.stringify({
        type: "finish",
        data: JSON.stringify({
            winPlayer: winPlayer,
        }),
        id: 0,
    }));
}
//# sourceMappingURL=clientActionHandler.js.map