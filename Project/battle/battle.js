let dragCount = 0
const unitLength  = 20;
let boxColor = "#e44545";
let gameStart = false;
let playerOneScore;
let playerTwoScore;
let round = 2;
let playTimer;
let generateTimer;
let parentWidth;
let parentHeight


document.querySelector('input[type="color"]').addEventListener('input',function(e){
    boxColor = e.target.value
    dragCount = 0
});




const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;

function windowResized(){
    setup();

}

function setup(){
	/* Set the canvas to be under the element #canvas*/
	parentWidth = document.querySelector("#games").getBoundingClientRect().width
    parentHeight = document.querySelector("#games").getBoundingClientRect().height
    const canvas = createCanvas(floor((parentWidth-10)/20)*20, floor((windowHeight- 350 - 10)/20)*20);
    canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength); 
	rows    = floor(height / unitLength); 
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];
	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	// Now both currentBoard and nextBoard are array of array of undefined values.
	init();  // Set the initial values of the currentBoard and nextBoard

}



//loop over both currentBoard and nextBoard to set all of the boxes' value to 0.
function init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

function draw() {

    background(255); //bg color 255,255,255
    generate();
    frameRate(2);
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
 
                fill(boxColor) //if the box has life, then give it a color
            } else {
                fill(255); //if no life, then bg color
            } 
            stroke(strokeColor); //stroke color
            rect(i * unitLength, j * unitLength, unitLength, unitLength); 
			//inbuilt function, x-coordinate of rectangle;y-coordinate of rectangle.;width of rectangle;height of rectangle.

        }
    }
}


//key logic - calculates the next generation with current generation.
function generate() {
    
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
					
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
					
                }
            }


            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }


    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


//Mouse Interaction
/**
 * When mouse is dragged
 */
function mouseDragged() {
    if (!gameStart) return;
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    if(hexToRgb(boxColor)[0]+ dragCount > 255 || hexToRgb(boxColor)[1]+ dragCount > 255 || hexToRgb(boxColor)[2]+ dragCount > 255 ){
        dragCount = 0
        fill(hexToRgb(boxColor)[0] - dragCount,hexToRgb(boxColor)[1] - dragCount,hexToRgb(boxColor)[2]-  dragCount);
    }else{
        fill(hexToRgb(boxColor)[0]+ dragCount,hexToRgb(boxColor)[1]+ dragCount,hexToRgb(boxColor)[2]+ dragCount);
    }
    
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
    dragCount ++
}

/**
 * When mouse is pressed
 */

function mousePressed() {
    if (!gameStart) return;
    noLoop();
    mouseDragged();
}


/**
 * When mouse is released
 */
function mouseReleased() {
    if (!gameStart)return;
    
    loop();
}



/**
 * Start Game
 */
document.querySelector('#start-game').addEventListener('click',function(e){
    round -= 1
    if(round < 0){
        alert("Game End. Please click Reset Game button to start a new round")
    }else{

    init();
    draw();

    if (playTimer){
        clearInterval(playTimer)
        clearInterval(generateTimer)
    }

    gameStart = true;
    var playTimeLeft = 10;
    var generateTimeLeft = 10;

    playTimer = setInterval(function(){
        if(playTimeLeft <= 0){
            clearInterval(playTimer);
            document.querySelector(".time").innerHTML = "TimesUp"
            gameStart = false;
            //set 2nd timer for cell generating
            generateTimer = setInterval(function(){

                if(generateTimeLeft <= 0){
                    clearInterval(generateTimer);
                    noLoop();
                    document.querySelector(".time").innerHTML = "TimesUp"
                    if(round % 2 !=0){
                        playerOneScore = calculateScore();
                        document.querySelector(".player-one-score").innerHTML = "Score: " +  playerOneScore
                        
                    }else{
                        playerTwoScore = calculateScore();
                        document.querySelector(".player-one-score").innerHTML = "Score: " +  playerOneScore
                        document.querySelector(".player-two-score").innerHTML = "Score: " +  playerTwoScore
                        declareWinner()
                    }
                    
                }else{
                    loop()
                    generateTimeLeft -= 1;
                    document.querySelector(".time").innerHTML = "Start Generating Pattern for " + generateTimeLeft + " seconds"
                }
                                
            },1000)

        }else{
            document.querySelector(".time").innerHTML = playTimeLeft + " seconds remaining";
            playTimeLeft -= 1;
        }
        
    }, 1000);

}});



/**
 * Reset Game
 */
document.querySelector('#reset-game').addEventListener('click', function() {
		init(); //assign 0 value to all cell
        draw(); //re-color all the dead cell white
        playerOneScore;
        playerTwoScore;
        round = 2
        boxColor = "#e44545"
        document.querySelector('input[type="color"]').value="#e44545"
        dragCount = 0
        document.querySelector(".player-one-score").innerHTML = "Score: 0"
        document.querySelector(".player-two-score").innerHTML = "Score: 0"
        document.querySelector(".time").innerHTML = "Times: 10s"
        document.querySelector(".winner").innerHTML = ""

        if (playTimer){
            clearInterval(playTimer)
            clearInterval(generateTimer)
        }
});


/**
 * HEX to RGB Function
 */
let hexToRgbArry = []
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r =  parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    hexToRgbArry[0] = r
    hexToRgbArry[1] = g
    hexToRgbArry[2] = b

    return  hexToRgbArry

}


function calculateScore(){
    let score = 0;
    for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			score = score + currentBoard[i][j]
		}
	} 

    return score
}


function declareWinner(){
    if(playerOneScore > playerTwoScore){
       document.querySelector(".winner").innerHTML = "Winner is Player 1"
    }else if(playerOneScore < playerTwoScore){
        document.querySelector(".winner").innerHTML = "Winner is Player 2"
    }else{
        document.querySelector(".winner").innerHTML = "Draw"
    }
}


let rulesDiv = document.querySelector('.rules')
let mouseRuleDiv = document.querySelector('.mouse-control-rules')

document.querySelector('#rules-btn').addEventListener('click',function(e){
  rulesDiv.classList.add("open-rules");
  mouseRuleDiv.classList.remove("open-rules");
})

document.querySelector('.close-rules').addEventListener('click',function(e){
    rulesDiv.classList.remove("open-rules");

})


document.querySelector('#mouse-control-rules-btn').addEventListener('click',function(e){
    mouseRuleDiv.classList.add("open-rules");
    rulesDiv.classList.remove("open-rules");
})
    
document.querySelector('.mouse-close').addEventListener('click',function(e){
    mouseRuleDiv.classList.remove("open-rules");

})



