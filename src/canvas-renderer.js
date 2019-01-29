import { COLORS } from "./utilities";
const CANVAS_WIDTH = 500;
const CUBE_SIZE = 50;

class CanvasRenderer {
  constructor(board) {
    this.board = board;
    this.canvas = document.getElementById("bejeweled");
    this.context = this.canvas.getContext("2d");

    this.drawCube = this.drawCube.bind(this);
    this.drawBoard = this.drawBoard.bind(this);
    this.drawOutline = this.drawOutline.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.canvas.onclick = this.handleClick;

    window.requestAnimationFrame(this.drawBoard);
  }

  drawCube(column, row, color) {
    this.context.save();
    this.context.fillStyle = color || "black";
    const originX = row * CUBE_SIZE;
    const originY = column * CUBE_SIZE;
    this.context.translate(originX, originY);
    this.context.rotate((Math.PI / 180) * 45);
    this.context.fillRect(
      0.5 * CUBE_SIZE,
      -0.5 * CUBE_SIZE,
      0.5 * CUBE_SIZE,
      0.5 * CUBE_SIZE
    );
    this.context.restore();
  }

  drawOutline(column, row) {
    this.context.save();
    this.context.fillStyle = "black";
    const originX = row * CUBE_SIZE;
    const originY = column * CUBE_SIZE;
    this.context.translate(originX, originY);
    this.context.rotate((Math.PI / 180) * 45);
    this.context.strokeRect(
      0.5 * CUBE_SIZE,
      -0.5 * CUBE_SIZE,
      0.5 * CUBE_SIZE,
      0.5 * CUBE_SIZE
    );
    this.context.restore();
  }

  drawBoard() {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
    this.board.columns.map((column, columnIndex) => {
      column.map((row, rowIndex) => {
        this.drawCube(rowIndex, columnIndex, COLORS[row]);
      });
    });
    if (this.board.selected) {
      this.drawOutline(this.board.selected[1], this.board.selected[0]);
    }
    window.requestAnimationFrame(this.drawBoard);
  }

  handleClick(e) {
    const rowIndex = Math.floor(e.offsetX / CUBE_SIZE);
    const columnIndex = Math.floor(e.offsetY / CUBE_SIZE);

    this.board.handleSelect(rowIndex, columnIndex);
  }
}

export default CanvasRenderer;
