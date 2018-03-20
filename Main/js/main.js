var controller = new ScrollMagic.Controller();

var scene1;
var scene2;

$(window).on('resize', function () {
    scene1.destroy(true);
    scene2.destroy(true);
    scene1 = createScene1();
    scene2 = createScene2();
});


function createScene1() {
    scene1 = new ScrollMagic.Scene({
            triggerElement: "#trig1",
            triggerHook: "onLeave",
        })
        .setPin("#pin1", {
            // y: "-100%",
        })
        // .setTween(wipeAnimation)
        .on("enter", function (e) {
            $("#pin1").css("z-index", 9999);
            document.getElementById("title-vid").play();
            // scene2.destroy(true);
        })
        .addIndicators()
        .addTo(controller);
}
createScene1();

function createScene2() {
    var wipeAnimation2 = new TimelineMax()
        .fromTo("#pin1", 1, {
            y: "0%"
        }, {
            y: "-100%",
            ease: Linear.easeNone
        })

    scene2 = new ScrollMagic.Scene({
            triggerElement: "#pin2",
            triggerHook: "onLeave",
            duration: "100%",
            // offset: "100%"
        })
        .setPin("#pin2", {})
        .setTween(wipeAnimation2)
        .addIndicators()
        .addTo(controller);
}
createScene2();