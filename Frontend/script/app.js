// element.requeestFullscreen()
// JavaScript

let head;

var position_x = 0
var position_y = 0

function preload() {
    // head = loadModel('img/thanos.obj');    
    head = loadModel('img/FemaleHead.obj');    
}

var sketchWidth;
var sketchHeight;
var size_head
var movement_down 

function setup() {
  // createCanvas(500, 500, WEBGL);?
  sketchWidth = document.getElementById("js-head").offsetWidth;
  sketchHeight = document.getElementById("js-head").offsetHeight;
  if(sketchWidth > sketchHeight){
    size_head = sketchHeight / 30
    movement_down = sketchHeight / 3.4
  }
  
  if(sketchWidth < sketchHeight){
    size_head = sketchWidth / 30
    movement_down = sketchHeight / 5
  }
  // console.log(sketchWidth)
  // console.log(sketchHeight)
  // console.log(size_head)
  var renderer = createCanvas(sketchWidth, sketchHeight, WEBGL);
  renderer.parent("js-head");
  
}


function draw() {
  // ambientLight(255,0,0);   
  pointLight(255,255,255,10,-100,150);   
  background('#222');
    
    // box(25);
    
    rectMode(CENTER);
    translate(0,movement_down);
    scale(size_head); // Scaled to make model fit into canvas
    // scale(20); // Scaled to make model fit into canvas
    rotateX(1.40);
    rotateX(position_x)
    rotateY(position_y);
    rotateZ(- position_y)
    
    
    // rotateZ(3.15)
    
    // ambientLight(255,0,0);
    // ambientMaterial(255, 102, 94);
    // ambientLight(255, 255, 255); 
    // ambientMaterial(255, 255, 255); 
    
    noStroke();
    ambientMaterial(255,255,255); 
    // ambientLight(100);
    // normalMaterial(); // For effect
    model(head);
}


let getAPI = async () => {
    
};


document.addEventListener('DOMContentLoaded', function() {
    // document.documentElement.webkitRequestFullScreen();
    var joy = new JoyStick('joyDiv');
    var joy2 = new JoyStick('joyDiv2');

    var prevX1 = -1;
    var prevY1 = -1;
    var prevX2 = -1;
    var prevY2 = -1;

    setInterval(function(){ 
      var joy_X = joy.GetX(); 
      var joy_Y = joy.GetY();
      if(joy_X != prevX1 || joy_Y != prevY1) {
        console.log("Joy1 = X " + joy_X + " | Y " + joy_Y)
        
        if (joy_Y < 0 && position_x > -0.25){
          position_x += joy_Y * 0.001;
        }
        if (joy_Y > 0 && position_x < 0.35){
          position_x += joy_Y * 0.001;
        }
        
        if (joy_X < 0 && position_y > -0.25){
          position_y += joy_X * 0.001;
        }
        if (joy_X > 0 && position_y < 0.25){
          position_y += joy_X * 0.001;
        }
        // position_x += joy_Y * 0.001;
        // console.log(position_x)
        // console.log(position_y)
        // position_y += joy_X * 0.001;
        redraw()
      }

      var joy2_X = joy2.GetX(); 
      var joy2_Y = joy2.GetY();
      if(joy2_X != prevX2 || joy2_Y != prevY2) {
        console.log("Joy2 = X " + joy2_X + " | Y " + joy2_Y)
      }

      prevX1 = joy_X;
      prevY1 = joy_Y;
      prevX2 = joy2_X;
      prevY2 = joy2_Y;
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


    // const btnfull =  document.querySelector(".js-button-full")
    // btnfull.addEventListener("click",function(){
    //     let elem = document.documentElement;
    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //       } else if (elem.mozRequestFullScreen) { /* Firefox */
    //         elem.mozRequestFullScreen();
    //       } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //         elem.webkitRequestFullscreen();
    //       } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //         elem.msRequestFullscreen();
    //       }
        
    //     // document.documentElement.webkitRequestFullScreen();
    //     screen.orientation.lock('landscape');
    // })  
    
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
    
});