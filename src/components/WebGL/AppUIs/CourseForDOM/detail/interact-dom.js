//create a new pre.
var pre = document.createElement('pre');
pre.innerHTML = `
Teacher: Wong Lok
Student: You!
Course: Creative Coding Course
`;
pre.style.color = '#23e88f';
pre.style.border = 'black solid 1px';
pre.style.width = '300px';
pre.style.height = '300px';
pre.style.textAlign = 'center';

document.body.appendChild(pre);

function getTransform(time){
    return `
        perspective(500px)
        rotateX(${ ((time) % 360 * 10) }deg)
        rotateY(${ ((time) % 360 * 10) }deg)
        rotateZ(${ ((time) % 360 * 10) }deg)
    `;
}

let speed = 15
let timer = 0
var rAF = function () {
  window.requestAnimationFrame(rAF);
  timer += 1 / 1000 * speed;
  pre.style.transform = getTransform(timer);
};
window.requestAnimationFrame(rAF);

document.body.addEventListener('mouseenter', () => {
  speed = 100
})
document.body.addEventListener('mouseleave', () => {
  speed = 15
})