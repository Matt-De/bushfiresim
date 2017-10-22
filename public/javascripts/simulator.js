/* constants */
// colours (todo: add more colours)
const GREEN = "#3EB606";
const DRY_GRASS = "rgb(219, 187, 11)";
const GRASS_MEDIUM = "rgb(210, 204 ,21)";
const GRASS = "rgb(200, 220, 30)";

const BLACK_GREY = "#484242";
const RED = "rgb(255, 0, 0)";

var drawOutline = false;
var speed = 10; // number of simulation seconds per second

// taken from:
// https://graphicdesign.stackexchange.com/questions/83866/generating-a-series-of-colors-between-two-colors
function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) { 
        factor = 0.5; 
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};

function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
        interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
}

// taken from:
// https://stackoverflow.com/questions/41310869/colors-from-rgb-values-in-javascript-array
function rgb(values) {
    return 'rgb(' + values.join(', ') + ')';
}

var transitionColours = interpolateColors(DRY_GRASS, RED, 6);

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
var windSpeed = 20;
var RH = 5;
var temperature = 30;

// grid clamping functions
function c0(i) { if(i>=0) { return i; } else { return 0; } }
function c59(i) { if(i<60) { return i; } else { return 59; } }

/* cell objects used inside the grid */
function Cell(combustibility, elevation, curing) {
    this.curing = 100;
    this.combustibility = combustibility;
    this.elevation = elevation;
    if(this.curing >=50 && this.curing <65) {
        this.colour = GRASS;
    } else if(this.curing >=65 && this.curing <80) {
        this.colour = GRASS_MEDIUM;
    } else {
        this.colour = DRY_GRASS;
    }
    this.state = 0; // how burnt the cell is at time t
    this.nextState = 0;
    this.area = 1;    // cell area
    this.rate = MK34_rate(MK34_GFDI(this.curing, temperature, RH, windSpeed)); // kmph
    this.timeTillBurned = (this.area/this.rate)*60*60;  // in seconds
    this.currentBurnTime = 0;
}

/* define grid model for simulation */
function buildGrid() {
    for(var i=0; i<60; i++) {
        grid.push([]);
        for(var j=0; j<60; j++) {
            grid[i].push(new Cell(1, 0, Math.floor(Math.random()*(100-50))+50)); // mostly dead grass
            //console.log(grid[i][j].rate);
            //console.log(grid[i][j].timeRemaining);
        }
    }
}

function updateCell(i, j) {
    if(grid[i][j].state > 0) {  // already alight, just update burn time
        grid[i][j].currentBurnTime += speed;
        grid[i][j].nextState = grid[i][j].currentBurnTime / grid[i][j].timeTillBurned;
        if(grid[i][j].state >= 0.0 && grid[i][j].state < 0.20) {
            grid[i][j].colour = rgb(transitionColours[1]);
        } else if(grid[i][j].state >= 0.20 && grid[i][j].state < 0.40) {
            grid[i][j].colour = rgb(transitionColours[2]);
        } else if(grid[i][j].state >= 0.40 && grid[i][j].state < 0.60) {
            grid[i][j].colour = rgb(transitionColours[3]);
        } else if(grid[i][j].state >= 0.60 && grid[i][j].state < 0.80) {
            grid[i][j].colour = rgb(transitionColours[4]);
        } else if(grid[i][j].state >= 0.80 && grid[i][j].state.state < 1) {
            grid[i][j].colour = RED;
        } else if(grid[i][j].state >= 1){
            grid[i][j].colour = BLACK_GREY;
        }
        //console.log("POS " + i + " " + j + " STATE: " + grid[i][j].state + "\n");
    } else {
        // are any of my neighbours on fire? if so how burnt are they
        // if any immediate neighbour is above 75% i'll catch fire
        // diagonal neighbours need to be 92%
        if((eWind*grid[i][c59(j+1)].state > 0.75) || (wWind*grid[i][c0(j-1)].state > 0.75) 
           || (nWind*grid[c59(i+1)][j].state > 0.75) || (sWind*grid[c0(i-1)][j].state > 0.75)) {
            grid[i][j].nextState = 0.01; // help, i am on fire
        } else if((neWind*grid[c59(i+1)][c59(j+1)].state > 0.92) || (swWind*grid[c0(i-1)][c0(j-1)].state > 0.92) 
           || (nwWind*grid[c59(i+1)][c0(j-1)].state > 0.92) || (seWind*grid[c0(i-1)][c59(j+1)].state > 0.92)) {
            grid[i][j].nextState = 0.01; // help, i am on fire
        }
    }
}

