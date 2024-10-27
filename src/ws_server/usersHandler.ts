interface Player {
  name: string;
  index: string;
  password: string;
  wins: number;
  isOnline: boolean;
}

interface Winner {
  id: string;
  name: string;
  wins: number;
}

export class UsersHandler {
  private static instance: UsersHandler | null = null;

  private players: Player[] = [];

  constructor() {
    if (UsersHandler.instance) {
      // eslint-disable-next-line no-constructor-return
      return UsersHandler.instance;
    }
    UsersHandler.instance = this;
   }

  private getPlayerByName = (name: string): Player => {
    const player = this.players.find((player) => player.name === name);
    if (!player) {
      throw new Error(`player whit name ${name} is not exist`);
    }
    return player;
  };

  private getPlayerByID = (playerID: string): Player => {
    const player = this.players.find((player) => player.index === playerID);
    if (!player) {
      throw new Error(`player whit ID ${playerID} is not exist`);
    }
    return player;
  };

  public isPlayerExist = (name: string): boolean => {
    const player = this.players.find((player) => player.name === name);
    return Boolean(player);
  };

  public isPasswordCorrect = (name: string, password: string): boolean => {
    const player = this.getPlayerByName(name);
    return player.password === password;
  };

  public isUserOnlain = (name: string): boolean => {
    const player = this.getPlayerByName(name);
    return player.isOnline;
  };

  public getPlayerID = (name: string): string =>
    this.getPlayerByName(name).index;

  public getPlayerName = (playerID: string): string =>
    this.getPlayerByID(playerID).name;
  public addPlayer = (name: string, password: string): void => {
    const newPlayer = {
      name,
      password,
      index: crypto.randomUUID(),
      wins: 0,
      isOnline: false,
    };
    this.players.push(newPlayer);
  };

  public setOnlineStatus = (playerID: string, status: boolean): void => {
    this.getPlayerByID(playerID).isOnline = status;
  };

  private sortPlayers(players: Player[]): Player[] {
    return players.sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  public getWinners = (): Winner[] => {
    const winners: Winner[] = this.sortPlayers(this.players).map((player) => ({
      id: player.index,
      name: `${player.name} ${player.isOnline ? "(online)" : ""}`, 
      wins: player.wins,
    }));
    return winners.sort((a, b) => Number(a.wins > b.wins));
  };

  public addWinner = (winnerID: string): void => {
    const user = this.getPlayerByID(winnerID);
    user.wins += 1;
  };
}
