let canvas;

canvasCenter = { x: 0, y: 0 };

const items = [];
let activeItemIndex = undefined;

let randomizeButton;
let descriptionButton;
let description;
let isDescriptionVisible = false;
let randomizeButtonIconImage;
let descriptionButtonIconImage;

let cursorX = 1;
let cursorY = 1;
let cursorOnCanvas = true;
let canvasScale = window.innerHeight / 800;

let itemMotion = true;
let motionMillis = 0;
let millisPaused = 0

const TEXT_SIZE = 15;
const TEXT_SIZE_SMALL = 12;
const TEXT_LEADING = 20;
const TEXT_LEADING_SMALL = 16;
const TEXT_RESIZE_CHAR_LIMIT = 130;

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

function preload() {
  randomizeButtonIconImage = loadImage('images/icon-shuffle.png');
  descriptionButtonIconImage = loadImage('images/icon-question.png');
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();
  imageMode(CENTER);

  textFont("Poppins Medium");

  promptItemTexts.forEach((promptItemText, i) => {
    let pos = generatePosition(i);
    let props = { key: i, text: promptItemText, x: pos.x, y: pos.y, path: PATHS.ROSE_LEFT, pathOffset: DEFAULT_PROMPT_PATH_OFFSET() }
    items.push(new PromptItem(props));
  })

  randomizeButton = new RandomizeButton({ x: .6, y: 0, size: DEFAULT_PROMPT_POINT_RADIUS, iconImage: randomizeButtonIconImage });
  descriptionButton = new DescriptionButton({ x: -.6, y: 0, size: DEFAULT_PROMPT_POINT_RADIUS, iconImage: descriptionButtonIconImage });
  description = new Description({ x: 0, y: 0, size: .185 });
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
  return { x: x, y: y };
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  canvasScale = window.innerHeight / 800;
}

function draw() {
  background(palette.light);

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

  let activeItem = items[activeItemIndex]
  if (activeItem) {
    activeItem.draw();
  }

  randomizeButton.draw();
  descriptionButton.draw();

  if (isDescriptionVisible) {
    description.draw();
  }

  // draw tooltip text
  fill(palette.primary);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(CENTER, BASELINE)
  text("Click the circles above to view a strategy, or use the shuffle button to pick one randomly.", window.innerWidth / 2, window.innerHeight - 20);

  // draw cursor
  fill(palette.dark)
  ellipse(cursorX, cursorY, 10, 10)
}

window.mouseClicked = e => {
  if (!isDescriptionVisible) {
    items.forEach(promptItem => {
      promptItem.clicked(e)
    });
    randomizeButton.clicked(e);
  }
  description.clicked(e);
  descriptionButton.clicked(e);
}

function updateActiveItem(key) {
  if (items[activeItemIndex]) {
    items[activeItemIndex].isActivated = false;
  }
  if (activeItemIndex == key) {
    activeItemIndex = undefined;
    return
  }

  if (key !== undefined) {
    items[key].isActivated = true;
  }

  activeItemIndex = key;
}

function pickRandomItem() {
  // pick random index
  let key = Math.floor(Math.random() * items.length)

  // retry if same item was picked twice
  if (key == activeItemIndex) {
    pickRandomItem();
    return;
  }

  updateActiveItem(key)
}


class Button {
  constructor(props) {
    this.originX = props.x;
    this.originY = props.y;
    this.size = props.size;
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.iconImage = props.iconImage;
    this.isHovered = false;
  }

  draw() {
    this.updatePos();

    this.checkHoverStatus();

    let fillColor = color(palette.primary);
    let fillAlpha = this.isHovered ? 1 : .5;
    fillColor.setAlpha(fillAlpha);

    fill(fillColor);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2)

    if (this.iconImage) {
      image(this.iconImage, this.x, this.y, this.radius * 1.2, this.radius * 1.2, 0, 0, this.iconImage.width, this.iconImage.height, COVER);
    }
  }

  updatePos() {
    this.x = this.originX * window.innerHeight + canvasCenter.x;
    this.y = this.originY * window.innerHeight + canvasCenter.y;
    this.radius = this.size * window.innerHeight;
  }

  checkHoverStatus() {
    this.isHovered = (abs(mouseX - this.x) <= this.radius && abs(mouseY - this.y) <= this.radius);
  }

  clicked(e) {
    if (this.isHovered) {
      this.handleClick();
    }
  }

  handleClick() {
  }
}

