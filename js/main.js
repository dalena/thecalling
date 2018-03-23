var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
  sURLVariables = sPageURL.split('&'),
  sParameterName,
  i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

if (isMobile) {
  var scene = document.getElementById('parallax');
  var parallaxInstance = new Parallax(scene);
  parallaxInstance.friction(0.3, 0.1);
  parallaxInstance.invert(true, true);
}

var controller = new ScrollMagic.Controller();

var sceneTitle;
var sceneCover;

$(window).on('resize', function () {
  sceneTitle.destroy(true);
  sceneTitle = initSceneTitle();
  sceneCover.destroy(true);
  sceneCover = initCoverTitle();
});

function initCoverTitle(){
  sceneCover = new ScrollMagic.Scene({
    triggerElement: "#pin2",
    triggerHook: "onLeave",
    duration: "100%"
  })
  .setPin("#pin2", {
    pushFollowers: true
  })
  // .setTween(wipeAnimation)
  .on("enter", function (e) {
    // $("#pin1").css("z-index", 999);
    // document.getElementById("title-vid").play();
  })
  .addTo(controller)
  // .addIndicators();

  return sceneCover;
}

function initSceneTitle() {
  var wipeAnimation = new TimelineMax()
  .fromTo("table", 1, {
    backgroundColor: "rgba(255,255,255,0)",
    color: "#fff",
  }, {
    backgroundColor: "rgba(255,255,255, 1)",
    color: "#000",
  }, '0')
  .fromTo(".cover-img", 1, {
    opacity: 0,
    width: "30%"
  }, {
    opacity: 1,
    width: "70%"
  }, '0')
  .fromTo(".link-container>h2", 1, {
    backgroundColor: "transparent",
    color: "#fff",
  }, {
    color: "#000",
    backgroundColor: "#fff",
  }, '0')
  .fromTo(".link-container>ul", 1, {
    backgroundColor: "transparent",
  }, {
    backgroundColor: "#fff",
  }, '0')
  .fromTo(".link-container>ul>li>a", 1, {
    color: "#fff",
  }, {
    color: "#000",
  }, '0')


  sceneTitle = new ScrollMagic.Scene({
    triggerElement: "#trig1",
    triggerHook: "onLeave",
    duration: "200%"
  })
  .setPin("#pin1", {
    pushFollowers: false
  })
  .setTween(wipeAnimation)
  .on("enter", function (e) {
    $("#pin1").css("z-index", 999);
    document.getElementById("title-vid").play();
  })
  .addTo(controller)
  // .addIndicators();

  return sceneTitle;
}

function ephemeris() {
  var cors_api_url = '//sevda-ephemeris.herokuapp.com/?url=';

  function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
      printResult(
        options.method + ' ' + options.url + '\n' +
        x.status + ' ' + x.statusText + '\n\n' +
        (x.responseText || '')
      );
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
  }

  doCORSRequest({
    method: 'GET',
    url: "https://www.astro.com/h/pl_e.htm",
    data: ""
  }, function printResult(result) {
    var lines = result.split('<div id="colmainleft2">');
    lines.splice(0, 1);
    result = lines[0]
    var lines = result.split('</table>');
    result = lines[0] + "</table>"
    var newtext = lines.join('\n');

    var dom_nodes = $($.parseHTML(result));
    var tableRow = $(dom_nodes).find('tr').filter(function () {
      var moon = $(this).text().toLowerCase().includes("sun");
      var sun = $(this).text().toLowerCase().includes("moon");
      return sun || moon;
    });
    $("#appendTo").append(tableRow);
  });
}

initSceneTitle();
initCoverTitle();
ephemeris();


if (!isMobile) {
  function drop(event) {
    $("#myCanvas").ripples('drop', event.clientX, event.clientY, 20, 0.01);
  }

  //////////// Default
  var imageURL = "./assets/img/canv-bg-3.jpg";

  if (getUrlParameter('random') == "true"){
    imageURL = "https://picsum.photos/g/1024?random";
  }

  if (getUrlParameter('num')){
    imageURL = "./assets/img/canv-bg-"+getUrlParameter('num')+".jpg";
  }

  if (getUrlParameter('file')){
    imageURL = "./assets/img/"+getUrlParameter('file');
  }
  if (getUrlParameter('sculpt') == 'true'){
    $("#parallax").show();
  }
  if (getUrlParameter('sculpt') == 'false'){
    $("#parallax").hide();
  }

  $('#myCanvas').ripples({
    resolution: 500,
    dropRadius: 500,
    perturbance: 0.05,
    interactive: false,
    imageUrl: imageURL
  });

  var rippleDelay = 3000;

  function rippleTimeout(){
    var x = Math.floor(Math.random() * window.innerWidth);
    var y = Math.floor(Math.random() * window.innerHeight);
    $("#myCanvas").ripples('drop', x, y, 20, 0.01)
    setTimeout(rippleTimeout, rippleDelay * Math.random());
  }
  rippleTimeout();

  $(window).mousemove(drop);
  $(window).mousedown(drop);
  $(window).mouseup(drop);
}
