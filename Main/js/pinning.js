$(document).ready(function(){
  //Init ScrollMagic
  var controller = new ScrollMagic.Controller();

  //Build a scene
  var ourScene = new ScrollMagic.Scene({
    triggerElement: '#titleAlbum'
  })
  .setClassToggle('#coverAlbum', 'fade-in') //add class to coverAlbum
  // .addIndicators({
  //   name: 'fade scene',
  //   colorTrigger: 'black',
  //   colorStart: 'red',
  //   colorEnd: 'green'
  // })
  .addTo(controller);
});
