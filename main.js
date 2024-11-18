// General variables
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const CANVAS_SIZE = 500
canvas.height = CANVAS_SIZE
canvas.width = CANVAS_SIZE


const BLOCK_SIZE = CANVAS_SIZE / 10

// User variables
const startingPosition = Math.floor(Math.random() * 4)

let userX = getStartingPositionCoordinates(startingPosition).x * BLOCK_SIZE
let userY = getStartingPositionCoordinates(startingPosition).y * BLOCK_SIZE


// Random functions 
function getStartingPositionCoordinates (randomNum) {
    switch (randomNum) {
        case 0:
            return { x: 0, y: 0};
        case 1:
            return { x: 9, y: 0};
        case 2:
            return { x: 0, y: 9};
        case 3:
            return { x: 9, y: 9};
    }
}
// Game functions
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawUser () {
    ctx.fillStyle = "#000" 
    ctx.fillRect(userX, userY, BLOCK_SIZE, BLOCK_SIZE)
}




function userEvents () {
    document.addEventListener("keydown", handleKeyDown)
    function handleKeyDown (e) {
        const { key } = e
        switch(key) {
            case "ArrowRight":
                if(userX + BLOCK_SIZE < CANVAS_SIZE) userX += BLOCK_SIZE
                break;
            case "ArrowLeft":
                if(userX > 0)
                userX -= BLOCK_SIZE
                break;
            case "ArrowUp":
                if(userY > 0)
                userY -= BLOCK_SIZE
                break;
            case "ArrowDown":
                if(userY + BLOCK_SIZE < CANVAS_SIZE) 
                userY += BLOCK_SIZE
                break;
        }
    }
}

function draw () {
    clearCanvas()
    drawUser()
    window.requestAnimationFrame(draw)
}

userEvents()
draw()

