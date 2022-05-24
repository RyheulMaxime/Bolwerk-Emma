let head;

function preload() {
    head = loadModel('img/FemaleHead.obj');    
}

var sketchWidth;
var sketchHeight;

function setup() {
    // createCanvas(500, 500, WEBGL);?
    sketchWidth = document.getElementById("js-head").offsetWidth;
    sketchHeight = document.getElementById("js-head").offsetHeight;
    let renderer = createCanvas(sketchWidth, sketchHeight, WEBGL);
    renderer.parent("js-head");
}


function draw() {
    background(200);
    // rectMode(CENTER);
    translate(0,60);
    scale(10); // Scaled to make model fit into canvas
    rotateX(1.40);
    // rotateY(frameCount * 0.01);
    normalMaterial(); // For effect
    model(head);
}