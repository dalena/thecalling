// "Ripples" by Bruce Luo
// http://www.openprocessing.org/sketch/446986
// Licensed under Creative Commons Attribution ShareAlike
// https://creativecommons.org/licenses/by-sa/3.0
// https://creativecommons.org/licenses/GPL/2.0/

const block_size = 25;
const block_core = 1;
const block_move_distance = 10;
const block_move_range = 70;
const block_scale = 0.12;
const ripple_speed = 0.1;

let show_ripples = false;
let show_info = false;

let mouse_speed;
let fps, avgFps = 0;
let prevFrame = 0;
let prevTime = 0;
let fpsInterval = 1000;

/**
 * @type {Block[][]}
 */
let blocks;

/**
 * @type {Ripple[]}
 */
let ripples = [];
var sketchCanvas;

var canvasDiv = document.getElementById('myCanvas');
// var width = document.getElementById('myCanvas').offsetWidth;
// var height = document.getElementById('myCanvas').offsetHeight;
function setup() {

  var calcWidth = windowWidth - (windowWidth / 10)
  var calcHeight = windowHeight - (windowWidth / 10)

  sketchCanvas = createCanvas(calcWidth, calcHeight);
  sketchCanvas.parent("myCanvas");
  sketchCanvas.position(windowWidth / 20, windowWidth / 20);
  sketchCanvas.style('z-index', '-1');
  noStroke();
  rectMode(CENTER);
  noSmooth();

  initBlocks();

}

function initBlocks() {
  let padding_scale = 1;
  let top_padding = Math.round(width % block_size) * padding_scale;
  let left_padding = top_padding * 1;
  // let top_padding = Math.round(height % block_size) * 5;

  // var border = width / 10;
  var border = 0;

  blocks = Array.from({
      length: Math.floor((height - border) / block_size)
    }, (v, y) =>
    Array.from({
        length: Math.floor((width - border) / block_size)
      }, (v, x) =>
      new Block((border / 2) + left_padding + block_size * (x + 0.5), (border / 2) + top_padding + block_size * (y + 0.5), y * Math.floor(width / block_size) + x)
    )
  );
}


function draw() {

  if (keyIsDown(32)) {
    if (random() < pow(fps / 60, 3)) {
      ripples.push(new Ripple(random(width), random(height), 0.4));
    }
  } else {
    if (random() < pow(fps / 60, 3) / 16) {
      ripples.push(new Ripple(random(width), random(height), 0.1));
    }
  }


  fps = frameRate();

  if (millis() - prevTime > fpsInterval) {
    avgFps = (frameCount - prevFrame) / fpsInterval * 1000;
    prevFrame = frameCount;
    prevTime = millis();
  }

  mouse_speed = dist(mouseX, mouseY, pmouseX, pmouseY);

  background(0);

  rectMode(CENTER);

  ripples.forEach((ripple, i) => {
    ripple.updateRadius();
    ripple.checkKill();
  });

  noStroke();
  blocks.forEach((line, i) =>
    line.forEach((block, j) => {
      block.calcDiff(ripples);
      block.render();
    })
  );

}

// function mousePressed() {
//    ripples.push(new Ripple(mouseX, mouseY, 1));
// }

function mouseMoved() {
  if (random() < pow(fps / 60, 3) * mouse_speed / 30) {
    ripples.push(new Ripple(mouseX, mouseY, 0.25 * mouse_speed / 40));
  }
}

function mouseDragged() {
  if (random() < pow(fps / 60, 3) * mouse_speed / 20) {
    ripples.push(new Ripple(mouseX, mouseY, 0.3 * mouse_speed / 40));
  }
}

function windowResized() {

  var calcWidth = windowWidth - (windowWidth / 10)
  var calcHeight = windowHeight - (windowWidth / 10)

  resizeCanvas(calcWidth, calcHeight);
  // sketchCanvas.parent("myCanvas");
  sketchCanvas.position(windowWidth / 20, windowWidth / 20);
  initBlocks()
  // sketchCanvas.style('z-index', '-1');
}

class Block {
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.id = id;
  }

  render() {
    fill(255, cubicInOut(this.amp, 60, 240, 15));
    rect(this.pos.x + this.diff.x, this.pos.y + this.diff.y, (block_core + 1* block_scale) * 2, block_core + 1 * block_scale * 2);
    // rect(this.pos.x + this.diff.x, this.pos.y + this.diff.y, block_core + this.amp * block_scale * 0.5, (block_core + this.amp * block_scale) * 2);
  }

  /**
   * @param {Ripple[]} ripples
   */
  calcDiff(ripples) {
    this.diff = createVector(0, 0);
    this.amp = 0;

    ripples.forEach((ripple, i) => {
      if (!ripple.dists[this.id]) {
        ripple.dists[this.id] = dist(this.pos.x, this.pos.y, ripple.pos.x, ripple.pos.y);
      };
      let distance = ripple.dists[this.id] - ripple.currRadius;
      if (distance < 0 && distance > -block_move_range * 2) {
        if (!ripple.angles[this.id]) {
          ripple.angles[this.id] = p5.Vector.sub(this.pos, ripple.pos).heading();
        };
        const angle = ripple.angles[this.id];
        const localAmp = cubicInOut(-abs(block_move_range + distance) + block_move_range, 0, block_move_distance, block_move_range) * ripple.scale;
        this.amp += localAmp;
        const movement = p5.Vector.fromAngle(angle).mult(localAmp);
        this.diff.add(movement);
      }
    });
  }

}

class Ripple {
  constructor(x, y, scale) {
    this.pos = createVector(x, y);
    this.initTime = millis();
    this.currRadius = 0;
    this.endRadius = max(dist(this.pos.x, this.pos.y, 0, 0), dist(this.pos.x, this.pos.y, 0, height), dist(this.pos.x, this.pos.y, width, 0), dist(this.pos.x, this.pos.y, height, width)) + block_move_range;
    this.scale = scale;

    this.dists = [];
    this.angles = [];
  }

  checkKill() {
    if (this.currRadius > this.endRadius) {
      ripples.splice(ripples.indexOf(this), 1);
    }
  }

  updateRadius() {
    this.currRadius = (millis() - this.initTime) * ripple_speed;
    //this.currRadius = 200;
  }

  draw() {
    stroke(255, cubicInOut(this.scale, 30, 120, 1));
    noFill();
    ellipse(this.pos.x, this.pos.y, this.currRadius * 2, this.currRadius * 2);
  }
}

function cubicInOut(t, b, c, d) {
  if (t <= 0) return b;
  else if (t >= d) return b + c;
  else {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }
}