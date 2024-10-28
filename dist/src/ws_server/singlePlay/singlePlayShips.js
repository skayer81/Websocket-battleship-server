"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinglPlayShips = void 0;
var SinglPlayShips = (function () {
  function SinglPlayShips() {
    var _this = this;
    this.fieldSize = 10;
    this.field = Array.from({ length: this.fieldSize }, function () {
      return Array(_this.fieldSize).fill(0);
    });
    this.ships = [];
  }
  SinglPlayShips.prototype.canPlaceShip = function (ship) {
    var _a = ship.position,
      x = _a.x,
      y = _a.y;
    if (!ship.direction) {
      if (x + ship.length > this.fieldSize) {
        return false;
      }
      for (var i = 0; i < ship.length; i += 1) {
        if (this.field[y][x + i] !== 0) {
          return false;
        }
      }
    } else {
      if (y + ship.length > this.fieldSize) {
        return false;
      }
      for (var i = 0; i < ship.length; i += 1) {
        if (this.field[y + i][x] !== 0) {
          return false;
        }
      }
    }
    var directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ];
    for (var i = 0; i < ship.length; i += 1) {
      var checkX = !ship.direction ? x + i : x;
      var checkY = !ship.direction ? y : y + i;
      for (
        var _i = 0, directions_1 = directions;
        _i < directions_1.length;
        _i++
      ) {
        var _b = directions_1[_i],
          dx = _b.dx,
          dy = _b.dy;
        var nx = checkX + dx;
        var ny = checkY + dy;
        if (nx >= 0 && nx < this.fieldSize && ny >= 0 && ny < this.fieldSize) {
          if (this.field[ny][nx] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };
  SinglPlayShips.prototype.placeShip = function (ship) {
    var _a = ship.position,
      x = _a.x,
      y = _a.y;
    if (!ship.direction) {
      for (var i = 0; i < ship.length; i += 1) {
        this.field[y][x + i] = 1;
      }
    } else {
      for (var i = 0; i < ship.length; i += 1) {
        this.field[y + i][x] = 1;
      }
    }
    this.ships.push(ship);
  };
  SinglPlayShips.prototype.randomizeShips = function () {
    var shipConfigurations = [
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
    var shipCounts = {
      huge: 1,
      large: 2,
      medium: 3,
      small: 4,
    };
    for (
      var _i = 0, shipConfigurations_1 = shipConfigurations;
      _i < shipConfigurations_1.length;
      _i++
    ) {
      var shipType = shipConfigurations_1[_i];
      for (var count = 0; count < shipCounts[shipType.type]; count += 1) {
        var placed = false;
        while (!placed) {
          var direction = Math.random() < 0.5;
          var x = Math.floor(Math.random() * this.fieldSize);
          var y = Math.floor(Math.random() * this.fieldSize);
          var ship = __assign(__assign({}, shipType), {
            position: { x: x, y: y },
            direction: direction,
          });
          if (this.canPlaceShip(ship)) {
            this.placeShip(ship);
            placed = true;
          }
        }
      }
    }
  };
  SinglPlayShips.prototype.printField = function () {
    console.log(
      this.field
        .map(function (row) {
          return row.join(" ");
        })
        .join("\n"),
    );
  };
  SinglPlayShips.prototype.getShips = function () {
    var _this = this;
    this.ships = [];
    this.field = Array.from({ length: this.fieldSize }, function () {
      return Array(_this.fieldSize).fill(0);
    });
    this.randomizeShips();
    return this.ships;
  };
  return SinglPlayShips;
})();
exports.SinglPlayShips = SinglPlayShips;
//# sourceMappingURL=singlePlayShips.js.map
