import Cell from "./Cell.js";
export default class Maze {
  constructor(rowsAndCols) {
    this.GRID = [];
    this.rowsAndCols = rowsAndCols;
  }

  generateGrid() {
    for (let i = 0; i < this.rowsAndCols; i++) {
      for (let j = 0; j < this.rowsAndCols; j++) {
        this.GRID.push(new Cell(i, j));
      }
    }
    for (let i = 0; i < this.rowsAndCols; i++) {
      for (let j = 0; j < this.rowsAndCols; j++) {
        this.GRID[i * this.rowsAndCols + j].findNeighbors(this.GRID, this.rowsAndCols);
      }
    }
    this.mazeGenerator(this.GRID[0], []);
  }

  mazeGenerator(current, stack) {
    if (!current?.visited) {
      current.visited = true;
      stack.push(current);
    }

    let unvisited = [];
    for (let neighbor of current.neighbors) {
      if (!neighbor.visited) {
        unvisited.push(neighbor);
      }
    }

    if (unvisited.length > 0) {
      let random = Math.floor(Math.random() * unvisited.length);
      let next = unvisited[random];

      let x = current.x - next.x;
      let y = current.y - next.y;

      // Set right and left walls
      if (x === 1) {
        current.walls[3] = false;
        next.walls[1] = false;
      } else if (x === -1) {
        current.walls[1] = false;
        next.walls[3] = false;
      }

      // Set top and bottom walls
      if (y === 1) {
        current.walls[0] = false;
        next.walls[2] = false;
      } else if (y === -1) {
        current.walls[2] = false;
        next.walls[0] = false;
      }

      this.mazeGenerator(next, stack);
    } else if (stack.length > 0) {
      let previous = stack.pop();
      this.mazeGenerator(previous, stack);
    }
  }
}
