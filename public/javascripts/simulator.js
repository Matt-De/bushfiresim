var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

/* draws a square grid */
function drawGrid() {
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



drawGrid();