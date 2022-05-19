if (document.body.webkitRequestFullScreen) {
    window.addEventListener('click', function(e) {
      if (e.target.type != 'text' && e.target.type != 'password') {
        body.webkitRequestFullScreen();
        window.setTimeout(function() {
          document.webkitCancelFullScreen();
        }, 500);
      }
    }, false);
  }