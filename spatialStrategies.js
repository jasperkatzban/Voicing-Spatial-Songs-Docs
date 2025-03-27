let canvas;

const items = new Map();

// const controls = {
//   view: { x: 0, y: 0, zoom: 1 },
//   viewPos: { prevX: null, prevY: null, isDragging: false },
// }

let cursorx = 1;
let cursory = 1;
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

  // canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e, items))
}

function draw() {
  background(30)
  // translate(controls.view.x, controls.view.y);
  // scale(controls.view.zoom)

  let targetX = mouseX;
  let dx = targetX - cursorx;
  cursorx += dx * 0.15;

  let targetY = mouseY;
  let dy = targetY - cursory;
  cursory += dy * 0.15;


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
  ellipse(cursorx, cursory, 15, 15)
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
// window.mousePressed = e => Controls.move(controls).mousePressed(e)
// window.mouseDragged = e => Controls.move(controls).mouseDragged(e, items);
// window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

/*
class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e, promptItemToUpdate) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;

      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if (prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y

        promptItemToUpdate.forEach(promptItem => {
          promptItem.offsetPhantomPos(dx, dy)
        })
      }
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }

    return {
      mousePressed,
      mouseDragged,
      mouseReleased
    }
  }

  static zoom(controls) {
    function calcPos(x, y, zoom) {
      const newX = width - (width * zoom - x);
      const newY = height - (height * zoom - y);
      return { x: newX, y: newY }
    }


    function worldZoom(e, promptItemToUpdate) {
      const { x, y, deltaY } = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.05;
      const zoom = 1 * direction * factor;

      const wx = (x - controls.view.x) / (width * controls.view.zoom);
      const wy = (y - controls.view.y) / (height * controls.view.zoom);

      // DISABLE ZOOM FOR NOW
      // if (controls.view.zoom + zoom > .3 && controls.view.zoom + zoom < 3) {
      //   controls.view.x -= wx * width * zoom;
      //   controls.view.y -= wy * height * zoom;
      //   controls.view.zoom += zoom;

      //   pageItemsToUpdate.forEach(pageItem => {
      //     // let { x, y } = calcPos(pageItem.x, pageItem.y, zoom);
      //     // console.log(x, y);
      //     // console.log(mouseX, mouseY);
      //     // pageItem.offsetPhantomPos(x - pageItem.x, y - pageItem.y);
      //     console.log(controls.view.zoom, controls.view.zoom ** 2)
      //     // pageItem.soundRadius
      //   })
      // }

    }

    return { worldZoom }
  }
}
*/

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
    // this.phantomSoundRadius = this.soundRadius * controls.view.zoom;
  }

  draw() {
    this.updatePos();

    let d = dist(this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY, cursorx, cursory);
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
    let d = dist(this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY, cursorx, cursory);
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