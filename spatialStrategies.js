let canvas;

canvasCenter = { x: 0, y: 0 };

const items = [];

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

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  textFont("Poppins Medium");

  promptItemTexts.forEach((promptItemText, i) => {
    let pos = generatePosition(i);
    let props = { text: promptItemText, x: pos.x, y: pos.y, path: PATHS.ROSE_LEFT, pathOffset: DEFAULT_PROMPT_PATH_OFFSET() }
    items.push(new PromptItem(props))
  })
}

function generatePosition(i) {
  let x = 0;
  let y = 0;

  if (i == 0) {
    x = 0;
    y = 0;
  } else if (i <= 6) {
    x = sin(i * Math.PI / 3) * R1;
    y = cos(i * Math.PI / 3) * R1;
  } else if (i <= 12) {
    x = sin(i * Math.PI / 3 + Math.PI / 6) * R2;
    y = cos(i * Math.PI / 3 + Math.PI / 6) * R2;
  } else if (i <= 18) {
    x = sin(i * Math.PI / 3) * R3;
    y = cos(i * Math.PI / 3) * R3;
  } else if (i <= 20) {
    x = sin((i - 19) * Math.PI / 8 + Math.PI / 9.5) * R4;
    y = cos((i - 19) * Math.PI / 8 + Math.PI / 9.5) * R4;
  } else if (i <= 22) {
    x = sin((i - 21) * Math.PI / 8 + Math.PI / 3 + Math.PI / 9.5) * R4;
    y = cos((i - 21) * Math.PI / 8 + Math.PI / 3 + Math.PI / 9.5) * R4;
  } else if (i <= 24) {
    x = sin((i - 23) * Math.PI / 8 + 2 * Math.PI / 3 + Math.PI / 9.5) * R4;
    y = cos((i - 23) * Math.PI / 8 + 2 * Math.PI / 3 + Math.PI / 9.5) * R4;
  } else if (i <= 26) {
    x = sin((i - 25) * Math.PI / 8 + 3 * Math.PI / 3 + Math.PI / 9.5) * R4;
    y = cos((i - 25) * Math.PI / 8 + 3 * Math.PI / 3 + Math.PI / 9.5) * R4;
  } else if (i <= 28) {
    x = sin((i - 27) * Math.PI / 8 + 4 * Math.PI / 3 + Math.PI / 9.5) * R4;
    y = cos((i - 27) * Math.PI / 8 + 4 * Math.PI / 3 + Math.PI / 9.5) * R4;
  } else if (i <= 30) {
    x = sin((i - 29) * Math.PI / 8 + 5 * Math.PI / 3 + Math.PI / 9.5) * R4;
    y = cos((i - 29) * Math.PI / 8 + 5 * Math.PI / 3 + Math.PI / 9.5) * R4;
  } else if (i <= 36) {
    x = sin(i * Math.PI / 3) * R5;
    y = cos(i * Math.PI / 3) * R5;
  } else if (i <= 37) {
    x = sin(Math.PI / 6) * R6;
    y = cos(Math.PI / 6) * R6;
  } else if (i <= 38) {
    x = sin(Math.PI / 6 + 2 * Math.PI / 3) * R6;
    y = cos(Math.PI / 6 + 2 * Math.PI / 3) * R6;
  } else if (i <= 39) {
    x = sin(-Math.PI / 6) * R6;
    y = cos(-Math.PI / 6) * R6;
  } else if (i <= 40) {
    x = sin(-Math.PI / 6 - 2 * Math.PI / 3) * R6;
    y = cos(-Math.PI / 6 - 2 * Math.PI / 3) * R6;
  } else if (i <= 52) {
    x = sin((i - 41) * Math.PI / 6 + Math.PI / 12) * R7;
    y = cos((i - 41) * Math.PI / 6 + Math.PI / 12) * R7;
  }


  console.log(i, x, y)

  return { x: x, y: y };
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  canvasScale = window.innerHeight / 800;
}

function draw() {
  background(color("#E6EDE7"));

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
  items.forEach(promptItem => {
    promptItem.draw()
    if (promptItem.isHovered) {
      itemMotion = false;
    }
  });

  // draw credits text
  fill(palette.primary);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(CENTER, BASELINE)
  text("Spatial Strategies", window.innerWidth / 2, window.innerHeight - 20);

  // draw cursor
  fill(0, 0, 0, .8)
  ellipse(cursorX, cursorY, 20, 20)
}

window.mouseClicked = e => items.forEach(promptItem => {
  promptItem.clicked(e)
});

class PromptItem {
  constructor(props) {
    this.text = props.text;
    this.originX = props.x;
    this.originY = props.y;
    this.x = 0;
    this.y = 0;
    this.pointRadius = props.pointRadius !== undefined ? props.pointRadius : DEFAULT_PROMPT_POINT_RADIUS;
    this.hoverRadius = props.hoverRadius !== undefined ? props.hoverRadius : DEFAULT_PROMPT_HOVER_RADIUS;
    this.expandedRadius = props.expandedRadius !== undefined ? props.expandedRadius : DEFAULT_PROMPT_EXPANDED_RADIUS;
    this.scaledPointRadius = 0;
    this.scaledHoverRadius = 0;
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
    this.scaledExpandedRadius = this.expandedRadius * window.innerHeight;

    let d = dist(this.x, this.y, cursorX, cursorY);
    d = this.isActivated ? 0 : d;
    let hoverDistance = constrain(d, this.scaledPointRadius / 2, this.scaledHoverRadius);
    let hoverPointRadius = map(hoverDistance, this.scaledPointRadius / 2, this.scaledHoverRadius, this.scaledExpandedRadius, this.scaledPointRadius);

    // hover ellipse
    noStroke();
    let hoverColor = color(palette.primary);
    hoverColor.setAlpha(.05);
    if (this.isActivated) {
      hoverColor.setAlpha(.1);
    }
    fill(hoverColor);
    ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);

    // text fill color
    noStroke();
    let mainColor = color(palette.primary);

    let textAlpha = map(hoverDistance, this.scaledPointRadius / 2, this.scaledHoverRadius * .75, .6, 0);
    textAlpha = this.isActivated ? 1 : textAlpha;
    mainColor.setAlpha(textAlpha)
    fill(mainColor)

    // text render
    textAlign(CENTER, CENTER);
    rectMode(CENTER)
    textSize(TEXT_SIZE * canvasScale);
    textLeading(TEXT_LEADING * canvasScale);
    text(this.text, this.x, this.y, this.scaledExpandedRadius * 1.7, this.scaledExpandedRadius * 3.5);

    // outer ring
    noFill();
    let outerRingColor = color(palette.primary);
    let ringAlpha = this.isActivated ? .5 : 0;
    outerRingColor.setAlpha(ringAlpha);
    stroke(outerRingColor);
    ellipse(this.x, this.y, this.scaledExpandedRadius * 2, this.scaledExpandedRadius * 2);

    this.isHovered = d < this.scaledHoverRadius
  }

  clicked(e) {
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.scaledPointRadius) {
      this.isActivated = !this.isActivated
    }
  }
}