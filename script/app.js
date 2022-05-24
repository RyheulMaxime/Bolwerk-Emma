// element.requeestFullscreen()
// JavaScript

let head;

var position_x = 0
var position_y = 0

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
    scale(7); // Scaled to make model fit into canvas
    rotateX(1.40);
    rotateX(position_x)
    rotateY(position_y);
    normalMaterial(); // For effect
    model(head);
}



let getAPI = async () => {


    
};




document.addEventListener('DOMContentLoaded', function() {
    // document.documentElement.webkitRequestFullScreen();
    var joy = new JoyStick('joyDiv');
    var joy2 = new JoyStick('joyDiv2');

    setInterval(function(){ 
      var joy2_X = joy2.GetX(); 
      if (joy2_X >= 10 || joy2_X <= -10){
        console.log("X " +joy2_X)
      }
    }, 100);
    
    setInterval(function(){ 
      var joy2_Y = joy2.GetY(); 
      if (joy2_Y >= 10 || joy2_Y <= -10){
        console.log("Y "+ joy2_Y)
      }
    }, 100);
    
    setInterval(function(){ 
      var joy_X = joy.GetX(); 
      if (joy_X >= 10 || joy_X <= -10){
        console.log("X " + joy_X)
      }
    }, 100);
    
    setInterval(function(){ 
      var joy_Y = joy.GetY(); 
      if (joy_Y >= 10 || joy_Y <= -10){
        console.log("Y "+joy_Y)
      }
    }, 100);

    var btn_wink_left = document.querySelector(".js-wink-left")
    var btn_wink_right = document.querySelector(".js-wink-right")

    btn_wink_left.addEventListener("click", function() {
      if (btn_wink_left.classList.contains("active")) {
        btn_wink_left.classList.remove("active");
      } else btn_wink_left.classList.add("active");
    }); 
    
    btn_wink_right.addEventListener("click", function() {
      if (btn_wink_right.classList.contains("active")) {
        btn_wink_right.classList.remove("active");
      } else btn_wink_right.classList.add("active");
    }); 
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./serviceWorker.js')
        .then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
    }

})

