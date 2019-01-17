const canvas = document.getElementById("bejeweled");
const context = canvas.getContext("2d");

const CUBE_SIZE = 20;
const GRID_SIZE = 500;
const ROW_COUNT = GRID_SIZE / CUBE_SIZE;

const COLORS = ["blue", "green", "orange", "purple", "red", "white", "yellow"];
const WHEEL = {
  blue: "green",
  green: "orange",
  orange: "purple",
  purple: "red",
  red: "white",
  white: "yellow",
  yellow: "blue"
};

const drawCube = (row, column, color) => {
  context.fillStyle = color;
  const originX = row * CUBE_SIZE;
  const originY = column * CUBE_SIZE;
  context.fillRect(originX, originY, CUBE_SIZE, CUBE_SIZE);
};

const drawOutline = (row, column) => {
  const originX = row * CUBE_SIZE;
  const originY = column * CUBE_SIZE;
  context.strokeRect(originX, originY, CUBE_SIZE, CUBE_SIZE);
};

const row = index => Math.floor(index / ROW_COUNT);
const column = index => index % ROW_COUNT;

const random = coll => coll[Math.floor(Math.random() * coll.length)];

const VerticalBoard = board => ({
  *[Symbol.iterator]() {
    let row = 0;
    let column = -1;
    let i = 0;

    while (i < board.length) {
      if (row % ROW_COUNT === 0) {
        column += 1;
        row = 0;
      }

      yield board[row * ROW_COUNT + column];

      row++;
      i++;
    }
  }
});

const verticalToHorizontal = index =>
  ROW_COUNT * (index % ROW_COUNT) + Math.floor(index / ROW_COUNT);

const checkForExplosions = board => {
  let lastColor = false;
  let colorStreak = 0;
  const matches = [];

  const appendToMatches = (colorStreak, index) => {
    if (colorStreak === 3) {
      matches.push(index - 3);
    } else if (colorStreak === 4) {
      matches.push(index - 4);
    } else if (colorStreak === 5) {
      matches.push(index - 5);
    }
  };

  board.map((color, index) => {
    if (index % ROW_COUNT === 0) {
      appendToMatches(colorStreak, index);
      colorStreak = 1;
      lastColor = color;
      return;
    }
    if (color === lastColor) {
      colorStreak += 1;
    } else {
      appendToMatches(colorStreak, index);
      colorStreak = 1;
      lastColor = color;
    }
  });

  return matches;
};

const createBoard = () => {
  const board = new Array(ROW_COUNT * ROW_COUNT)
    .fill(undefined)
    .map(() => random(COLORS));
  while (
    checkForExplosions(board).length ||
    checkForExplosions(Array.from(VerticalBoard(board))).length
  ) {
    checkForExplosions(board).map(space => {
      board[space] = WHEEL[board[space]];
    });
    checkForExplosions(Array.from(VerticalBoard(board))).map(space => {
      board[verticalToHorizontal(space)] =
        WHEEL[board[verticalToHorizontal(space)]];
    });
  }

  return board;
};

const board = createBoard();

const drawBoard = () => {
  board.map((color, index) => {
    drawCube(column(index), row(index), color);
  });
  if (currentlySelected) {
    drawOutline(currentlySelected[0], currentlySelected[1]);
  }
  window.requestAnimationFrame(drawBoard);
};

let currentlySelected = false;

const areNeighbors = (a, b) => {
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

const swap = (a, b) => {
  const aIndex = a[0] + ROW_COUNT * a[1];
  const bIndex = b[0] + ROW_COUNT * b[1];
  const tmpA = board[aIndex];
  board[aIndex] = board[bIndex];
  board[bIndex] = tmpA;
  console.log(checkForExplosions(board));
  console.log(checkForExplosions(Array.from(VerticalBoard(board))));
};

const handleClick = e => {
  if (!currentlySelected) {
    const row = Math.floor(e.offsetX / CUBE_SIZE);
    const column = Math.floor(e.offsetY / CUBE_SIZE);
    currentlySelected = [row, column];
  } else {
    const toSwap = [
      Math.floor(e.offsetX / CUBE_SIZE),
      Math.floor(e.offsetY / CUBE_SIZE)
    ];

    if (areNeighbors(currentlySelected, toSwap)) {
      swap(currentlySelected, toSwap);
    }

    currentlySelected = false;
  }
};

canvas.onclick = handleClick;

window.requestAnimationFrame(drawBoard);
