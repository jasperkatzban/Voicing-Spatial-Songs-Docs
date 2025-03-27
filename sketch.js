let canvas, canvasCenter;

const navigationItems = new Map();

let cursorX = window.innerHeight / 2;
let cursorY = window.innerHeight / 2;
let cursorOnCanvas = true;
let canvasScale = window.innerHeight / 800;

const TEXT_SIZE = 15;

let AUDIO_ENABLED = false;
let FIRST_INTERACTION = false;

const PATHS = {
  ORBIT_LEFT: (scale, speed, offset) => {
    let x = scale * window.innerHeight * sin(millis() * speed + offset);
    let y = scale * window.innerHeight * cos(millis() * speed + offset);
    let t = millis() * speed + offset
    return { x, y, t };
  },
  ORBIT_RIGHT: (scale, speed, offset) => {
    let x = scale * window.innerHeight * sin(-millis() * speed + offset);
    let y = scale * window.innerHeight * cos(-millis() * speed + offset);
    let t = -millis() * speed + offset
    return { x, y, t };
  },
  ROSE_LEFT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(millis() * speed);
    let t = millis() * speed / 3 + offset;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y, t };
  },
}

const navigationItemStyles = {
  Inspiration: { color: '#22e6a1' },
  Thought: { color: '#aa34e0' },
  Process: { color: '#f5b40f' },
  Output: { color: '#3351b0' }
}

function preload() {
  navigationItemProps.forEach(navigationItem => {
    navigationItem.sound = loadSound(navigationItem.soundURL);
    if (navigationItem.imageUrl !== undefined) {
      navigationItem.image = loadImage(navigationItem.imageUrl);
    }
    switch (navigationItem.type) {
      case "group":
        navigationItems.set(navigationItem.title, new GroupItem(navigationItem))
        break;
      case "link":
        navigationItems.set(navigationItem.title, new LinkItem(navigationItem))
        break;
      case "subItem":
        let subItem = new LinkItem(navigationItem)
        subItem.navigationState = 'hidden'
        navigationItems.set(navigationItem.title, subItem)

      // TODO: handle default case
      default:
        break;
    }
  })
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  navigationItems.forEach(navigationItem => {
    navigationItem.loop();
  })
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  canvasScale = window.innerHeight / 800;
}

function draw() {
  background(30);

  let targetX = mouseX;
  let dx = targetX - cursorX;
  cursorX += dx * 0.3;

  let targetY = mouseY;
  let dy = targetY - cursorY;
  cursorY += dy * 0.3;

  // check if cursor is active with position delta,
  if ((abs(dx) > 1 || abs(dy) > 1) && !cursorOnCanvas) {
    cursorOnCanvas = true;
  }

  // if cursor active, update audio
  if (cursorOnCanvas) {
    navigationItems.forEach(navigationItem => {
      navigationItem.updateAudio();
    });
  }

  // enable or disable audioContext
  if (getAudioContext().state == 'running' && !AUDIO_ENABLED) {
    getAudioContext().suspend();
  }

  if (getAudioContext().state == 'suspended' && AUDIO_ENABLED) {
    getAudioContext().resume();
  }

  navigationItems.forEach(navigationItem => {
    navigationItem.draw()
  });

  // draw cursor
  fill(255, 255, 255, .5)
  ellipse(cursorX, cursorY, 15, 15)

  // draw audio toggle
  fill(100);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(LEFT, BASELINE)
  let audio_toggle_icon = (AUDIO_ENABLED) ? '🔈' : '🔇';
  let audio_enable_tooltip = (!FIRST_INTERACTION && !AUDIO_ENABLED ? 'Click to enable audio' : '');
  text(audio_toggle_icon + audio_enable_tooltip, 20, window.innerHeight - 20);

  // draw tooltip
  fill(100);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(RIGHT, BASELINE)
  text('Voicing Spatial Songs Documentation Demo', window.innerWidth - 20, window.innerHeight - 20);
}

function handleCursorExit() {
  cursorOnCanvas = false;
  navigationItems.forEach(navigationItem => {
    navigationItem.fadeOutAudio();
    navigationItem.trail = [];
  });
}

function handleGroupEntryClick(clickedGroupItem) {
  navigationItems.forEach(item => {
    if (clickedGroupItem.subItems.includes(item.title)) {
      item.moveToForeground();
      item.show();
    } else if (item == clickedGroupItem) {
      item.hide();
    } else {
      // send other navigationItems to background
      item.moveToBackground();
    }
  })
}

function handleGroupExitClick(clickedGroupItem) {
  navigationItems.forEach(item => {
    if (clickedGroupItem.subItems.includes(item.title)) {
      item.hide();
    } else {
      // restore other navigationItems
      item.moveToForeground();
    }
  })
}

mouseClicked = e => {
  let d = dist(e.clientX, e.clientY, 20, window.innerHeight - 20);
  if (d < 20) {
    AUDIO_ENABLED = !AUDIO_ENABLED
  }

  if (!FIRST_INTERACTION) {
    AUDIO_ENABLED = true;
    FIRST_INTERACTION = true;
  }

  navigationItems.forEach(navigationItem => {
    navigationItem.playAudio()
    navigationItem.clicked(e)
  });
}

class NavigationItem {
  constructor(props) {
    this.title = props.title;
    this.type = props.type;

    this.link = props.link;
    this.sound = props.sound;
    this.image = props.image;

    this.style = props.style;

    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;

    this.pointRadius = props.pointRadius;
    this.soundRadius = props.soundRadius;
    this.phantomSoundRadius = props.soundRadius;
    this.path = props.path;
    this.pathScale = props.pathScale;
    this.pathSpeed = props.pathSpeed;
    this.pathOffset = props.pathOffset;

    this.trail = [];
    this.logTrailCounter = 0;

    this.navigationState = 'foreground';
  }

