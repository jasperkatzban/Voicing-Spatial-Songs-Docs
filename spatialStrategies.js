let canvas;

canvasCenter = { x: 0, y: 0 };

const items = new Map();

let cursorX = 1;
let cursorY = 1;
let cursorOnCanvas = true;
let canvasScale = window.innerHeight / 800;

let itemMotion = true;
let motionMillis = 0;
let millisPaused = 0

const TEXT_SIZE = 15;
const TEXT_LEADING = 18;

const PATHS = {
  ROSE_LEFT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(motionMillis * speed + offset);
    let t = (motionMillis * speed + offset) / 3;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y };
  },
  ROSE_RIGHT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(-motionMillis * speed - offset);
    let t = (-motionMillis * speed - offset) / 3;
    let x = r * sin(-t);
    let y = r * cos(-t);
    return { x, y };
  },
}

const itemStyles = {
  Default: { color: '#1B50F3' },
  Center: { color: '#1B50F3' },
  Inner: { color: '#1374D3' },
  Outer: { color: '#0E90BB' },
  Outest: { color: '#07ADA2' },
}

function preload() {
  promptItems.forEach(promptItem => {
    items.set(promptItem.key, new PromptItem(promptItem))
  })
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  canvasScale = window.innerHeight / 800;
}

function draw() {
  background(255)

  let targetX = mouseX;
  let dx = targetX - cursorX;
  cursorX += dx * 0.3;

  let targetY = mouseY;
  let dy = targetY - cursorY;
  cursorY += dy * 0.3;


  if (itemMotion) {
    motionMillis = millis() - millisPaused;
  } else {
    millisPaused = millis() - motionMillis;
  }

  // check if cursor is active with position delta,
  if ((abs(dx) > 1 || abs(dy) > 1) && !cursorOnCanvas) {
    cursorOnCanvas = true;
  }

  itemMotion = true;
  console.log(items.forEach(promptItem => {
    promptItem.draw()
    if (promptItem.isHovered) {
      itemMotion = false;
    }
  }));

  // draw credits text
  fill(100);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(CENTER, BASELINE)
  text("Spatial Prompts by SØSTR and others.", window.innerWidth / 2, window.innerHeight - 20);

  // draw cursor
  fill(0, 0, 0, .8)
  ellipse(cursorX, cursorY, 20, 20)
}

window.mouseClicked = e => items.forEach(promptItem => {
  promptItem.clicked(e)
});

class PromptItem {
  constructor(props) {
    this.title = props.title;
    this.credit = props.credit;
    this.style = props.style;
    this.originX = props.x;
    this.originY = props.y;
    this.x = 0;
    this.y = 0;
    this.pointRadius = props.pointRadius !== undefined ? props.pointRadius : DEFAULT_PROMPT_POINT_RADIUS;
    this.hoverRadius = props.hoverRadius !== undefined ? props.hoverRadius : DEFAULT_PROMPT_HOVER_RADIUS;
    this.scaledPointRadius = 0;
    this.scaledHoverRadius = 0;
    this.image = props.image;
    this.path = props.path;
    this.pathScale = DEFAULT_PROMPT_PATH_SCALE;
    this.pathSpeed = DEFAULT_PROMPT_PATH_SPEED;
    this.pathOffset = props.pathOffset;

    this.isHovered = false;
    this.isActivated = false;
  }

  updatePos() {
    let { x: pathX, y: pathY } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)
    this.x = this.originX * window.innerHeight + canvasCenter.x + pathX;
    this.y = this.originY * window.innerHeight + canvasCenter.y + pathY;
  }

  draw() {
    this.updatePos();

    this.scaledPointRadius = this.pointRadius * window.innerHeight;
    this.scaledHoverRadius = this.hoverRadius * window.innerHeight;

    let d = dist(this.x, this.y, cursorX, cursorY);
    d = this.isActivated ? 0 : d;
    let hoverDistance = constrain(d, this.scaledPointRadius, this.scaledHoverRadius);
    let hoverPointRadius = map(hoverDistance, this.scaledPointRadius, this.scaledHoverRadius, this.scaledHoverRadius, 0);

    // hover ellipse
    noStroke();
    let hoverColor = color(this.style.color);
    hoverColor.setAlpha(.05);
    if (this.isActivated) {
      hoverColor.setAlpha(.1);
    }
    fill(hoverColor);
    ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);

    // text fill color
    noStroke();
    let mainColor = color(this.style.color);
    let creditColor = mainColor

    mainColor.setAlpha(map(hoverDistance, 0, this.scaledHoverRadius, 1, 0))
    fill(mainColor)

    // text render
    textAlign(CENTER, CENTER);
    rectMode(CENTER)
    textSize(TEXT_SIZE * canvasScale);
    textLeading(TEXT_LEADING * canvasScale);
    text(this.title, this.x, this.y, this.scaledHoverRadius * 1.7, this.scaledHoverRadius * 3.5);

    creditColor.setAlpha(map(hoverDistance, 0, this.scaledHoverRadius, 1, 0))
    fill(creditColor)
    text(this.credit, this.x, this.y + this.scaledHoverRadius * .7);

    this.isHovered = d < this.scaledPointRadius

    // outer ring
    noFill();
    let hoverRadiusColor = color(this.style.color);
    let a = map(hoverDistance, 0, this.scaledHoverRadius, 1.0, .2)
    a = this.isHovered ? .5 : a;
    hoverRadiusColor.setAlpha(a);
    stroke(hoverRadiusColor);
    ellipse(this.x, this.y, this.scaledHoverRadius * 2, this.scaledHoverRadius * 2);
  }

  clicked(e) {
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.scaledPointRadius) {
      this.isActivated = !this.isActivated
    }
  }
}