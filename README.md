# WebSocket server for BattleShip game

RS School NodeJS 2024 Q3

## Requirements

Use Node.js LTS version (at the time of writing 18.16.1)

## Installation

1. Clone/download this repository
2. Switch to branch 'develop'
3. `npm install`

## Provided scripts

- `npm run start` - start app in production mode

## Implementation details

- WebSocket server starts on port 3000. Web interface for the game is available on port 8080
- WebSocket server logs informational messages & info about problems to console
- Simple dumb bot for single player mode is also implemented
- If you shoot at a cell that has already been shot at, the auto-shot timer will reset and your turn will remain
- If you created a room and then started a solo game, the room is deleted
- If a player disconnects, the room he was in is deleted. If he was in the game, then the game ends and the opponent is awarded victory
