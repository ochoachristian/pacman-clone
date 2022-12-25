const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

//createRect is the game board
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let fps = 30;
let oneBlockSize = 20;
let pacManSize = 20;
//let wallColor = "3420CA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let coinColor = "gold";
let score = 0;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2; 
const DIRECTION_DOWN = 1;  

//1 represents border, 2 represents open slot, 0 out of bounds. refer to map.png for map layout
let map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,1],//middle
    [1,1,1,1,1,2,1,2,1,2,2,2,1,2,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,2,1,1,1,1,1,2,1,2,1,0,0,0,0],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
    [1,1,2,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,2,1,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
};

/**draw coins if map element = 2 */
let drawCoins = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if(map[i][j] == 2) {
                createRect( 
                j * oneBlockSize + oneBlockSize / 3,
                i * oneBlockSize + oneBlockSize /3,
                oneBlockSize / 3,
                oneBlockSize / 3,
                coinColor
                );
            }
        }
    }
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height, "black");
    drawWalls();
    drawCoins();
    pacman.draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

//looping over map declared above
let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) { //if number == 1, i.e its a border, color index darkBlue
                createRect(
                    j * oneBlockSize, 
                    i * oneBlockSize, 
                    oneBlockSize, 
                    oneBlockSize, 
                    "darkBlue"
                    );

                if ( j > 0 && map[i][j - 1] == 1) {

                    createRect(
                        j * oneBlockSize, 
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                        );
                }
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {

                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                //paste
                if ( i > 0 && map[i - 1][j] == 1) {

                    createRect(
                        j * oneBlockSize + wallOffset, 
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                        );
                }
                if (i < map.length - 1 && map[i + 1][j] == 1) {

                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        pacManSize,
        pacManSize,
        pacManSize,
        pacManSize,
        pacManSize / 5
    );
};

createNewPacman();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.key;
    console.log(k)
    
    setTimeout(() => {
        if (k == "ArrowLeft") {
            //left
           // console.log("keyleft!")
            pacman.direction = DIRECTION_LEFT   
            pacman.nextDirection = DIRECTION_LEFT 
        } else if (k == "ArrowUp") {
            //up
            //console.log("keyup!")
            pacman.direction = DIRECTION_UP
            pacman.nextDirection = DIRECTION_UP
        } else if (k == "ArrowRight") {
            //right
            //console.log("keyright!")
            pacman.direction = DIRECTION_RIGHT
            pacman.nextDirection = DIRECTION_RIGHT
        } else if (k == "ArrowDown") {
            //down
            //console.log("keydown!")
            pacman.direction = DIRECTION_DOWN
            pacman.nextDirection = DIRECTION_DOWN
        }
    }, 1);
});