let canvas, ctx, ticker = 0;
let setup = () => {
  canvas = document.createElement('canvas')
  canvas.width = 350
  canvas.height = 350
  ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)
}
let tick = () => {
  ctx.fillStyle = `rgba(${(ticker) % 255},100,${(ticker) % 255},1.0)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

setup()

var rAF = function(){
  window.requestAnimationFrame(rAF);
  tick(ticker);
  ticker += 1
};
window.requestAnimationFrame(rAF);