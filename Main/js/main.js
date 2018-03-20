var controller = new ScrollMagic.Controller();

var sceneTitle;
var sceneCover;

$(window).on('resize', function () {
    sceneTitle.destroy(true);
    // sceneCover.destroy(true);
    sceneTitle = initSceneTitle();
    // sceneCover = initSceneCover();
});


function initSceneTitle() {
    var wipeAnimation = new TimelineMax()
        .fromTo(".cover-img", 1, {
            opacity: 0,
            width: "0%"
        }, {
            opacity: 1,
            width: "70%"
        }, '0')


    sceneTitle = new ScrollMagic.Scene({
            triggerElement: "#trig1",
            triggerHook: "onLeave",
            duration: "100%"
        })
        .setPin("#pin1", {
            pushFollowers: false
            // y: "-100%",
        })
        .setTween(wipeAnimation)
        .on("enter", function (e) {
            $("#pin1").css("z-index", 9999);
            document.getElementById("title-vid").play();
        })
        // .addIndicators()
        .addTo(controller);

    return sceneTitle;
}
initSceneTitle();

// function initSceneCover() {
//     var halfHeight = window.innerHeight / 2;


//     sceneCover = new ScrollMagic.Scene({
//             triggerElement: "#pin2",
//             triggerHook: "onLeave",
//             duration: "100%",
//             // offset: "100%"
//         })
//         .setPin("#pin2", {
//             pushFollowers: true
//         })
//         .setTween(wipeAnimation)
//         // .addIndicators()
//         .addTo(controller);

//     return sceneCover;
// }
// initSceneCover();