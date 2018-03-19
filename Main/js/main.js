var rellax = new Rellax('.rellax');


var titleInit = function(){
    var textAlbum = new Blotter.Text("the CALLING", {
        family : "Baskerville Old Face",
        size : 152,
        fill : "#fff",
        paddingLeft: 75,
        paddingRight:75,
        paddingBottom: 0,
        paddingTop: 1,
      });
      
      var material = new Blotter.LiquidDistortMaterial();
      material.uniforms.uSpeed.value = 0.1;
      material.uniforms.uVolatility.value = 0.05;
      var blotter = new Blotter(material, { texts : textAlbum });
      var scope = blotter.forText(textAlbum);
      scope.appendTo(document.getElementById("titleAlbum"));      
}

titleInit();

// console.log('hello')
// $(document).ready(function(){
//   // Init ScrollMagic
//   var controller = new ScrollMagic.Controller();
//
//   //Pin the Hero
//   var pinHeroScene = new ScrollMagic.Scene({
//     triggerElement: '.hero',
//     triggerHook: 0
//   })
//   .setPin('.hero')
//   .addTo(controller);
//
//   //Pin Album
//   //
//   // var pinHeroScene = new ScrollMagic.Scene({
//   //   triggerElement: '.coverAlbum',
//   //   triggerHook: 0
//   // })
//   // .setPin('.coverAlbum')
//   // .addTo(controller);
//
// });
