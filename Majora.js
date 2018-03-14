"use strict"

var sourceRepo = "https://github.com/dalena/thecalling";
var redirect = false;
var redir_seconds = 10;
var sound_count = 1

var sounds = {
    "bg": function () {
        var sound = new Howl({
            src: [
                './assets/audio/bg_theme.altconv.webm',
                './assets/audio/bg_theme.altconv.oga',
                './assets/audio/bg_theme.mp3'
            ],
            autoplay: false,
            rate: 0.3,
            loop: true,
            volume: 0
        });

        sound.setEvent = function (event, callback) {
            sound.once(event, callback)
        }

        sounds.bg = sound;
    },

    "intro": function () {
        var sound = new Howl({
            src: [
                './assets/audio/mar_1.altconv.webm',
                './assets/audio/mar_1.altconv.oga',
                './assets/audio/mar_1.mp3'
            ],
            autoplay: false,
            rate: 0.8,
            volume: 0
        });

        sounds.intro = sound;
    },

    "outro": function () {
        var idx = Math.floor(Math.random() * sound_count) + 1;
        var sound = new Howl({
            src: [
                './assets/audio/mar_' + idx + '.altconv.webm',
                './assets/audio/mar_' + idx + '.altconv.oga',
                './assets/audio/mar_' + idx + '.mp3'
            ],
            autoplay: false,
            volume: 0
        });

        sounds.outro = sound;
    },

    "load": function (key, from, to, dur, callback) {
        sounds[key]();
        sounds[key].play();
        sounds[key].fade(from, to, dur);
    }
}

// register the application module
b4w.register("Majora_main", function (exports, require) {

    // MODULES
    var m_app = require("app");
    var m_main = require("main");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_preloader = require("preloader");
    var m_ver = require("version");

    // EXPORTS
    exports.init = init;
    exports.webgl_failed = webgl_failed

    // APP MODE
    var DEBUG = (m_ver.type() == "DEBUG");

    // DETECT ASSETS PATH
    var APP_ASSETS_PATH = m_cfg.get_assets_path("Majora");

    function init() {
        console.log("Source available at:", sourceRepo);

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
        sounds.load("bg", 0, 0.1, 6000);


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

    function load_cb(data_id, success) {

        if (!success) {
            console.log("Loading failed.");
            return;
        }

        m_app.enable_camera_controls();

        // If success for load, play the INTRO sound
        setTimeout(function () {
            sounds.load("intro", 0, 0.5, 1000);
        }, 6000);
    }

    function webgl_failed() {
        console.log("WebGL initialization failed.");

        $('#main_canvas_container').remove();
        $('#webgl-fail').removeClass('opacity-zero');
        $('#webgl-fail').addClass('opacity-full');


        var seconds_span = $('#redir-seconds');

        function incrementSeconds() {
            redir_seconds -= 1;
            seconds_span.text(redir_seconds)
            redir_seconds == 0 && redirect && (document.location.href = "http://sevdaliza.com");
        }

        var cancel = setInterval(incrementSeconds, 1000);
    }

});

var majora = b4w.require("Majora_main");
majora.init();