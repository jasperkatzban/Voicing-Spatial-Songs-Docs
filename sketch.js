let canvas;

const items = new Map();

const controls = {
  view: { x: 0, y: 0, zoom: 1 },
  viewPos: { prevX: null, prevY: null, isDragging: false },
}

let cursorx = 1;
let cursory = 1;
let cursorOnCanvas = true;

const paths = {
  orbitLeft: (scale, speed, offset) => {
    let x = scale * sin(millis() * speed + offset);
    let y = scale * cos(millis() * speed + offset);
    return { x, y };
  },
  orbitRight: (scale, speed, offset) => {
    let x = scale * sin(-millis() * speed + offset);
    let y = scale * cos(-millis() * speed + offset);
    return { x, y };
  },
  roseLeft: (scale, speed, offset) => {
    let r = scale * sin(millis() * speed);
    let t = millis() * speed / 3 + offset;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y };
  },
}

const itemStyles = {
  Inspiration: { color: '#22e6a1' },
  Thought: { color: '#aa34e0' },
  Process: { color: '#f5b40f' },
  Output: { color: '#3351b0' }
}

function preload() {
  pageItems.forEach(pageItem => {
    pageItem.sound = loadSound(pageItem.soundURL);
    if (pageItem.imageUrl !== undefined) {
      pageItem.image = loadImage(pageItem.imageUrl);
    }
    items.set(pageItem.title, new PageItem(pageItem))
  })
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  items.forEach(pageItem => {
    pageItem.loop();
  })

  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e, items))
}

function draw() {
  background(30)
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom)

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
    items.forEach(pageItem => {
      pageItem.updateAudio();
    });
  }

  items.forEach(pageItem => {
    pageItem.draw()
  });

  // draw cursor
  fill(255, 255, 255, .5)
  ellipse(cursorx, cursory, 15, 15)
}

function handleCursorExit() {
  cursorOnCanvas = false;
  items.forEach(pageItem => {
    pageItem.fadeOut();
  });
}

window.mouseClicked = e => items.forEach(pageItem => {
  pageItem.playAudio()
  pageItem.clicked(e)
});
window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e, items);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e, pageItemsToUpdate) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;

      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if (prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y

        pageItemsToUpdate.forEach(pageItem => {
          pageItem.offsetPhantomPos(dx, dy)
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


    function worldZoom(e, pageItemsToUpdate) {
      const { x, y, deltaY } = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.05;
      const zoom = 1 * direction * factor;

      const wx = (x - controls.view.x) / (width * controls.view.zoom);
      const wy = (y - controls.view.y) / (height * controls.view.zoom);

      // DISABLE ZOOM FOR NOW
      if (controls.view.zoom + zoom > .3 && controls.view.zoom + zoom < 3) {
        // controls.view.x -= wx * width * zoom;
        // controls.view.y -= wy * height * zoom;
        // controls.view.zoom += zoom;

        pageItemsToUpdate.forEach(pageItem => {
          // let { x, y } = calcPos(pageItem.x, pageItem.y, zoom);
          // console.log(x, y);
          // console.log(mouseX, mouseY);
          // pageItem.offsetPhantomPos(x - pageItem.x, y - pageItem.y);
          // console.log(zoom)
          // pageItem.soundRadius
        })
      }
    }
    return { worldZoom }
  }
}

class PageItem {
  constructor(props) {
    this.title = props.title;
    this.link = props.link;
    this.style = props.style;
    this.x = props.x;
    this.y = props.y;
    this.drawnX = props.x;
    this.drawnY = props.y;
    this.phantomX = props.x;
    this.phantomY = props.y;
    this.pointRadius = props.pointRadius;
    this.soundRadius = props.soundRadius;
    this.phantomSoundRadius = props.soundRadius;
    this.sound = props.sound;
    this.image = props.image;
    this.path = props.path;
    this.pathScale = props.pathScale;
    this.pathSpeed = props.pathSpeed;
    this.pathOffset = props.pathOffset;
  }

  updatePos() {
    let { x, y } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)
    this.drawnX = this.x + x;
    this.drawnY = this.y + y;
    this.phantomSoundRadius = this.soundRadius * controls.view.zoom;
  }

  draw() {
    this.updatePos();

    let d = dist(this.drawnX - this.x + this.phantomX, this.drawnY - this.y + this.phantomY, cursorx, cursory);
    d = constrain(d, 0, this.soundRadius);
    let hoverPointRadius = map(d, 0, this.soundRadius, this.soundRadius / 2, this.pointRadius);

    if (this.image) {
      imageMode(CENTER)
      let imageX = this.drawnX;
      let imageY = this.drawnY - 50 - this.pointRadius * 2;
      let dForImage = constrain(d, this.pointRadius, this.pointRadius * 3)
      let a = map(dForImage, this.pointRadius, this.pointRadius * 3, .6, 0)
      tint(256, 256, 256, a);
      // TODO: fix positioning of different image sizes
      image(this.image, imageX, imageY, 100, 100, 0, 0, this.image.width, this.image.height, COVER);
    }

    let hoverColor = color(this.style.color);
    hoverColor.setAlpha(.1);
    fill(hoverColor);
    ellipse(this.drawnX, this.drawnY, hoverPointRadius * 2, hoverPointRadius * 2);

    noStroke();
    let mainColor = color(this.style.color);
    mainColor.setAlpha(map(d, 0, this.soundRadius, 1, .2))
    fill(mainColor)
    ellipse(this.drawnX, this.drawnY, this.pointRadius * 2, this.pointRadius * 2);

    textAlign(CENTER);
    textAlign(CENTER);
    textSize(15);
    text(this.title, this.drawnX, this.drawnY + this.pointRadius + 20);

    noFill();
    let soundRadiusColor = color(128, 128, 128, .1);
    soundRadiusColor.setAlpha(map(d, 0, this.soundRadius, .2, 0))
    stroke(soundRadiusColor);
    ellipse(this.drawnX, this.drawnY, this.soundRadius * 2, this.soundRadius * 2);

    if (d < this.pointRadius * 2) {
      fill(255, 255, 255, .6)
      ellipse(this.drawnX, this.drawnY, this.pointRadius * 1, this.pointRadius * 1);
      noStroke();
      text(this.title, this.drawnX, this.drawnY + this.pointRadius + 20);
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
    if (d < this.pointRadius * 2) {
      handleCursorExit();
      window.open(this.link);
    }
  }
}