  show() {
    this.navigationState = 'foreground';
  }

  hide() {
    this.navigationState = 'hidden';
  }

  moveToBackground() {
    this.navigationState = 'background';
  }

  moveToForeground() {
    this.navigationState = 'foreground';
  }

  updatePos() {
    let { x: pathX, y: pathY, t: pathT } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)

    let targetX = canvasCenter.x;
    let targetY = canvasCenter.y;

    switch (this.navigationState) {
      case 'foreground':
        targetX = canvasCenter.x + pathX;
        targetY = canvasCenter.y + pathY;

        // TODO: wait until state change has occured to show / log trails
        // this.trail.push({ x: this.x, y: this.y })
        // if (this.trail.length > 1000) {
        //   this.trail.splice(0, 1);
        // }
        break;

      case 'background':
        // TODO: add random offset to theta
        targetX = sin(pathT) * window.innerWidth * 2 / 5 + pathX * .1 + canvasCenter.x;
        targetY = cos(pathT) * window.innerHeight * 2 / 5 + pathY * .1 + canvasCenter.y;
        this.trail = []

        break;

      case 'activeGroup':
        targetX = canvasCenter.x;
        targetY = canvasCenter.y;

        this.trail = []
        break;

      default:
        this.trail = []
        break;
    }

    // LERP between target position and current position
    let dx = targetX - this.x;
    this.x += dx * 0.15;

    let dy = targetY - this.y;
    this.y += dy * 0.15;
  }

  draw() {
    this.updatePos();

    switch (this.navigationState) {
      case 'hidden':
        // don't draw if the item is hidden
        break;

      default:
        let trailColor = color(this.style.color)
        trailColor.setAlpha(.1)
        fill(trailColor)
        noStroke()

        for (let i = this.trail.length - 1; i > 29; i -= 30) {
          let step = this.trail[i];
          let r = map(i, 0, this.trail.length, 0, this.pointRadius)
          ellipse(step.x, step.y, r, r);
        }

        let d = dist(this.x, this.y, cursorX, cursorY);
        d = constrain(d, 0, this.soundRadius);
        let hoverPointRadius = map(d, 0, this.soundRadius, this.soundRadius / 2, this.pointRadius);

        if (this.image) {
          imageMode(CENTER)
          let imageX = this.x;
          let imageY = this.y - 50 - this.pointRadius * 2;
          let dForImage = constrain(d, this.pointRadius, this.pointRadius * 3)
          let a = map(dForImage, this.pointRadius, this.pointRadius * 3, .6, 0)
          tint(256, 256, 256, a);
          // TODO: fix positioning of different image sizes
          image(this.image, imageX, imageY, 100, 100, 0, 0, this.image.width, this.image.height, COVER);
        }

        let hoverColor = color(this.style.color);
        hoverColor.setAlpha(.1);
        fill(hoverColor);
        ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);

        noStroke();
        let mainColor = color(this.style.color);
        mainColor.setAlpha(map(d, 0, this.soundRadius, 1, .2))
        fill(mainColor)
        ellipse(this.x, this.y, this.pointRadius * 2, this.pointRadius * 2);

        textAlign(CENTER);
        textAlign(CENTER);
        textSize(TEXT_SIZE * canvasScale);
        text(this.title, this.x, this.y + this.pointRadius + 20);

        noFill();
        let soundRadiusColor = color(128, 128, 128, .1);
        soundRadiusColor.setAlpha(map(d, 0, this.soundRadius, .2, 0))
        stroke(soundRadiusColor);
        ellipse(this.x, this.y, this.soundRadius * 2, this.soundRadius * 2);

        if (d < this.pointRadius * 2) {
          fill(255, 255, 255, .6)
          ellipse(this.x, this.y, this.pointRadius * 1, this.pointRadius * 1);
          noStroke();
          text(this.title, this.x, this.y + this.pointRadius + 20);
        }

        break;
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
    d = constrain(d, 0, this.phantomSoundRadius);
    let aInt = map(d, 0, this.phantomSoundRadius, 100, 0);
    let a = float(aInt) / 100.0;
    this.sound.setVolume(a, .1);
  }

  updatePanning() {
    let pan = (this.x - width / 2) / (width / 4);
    pan = constrain(pan, -1, 1)
    this.sound.pan(pan);
  }

  fadeOutAudio() {
    this.sound.setVolume(0, 1.0);
  }
}

class LinkItem extends NavigationItem {
  constructor(props) {
    super(props)
  }

  clicked(e) {
    // check if mouse click is within item bounds
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.pointRadius * 2) {
      handleCursorExit();
      window.open(this.link);
    }
  }
}

class GroupItem extends NavigationItem {
  constructor(props) {
    super(props);
    this.subItems = props.subItems;
  }

  clicked(e) {
    // check if mouse click is within item bounds
    if (this.isActiveGroup) {
      let d = dist(e.clientX, e.clientY, canvasCenter.x, canvasCenter.y);
      // if clicking outside the center area, exit the group
      if (d > window.innerHeight / 3) {
        this.isActiveGroup = false;
        handleGroupExitClick(this);
      }
    } else {
      let d = dist(e.clientX, e.clientY, this.x, this.y);
      if (d < this.pointRadius * 2) {
        this.isActiveGroup = true;
        handleGroupEntryClick(this);
      }
    }
  }
}