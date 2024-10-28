import { UsersHandler } from "./usersHandler";

interface PlayerInRoom {
  name: string;
  index: string;
}

interface Room {
  roomId: string;
  roomUsers: PlayerInRoom[];
}

export class RoomsHandler {
  private static instance: RoomsHandler | null = null;

  private usersHandler = new UsersHandler();
  private rooms: Room[] = [];

  constructor() {
    if (RoomsHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return RoomsHandler.instance;
    }
    RoomsHandler.instance = this;
  }

  public getRooms = (): Room[] => {
    const result = this.rooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((player) => ({
        name: player.name,
        index: player.index,
      })),
    }));
    return this.rooms;
  };

  public addPlayerToRoom = (playerIndex: string, roomId: string): void => {
    const room = this.rooms.find((room) => room.roomId === roomId);
    const playerName = this.usersHandler.getPlayerName(playerIndex);
    room?.roomUsers.push({
      name: playerName,
      index: playerIndex,
    });
  };

  public isRoomFull = (roomId: string): boolean =>
    this.rooms.find((room) => room.roomId === roomId)?.roomUsers.length === 2;

  public addRoom = (): string => {
    const newRoom: Room = {
      roomId: crypto.randomUUID(),
      roomUsers: [],
    };
    this.rooms.push(newRoom);
    return newRoom.roomId;
  };

  public getPlayersInRoom = (
    roomId: string,
  ): { player1: string; player2: string } => {
    const room: Room = this.rooms.find(
      (room) => room.roomId === roomId,
    ) as Room;
    return {
      player1: room.roomUsers[0].index,
      player2: room.roomUsers[1].index,
    };
  };

  public isPlayerInRoom = (playerID: string): boolean =>
    this.rooms.some((room) =>
      room.roomUsers.some((user) => user.index === playerID),
    );

  public delRoom = (roomId: string): void => {
    this.rooms = this.rooms.filter((room) => room.roomId !== roomId);
  };

  public playerOffline = (playerID: string): void => {
    this.rooms = this.rooms.filter(
      (room) => room.roomUsers[0].index !== playerID,
    );
  };
}
