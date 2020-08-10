let canvas, ctx, ticker = 0;

let drawLine = (x1, y1, x2, y2, color) => {
  //from: top left
  //to:   bottom right
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.stroke();
};

let setup = () => {
  canvas = document.createElement('canvas')
  canvas.width = 350
  canvas.height = 350
  ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

}


let tick = () => {
  ctx.fillStyle = `white`
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (var i = 0; i < 35; i++) {
    drawLine((ticker + i * 10) % (350), 0, 350, 350, '#3f945d')
  }
  for (var j = 0; j < 35; j++) {
    drawLine(0.0, 0, (ticker + j * 10) % (350), 350, '#2da1d2')
  }
}

setup()

var rAF = function(){
  window.requestAnimationFrame(rAF);
  tick(ticker);
  ticker += 1
};
window.requestAnimationFrame(rAF);