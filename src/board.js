import { differentByOne, randomColor } from "./utilities";

const MINIMUM_EXPLOSION_SIZE = 3;

class Board {
  constructor(rowCount) {
    this.rowCount = rowCount;
    this.selected = false;

    this.adjacent = this.adjacent.bind(this);
    this.areNeighbors = this.areNeighbors.bind(this);
    this.checkForExplosions = this.checkForExplosions.bind(this);
    this.checkHorizontal = this.checkHorizontal.bind(this);
    this.checkVertical = this.checkVertical.bind(this);
    this.fillIn = this.fillIn.bind(this);
    this.fillInColumn = this.fillInColumn.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.pivot = this.pivot.bind(this);
    this.pivotCoordinates = this.pivotCoordinates.bind(this);
    this.resolveAllExplosions = this.resolveAllExplosions.bind(this);
    this.resolveExplosions = this.resolveExplosions.bind(this);
    this.swap = this.swap.bind(this);

    // we create the board for the first time by randomly filling it and then
    // resolving any explosions that got created by the randomness
    this.columns = new Array(this.rowCount)
      .fill(undefined)
      .map(() =>
        new Array(this.rowCount).fill(undefined).map(() => randomColor())
      );

    this.resolveAllExplosions();
  }

  fillInColumn(column) {
    let newColumn = column.filter(space => space);
    for (let i = column.length - newColumn.length; i > 0; i--) {
      newColumn.unshift(randomColor());
    }
    return newColumn;
  }

  fillIn() {
    this.columns = this.columns.map(column => this.fillInColumn(column));
  }

  handleSelect(column, row) {
    if (
      column >= this.rowCount ||
      row >= this.rowCount ||
      row < 0 ||
      column < 0
    ) {
      return;
    }

    if (!this.selected) {
      this.selected = [column, row];
    } else {
      if (this.adjacent([column, row], this.selected)) {
        this.swap([column, row], this.selected);
      }
      this.selected = false;
    }
  }

  adjacent(a, b) {
    if (a[0] === b[0]) {
      return differentByOne(a[1], b[1]);
    } else if (a[1] === b[1]) {
      return differentByOne(a[0], b[0]);
    }
    return false;
  }

  pivotCoordinates(coordinates) {
    return [coordinates[1], coordinates[0]];
  }

  checkForExplosions(columns, vertical = false) {
    let lastColor = false;
    let currentMatch = [];
    const matches = [];

    const appendToMatches = match => {
      if (match.length >= MINIMUM_EXPLOSION_SIZE) {
        if (vertical) {
          match = match.map(this.pivotCoordinates);
        }
        matches.push(match);
      }
    };

    columns.map((column, columnIndex) => {
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
  }

  pivot() {
    const pivoted = new Array(this.rowCount)
      .fill(undefined)
      .map(() => new Array(this.rowCount).fill(undefined));
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.rowCount; col++) {
        pivoted[col][row] = this.columns[row][col];
      }
    }
    return pivoted;
  }

  checkHorizontal() {
    this.checkForExplosions(this.columns);
  }

  checkVertical() {
    this.checkForExplosions(this.pivot(), 1);
  }

  resolveAllExplosions() {
    let exploded = false;
    while (this.checkHorizontal().length || this.checkVertical().length) {
      exploded = true;
      this.resolveExplosions(this.checkHorizontal());
      this.resolveExplosions(this.checkVertical());
    }
    return exploded;
  }

  resolveExplosions(explosions) {
    explosions.forEach(explosion => {
      explosion.forEach(explosionSpace => {
        this.columns[explosionSpace[0]][explosionSpace[1]] = false;
      });
    });
    this.fillIn();
  }

  swap(a, b) {
    const tmpA = this.columns[a[0]][a[1]];
    this.columns[a[0]][a[1]] = this.columns[b[0]][b[1]];
    this.columns[b[0]][b[1]] = tmpA;
    if (!this.resolveAllExplosions()) {
      // if nothing exploded, swap back
      this.columns[b[0]][b[1]] = this.columns[a[0]][a[1]];
      this.columns[a[0]][a[1]] = tmpA;
    }
  }

  areNeighbors(a, b) {
    if (a[0] === b[0]) {
      return differentByOne(a[1], b[1]);
    }
    if (a[1] === b[1]) {
      return differentByOne(a[0], b[0]);
    }
    return false;
  }
}

export default Board;
