let unitLength  = 10;
let boxColor    = "#969696";
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr;
let userPickedColor;
let parentWidth;
let parentHeight;


let colorPalette = {
    pinkColorPalette: ['#FAE0E4','#F7CAD0','#F9BEC7','#FBB1BD','#FF99AC','#FF85A1','#FF7096','#FF5C8A','#FF477E','#FF0A54'],
    unicornColorPalette : ['#EDABCE','#E1B0D0','#D4B0D3','#CFB1D5','#C9B8DA','#C0BBDC','#AFBDE0','#B1CAE9','#AFD8F4','#B0E3F6'],
    yellowColorPalette :['#FFE15C','#FFD933','#FFD000','#FFC300','#FFB700','#FFAA00','#FFA200','#FF9500','#FF8800','#FF7B00'],
    greenColorPalette :['#80B384','#73AB77','#66A36B','#5C9961','#548C59','#4D8051','#457349','#3D6641','#365939','#2E4D30'],
    blueColorPalette :['#E8F3FE','#CCE4FD','#A4CEFC','#77B6FB','#4B9CF9','#2382F7','#1557C0','#13459C','#13459C','#0F3375'],

}

document.querySelector('.colorPicker').addEventListener('click',function(e){
    if(e.target && e.target.matches('.color')){
        userPickedColor = e.target.id 
    }
})



//user picked box color 
function boxColorTheme(){
    if(userPickedColor === "grey"){
        return boxColor
    }else if(userPickedColor === "pink"){
        return (colorPalette.pinkColorPalette)[Math.floor(Math.random() * 10)]
    }else if(userPickedColor === "unicorn"){
        return (colorPalette.unicornColorPalette)[Math.floor(Math.random() * 10)]
    }else if(userPickedColor === "yellow"){
        return (colorPalette.yellowColorPalette)[Math.floor(Math.random() * 10)]
    }else if(userPickedColor === "green"){
        return (colorPalette.greenColorPalette)[Math.floor(Math.random() * 10)]
    }else if(userPickedColor === "blue"){
        return (colorPalette.blueColorPalette)[Math.floor(Math.random() * 10)]
    }else{
        return boxColor
    }
}


document.querySelector('input[id="speed"]').addEventListener('input',function(e){
    fr = parseInt(e.target.value)
})

document.querySelector('input[id="unitSize"]').addEventListener('input',function(e){
    unitLength = parseInt(e.target.value)
    console.log(unitLength)
    parentWidth = document.querySelector("#games").getBoundingClientRect().width
    parentHeight = document.querySelector("#games").getBoundingClientRect().height
    canvas = createCanvas(floor((parentWidth)/unitLength)*unitLength, floor((windowHeight- 400)/unitLength)*unitLength);
    canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength); 
	rows    = floor(height / unitLength); 
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    
})


function windowResized(){

    parentWidth = document.querySelector("#games").getBoundingClientRect().width
    parentHeight = document.querySelector("#games").getBoundingClientRect().height
    canvas = createCanvas(floor((parentWidth)/unitLength)*unitLength, floor((windowHeight- 400)/unitLength)*unitLength);
    canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength); 
	rows    = floor(height / unitLength);
    loop();
    
}



function setup(){
	/* Set the canvas to be under the element #canvas*/
	parentWidth = document.querySelector("#games").getBoundingClientRect().width
    parentHeight = document.querySelector("#games").getBoundingClientRect().height
    const canvas = createCanvas(floor((parentWidth)/unitLength)*unitLength, floor((windowHeight- 400)/unitLength)*unitLength);
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



// loop over both currentBoard and nextBoard to set all of the boxes' value to 0.
function init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

let drawCount = 0

function draw() {

    background(255); //bg color 255,255,255
    frameRate(fr);
    generate();
    
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
                fill(boxColorTheme());  //if the box has life, then give it a color
            } else {
                fill(255); //if no life, then bg color
            } 
            stroke(strokeColor); //stroke color
            rect(i * unitLength, j * unitLength, unitLength, unitLength); 
			//inbuilt function, x-coordinate of rectangle;y-coordinate of rectangle.;width of rectangle;height of rectangle.
        }
    }
}


//calculates the next generation with current generation.
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





