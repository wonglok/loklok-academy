//create a new pre.
var pre = document.createElement('pre');
pre.innerHTML = `
Teacher: Wong Lok
Student: You!
Course: Creative Coding Course
`;
pre.style.color = '#216bca';
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


var rAF = function(time){
  window.requestAnimationFrame(rAF);
  pre.style.transform = getTransform(time / 1000);
};
window.requestAnimationFrame(rAF);