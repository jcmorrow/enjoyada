const COLORS = ["blue", "green", "orange", "purple", "red", "white", "yellow"];
const CUBE_SIZE = 50;

class CanvasRenderer {
  constructor(board) {
    this.board = board;
    this.canvas = document.getElementById("bejeweled");
    this.context = this.canvas.getContext("2d");

    this.drawCube = (column, row, color) => {
      this.context.save();
      this.context.fillStyle = color || "black";
      const originX = row * CUBE_SIZE;
      const originY = column * CUBE_SIZE;
      this.context.translate(originX, originY);
      this.context.rotate((Math.PI / 180) * 45);
      this.context.fillRect(
        0.5 * CUBE_SIZE,
        -0.5 * CUBE_SIZE,
        0.6 * CUBE_SIZE,
        0.6 * CUBE_SIZE
      );
      this.context.restore();
    };

    this.drawOutline = (column, row) => {
      this.context.save();
      this.context.fillStyle = "black";
      const originX = row * CUBE_SIZE;
      const originY = column * CUBE_SIZE;
      this.context.translate(originX, originY);
      this.context.rotate((Math.PI / 180) * 45);
      this.context.strokeRect(
        0.5 * CUBE_SIZE,
        -0.5 * CUBE_SIZE,
        0.6 * CUBE_SIZE,
        0.6 * CUBE_SIZE
      );
      this.context.restore();
    };

    this.drawBoard = () => {
      this.context.clearRect(0, 0, 500, 500);
      this.board.spaces.map((column, columnIndex) => {
        column.map((row, rowIndex) => {
          this.drawCube(rowIndex, columnIndex, COLORS[row]);
        });
      });
      if (this.board.selected) {
        this.drawOutline(this.board.selected[1], this.board.selected[0]);
      }
      window.requestAnimationFrame(this.drawBoard);
    };

    this.handleClick = e => {
      const rowIndex = Math.floor(e.offsetX / CUBE_SIZE);
      const columnIndex = Math.floor(e.offsetY / CUBE_SIZE);

      board.handleSelect(rowIndex, columnIndex);
    };

    this.canvas.onclick = this.handleClick;

    window.requestAnimationFrame(this.drawBoard);
  }
}

export default CanvasRenderer;
