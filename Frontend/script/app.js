// element.requeestFullscreen()
// JavaScript
let head;

var position_x = 0
var position_y = 0
var sleep_mode = false;

function preload() {
    // head = loadModel('img/thanos.obj');    
    head = loadModel('img/FemaleHead.obj');    
}

var sketchWidth;
var sketchHeight;
var size_head
var movement_down 
var inverted = false;

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
  if (inverted == false) {
    pointLight(200,200,200,20,-250,300);   
    // pointLight(100,0,255,10,-50,100);  // kleur thanos 
    background('#fff');
      
    rectMode(CENTER);
    translate(0,movement_down);
    scale(size_head); // Scaled to make model fit into canvas
    // scale(20); // Scaled to make thanos fit into canvas
    rotateX(1.40);
    rotateX(position_x)
    rotateY(position_y);
    rotateZ(- position_y)    
    // rotateZ(3.15) // rotation thanos
    
    noStroke();
    ambientMaterial(255,255,255); 
    // ambientLight(100);
    // normalMaterial(); // For effect
    model(head);
  }  
  if(inverted == true){
    background('#fff');
    pointLight(200,200,200,20,-250,300);   
    // pointLight(100,0,255,10,-50,100);  // kleur thanos 
    rectMode(CENTER);
    translate(0,movement_down);
    scale(size_head); // Scaled to make model fit into canvas
    // scale(20); // Scaled to make thanos fit into canvas
    rotateX(1.40);
    rotateX(position_x)
    rotateY(position_y);
    rotateZ( position_y)    
    // rotateZ(3)
    rotateZ(3.15) // rotation thanos
    
    noStroke();
    ambientMaterial(255,255,255); 
    // ambientLight(100);
    // normalMaterial(); // For effect
    model(head);
  }
  
}

var speed_wink = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wink(button){ //must be async func
  console.log("wink: " + button)
  button.disabled = true;
  button.classList.add("active")
  await sleep(speed_wink) //wait x seconds
  button.disabled = false;
  button.classList.remove("active")
}

// const init = function(){
  
// }

document.addEventListener('DOMContentLoaded', function() {
    // var joyParam = { "title": "joystick"};
    var joy = new JoyStick('joyDiv');
  
    var prevX1 = -1;
    var prevY1 = -1;
    var prevX2 = -1;
    var prevY2 = -1;

    var speed = 0.0005;
    
    setInterval(function(){ 
      var joy_X = joy.GetX(); 
      var joy_Y = joy.GetY();
      if(inverted == false){
        if(sleep_mode == false){
          if(joy_X != prevX1 || joy_Y != prevY1) {
            console.log("Joy1 = X " + joy_X + " | Y " + joy_Y)
          };
          if (joy_Y < 0 && position_x > -0.25){
            position_x += joy_Y * speed;
          };
          if (joy_Y > 0 && position_x < 0.35){
            position_x += joy_Y * speed;
          };
          if (joy_X < 0 && position_y > -0.25){
            position_y += joy_X * speed;
          };
          if (joy_X > 0 && position_y < 0.25){
            position_y += joy_X * speed;
          };
          redraw();

          prevX1 = joy_X;
          prevY1 = joy_Y;
        };
      }
      if(inverted == true){
        if(sleep_mode == false){
          if(joy_X != prevX1 || joy_Y != prevY1) {
            console.log("Joy1 = X " + joy_X + " | Y " + joy_Y)
          };
          if (joy_Y < 0 && - position_x > -0.25){
            position_x += - joy_Y * speed;
          };
          if (joy_Y > 0 && - position_x < 0.35){
            position_x += - joy_Y * speed;
          };
          if (joy_X < 0 &&  position_y > -0.25){
            position_y +=  joy_X * speed;
          };
          if (joy_X > 0 &&  position_y < 0.25){
            position_y +=  joy_X * speed;
          };
          if(sleep_mode == false){
          redraw();
          };
          prevX1 = joy_X;
          prevY1 = joy_Y;
        };
      };
    }, 100);
    
    var joy2Param = { "title": "joystick2", "autoReturnToCenter": false };
    var joy2 = new JoyStick('joyDiv2',joy2Param);
    setInterval(function(){ 
      var joy2_X = joy2.GetX(); 
      var joy2_Y = joy2.GetY();
      if(inverted == false){
        if(joy2_X != prevX2 || joy2_Y != prevY2) {
          console.log("Joy2 = X " + joy2_X + " | Y " + joy2_Y);
        };
        prevX2 = joy2_X;
        prevY2 = joy2_Y;
      };

      if(inverted == true){
        if(joy2_X != prevX2 || joy2_Y != prevY2) {
          console.log("Joy2 = X " + joy2_X + " | Y " + joy2_Y);
        };
        prevX2 = joy2_X;
        prevY2 = joy2_Y;
      };
    }, 100);

    var btn_wink_left = document.querySelector(".js-wink-left")
    var btn_wink_both = document.querySelector(".js-wink-both")
    var btn_wink_right = document.querySelector(".js-wink-right")

    btn_wink_left.addEventListener("click", function() {
      wink(btn_wink_left)

    }); 
    
    btn_wink_both.addEventListener("click", function() {
      wink(btn_wink_both)
    }); 
    
    btn_wink_right.addEventListener("click", function() {
      wink(btn_wink_right)
    }); 

    var radio_voor = document.querySelector(".js-voor_aanzicht")
    var radio_achter = document.querySelector(".js-achter_aanzicht")
    radio_voor.addEventListener("change", function() {
      if(radio_voor.checked == true){
        inverted = false
      }
      redraw()
    });
    radio_achter.addEventListener("change", function() {
      if(radio_achter.checked == true){
        inverted = true
      }
      redraw()
    });


    var checkbox_settings = document.querySelector(".js-checkbox-settings")
    var body_page = document.querySelector(".js-body")
    checkbox_settings.addEventListener('change', function() {
      // console.log("settings")
      if(this.checked) {
        body_page.classList.add("settings-active")
      } else {
        body_page.classList.remove("settings-active")
      }
    });

    var background_settings = document.querySelector(".js-background")
    background_settings.addEventListener('click', function() {
      body_page.classList.remove("settings-active")
      checkbox_settings.checked = false;
    });
    
    var btn_center = document.querySelector(".js-center-head")
    btn_center.addEventListener('click', function() {
      console.log("center")
      var reset = joy2.reset()
      console.log(reset)
      position_x = 0;
      position_y = 0;
      redraw();
    });
    
    var slider_head = document.querySelector(".js-slider-head")
    slider_head.addEventListener('change', function() {
      // console.log(slider_head.value)
      speed = slider_head.value / 100000;
      console.log(speed);
    });
    
    var input_speed_wink = document.querySelector(".js-snelheid-knipogen")
    input_speed_wink.addEventListener('change', function() {
      // console.log(this.value)
      speed_wink = this.value * 1000;
    });

    var checkbox_sleep = document.querySelector(".js-slaapstand")
    checkbox_sleep.addEventListener('change', function() {
      if(this.checked) {
        // console.log("sleep");
        sleep_mode = true;
        if(inverted == false){
          position_x = -0.35;
          position_y = 0;
        }else{
          position_x = 0.35;
          position_y = 0;
        }
        
        redraw();
      } else {
        // console.log("wake");
        sleep_mode = false;
        position_x = 0;
        position_y = 0;
        redraw();
      }
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
    
});