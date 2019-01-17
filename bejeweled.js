const canvas = document.getElementById("bejeweled");
const context = canvas.getContext("2d");

const CUBE_SIZE = 20;
const GRID_SIZE = 500;
const ROW_COUNT = GRID_SIZE / CUBE_SIZE;

const COLORS = ["blue", "green", "orange", "purple", "red", "white", "yellow"];

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

const board = new Array(ROW_COUNT * ROW_COUNT)
  .fill(undefined)
  .map(() => random(COLORS));

const drawBoard = () => {
  board.map((color, index) => {
    drawCube(column(index), row(index), color);
  });
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

const handleClick = e => {
  if (!currentlySelected) {
    const row = Math.floor(e.offsetX / CUBE_SIZE);
    const column = Math.floor(e.offsetY / CUBE_SIZE);
    currentlySelected = [row, column];
    drawOutline(row, column);
  } else {
    const toSwap = [
      Math.floor(e.offsetX / CUBE_SIZE),
      Math.floor(e.offsetY / CUBE_SIZE)
    ];

    if (areNeighbors(currentlySelected, toSwap)) {
      swap(currentlySelected, toSwap);
    }

    currentlySelected = false;
    drawBoard();
  }
};

const swap = (a, b) => {
  const aIndex = a[0] + ROW_COUNT * a[1];
  const bIndex = b[0] + ROW_COUNT * b[1];
  const tmpA = board[aIndex];
  board[aIndex] = board[bIndex];
  board[bIndex] = tmpA;
  drawBoard();
};
canvas.onclick = handleClick;

drawBoard();
