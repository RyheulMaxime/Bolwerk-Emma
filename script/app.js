// element.requeestFullscreen()
// JavaScript


document.addEventListener('DOMContentLoaded', function() {
    // document.documentElement.webkitRequestFullScreen();

    const btnfull =  document.querySelector(".js-button-full")
    btnfull.addEventListener("click",function(){
        document.documentElement.webkitRequestFullScreen();
    })  
    
    
});