"use strict"

console.style('<img="background:url(https://static1.squarespace.com/static/523950d1e4b0eacf372043db/t/5583208ae4b0dd6ca1a4b945/1434656921780/);width:250px;height:250px">');

var glopts = {
    "sourceRepo": "https://github.com/dalena/thecalling",
    "redirect": true,
    "redir_seconds": 10,
    "sound_count": 28,
}

function loggy(str) {
    console.style('<b="font-size:14px;color:red;">[M]|</b> ' + str);
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

    this.introPlay = false;
    this.introEnd = false;
    this.introFade = false;
    this.outroPlay = false;
    this.outroEnd = false;
    this.outroFade = false;

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
        loggy("SOUND: Prepared.");
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
    this.avgFilled = false;

    this.avgRMS = function (val, rmsArr, rmsArrLimit) {
        rmsArr.push(val);
        if (rmsArr.length == rmsArrLimit)
            loggy("SOUND: Mean buffer filled.");
        if (rmsArr.length > rmsArrLimit) {
            rmsArr.shift();
            this.avgFilled = true;
        }

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

    this.rms = function (buffer) {
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
    var m_cont = require("container");
    var m_mouse = require("mouse");
    var m_cam = require("camera");
    var m_scenes = require("scenes");
    var m_anim = require("animation");
    var m_time = require("time");
    var m_ctl = require("controls");
    var m_trns = require("transform");

    var snd = new Snd();

    // EXPORTS
    exports.init = init;
    exports.webgl_failed = webgl_failed
    exports.snd = snd;

    // APP MODE
    var DEBUG = (m_ver.type() == "DEBUG");

    // DETECT ASSETS PATH
    var APP_ASSETS_PATH = m_cfg.get_assets_path("Majora");
    var APP_ASSETS_PATH = "./assets/";
    console.log(APP_ASSETS_PATH)

    function init() {
        loggy("Source available at: " + glopts.sourceRepo);

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
        startBG();

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
        snd.rmsArrLimit = 64;
        snd.analyze();

        var lamps = m_light.get_lamps();
        var energy = snd.stats.rmsSmoothScaled;

        if (snd.avgFilled && !snd.introEnd && energy > 0.7) {
            m_light.set_light_energy(objs.light_point, energy * 2);
            // m_light.set_light_energy(objs.light_point, 0);
        }
    }


    var objs = {
        cam: undefined,
        light_point: undefined,
        light_point_back: undefined
    };

    var flags = {

    }

    function load_cb(data_id, success) {
        if (!success) {
            loggy("Loading failed.");
            return;
        }

        objs.cam = m_scenes.get_object_by_name("camera");
        objs.light_point = m_scenes.get_object_by_name("light_point");
        objs.light_point_back = m_scenes.get_object_by_name("light_point_back");
        // m_anim.apply(objs.light_point, "on", 0);
        // m_anim.play(objs.light_point, null, 0);

        introFadeIn(startIntro);

        // camera = m_scene.get_active_camera();

        m_main.set_render_callback(render_cb);

        m_app.enable_camera_controls();
        m_gryo.enable_camera_rotation();

        var canvas_elem = m_cont.get_canvas();
        canvas_elem.addEventListener("mouseup", function (e) {
            m_mouse.request_pointerlock(canvas_elem, null, null, null, null, rot_cb);
        }, false);
        m_mouse.set_plock_smooth_factor(5);


        registerMouse();
        // If success for load, play the INTRO sound

    }

    var camera_smooth_fact = 2;
    var camera_rot_fact = 5;

    function rot_cb(rot_x, rot_y) {
        m_cam.rotate_camera(objs.cam, rot_x * camera_rot_fact, rot_y * camera_rot_fact);
    }

    function registerMouse() {
        console.log("mouse registered");
        var clickSensor = m_ctl.create_mouse_click_sensor();

        function logic(triggers) {
            if (triggers[0])
                return 1;
            else
                return 0;
        }

        function cb(obj, id, pulse, param) {
            if (pulse) {
                introFadeIn();
            }
            console.log(pulse);
            return;
        };

        m_ctl.create_sensor_manifold(null,
            "mouse",
            m_ctl.CT_TRIGGER, [clickSensor],
            logic,
            cb,
        );
    }

    function startBG() {
        snd.initBG();
        snd.bg.play();
        snd.bg.fade(0, 0.3, 6000);
    }

    function introFadeIn(callback) {
        m_scenes.set_dof_params({
            dof_on: true
        });
        m_cam.target_set_horizontal_limits(objs.cam, {
            left: -45,
            right: 45
        });
        m_cam.target_set_vertical_limits(objs.cam, {
            down: Math.PI/4,
            up: -Math.PI/4
        });
        // m_trns.set_translation(objs.cam, 0.0, -4.30813, 2.55447);


        m_time.animate(0, 1.4, 6000, function (v) {
            m_light.set_light_energy(objs.light_point, v);
        })
        m_time.animate(0, 1, 6000, function (v) {
            m_scenes.set_god_rays_params({
                god_rays_max_ray_length: 2,
                god_rays_intensity: v,
                god_rays_steps: 10
            });
        })
        if (callback != null) {
            m_time.set_timeout(function () {
                loggy("ANIM: Intro fade-in completed.");
                callback();
            }, 6000);
        }
    }

    function outroFadeIn(callback) {
        m_scenes.set_dof_params({
            dof_on: false
        });
        m_cam.target_set_horizontal_limits(objs.cam, null);
        m_cam.target_set_vertical_limits(objs.cam, null);

        m_time.animate(0, 1.4, 6000, function (v) {
            m_light.set_light_energy(objs.light_point, v);
        })
        m_time.animate(0, 1.4, 6000, function (v) {
            m_light.set_light_energy(objs.light_point_back, v);
        })

        if (callback != null) {
            m_time.set_timeout(function () {
                loggy("ANIM: Outro fade-in completed.");
                callback();
            }, 6000);
        }

    }

    function introFadeOut() {
        m_time.animate(1.4, 0, 6000, function (v) {
            m_light.set_light_energy(objs.light_point, v);
        })
        m_time.animate(1, 0, 6000, function (v) {
            m_scenes.set_god_rays_params({
                god_rays_max_ray_length: 2,
                god_rays_intensity: v,
                god_rays_steps: 10
            });
        })
        m_time.set_timeout(function () {
            loggy("ANIM: Fade-out completed.")
            m_scenes.hide_object(m_scenes.get_object_by_name("hide"))
            m_scenes.hide_object(m_scenes.get_object_by_name("eye_left"))
            m_scenes.hide_object(m_scenes.get_object_by_name("eye_right"))
            m_scenes.show_object(m_scenes.get_object_by_name("crystal"))
            outroFadeIn(startOutro);
        }, 6000);
    }


    function startIntro() {
        snd.initIntro();
        snd.intro.play();
        snd.intro.once('play', function () {
            snd.introPlay = true;
            loggy("AUDIO: Intro played.");

            snd.prepare()
        });
        snd.intro.fade(0, 0.5, 6000);
        snd.intro.once('fade', function () {
            snd.introFade = true;
            loggy("AUDIO: Intro fade-in completed.");
        });
        snd.intro.once('end', function () {
            snd.introEnd = true;
            loggy("AUDIO: Intro ended.");

            endIntro();
        });
    }

    function endIntro() {
        introFadeOut()
    }

    function startOutro() {
        snd.initOutro();
        snd.outro.play();
        snd.outro.once('play', function () {
            snd.outroPlay = true;
            loggy("AUDIO: Outro played.");
        });
        snd.outro.fade(0, 0.5, 6000);
        snd.outro.once('fade', function () {
            snd.introFade = true;
            loggy("AUDIO: Outro fade-in completed.");
        });
        snd.outro.once('end', function () {
            snd.outroEnd = true;
            loggy("AUDIO: Outro ended.");
        });
    }

    function webgl_failed() {
        loggy("WebGL initialization failed.");

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