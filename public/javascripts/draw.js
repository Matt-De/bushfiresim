/* draws a square of specified colour (hex code) */
function drawSquare(x, y, colour) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle=colour;
    ctx.fillRect(x, y, 5, 5);
}

function drawGrid(drawOutline=false) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i=0; i<60; i++) {
        for(var j=0; j<60; j++) {
            drawSquare(j*5, i*5, grid[i][j].colour);
        }
    }
    if(drawOutline) { drawGridOutline(); }
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