class RandomizeButton extends Button {
  constructor(props) {
    super(props)
  }

  handleClick() {
    pickRandomItem();
  }

}

class DescriptionButton extends Button {
  constructor(props) {
    super(props)
  }

  handleClick() {
    showDescription();
  }
}

function showDescription() {
  isDescriptionVisible = true;
  updateActiveItem(undefined);
}

function hideDescription() {
  isDescriptionVisible = false;
}

class Description {
  constructor(props) {
    this.originX = props.x;
    this.originY = props.y;
    this.size = props.size;
    this.x = 0;
    this.y = 0;
    this.radius = 0;
  }

  draw() {
    let tint = color(palette.primary);
    tint.setAlpha(.05);
    background(tint);
    this.updatePos();

    fill(palette.light);
    stroke(palette.primary)
    strokeWeight(1)
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2)
    noStroke();

    fill(palette.primary);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    print(this.x, this.y);
    text(descriptionText, this.x, this.y, this.radius * 1.5, windowHeight);
  }

  updatePos() {
    this.x = this.originX * window.innerHeight + canvasCenter.x;
    this.y = this.originY * window.innerHeight + canvasCenter.y;
    this.radius = this.size * window.innerHeight * 2;
  }

  clicked() {
    let d = dist(this.x, this.y, mouseX, mouseY)
    if (d > this.radius && isDescriptionVisible) {
      hideDescription();
    }
  }
}

class PromptItem {
  constructor(props) {
    this.key = props.key;
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

    // hover ellipse
    let fillColor = color(palette.primary);
    let fillAlpha = this.isActivated ? .1 : .05;
    fillColor.setAlpha(fillAlpha);

    let outerRingColor = color(palette.primary);
    let ringAlpha = this.isActivated ? .5 : .2;
    outerRingColor.setAlpha(ringAlpha);

    stroke(outerRingColor);
    strokeWeight(1);

    if (isDescriptionVisible) {
      fill(fillColor);
      ellipse(this.x, this.y, this.scaledPointRadius * 2, this.scaledPointRadius * 2);
      return;
    }

    let d = dist(this.x, this.y, cursorX, cursorY);
    let hoverDistance = constrain(d, this.scaledPointRadius / 2, this.scaledHoverRadius);

    if (this.isActivated) {
      fill(palette.light);
      ellipse(this.x, this.y, this.scaledExpandedRadius * 2, this.scaledExpandedRadius * 2);

      // fill(fillColor);
      // ellipse(this.x, this.y, this.scaledExpandedRadius * 2, this.scaledExpandedRadius * 2);
    } else {
      let hoverPointRadius = map(hoverDistance, this.scaledPointRadius / 2, this.scaledHoverRadius, this.scaledExpandedRadius / 3, this.scaledPointRadius);
      hoverPointRadius = this.isActivated ? this.scaledExpandedRadius : hoverPointRadius;

      fill(fillColor);
      ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);
    }

    // text render
    if (this.isActivated) {
      noStroke();
      fillColor.setAlpha(1);
      fill(fillColor);
      textAlign(CENTER, CENTER);
      rectMode(CENTER);
      if (this.text.length > TEXT_RESIZE_CHAR_LIMIT) {
        textSize(TEXT_SIZE_SMALL * canvasScale);
        textLeading(TEXT_LEADING_SMALL * canvasScale);
      } else {
        textSize(TEXT_SIZE * canvasScale);
        textLeading(TEXT_LEADING * canvasScale);
      }
      text(this.text, this.x, this.y, this.scaledExpandedRadius * 1.7, this.scaledExpandedRadius * 3.5);
    }

    this.isHovered = d < this.scaledHoverRadius
  }

  clicked(e) {
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.scaledPointRadius) {
      updateActiveItem(this.key);
    }
  }
}

