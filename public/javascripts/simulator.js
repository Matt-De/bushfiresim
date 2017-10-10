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


/* ################################## */
/* ###  FIRE RATE ALGORITHMS HERE ### */
/* ################################## */

/* continuous grass land */

// McArthur Grassland Fire Danger Index Mk3/4
// todo: add detailed comment
function MK34_GFDI(C,T,RH,U) {
    return (2*Math.exp((-23.6)+(5.1*Math.log(C))-(0.0281*T)+(0.663*Math.sqrt(U))));
}

// McArthur headfire rate of spread
// todo: add detailed comment
function MK34_rate(GFDI) { return (0.13*GFDI); }

// Mcarthur Grassland Fire Danger Index Mk5
// takes into account fuel load
function MK5_GFDI(w,C,T,RH,U) {
    // compute moisture content (MC)
    var MC = (((97.7+(4.06*RH))/(T+6))-(0.00854*RH)+(3000/C)-30);
    // compute GFDI depending on MC
    if(MC<18.8) {
        return ((3.35*w)*(exp((-0.0897*MC))+(0.0403*U)));
    } else if(MC>=18.8) {
        return ((0.299*w)*(exp((-1.686*MC))+(0.0403*U))*(30-MC));
    } else {
        // error has occurred
    }
}

// McArthur headfire rate of spread Mk5
// Takes into account fuel load
function MK5_rate(GFDI, w) {
    if((w>=4)&&(w<=6)) {
        // MK5 uses 0.14 to account for differences in observed values from different meters
        return (0.14*GFDI); 
    } else if((w>=0)&&(w<4)) {
        return (0.06*GFDI);
    } else {
        // error has occurred
    }
}

// Cheney et al. rate of spread for undisturbed grass
// todo

/* updates the simulation */
function updateGrid() {
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            grid[i][j].
        }
    }
}
    
/* running code from here */

// build and fill grid
buildGrid();
drawGrid();
window.setTimeout(updateGrid, 1000);
