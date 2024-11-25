import Maze from "./Maze.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.querySelector("#startBtn")
const startDiv = document.querySelector(".startBtn")
const restartBtn = document.querySelector("#restartBtn")
const dropdown = document.querySelector("#dropdown")
const select = dropdown.querySelector(".select ")
const caret = dropdown.querySelector(".caret ")
const menu = dropdown.querySelector(".menu ")
const options = dropdown.querySelectorAll(".menu li")
const selected = dropdown.querySelector(".selected")
const restartScreen = document.querySelector(".restartScreen")
let difficultyText = "Easy"

let startGame = false;
const DIFFICULTY = {
  easy: 10,
  medium: 15,
  hard: 25,
  veryHard: 40,
  impossible: 50,
};
const CANVAS_SIZE = 500;

canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;

// Maze variables
let rowsAndCols = DIFFICULTY.easy;
let blockSize = CANVAS_SIZE / rowsAndCols;
let maze = new Maze(rowsAndCols);

// User variables
let userX 
let userY

// End cell variables
let targetX
let targetY 

// Start Game
startBtn.addEventListener("click", () => {
  resetCoordinates()
  startGame = true
  startDiv.classList.add("hidden")
  caret.classList.add("hidden")
  selected.innerText = difficultyText
  draw()
})

// Restart Game
restartBtn.addEventListener("click", () => {
  startDiv.classList.remove("hidden")
  caret.classList.remove("hidden")
  restartScreen.classList.add("hidden")
  selected.innerText = "Choose Difficulty"
})

// Dropdown
document.addEventListener("click", (e) => {
  const isClickInside = dropdown.contains(e.target)
  if (!isClickInside && dropdown.classList.contains("dropdown")) {
    menu.classList.remove("menu-open")
    caret.classList.remove("caret-rotate")
  }
})
select.addEventListener("click", () => {
  if(startGame) return
  select.classList.toggle("select-clicked");
  caret.classList.toggle("caret-rotate");
  menu.classList.toggle("menu-open");
});

options.forEach((option) => {
  option.addEventListener("click", (e) => {
    switch (e.target.getAttribute("data-difficulty")) {
      case "easy":
        rowsAndCols = DIFFICULTY.easy
        break;
      case "medium":
        rowsAndCols = DIFFICULTY.medium;
        difficultyText = "Medium"
        break;
      case "hard":
        rowsAndCols = DIFFICULTY.hard;
        difficultyText = "Hard"
        break;
      case "veryHard":
        rowsAndCols = DIFFICULTY.veryHard;
        difficultyText = "Very Hard"
        break;
      case "impossible":
        rowsAndCols = DIFFICULTY.impossible;
        difficultyText = "Impossible"
        break;
    }
    // Reset game variables
    blockSize = CANVAS_SIZE / rowsAndCols
    maze = new Maze(rowsAndCols)
    // Ui
    selected.innerText = option.innerText;
    select.classList.remove("select-clicked");
    caret.classList.remove("caret-rotate");
    menu.classList.remove("menu-open");
    options.forEach((option) => {
      option.classList.remove("active");
    })
    option.classList.add("active");
    // Game preview
    if(!startGame) {
      maze.generateGrid()
      draw()
    }
  })
})


function getStartingPositionCoordinates(randomNum) {
  const lastCoordinate = rowsAndCols - 1
  switch (randomNum) {
    case 0:
      return { x: 0, y: 0 }
    case 1:
      return { x: lastCoordinate, y: 0 }
    case 2:
      return { x: 0, y: lastCoordinate }
    case 3:
      return { x: lastCoordinate, y: lastCoordinate }
  }
}
function resetCoordinates () {
    const random = getStartingPositionCoordinates(Math.floor(Math.random() * 4))
    userX = random.x * blockSize
    userY = random.y * blockSize
    targetX = random.x === 0 ? (rowsAndCols - 1) * blockSize : 0
    targetY = random.y === 0 ? (rowsAndCols - 1) * blockSize : 0
}
// Game functions
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawGrid() {
  for (let i = 0; i < rowsAndCols; i++) {
    for (let j = 0; j < rowsAndCols; j++) {
      const x = i * blockSize
      const y = j * blockSize
      const current = maze.GRID[i * rowsAndCols + j]
      ctx.strokeStyle = "#313"
      ctx.lineWidth = 2
      ctx.beginPath()

      // Top side
      if (current.walls[0]) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + blockSize, y)
      }

      // Left side
      if (current.walls[3]) {
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + blockSize)
      }

      // Right side
      if (current.walls[1]) {
        ctx.moveTo(x + blockSize, y)
        ctx.lineTo(x + blockSize, y + blockSize)
      }

      // Bottom side
      if (current.walls[2]) {
        ctx.moveTo(x, y + blockSize)
        ctx.lineTo(x + blockSize, y + blockSize)
      }

      ctx.stroke()
    }
  }
}

function drawUser() {
  const x = userX + blockSize * 0.15
  const y = userY + blockSize * 0.15
  const heightAndWidth = blockSize - blockSize * 0.3
  ctx.fillStyle = "#034078"
  ctx.fillRect(x, y, heightAndWidth, heightAndWidth)
}

function drawFinishCell() {
  ctx.fillStyle = "#f33f3f90"
  ctx.fillRect(targetX, targetY, blockSize, blockSize)
}

function userEvents() {
  document.addEventListener("keydown", handleKeyDown)
  function handleKeyDown(e) {
    const x = Math.round(userX / blockSize)
    const y = Math.round(userY / blockSize)
    const { walls } = maze.GRID[x * rowsAndCols + y]
    const { key } = e
    switch (key) {
      case "ArrowRight":
        if (userX + blockSize < CANVAS_SIZE && !walls[1]) {
          userX += blockSize;
        }
        break;
      case "ArrowLeft":
        if (userX > 0 && !walls[3]) {
          userX -= blockSize
        }
        break;
      case "ArrowUp":
        if (userY > 0 && !walls[0]) userY -= blockSize;
        break;
      case "ArrowDown":
        if (userY + blockSize < CANVAS_SIZE && !walls[2]) userY += blockSize;
        break;
    }
  }
}
function gameOver() {
  const isXMatching = Math.round(userX) === Math.round(targetX)
  const isYMatching = Math.round(userY) === Math.round(targetY)
  if( isXMatching && isYMatching) {
    startGame = false
    restartScreen.classList.remove("hidden")
  }
}
function draw() {
  clearCanvas();
  drawGrid();
  if(startGame) {
    drawUser();
    drawFinishCell();
    gameOver()
    window.requestAnimationFrame(draw);
  }
}

//Preview game
if(!startGame) {
  maze.generateGrid()
  draw()
} 
userEvents();