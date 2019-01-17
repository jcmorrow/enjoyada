import CanvasRenderer from "./canvas-renderer";
import Board from "./board";

const CUBE_SIZE = 50;
const GRID_SIZE = 400;
const ROW_COUNT = GRID_SIZE / CUBE_SIZE;

new CanvasRenderer(new Board(ROW_COUNT));
