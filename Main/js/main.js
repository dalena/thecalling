$(window).resize(function () {
    var blur = $(document).width() / 384;
    // $("#blur-amount").attr("stdDeviation", blur);
    var elem = document.getElementById("blur-amount");
    elem.setAttribute("stdDeviation", blur);
});

var controller = new ScrollMagic.Controller();


// var scene = new ScrollMagic.Scene({
//         triggerElement: '#pinned-trigger1', // starting scene, when reaching this element
//         duration: "500%" // pin the element for a total of 400px
//     })
//     .setPin('#pinned-element1'); // the element we want to pin


// init controller
var controller = new ScrollMagic.Controller();

// build scenes
new ScrollMagic.Scene({
        triggerElement: "#img2",
        duration: '300%'
    })
    .setPin("#pin1")
    .addTo(controller)
    .addIndicators();

// new ScrollMagic.Scene({
//         triggerElement: "#trigger1",
//         duration: '300%',
//         offset: '300%'
//     })
//     .setPin("#pin2")
//     .addTo(controller)
//     .addIndicators();

// new ScrollMagic.Scene({
//         triggerElement: "#trigger",
//         duration: 150,
//         offset: 600
//     })
//     .setPin("#pin")
//     .setClassToggle("#pin", "green")
//     .on("enter leave", updateBox)
//     .addIndicators() // add indicators (requires plugin)
//     .addTo(controller);

// Add Scene to ScrollMagic Controller
//   controller.addScene(scene);

// var rellax = new Rellax('.rellax');
// var parallax = document.getElementById('parallax');
// var parallaxInstance = new Parallax(parallax);
// parallaxInstance.friction(0.2, 0.2);

// var scene = document.getElementById('scene');
// var parallaxInstanceWrapper = new Parallax(scene);
// parallaxInstanceWrapper.friction(0.5, 0.5);

var titleInit = function () {
    var textAlbum = new Blotter.Text("the CALLING", {
        family: "Baskerville Old Face",
        size: 152,
        fill: "#fff",
        paddingLeft: 75,
        paddingRight: 75,
        paddingBottom: 0,
        paddingTop: 1,
    });

    var material = new Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = 0.1;
    material.uniforms.uVolatility.value = 0.05;
    var blotter = new Blotter(material, {
        texts: textAlbum
    });
    var scope = blotter.forText(textAlbum);
    scope.appendTo(document.getElementById("titleAlbum"));
}

// titleInit();

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