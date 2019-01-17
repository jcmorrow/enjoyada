import { randomIndex, incrementColor, COLORS } from "./utilities";

class Board {
  constructor(rowCount) {
    this.rowCount = rowCount;

    this.handleSelect = (column, row) => {
      console.log(this.spaces);
      if (column >= this.rowCount || row >= this.rowCount) {
        return;
      }
      if (this.selected) {
        this.swap([column, row], this.selected);
        this.selected = false;
      } else {
        this.selected = [column, row];
      }
    };

    this.checkForExplosions = spaces => {
      let lastColor = false;
      let colorStreak = 0;
      const matches = [];

      const appendToMatches = (colorStreak, columnIndex, rowIndex) => {
        if (colorStreak >= 3) {
          matches.push([columnIndex, rowIndex]);
        }
      };

      spaces.map((column, columnIndex) => {
        lastColor = false;
        column.map((row, rowIndex) => {
          if (lastColor === false) {
            lastColor = row;
            colorStreak = 1;
            return;
          } else {
            if (lastColor === row) {
              colorStreak++;
            } else {
              appendToMatches(colorStreak, columnIndex, rowIndex - 1);
              lastColor = row;
              colorStreak = 1;
            }
          }
          if (rowIndex === this.rowCount - 1) {
            appendToMatches(colorStreak, columnIndex, rowIndex);
          }
        });
      });

      return matches;
    };

    this.pivot = () => {
      const pivoted = new Array(this.rowCount)
        .fill(undefined)
        .map(() => new Array(this.rowCount).fill(undefined));
      for (let row = 0; row < this.rowCount; row++) {
        for (let col = 0; col < this.rowCount; col++) {
          pivoted[col][row] = this.spaces[row][col];
        }
      }
      return pivoted;
    };

    this.checkHorizontal = () => this.checkForExplosions(this.spaces);

    this.checkVertical = () => this.checkForExplosions(this.pivot());

    this.resolveExplosions = explosions => {
      explosions.forEach(explosion => {
        const color = this.spaces[explosion[0]][explosion[1]];
        let row = explosion[1];
        while (row >= 0 && this.spaces[explosion[0]][row] === color) {
          this.spaces[explosion[0]][row] = false;
          row--;
        }
      });
    };

    this.swap = (a, b) => {
      const tmpA = this.spaces[a[0]][a[1]];
      this.spaces[a[0]][a[1]] = this.spaces[b[0]][b[1]];
      this.spaces[b[0]][b[1]] = tmpA;
      this.resolveExplosions(this.checkHorizontal());
    };

    this.areNeighbors = (a, b) => {
      if (a[0] === b[0]) {
        return this.differentByOne(a[1], b[1]);
      }
      if (a[1] === b[1]) {
        return this.differentByOne(a[0], b[0]);
      }
      return false;
    };

    this.differentByOne = (a, b) => Math.abs(a - b) === 1;

    this.spaces = new Array(this.rowCount)
      .fill(undefined)
      .map(() =>
        new Array(this.rowCount).fill(undefined).map(() => randomIndex(COLORS))
      );

    while (this.checkHorizontal().length || this.checkVertical().length) {
      this.checkHorizontal().map(space => {
        this.spaces[space[0]][space[1]] = incrementColor(
          this.spaces[space[0]][space[1]]
        );
      });
      this.checkVertical().map(space => {
        this.spaces[space[1]][space[0]] = incrementColor(
          this.spaces[space[1]][space[0]]
        );
      });
    }

    console.log(this.spaces);
    console.log(this.pivot());
  }
}

export default Board;
