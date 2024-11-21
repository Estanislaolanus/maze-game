export default class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = [true, true, true, true];
    this.neighbors = [];
  }
  findNeighbors(grid, ROWS_AND_COLS) {
    // Left
    if(this.x > 0) {
        this.neighbors.push(grid[(this.x - 1) * ROWS_AND_COLS + this.y])
    }
    // Right
    if (this.x < ROWS_AND_COLS - 1) {
      this.neighbors.push(grid[(this.x + 1) * ROWS_AND_COLS + this.y]);
    }
    // Up
    if (this.y > 0) {
      this.neighbors.push(grid[this.x * ROWS_AND_COLS + (this.y - 1)]);

    }
    // // Down
    if(this.y < ROWS_AND_COLS - 1) {
        this.neighbors.push(grid[this.x * ROWS_AND_COLS + (this.y + 1)])
    }
  }
}
