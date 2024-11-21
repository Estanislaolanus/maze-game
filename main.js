import Cell from "./Cell.js";

// General variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_SIZE = 500;
canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;

const ROWS_AND_COLS = 10;

const BLOCK_SIZE = CANVAS_SIZE / ROWS_AND_COLS;
// Grid
const GRID = []


function generateGrid () {
  
  for (let i = 0; i < ROWS_AND_COLS; i++) {
    for (let j = 0; j < ROWS_AND_COLS; j++) {
      GRID.push(new Cell(i, j))
    }
  }
  for (let i = 0; i < ROWS_AND_COLS; i++) {
    for (let j = 0; j < ROWS_AND_COLS; j++) {
      GRID[i * ROWS_AND_COLS + j].findNeighbors(GRID, ROWS_AND_COLS)
    }
  }
  mazeGenerator(GRID[0], [])
}
function mazeGenerator (current, stack) {
  if(!current?.visited) {
    current.visited = true
    stack.push(current)
  }
  
  let unvisited = []
  for(let neighbor of current.neighbors) {
    if(!neighbor.visited) {
      unvisited.push(neighbor)
    }
  }

  if(unvisited.length > 0) {
    let random = Math.floor(Math.random() * unvisited.length)
    let next = unvisited[random]

    let x = current.x - next.x
    let y = current.y - next.y 

    // Set top and bottom walls
    if (y === 1) {
      current.walls[0] = false
      next.walls[2] = false
    } else if (y === -1) {
      current.walls[2] = false
      next.walls[0] = false
    }

    // Set right and left
    
    if (x === 1) {
      current.walls[3] = false
      next.walls[1] = false
    } else if (x === -1) {
      current.walls[1] = false
      next.walls[3] = false
    }
    mazeGenerator(next, stack)
  } else if(stack.length > 0) {
    let previous = stack.pop()
    mazeGenerator(previous, stack)
  } 

}
function drawGrid() {
  for (let i = 0; i < ROWS_AND_COLS; i++) {
    for (let j = 0; j < ROWS_AND_COLS; j++) {
      const x = i * BLOCK_SIZE;
      const y = j * BLOCK_SIZE;
      const current = GRID[i * ROWS_AND_COLS + j]
      ctx.strokeStyle = "#313";
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Top side
      if(current.walls[0]) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + BLOCK_SIZE, y);

      }

      // Left side
      if(current.walls[3]) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + BLOCK_SIZE);
      }

      // Right side
      if (current.walls[1]) {
        ctx.moveTo(x + BLOCK_SIZE, y)
        ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE)
        
      }

      // Bottom side
      if(current.walls[2]) {
        ctx.moveTo(x, y + BLOCK_SIZE)
        ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE)
      }

      ctx.stroke();
    }
  }
}

// User variables
const startingPosition = Math.floor(Math.random() * 4);

let userX = getStartingPositionCoordinates(startingPosition).x * BLOCK_SIZE;
let userY = getStartingPositionCoordinates(startingPosition).y * BLOCK_SIZE;

// Random functions
function getStartingPositionCoordinates(randomNum) {
  switch (randomNum) {
    case 0:
      return { x: 0, y: 0 };
    case 1:
      return { x: 9, y: 0 };
    case 2:
      return { x: 0, y: 9 };
    case 3:
      return { x: 9, y: 9 };
  }
}
// Game functions
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawUser() {
  ctx.fillStyle = "#000";
  ctx.fillRect(userX + 5, userY + 5, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
}


function userEvents() {
  document.addEventListener("keydown", handleKeyDown);
  function handleKeyDown(e) {
    const x = userX / BLOCK_SIZE
    const y = userY / BLOCK_SIZE
    const { walls } = GRID[x * ROWS_AND_COLS + y]
    const { key } = e;
    switch (key) {
      case "ArrowRight":
        if (userX + BLOCK_SIZE < CANVAS_SIZE && !walls[1]) userX += BLOCK_SIZE;
        break;
      case "ArrowLeft":
        if (userX > 0 && !walls[3]) userX -= BLOCK_SIZE;
        break;
      case "ArrowUp":
        if (userY > 0 && !walls[0]) userY -= BLOCK_SIZE;
        break;
      case "ArrowDown":
        if (userY + BLOCK_SIZE < CANVAS_SIZE && !walls[2]) userY += BLOCK_SIZE;
        break;
    }
  }
}

function draw() {
  clearCanvas()
  drawGrid()

  drawUser()

  window.requestAnimationFrame(draw)
}

generateGrid()
userEvents()
draw()
