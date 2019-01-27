import { randomIndex, incrementColor, COLORS } from "./utilities";

class Board {
  constructor(rowCount) {
    this.rowCount = rowCount;
    this.selected = false;

    this.fillInColumn = column => {
      let newColumn = column.filter(space => space);
      for (let i = column.length - newColumn.length; i > 0; i--) {
        newColumn.unshift(randomIndex(COLORS));
      }
      return newColumn;
    };

    this.fillIn = () => {
      this.spaces = this.spaces.map(column => this.fillInColumn(column));
    };

    this.handleSelect = (column, row) => {
      if (column >= this.rowCount || row >= this.rowCount) {
        return;
      }
      if (this.selected === false) {
        this.selected = [column, row];
      } else {
        if (this.adjacent([column, row], this.selected)) {
          this.swap([column, row], this.selected);
        }
        this.selected = false;
      }
    };

    this.adjacent = (a, b) => {
      if (a[0] === b[0]) {
        if (Math.abs(a[1] - b[1]) === 1) {
          return true;
        }
      } else if (a[1] === b[1]) {
        if (Math.abs(a[0] - b[0]) === 1) {
          return true;
        }
      }
      return false;
    };

    this.checkForExplosions = (spaces, vertical = false) => {
      let lastColor = false;
      let currentMatch = [];
      const matches = [];

      const appendToMatches = match => {
        if (match.length >= 3) {
          matches.push(match);
        }
      };

      spaces.map((column, columnIndex) => {
        lastColor = false;
        currentMatch = [];
        column.map((row, rowIndex) => {
          if (lastColor === false) {
            lastColor = row;
            if (vertical) {
              currentMatch.push([rowIndex, columnIndex]);
            } else {
              currentMatch.push([columnIndex, rowIndex]);
            }
            return;
          } else {
            if (lastColor === row) {
              if (vertical) {
                currentMatch.push([rowIndex, columnIndex]);
              } else {
                currentMatch.push([columnIndex, rowIndex]);
              }
            } else {
              appendToMatches(currentMatch, columnIndex, rowIndex - 1);
              if (vertical) {
                currentMatch = [[rowIndex, columnIndex]];
              } else {
                currentMatch = [[columnIndex, rowIndex]];
              }
              lastColor = row;
            }
          }
          if (rowIndex === this.rowCount - 1) {
            appendToMatches(currentMatch, columnIndex, rowIndex);
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

    this.checkVertical = () => this.checkForExplosions(this.pivot(), 1);

    this.resolveAllExplosions = () => {
      let exploded = false;
      while (this.checkHorizontal().length || this.checkVertical().length) {
        exploded = true;
        this.resolveExplosions(this.checkHorizontal());
        this.resolveExplosions(this.checkVertical());
      }
      return exploded;
    };

    this.resolveExplosions = explosions => {
      explosions.forEach(explosion => {
        explosion.forEach(explosionSpace => {
          this.spaces[explosionSpace[0]][explosionSpace[1]] = false;
        });
      });
      this.fillIn();
    };

    this.swap = (a, b) => {
      const tmpA = this.spaces[a[0]][a[1]];
      this.spaces[a[0]][a[1]] = this.spaces[b[0]][b[1]];
      this.spaces[b[0]][b[1]] = tmpA;
      if (!this.resolveAllExplosions()) {
        this.spaces[b[0]][b[1]] = this.spaces[a[0]][a[1]];
        this.spaces[a[0]][a[1]] = tmpA;
      }
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

    let i = 0;

    this.resolveAllExplosions();
  }
}

export default Board;
