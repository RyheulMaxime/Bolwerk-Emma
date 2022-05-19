// element.requeestFullscreen()
// JavaScript


document.addEventListener('DOMContentLoaded', function() {
    // document.documentElement.webkitRequestFullScreen();
    var joy = new JoyStick('joyDiv');
    var joy2 = new JoyStick('joyDiv2');

    const btnfull =  document.querySelector(".js-button-full")
    btnfull.addEventListener("click",function(){
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
          }
        
        // document.documentElement.webkitRequestFullScreen();
        screen.orientation.lock('landscape');
    })  
    
    
});