/* updates the simulation */
function updateGrid() {
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            updateCell(i,j);
        }
    }
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            grid[i][j].state = grid[i][j].nextState;
        }
    }
    if(drawOutline) {
        drawGrid(drawOutline);
    } else {
        drawGrid();
    }
    window.setTimeout(updateGrid, 100);
}

function updateRate() {
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            grid[i][j].rate = MK34_rate(MK34_GFDI(grid[i][j].curing, temperature, RH, windSpeed));
            grid[i][j].timeTillBurned = (grid[i][j].area/grid[i][j].rate)*60*60;
            //console.log(grid[i][j].rate);
        }
    }
}

var running = false;

// build and fill grid
buildGrid();
drawGrid();

// returns the coordinates of the mouse on the grid
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(((evt.clientX - rect.left)/3)/5),
      y: Math.floor(((evt.clientY - rect.top)/3)/5)
    };
}

var canvas = document.getElementById('canvas');
canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        if(!running) {
            if(mousePos.x>0 && mousePos.x<=60 && mousePos.y>0 && mousePos.y<=60) {
                console.log(mousePos.x);
                console.log(mousePos.y);
                grid[mousePos.y][mousePos.x].state = 0.01;
                window.setTimeout(updateGrid, 100);
                running = true;
                // disable slider inputs
                $("#humiditySlider").slider("disable");
                $("#tempSlider").slider("disable");
                $("#windSpeedSlider").slider("disable");
            }
        }
}, false);
    
/* running code from here */
// initialise some values
neWind = 1;
nWind = 1;
nwWind = 1;
seWind = 1;
sWind = 1;
swWind = 1;
eWind = 1;
wWind = 1;

function updateWindDir() {
    $("#windDirecionLabel").text("North: " + nWind + "%, South: " + sWind + "%, East: " + eWind + "%, West: " + wWind + "%");
}

function updateHumidity() {
    $("#humiditiLabel").text(RH + "%");
}

function updateWindSpeed() {
    $("#windSpeedLabel").text(windSpeed + "KM/H");
}

function updateTemperature() {
    $("#tempLabel").text(temperature + "°C");
}

function updateSpeed() {
    $("#simulationSpeed").text((10*speed) + " simulation seconds per second");
}

$("#northSouthWindSlider").slider({
	formatter: function(value) {
        if(value==0) {
            nWind = 1;
            sWind = 1;
            updateWindDir();
        } else if(value<0) {
            nWind = Math.floor(1+(Math.abs(value))*100);
            sWind = Math.floor(1-(Math.abs(value))*100); 
            updateWindDir();
        } else {
            nWind = Math.floor(1-(Math.abs(value))*100);
            sWind = Math.floor(1+(Math.abs(value))*100);
            updateWindDir();
        }
	}
});
$("#westEastWindSlider").slider({
	formatter: function(value) {
        if(value==0) {
            wWind = 1;
            eWind = 1;
            updateWindDir();
        } else if(value<0) {
            wWind = Math.floor(1+(Math.abs(value))*100);
            eWind = Math.floor(1-(Math.abs(value))*100);
            updateWindDir();
        } else {
            wWind = Math.floor(1-(Math.abs(value))*100);
            eWind = Math.floor(1+(Math.abs(value))*100);
            updateWindDir();
        }
	}
});
$("#windSpeedSlider").slider({
	formatter: function(value) {
        windSpeed = value;
        updateRate();
        updateWindSpeed();
	}
});

$("#humiditySlider").slider({
	formatter: function(value) {
        RH = value;
        updateRate();
        updateHumidity();
	}
});
$("#tempSlider").slider({
	formatter: function(value) {
        temperature = value;
        updateRate();
        updateTemperature();
	}
});
$("#simulationSpeedSlider").slider({
	formatter: function(value) {
        speed = value;
        updateSpeed();
	}
});

$("#showGridCheck").click(function() {
    if ($("#showGridCheck").is(":checked")) {
        drawOutline = true;
        drawGrid(drawOutline);
    } else {
        drawOutline = false;
        drawGrid();
    }
});
