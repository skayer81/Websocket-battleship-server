type ShipType = "small" | "medium" | "large" | "huge";

interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
  shots: boolean[];
}

// export interface Ship {
//     position: {
//       x: number;
//       y: number;
//     };
//     direction: boolean;
//     length: number;
//     type: "small" | "medium" | "large" | "huge";
//     shots: boolean[];
//   }

export class SinglPlayShips {
  private field: number[][];

  private ships: Ship[];

  private readonly fieldSize: number;

  constructor(fieldSize: number = 10) {
    this.fieldSize = fieldSize;
    this.field = Array.from({ length: fieldSize }, () =>
      Array(fieldSize).fill(0),
    );
    this.ships = [];
  }

  private canPlaceShip(ship: Ship): boolean {
    const { x, y } = ship.position;

    if (!ship.direction) {
      if (x + ship.length > this.fieldSize) {
        return false;
      }
      for (let i = 0; i < ship.length; i+=1) {
        if (this.field[y][x + i] !== 0) {
          return false;
        }
      }
    } else {
      if (y + ship.length > this.fieldSize) {
        return false;
      }
      for (let i = 0; i < ship.length; i+=1) {
        if (this.field[y + i][x] !== 0) {
          return false;
        }
      }
    }

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ];

    for (let i = 0; i < ship.length; i+=1) {
      const checkX = !ship.direction ? x + i : x;
      const checkY = !ship.direction ? y : y + i;

      for (const { dx, dy } of directions) {
        const nx = checkX + dx;
        const ny = checkY + dy;

        if (nx >= 0 && nx < this.fieldSize && ny >= 0 && ny < this.fieldSize) {
          if (this.field[ny][nx] !== 0) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private placeShip(ship: Ship): void {
    const { x, y } = ship.position;

    if (!ship.direction) {
      for (let i = 0; i < ship.length; i+=1) {
        this.field[y][x + i] = 1;
      }
    } else {
      for (let i = 0; i < ship.length; i+=1) {
        this.field[y + i][x] = 1;
      }
    }

    this.ships.push(ship);
  }

  public randomizeShips(): void {
    const shipConfigurations: Ship[] = [
      {
        position: { x: 0, y: 0 },
        direction: true,
        length: 4,
        type: "huge",
        shots: [],
      },
      {
        position: { x: 0, y: 0 },
        direction: true,
        length: 3,
        type: "large",
        shots: [],
      },
      {
        position: { x: 0, y: 0 },
        direction: true,
        length: 2,
        type: "medium",
        shots: [],
      },
      {
        position: { x: 0, y: 0 },
        direction: true,
        length: 1,
        type: "small",
        shots: [],
      },
    ];

    const shipCounts = {
      huge: 1,
      large: 2,
      medium: 3,
      small: 4,
    };

    for (const shipType of shipConfigurations) {
      for (let count = 0; count < shipCounts[shipType.type]; count+=1) {
        let placed = false;

        while (!placed) {
          const direction = Math.random() < 0.5;
          const x = Math.floor(Math.random() * this.fieldSize);
          const y = Math.floor(Math.random() * this.fieldSize);

          const ship: Ship = { ...shipType, position: { x, y }, direction };

          if (this.canPlaceShip(ship)) {
            this.placeShip(ship);
            placed = true;
          }
        }
      }
    }
  }

  public printField(): void {
    console.log(this.field.map((row) => row.join(" ")).join("\n"));
  }

  public getShips(): Ship[] {
    this.randomizeShips();
    this.printField();
    console.log(this.ships);
    return this.ships;
  }
}