/**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColorTheme());
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

}

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
}



const keyboardMode = {
    currentX: undefined,
    currentY: undefined,
};


let patterns = {
    gliderGun:`........................O...........
	......................O.O...........
	............OO......OO............OO
	...........O...O....OO............OO
	OO........O.....O...OO..............
	OO........O...O.OO....O.O...........
	..........O.....O.......O...........
	...........O...O....................
	............OO......................`,
    flotilla:`....OOOO.......
	...OOOOOO......
	..OO.OOOO......
	...OO..........
	...............
	...........OO..
	.O............O
	O..............
	O.............O
	OOOOOOOOOOOOOO.
	...............
	...............
	....OOOO.......
	...OOOOOO......
	..OO.OOOO......
	...OO..........`,
    snacker:`OO................OO
	.O................O.
	.O.O............O.O.
	..OO............OO..
	.......O....O.......
	.....OO.OOOO.OO.....
	.......O....O.......
	..OO............OO..
	.O.O............O.O.
	.O................O.
	OO................OO`,
    galaxy:`OOOOOO.OO
	OOOOOO.OO
	.......OO
	OO.....OO
	OO.....OO
	OO.....OO
	OO.......
	OO.OOOOOO
	OO.OOOOOO`,
    beaconMaker:`..............OO
	.............O.O
	............O...
	...........O....
	..........O.....
	.........O......
	........O.......
	.......O........
	......O.........
	.....O..........
	....O...........
	...O............
	OOO.............
	..O.............
	..O.............`,
    fireship:`....OO....
	...OOOO...
	..........
	..OOOOOO..
	...OOOO...
	..........
	..OO..OO..
	OO.O..O.OO
	...O..O...
	..........
	..........
	....OO....
	....OO....
	..........
	.O.O..O.O.
	O..O..O..O
	O........O
	O........O
	OO......OO
	..OOOOOO..`,
}

let userSelectedPattern;


document.querySelector('.patterns').addEventListener('click',function(e){
    if(e.target && e.target.matches('.pattern')){
        userSelectedPattern = e.target.id
       
    }
})

function keyPressed(){

    if (key === "Enter") {
        loop();  
    }

    if(key === "p" || key === "P"){
        noLoop();
    }


    if(key === "c"|| key === 'C' ){
        noLoop();

        setTimeout(() => {
      

        if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
            return;
        }

        keyboardMode.currentX = Math.floor(mouseX / unitLength);
        keyboardMode.currentY = Math.floor(mouseY / unitLength);
       
        let pattern;
        let patternArr;

        if(userSelectedPattern === "glider-gun"){
            pattern = patterns.gliderGun
        }else if(userSelectedPattern === "flotilla"){
            pattern = patterns.flotilla
        }else if(userSelectedPattern === "snacker"){
            pattern = patterns.snacker
        }else if(userSelectedPattern === "galaxy"){
            pattern = patterns.galaxy
        }else if(userSelectedPattern === "beacon-marker"){
            pattern = patterns.beaconMaker
        }else if(userSelectedPattern === "fireship"){
            pattern = patterns.fireship
        }

        
        patternArr = pattern.split("\n")
        for(let rowIdx = 0; rowIdx < patternArr.length; rowIdx++){
            for(let colIdx=0; colIdx < patternArr[rowIdx].length; colIdx++){
                let newColumn = (keyboardMode.currentX + colIdx + columns) % columns;
                let newRow = (keyboardMode.currentY + rowIdx + rows) % rows;
                if (patternArr[rowIdx][colIdx] === "O"){
                    currentBoard[newColumn][newRow] = 1;

                }else{
                    currentBoard[newColumn][newRow] = 0;
                }

                if(currentBoard[newColumn][newRow] === 1){
                    fill(boxColorTheme());
                }else{
                    fill(255);
                }
                stroke(strokeColor); 
                rect(newColumn * unitLength, newRow * unitLength, unitLength, unitLength);
            }
        }
        return;
        },500)
    }


    if (key === "x" || key === "X"){

        keyboardMode.currentX = Math.floor(mouseX / unitLength);
        keyboardMode.currentY = Math.floor(mouseY / unitLength);
        noLoop();
    }

    if (key === "ArrowUp") {

        keyboardMode.currentY = (keyboardMode.currentY - 1 + rows)%rows;

      } else if (key === "ArrowRight") {
        keyboardMode.currentX = (keyboardMode.currentX + 1 + columns)%columns;
      }else if (key === "ArrowLeft") {
        keyboardMode.currentX = (keyboardMode.currentX - 1 + columns)%columns;
      }else if (key === "ArrowDown") {
        keyboardMode.currentY = (keyboardMode.currentY + 1+ rows)%rows;
      }
    
      currentBoard[keyboardMode.currentX][keyboardMode.currentY] = 1;
      fill("#7E685A"); //if the box has life, then give it a color
      stroke(strokeColor); //stroke color
      rect(
        keyboardMode.currentX * unitLength,
        keyboardMode.currentY * unitLength,
        unitLength,
        unitLength
      );


}

document.querySelector('.reset')
	.addEventListener('click', function() {
		init();
	});


let keyboardRuleDiv = document.querySelector('.keyboard-control-rules')
let mouseRuleDiv = document.querySelector('.mouse-control-rules')

document.querySelector('#keyboard-control-rules-btn').addEventListener('click',function(e){
    keyboardRuleDiv.classList.add("open-rules");
    mouseRuleDiv.classList.remove("open-rules");
    
})
    
document.querySelector('.close-keyboard-control-rules').addEventListener('click',function(e){
    keyboardRuleDiv.classList.remove("open-rules");
})


document.querySelector('#mouse-control-rules-btn').addEventListener('click',function(e){
    mouseRuleDiv.classList.add("open-rules");
    keyboardRuleDiv.classList.remove("open-rules");
})
    
document.querySelector('.close-mouse-control-rules').addEventListener('click',function(e){
    mouseRuleDiv.classList.remove("open-rules");
})
   