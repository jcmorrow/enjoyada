import { differentByOne, randomColor } from "./utilities";

class Board {
  constructor(rowCount) {
    this.rowCount = rowCount;
    this.selected = false;

    this.fillInColumn = column => {
      let newColumn = column.filter(space => space);
      for (let i = column.length - newColumn.length; i > 0; i--) {
        newColumn.unshift(randomColor());
      }
      return newColumn;
    };

    this.fillIn = () => {
      this.spaces = this.spaces.map(column => this.fillInColumn(column));
    };

    this.handleSelect = (column, row) => {
      if (
        column >= this.rowCount ||
        row >= this.rowCount ||
        row < 0 ||
        column < 0
      ) {
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
        return differentByOne(a[1], b[1]);
      } else if (a[1] === b[1]) {
        return differentByOne(a[0], b[0]);
      }
      return false;
    };

    this.pivotCoordinates = coordinates => {
      return [coordinates[1], coordinates[0]];
    };

    this.checkForExplosions = (spaces, vertical = false) => {
      let lastColor = false;
      let currentMatch = [];
      const matches = [];

      const appendToMatches = match => {
        if (match.length >= 3) {
          if (vertical) {
            match = match.map(this.pivotCoordinates);
          }
          matches.push(match);
        }
      };

      spaces.map((column, columnIndex) => {
        lastColor = false;
        currentMatch = [];
        column.map((row, rowIndex) => {
          if (lastColor === false) {
            // first jewel of the row
            lastColor = row;
            currentMatch.push([columnIndex, rowIndex]);
            return;
          } else {
            // not first jewel of the row, which means we have comparing to do
            if (lastColor === row) {
              // we are still matching so far!
              currentMatch.push([columnIndex, rowIndex]);
            } else {
              // our match has ended! Let's try and add everything that has
              // matched so far and restart
              appendToMatches(currentMatch);
              currentMatch = [[columnIndex, rowIndex]];
              lastColor = row;
            }
          }
          if (rowIndex === this.rowCount - 1) {
            // last jewel of the row, let's try and add a match no matter what!
            appendToMatches(currentMatch);
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
        // if nothing exploded, swap back
        this.spaces[b[0]][b[1]] = this.spaces[a[0]][a[1]];
        this.spaces[a[0]][a[1]] = tmpA;
      }
    };

    this.areNeighbors = (a, b) => {
      if (a[0] === b[0]) {
        return differentByOne(a[1], b[1]);
      }
      if (a[1] === b[1]) {
        return differentByOne(a[0], b[0]);
      }
      return false;
    };

    // we create the board for the first time by randomly filling it and then
    // resolving any explosions that got created by the randomness
    this.spaces = new Array(this.rowCount)
      .fill(undefined)
      .map(() =>
        new Array(this.rowCount).fill(undefined).map(() => randomColor())
      );

    this.resolveAllExplosions();
  }
}

export default Board;
