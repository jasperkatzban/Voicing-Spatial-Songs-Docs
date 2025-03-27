let canvas;

canvasCenter = { x: 0, y: 0 };

const items = new Map();

let cursorX = 1;
let cursorY = 1;
let cursorOnCanvas = true;
let canvasScale = window.innerHeight / 800;;

const TEXT_SIZE = 15;
const TEXT_LEADING = 18;

const PATHS = {
  ROSE_LEFT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(millis() * speed);
    let t = (millis() * speed + offset) / 3;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y };
  },
  ROSE_RIGHT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(millis() * speed);
    let t = (millis() * speed + offset) / 3;
    let x = r * sin(-t);
    let y = r * cos(-t);
    return { x, y };
  },
}

const itemStyles = {
  Default: { color: '#22e6a1' },
  Center: { color: '#22e6a1' },
  Inner: { color: '#22e6b1' },
  Outer: { color: '#22e6d5' },
  Outest: { color: '#22e6e6' },
}

function preload() {
  promptItems.forEach(promptItem => {
    promptItem.sound = loadSound(promptItem.soundURL);
    items.set(promptItem.key, new PromptItem(promptItem))
  })
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  items.forEach(promptItem => {
    promptItem.loop();
  })
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  canvasScale = window.innerHeight / 800;
}

function draw() {
  background(30)

  let targetX = mouseX;
  let dx = targetX - cursorX;
  cursorX += dx * 0.15;

  let targetY = mouseY;
  let dy = targetY - cursorY;
  cursorY += dy * 0.15;

  // check if cursor is active with position delta,
  if ((abs(dx) > 1 || abs(dy) > 1) && !cursorOnCanvas) {
    cursorOnCanvas = true;
  }

  items.forEach(promptItem => {
    promptItem.draw()
  });

  if (cursorOnCanvas) {
    items.forEach(promptItem => {
      promptItem.updateAudio();
    });
  }


  // draw cursor
  fill(255, 255, 255, .5)
  ellipse(cursorX, cursorY, 15, 15)
}

function handleCursorExit() {
  cursorOnCanvas = false;
  items.forEach(promptItem => {
    promptItem.fadeOut();
  });
}

window.mouseClicked = e => items.forEach(promptItem => {
  promptItem.playAudio()
  promptItem.clicked(e)
});

class PromptItem {
  constructor(props) {
    this.title = props.title;
    this.style = props.style;
    // this.originX(props.x !== undefined ? props.x * window.innerHeight : 0) + 0 * canvasCenter.x;
    // this.originY(props.x !== undefined ? props.x * window.innerHeight : 0) + 0 * canvasCenter.x;
    this.originX = props.x;
    this.originY = props.y;
    this.x = 0;
    this.y = 0;
    this.pointRadius = props.pointRadius !== undefined ? props.pointRadius : DEFAULT_PROMPT_POINT_RADIUS;
    this.soundRadius = props.soundRadius !== undefined ? props.soundRadius : DEFAULT_PROMPT_SOUND_RADIUS;
    this.scaledPointRadius = 0;
    this.scaledSoundRadius = 0;
    this.sound = props.sound;
    this.image = props.image;
    this.path = props.path;
    this.pathScale = props.pathScale !== undefined ? props.pathScale : DEFAULT_PROMPT_PATH_SCALE;
    this.pathSpeed = props.pathSpeed !== undefined ? props.pathSpeed : DEFAULT_PROMPT_PATH_SPEED;
    this.pathOffset = props.pathOffset !== undefined ? props.pathOffset : DEFAULT_PROMPT_PATH_OFFSET;

    this.isActivated = false;
  }

  updatePos() {
    let { x: pathX, y: pathY } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)
    this.x = this.originX * window.innerHeight + canvasCenter.x; + pathX;
    this.y = this.originY * window.innerHeight + canvasCenter.y; + pathY;
  }

  draw() {
    this.updatePos();

    this.scaledPointRadius = this.pointRadius * window.innerHeight;
    this.scaledSoundRadius = this.soundRadius * window.innerHeight;

    let d = dist(this.x, this.y, cursorX, cursorY);
    d = this.isActivated ? 0 : d;
    let hoverDistance = constrain(d, this.scaledPointRadius, this.scaledSoundRadius);
    let hoverPointRadius = map(hoverDistance, this.scaledPointRadius, this.scaledSoundRadius, this.scaledSoundRadius, this.scaledSoundRadius / 4);

    // hover ellipse
    noStroke();
    let hoverColor = color(this.style.color);
    hoverColor.setAlpha(.1);
    fill(hoverColor);
    ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);

    // text fill color
    noStroke();
    let mainColor = color(this.style.color);

    mainColor.setAlpha(map(hoverDistance, 0, this.scaledSoundRadius, 1, 0))
    fill(mainColor)

    // text render
    textAlign(CENTER, CENTER);
    rectMode(CENTER)
    textSize(TEXT_SIZE * canvasScale);
    textLeading(TEXT_LEADING * canvasScale);
    text(this.title, this.x, this.y, this.scaledSoundRadius * 1.5, this.scaledSoundRadius * 3.5);

    if (this.isActivated) {
      fill(255, 255, 255, .6)
      text(this.title, this.x, this.y, this.scaledSoundRadius * 1.5, this.scaledSoundRadius * 3.5);
    }

    // outer ring
    noFill();
    let soundRadiusColor = color(128, 128, 128, .1);
    let a = map(hoverDistance, 0, this.scaledSoundRadius, .2, .1)
    a = d < this.scaledPointRadius ? .5 : a;
    soundRadiusColor.setAlpha(a);
    stroke(soundRadiusColor);
    ellipse(this.x, this.y, this.scaledSoundRadius * 2, this.scaledSoundRadius * 2);

    if (this.isActivated) {
      stroke(255, 255, 255, .6);
      ellipse(this.x, this.y, this.scaledSoundRadius * 2, this.scaledSoundRadius * 2);
    }
  }

  loop() {
    this.sound.setLoop(true);
    this.isPlaying = true;
  }

  playAudio() {
    if (!this.sound.isPlaying()) {
      this.sound.setVolume(0);
      this.sound.play();
    }
  }

  updateAudio() {
    this.updateVolume();
    this.updatePanning();
  }

  updateVolume() {
    let d = dist(this.x, this.y, cursorX, cursorY);
    d = constrain(d, 0, this.scaledSoundRadius);
    d = this.isActivated ? 0 : d;
    let aInt = map(d, 0, this.scaledSoundRadius, 100, 0);
    let a = float(aInt) / 100.0;

    this.sound.setVolume(a, .1);
  }

  updatePanning() {
    let pan = (this.x - width / 2) / (width / 4);
    pan = constrain(pan, -1, 1)
    this.sound.pan(pan);
  }

  fadeOut() {
    this.sound.setVolume(0, 1.0);
  }

  clicked(e) {
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.scaledPointRadius) {
      this.isActivated = !this.isActivated
    }
  }
}