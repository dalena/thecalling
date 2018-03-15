"use strict"

var glopts = {
    "sourceRepo": "https://github.com/dalena/thecalling",
    "redirect": true,
    "redir_seconds": 10,
    "sound_count": 28,
}

function Snd(type) {
    this.fftSize = 512;
    this.smoothingTimeConstant = 1.0;

    this.graph = true;

    this.bg = undefined;
    this.intro = undefined;
    this.outro = undefined;

    this.initSound = function (options) {
        var sound = new Howl({
            src: [
                './assets/audio/' + options.file + '.altconv.webm',
                './assets/audio/' + options.file + '.altconv.oga',
                './assets/audio/' + options.file + '.mp3'
            ],
            autoplay: options.autoplay,
            rate: options.rate,
            loop: options.loop,
            volume: options.volume
        });

        return sound;
    }

    this.initBG = function () {
        var options = {
            file: "bg_theme",
            autoplay: false,
            rate: 0.5,
            loop: true,
            volume: 0
        }

        this.bg = this.initSound(options);
    };

    this.initIntro = function () {
        var options = {
            file: "intro",
            autoplay: false,
            rate: 0.9,
            loop: false,
            volume: 0
        }
        this.intro = this.initSound(options);
    };

    this.initOutro = function () {
        var idx = Math.floor(Math.random() * glopts.sound_count) + 1;
        var options = {
            file: "poem" + idx,
            autoplay: false,
            rate: 0.9,
            loop: false,
            volume: 0
        }

        this.outro = this.initSound(options);
    };

    this.analyser = undefined;
    this.buffer = undefined;
    this.isPrepared = false;

    this.prepare = function (_addGraph) {
        var analyser = Howler.ctx.createAnalyser();
        Howler.masterGain.connect(analyser);
        analyser.connect(Howler.ctx.destination);
        analyser.smoothingTimeConstant = this.smoothingTimeConstant;
        analyser.fftSize = this.fftSize;
        var buffer = new Uint8Array(this.fftSize);
        analyser.getByteTimeDomainData(buffer);
        this.analyser = analyser;
        this.buffer = buffer;
        this.isPrepared = true;
        this.graph && this.addGraph();
    }

    this.graphCanvas;
    this.graphContext;

    this.graphX = 0;

    this.addGraph = function () {
        var canvasID = 'snd-graph';
        $('body').append(`<canvas id="` + canvasID + `" width="1024" height="200" style="    position: absolute;top: 0;left: 0;"></canvas>`);
        var element = document.getElementById(canvasID);
        this.graphCanvas = element;
        this.graphContext = this.graphCanvas.getContext('2d');
    }

    this.drawGraph = function (a, b) {
        var t = this;
        t.graphX++;
        if (t.graphX > t.graphCanvas.width) {
            t.graphX = 0;
            t.graphContext.clearRect(0, 0, t.graphCanvas.width, t.graphCanvas.height)
        }
        t.graphContext.fillStyle = "red";
        t.graphContext.fillRect(t.graphX, a, 1, 1);
        t.graphContext.fillStyle = "yellow";
        t.graphContext.fillRect(t.graphX, b, 1, 1);
    }

    this.avgArr = [];
    this.avgLimit = 128 / 4;

    this.avgRMS = function (val, rmsArr, rmsArrLimit) {
        rmsArr.push(val);
        if (rmsArr.length > rmsArrLimit)
            rmsArr.shift();
        if (rmsArr.length < rmsArrLimit)
            return val;
        var sum = 0;
        for (var i = 0; i < rmsArr.length; i++) {
            sum += rmsArr[i];
        }

        return sum / rmsArrLimit;
    }

    this.stats = {
        rms: 0,
        rmsSmooth: 0,
        rmsScaled: 0,
        rmsSmoothScaled: 0
    }

    this.rms = function(buffer){
        var rms = 0;
        for (var i = 0; i < buffer.length; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms /= buffer.length;
        rms = Math.sqrt(rms);
        return rms
    }

    this.analyze = function () {
        var t = this;
        if (!t.isPrepared) {
            console.log("SOUND: Not prepared.");
            return;
        }

        this.analyser.getByteTimeDomainData(this.buffer);

        var rms = t.rms(t.buffer);
        var rmsSmooth = this.avgRMS(rms, this.avgArr, this.avgLimit);


        function scale(val) {
            var res = Math.abs(val - 127);
            // res = res * 100
            // res = Math.round(res) / 100
            return res;
        }

        var rmsScaled = scale(rms);
        var rmsSmoothScaled = scale(rmsSmooth);

        t.stats.rms = rms;
        t.stats.rmsSmooth = rmsSmooth;
        t.stats.rmsScaled = rmsScaled;
        t.stats.rmsSmoothScaled = rmsSmoothScaled;


        this.graph && this.drawGraph(30 - rmsScaled, 30 - rmsSmoothScaled * 2);
    }
}

// register the application module
b4w.register("Majora_main", function (exports, require) {

    // MODULES
    var m_app = require("app");
    var m_main = require("main");
    var m_light = require("lights");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_preloader = require("preloader");
    var m_ver = require("version");
    var m_gryo = require("gyroscope");

    var snd = new Snd();

    // EXPORTS
    exports.init = init;
    exports.webgl_failed = webgl_failed
    exports.snd = snd;

    // APP MODE
    var DEBUG = (m_ver.type() == "DEBUG");

    // DETECT ASSETS PATH
    var APP_ASSETS_PATH = m_cfg.get_assets_path("Majora");

    function init() {
        console.log("Source available at:", glopts.sourceRepo);

        if (true)
            m_app.init({
                canvas_container_id: "main_canvas_container",
                callback: init_cb,
                show_fps: DEBUG,
                console_verbose: DEBUG,
                autoresize: true,
                report_init_failure: false
                // assets_gzip_available: true
            });
    }

    function init_cb(canvas_elem, success) {

        if (!success) {
            webgl_failed();
            return;
        }

        // Start BACKGROUND theme sound
        snd.initBG();
        snd.bg.play();
        snd.bg.fade(0, 0.3, 6000);


        $('#preloader_cont').css('visibility', 'visible');
        $('#preloader_cont').removeClass('opacity-zero');
        $('#preloader_cont').addClass('opacity-full');

        // ignore right-click on the canvas element
        canvas_elem.oncontextmenu = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        load();
    }

    function load() {
        m_data.load(APP_ASSETS_PATH + "Majora.json", load_cb, preloader_cb);
    }

    function preloader_cb(percentage) {
        $('#prelod_dynamic_path').css('width', percentage + "%");
        if (percentage == 100) {
            $('#preloader_cont').removeClass('opacity-full');
            $('#preloader_cont').addClass('opacity-zero');
            setTimeout(function () {
                $('#preloader_cont').remove();
                $('#webgl-fail').remove();
            }, 500)
        }
    }

    function render_cb() {
        // console.log("render cb");
        snd.rmsArrLimit = 64;
        snd.analyze();

        var lamps = m_light.get_lamps();
        var energy = snd.stats.rmsSmoothScaled;
        // if (energy > 0.7) {
        m_light.set_light_energy(lamps[0], energy * 2);
        m_light.set_light_energy(lamps[1], 0);
        // }
    }

    function load_cb(data_id, success) {
        if (!success) {
            console.log("Loading failed.");
            return;
        }

        m_main.set_render_callback(render_cb);

        m_app.enable_camera_controls();
        m_gryo.enable_camera_rotation();

        // If success for load, play the INTRO sound
        setTimeout(function () {
            startIntro();
        }, 500);
    }

    function startIntro() {
        snd.initIntro();
        snd.intro.play();
        snd.intro.fade(0, 0.5, 1000);
        snd.introEnd = function () {
            console.log("SOUND: Intro ended.")
            startOutro()
        }
        snd.intro.once('play', snd.prepare());
        snd.intro.once('end', snd.introEnd);
    }

    function startOutro() {
        snd.initOutro();
        snd.outro.play();
        snd.outro.fade(0, 0.5, 1000);
        snd.outroEnd = function () {
            console.log("SOUND: Outro ended.")
        }
        snd.outro.once('end', snd.outroEnd);
    }

    function webgl_failed() {
        console.log("WebGL initialization failed.");

        $('#main_canvas_container').remove();
        $('#webgl-fail').removeClass('opacity-zero');
        $('#webgl-fail').addClass('opacity-full');


        var seconds_span = $('#redir-seconds');

        function incrementSeconds() {
            glopts.redir_seconds -= 1;
            seconds_span.text(glopts.redir_seconds)
            glopts.redir_seconds == 0 && glopts.redirect && (document.location.href = "http://sevdaliza.com");
        }

        var cancel = setInterval(incrementSeconds, 1000);
    }

});

var majora = b4w.require("Majora_main");
majora.init();