let canvas;

const items = new Map();

let cursorX = 1;
let cursorY = 1;
let cursorOnCanvas = true;

const paths = {
  roseLeft: (scale, speed, offset) => {
    let r = scale * sin(millis() * speed + offset);
    let t = (millis() * speed + offset) / 3;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y };
  },
  roseRight: (scale, speed, offset) => {
    let r = scale * sin(millis() * speed + offset);
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
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  items.forEach(promptItem => {
    promptItem.loop();
  })
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

  if (cursorOnCanvas) {
    items.forEach(promptItem => {
      promptItem.updateAudio();
    });
  }

  items.forEach(promptItem => {
    promptItem.draw()
  });

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
    this.x = props.x !== undefined ? props.x : DEFAULT_PROMPT_X;
    this.y = props.y !== undefined ? props.y : DEFAULT_PROMPT_Y;
    this.drawnX = this.x;
    this.drawnY = this.y;
    this.phantomX = this.x;
    this.phantomY = this.y;
    this.pointRadius = props.pointRadius !== undefined ? props.pointRadius : DEFAULT_PROMPT_POINT_RADIUS;
    this.soundRadius = props.soundRadius !== undefined ? props.soundRadius : DEFAULT_PROMPT_SOUND_RADIUS;
    this.phantomSoundRadius = this.soundRadius;
    this.sound = props.sound;
    this.image = props.image;
    this.path = props.path;
    this.pathScale = props.pathScale !== undefined ? props.pathScale : DEFAULT_PROMPT_PATH_SCALE;
    this.pathSpeed = props.pathSpeed !== undefined ? props.pathSpeed : DEFAULT_PROMPT_PATH_SPEED;
    this.pathOffset = props.pathOffset !== undefined ? props.pathOffset : DEFAULT_PROMPT_PATH_OFFSET;

    this.isActivated = false;
  }

  updatePos() {
    let { x, y } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)
    this.drawnX = this.x + x;
    this.drawnY = this.y + y;
  }

  draw() {
    this.updatePos();

    let d = dist(this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY, cursorX, cursorY);
    d = this.isActivated ? 0 : d;
    let hoverDistance = constrain(d, this.pointRadius, this.soundRadius);
    let hoverPointRadius = map(hoverDistance, this.pointRadius, this.soundRadius, this.soundRadius, this.soundRadius / 4);

    // hover ellipse
    noStroke();
    let hoverColor = color(this.style.color);
    hoverColor.setAlpha(.1);
    fill(hoverColor);
    ellipse(this.drawnX, this.drawnY, hoverPointRadius * 2, hoverPointRadius * 2);

    // text fill color
    noStroke();
    let mainColor = color(this.style.color);

    mainColor.setAlpha(map(hoverDistance, 0, this.soundRadius, 1, 0))
    fill(mainColor)

    // text render
    textAlign(CENTER, CENTER);
    rectMode(CENTER)
    textSize(15);
    textLeading(18);
    text(this.title, this.drawnX, this.drawnY, this.soundRadius * 1.5, this.soundRadius * 3.5);

    if (this.isActivated) {
      fill(255, 255, 255, .6)
      text(this.title, this.drawnX, this.drawnY, this.soundRadius * 1.5, this.soundRadius * 3.5);
    }

    // outer ring
    noFill();
    let soundRadiusColor = color(128, 128, 128, .1);
    let a = map(hoverDistance, 0, this.soundRadius, .2, .1)
    a = d < this.pointRadius ? .5 : a;
    soundRadiusColor.setAlpha(a);
    stroke(soundRadiusColor);
    ellipse(this.drawnX, this.drawnY, this.soundRadius * 2, this.soundRadius * 2);

    if (this.isActivated) {
      stroke(255, 255, 255, .6);
      ellipse(this.drawnX, this.drawnY, this.soundRadius * 2, this.soundRadius * 2);
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
    let d = dist(this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY, cursorX, cursorY);
    d = constrain(d, 0, this.phantomSoundRadius);
    d = this.isActivated ? 0 : d;
    let aInt = map(d, 0, this.phantomSoundRadius, 100, 0);
    let a = float(aInt) / 100.0;
    this.sound.setVolume(a, .1);
  }

  updatePanning() {
    let pan = (this.drawnX - this.x + this.phantomX - width / 2) / (width / 4);
    pan = constrain(pan, -1, 1)
    this.sound.pan(pan);
  }

  fadeOut() {
    this.sound.setVolume(0, 1.0);
  }

  offsetPhantomPos(dx, dy) {
    this.phantomX += dx;
    this.phantomY += dy;
  }

  clicked(e) {
    let d = dist(e.clientX, e.clientY, this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY);
    if (d < this.pointRadius) {
      this.isActivated = !this.isActivated
    }
  }
}