/* constants */
// colours (todo: add more colours)
const GREEN = "#3EB606";
const DRY_GRASS = "#DBBB0B";
const BLACK = "#000000"

/* global variables */
var grid = [];   // stores the grid of cell objects
// wind values for each direction
var nWind;  
var sWind;
var eWind;
var wWind;
var neWind;
var nwWind;
var swWind;
var seWind;

/* cell objects used inside the grid */
function Cell(combustibility, elevation, colour) {
    this.combustibility = combustibility;
    this.elevation = elevation;
    this.colour = colour;
    this.state = 0; // how burnt the cell is at time t
}

/* define grid model for simulation */
function buildGrid() {
    for(var i=0; i<60; i++) {
        grid.push([]);
        for(var j=0; j<60; j++) {
            grid[i].push(new Cell(1, 0, GREEN));
        }
    }
}

/* draws a square of specified colour (hex code) */
function drawSquare(x, y, colour) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle=colour;
    ctx.fillRect(x, y, 5, 5);
}

function drawGrid() {
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            drawSquare(j*5, i*5, grid[i][j].colour);
        }
    }
    drawGridOutline();
}

/* draws an outline of a square grid */
function drawGridOutline() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    for (var x = 0.5; x <= 300.5; x += 5) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 300.5);
    } 
    for (var y = 0.5; y <= 300.5; y += 5) {
      ctx.moveTo(0, y);
      ctx.lineTo(300.5, y);
    }
    ctx.stroke();
}

/* updates the simulation */

    
/* running code from here */

// build and fill grid
buildGrid();
drawGrid();
window.setTimeout(updateGrid, 1000);
