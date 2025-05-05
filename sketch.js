let canvas, canvasCenter;

const navigationItems = new Map();

let cursorX = window.innerHeight / 2;
let cursorY = window.innerHeight / 2;
let cursorOnCanvas = true;
let cursorImage;
let canvasScale = window.innerHeight / 800;

const TEXT_SIZE = 15;
const TEXT_LEADING = 18;

const MAX_TRAIL_LENGTH = 300;
const MAX_TRAIL_PARTICLES = 15;
const NAVIGATION_FADE_TIME = 1000;
const NAVIGATION_HOLD_TIME = 2000;

let audioEnabled = false;
let firstInteraction = false;
let itemClickedDuringFrame = false;

let fadeOverlayColor;
let isScreenFading = false;
let currentFadeStartTime;

// TODO: make generate via unit circle; scale position to canvas afterwards
const PATHS = {
  ORBIT_LEFT: (scale, speed, offset) => {
    let x = scale * window.innerHeight * sin(millis() * speed + offset);
    let y = scale * window.innerHeight * cos(millis() * speed + offset);
    let t = millis() * speed + offset
    return { x, y, t };
  },
  ORBIT_RIGHT: (scale, speed, offset) => {
    let x = scale * window.innerHeight * sin(-millis() * speed - offset);
    let y = scale * window.innerHeight * cos(-millis() * speed - offset);
    let t = -millis() * speed + offset
    return { x, y, t };
  },
  ROSE_LEFT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(millis() * speed + offset);
    let t = (millis() * speed + offset) / 3;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y, t };
  },
  ROSE_RIGHT: (scale, speed, offset) => {
    let r = scale * window.innerHeight * sin(millis() * speed + offset);
    let t = (-millis() * speed - offset) / 3;
    let x = r * sin(t);
    let y = r * cos(t);
    return { x, y, t };
  },
}

function preload() {
  cursorImage = loadImage('images/cursor-corona.png')

  navigationItemProps.forEach(navigationItemProp => {
    if (navigationItemProp.soundURL) {
      navigationItemProp.sound = loadSound(navigationItemProp.soundURL);
    }
    if (navigationItemProp.imageURL) {
      navigationItemProp.image = loadImage(navigationItemProp.imageURL);
    }
    switch (navigationItemProp.type) {
      case "group":
        navigationItems.set(navigationItemProp.key, new GroupItem(navigationItemProp));
        break;
      case "subGroup":
        let subGroup = new GroupItem(navigationItemProp);
        subGroup.navigationState = 'hidden';
        navigationItems.set(navigationItemProp.key, subGroup);
        break;
      case "link":
        navigationItems.set(navigationItemProp.key, new LinkItem(navigationItemProp));
        break;
      case "subItem":
        let subItem = new LinkItem(navigationItemProp);
        subItem.navigationState = 'hidden';
        navigationItems.set(navigationItemProp.key, subItem);
    }
  })
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  textFont("Poppins Medium");

  fadeOverlayColor = color(palette.light);

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
  background(color(palette.light));

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
  if (getAudioContext().state == 'running' && !audioEnabled) {
    getAudioContext().suspend();
  }

  if (getAudioContext().state == 'suspended' && audioEnabled) {
    getAudioContext().resume();
  }

  // draw trails in background first
  navigationItems.forEach(navigationItem => {
    navigationItem.drawTrail();
  });

  // then draw items
  navigationItems.forEach(navigationItem => {
    navigationItem.draw()
  });

  // draw audio toggle
  fill(palette.dark);
  textSize(TEXT_SIZE * canvasScale);
  textAlign(LEFT, BASELINE)
  let audio_toggle_icon = (audioEnabled) ? '🔈' : '🔇';
  text(audio_toggle_icon, 20, window.innerHeight - 20);

  // draw tooltip if audio disabled
  if (!firstInteraction && !audioEnabled) {
    text('click for sound', cursorX + 10, cursorY + 10);
  }

  // draw cursor dot 
  fill(mouseIsPressed ? palette.primary : palette.dark);
  ellipse(cursorX, cursorY, 10, 10)

  if (isScreenFading) {
    let timeSinceFadeStart = Date.now() - currentFadeStartTime;
    let a = 0;

    if (timeSinceFadeStart >= 2 * NAVIGATION_FADE_TIME + NAVIGATION_HOLD_TIME) {
      isScreenFading = false;
    } else if (timeSinceFadeStart < NAVIGATION_FADE_TIME) {
      a = map(timeSinceFadeStart, 0, NAVIGATION_FADE_TIME, 0.0, 1.0, true)
    } else if (timeSinceFadeStart > NAVIGATION_FADE_TIME + NAVIGATION_HOLD_TIME) {
      a = map(timeSinceFadeStart - NAVIGATION_HOLD_TIME, NAVIGATION_FADE_TIME, 2 * NAVIGATION_FADE_TIME, 1.0, 0, true)
    } else {
      a = 1.0;
    }
    fadeOverlayColor.setAlpha(a)
    background(fadeOverlayColor);
  }

  // set flag to false once all draw updates have occured
  itemClickedDuringFrame = false;
}

function handleCursorExit() {
  cursorOnCanvas = false;
  navigationItems.forEach(navigationItem => {
    navigationItem.fadeOutAudio();
  });
}

function handleGroupEntryClick(clickedGroupItem) {
  navigationItems.forEach(item => {
    if (clickedGroupItem.subItems.includes(item.key)) {
      item.moveToForeground();
      item.show();
    } else if (item.type == 'link' || item.type == 'group') {
      // send other navigationItems to background
      item.moveToBackground();
    } else {
      item.hide();
    }

    // make sure parent object gets hidden
    if (item.subItems && item.subItems.includes(clickedGroupItem.key)) {
      item.hide()
    }

    if (item.type == 'group' || item.type == 'subGroup') {
      if (item == clickedGroupItem) {
        item.isActiveGroup = true;
      } else {
        item.isActiveGroup = false;
      }
    }
  })
  clickedGroupItem.hide();
}

function handleGroupExitClick(clickedGroupItem) {
  navigationItems.forEach(item => {
    if (clickedGroupItem.subItems.includes(item.key)) {
      item.hide();
    } else if (item.type == 'link' || item.type == 'group') {
      // restore other navigationItems
      item.moveToForeground();
    }

    if (item.type == 'group') {
      item.isActiveGroup = false;
    }

    if (item.type == 'subGroup') {
      item.hide();
      item.isActiveGroup = false;
    }
  })
}

mouseClicked = e => {
  let d = dist(e.clientX, e.clientY, 20, window.innerHeight - 20);
  if (d < 20) {
    audioEnabled = !audioEnabled
  }

  if (!firstInteraction) {
    audioEnabled = true;
    firstInteraction = true;
  }

  // check clicking per each item
  navigationItems.forEach(navigationItem => {
    navigationItem.playAudio()
    navigationItem.clicked(e)
  });
}

class NavigationItem {
  constructor(props) {
    this.key = props.key;
    this.title = props.title;
    this.type = props.type;

    this.link = props.link;
    this.sound = props.sound;
    this.image = props.image;
    this.alwaysShowImage = props.alwaysShowImage;

    this.style = props.style;

    this.pointRadius = props.pointRadius;
    this.soundRadius = props.soundRadius;
    this.phantomSoundRadius = props.soundRadius;
    this.path = props.path;
    this.pathScale = props.pathScale;
    this.pathSpeed = props.pathSpeed;
    this.pathOffset = props.pathOffset;

    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;

    this.navigationState = 'foreground';
  }

  show() {
    this.navigationState = 'foreground';
  }

  hide() {
    this.navigationState = 'hidden';
    this.fadeOutAudio()
  }

  moveToBackground() {
    this.navigationState = 'background';
  }

  moveToForeground() {
    this.navigationState = 'foreground';
  }

  updatePos() {
    let { x: pathX, y: pathY, t: pathT } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)

    let targetX;
    let targetY;

    switch (this.navigationState) {
      case 'foreground':
        targetX = canvasCenter.x + pathX;
        targetY = canvasCenter.y + pathY;
        break;

      case 'background':
        targetX = sin(pathT) * window.innerWidth * 2 / 5 + pathX * .1 + canvasCenter.x;
        targetY = cos(pathT) * window.innerHeight * 2 / 5 + pathY * .1 + canvasCenter.y;
        break;

      case 'activeGroup':
        targetX = canvasCenter.x;
        targetY = canvasCenter.y;
        break;

      case 'hidden':
        targetX = canvasCenter.x;
        targetY = canvasCenter.y;
        break

      default:
        targetX = canvasCenter.x;
        targetY = canvasCenter.y;
    }

    // LERP between target position and current position
    let dx = targetX - this.x;
    this.x += dx * 0.15;

    let dy = targetY - this.y;
    this.y += dy * 0.15;
  }

  draw() {
    this.updatePos();

    // set colors
    let mainColor = color(this.style.color);

    switch (this.navigationState) {
      case 'hidden':
        // don't draw if the item is hidden
        break;

      case 'background':
        mainColor.setAlpha(.2);
        fill(mainColor)
        ellipse(this.x, this.y, this.pointRadius * 2, this.pointRadius * 2);
        break

      default:
        // calculate distance to cursor
        let d = dist(this.x, this.y, cursorX, cursorY);
        d = constrain(d, 0, this.soundRadius);
        let dScaled = constrain(d, this.soundRadius / 4, this.soundRadius * (2 / 5))

        // change hover indicator size and opacity on hover
        let hoverColor = color(this.style.color);
        hoverColor.setAlpha(.3);
        let hoverPointRadius;
        if (this.image) {
          hoverPointRadius = map(d, this.pointRadius / 2, this.soundRadius, this.soundRadius, this.pointRadius);
          hoverPointRadius = constrain(hoverPointRadius, this.pointRadius, this.soundRadius * .75);
        } else {
          hoverPointRadius = map(d, 0, this.soundRadius, this.soundRadius / 2, this.pointRadius);
        }

        // draw hover indicator
        noStroke();
        fill(hoverColor);
        ellipse(this.x, this.y, hoverPointRadius * 2, hoverPointRadius * 2);

        // render image
        if (this.image) {
          imageMode(CENTER)
          let a = 1;
          if (this.alwaysShowImage) {
            a = map(dScaled, this.soundRadius / 4, this.soundRadius * (2 / 5), 1.0, .8)
          } else {
            a = map(dScaled, this.soundRadius / 4, this.soundRadius * (2 / 5), 1.0, 0)
          }
          tint(256, 256, 256, a);
          image(this.image, this.x, this.y, this.pointRadius * 2, this.pointRadius * 2, 0, 0, this.image.width, this.image.height, COVER);
        } else { // otherwise draw dot
          fill(mainColor)
          ellipse(this.x, this.y, this.pointRadius * 2, this.pointRadius * 2);

          // fade dot to 
          let a = map(dScaled, this.soundRadius / 4, this.soundRadius * (2 / 5), 1, 0)
          fill(255, 255, 255, a)
          ellipse(this.x, this.y, this.pointRadius * 1, this.pointRadius * 1);
        }

        // text
        fill(mainColor)
        textAlign(LEFT, CENTER);
        textSize(TEXT_SIZE * canvasScale);
        text(this.title, this.x + this.pointRadius + 5, this.y + this.pointRadius + 5);

        // fade text to white on hover
        let a = map(dScaled, this.soundRadius / 4, this.soundRadius * (2 / 5), 1, 0)
        fill(255, 255, 255, a)
        text(this.title, this.x + this.pointRadius + 5, this.y + this.pointRadius + 5);

      /* alternate radial text
      let textRadius = this.soundRadius / 2
      let currentAngle = Math.PI - (textWidth(this.title) / 2) / textRadius;
 
      for (let i = -1; i < this.title.length; i++) {
        let charWidth = textWidth(this.title.charAt(i));
        let nextCharWidth = textWidth(this.title.charAt(i + 1 || i));
 
        push();
        translate(this.x, this.y)
        rotate(currentAngle);
        translate(0, textRadius + TEXT_LEADING);
        rotate(Math.PI)
        text(this.title.charAt(i), 0, 0);
 
        fill(255, 255, 255, a)
        text(this.title.charAt(i), 0, 0);
        pop();
 
        currentAngle += (charWidth + nextCharWidth) / 2 / textRadius;
      }
 
      currentAngle = (textWidth(this.title) / 2) / textRadius;
 
      for (let i = -1; i < this.title.length; i++) {
        let charWidth = textWidth(this.title.charAt(i));
        let nextCharWidth = textWidth(this.title.charAt(i + 1 || i));
 
        push();
        translate(this.x, this.y)
        rotate(currentAngle);
        translate(0, textRadius + TEXT_SIZE * .42);
        text(this.title.charAt(i), 0, 0);
 
        fill(255, 255, 255, a)
        text(this.title.charAt(i), 0, 0);
        pop();
 
        currentAngle -= (charWidth + nextCharWidth) / 2 / textRadius;
      }
    */
    }
  }

  drawTrail() {
    let trailScale = (this.type == 'subItem') ? .5 : 1;
    if (this.navigationState == 'foreground') {
      let trailColor = color(this.style.color)
      let trailStrokeColor = color(this.style.color)

      let frameIntervalToDrawTrail = Math.floor(MAX_TRAIL_LENGTH / MAX_TRAIL_PARTICLES);
      for (let i = 0; i < MAX_TRAIL_LENGTH * trailScale; i += frameIntervalToDrawTrail) {
        let { x: trailX, y: trailY, t: trailT } = this.path(this.pathScale, this.pathSpeed, this.pathOffset - i * .002)
        let { x: pathX, y: pathY, t: pathT } = this.path(this.pathScale, this.pathSpeed, this.pathOffset)

        let r = map(i, 0, MAX_TRAIL_LENGTH * trailScale, this.pointRadius, this.soundRadius * 2 * trailScale)

        let a = map(i, 0, MAX_TRAIL_LENGTH * trailScale, .4, 0)

        trailStrokeColor.setAlpha(a)
        stroke(trailStrokeColor);
        strokeWeight(1);

        trailColor.setAlpha(a * .1)
        fill(trailColor)

        ellipse(trailX + this.x - pathX, trailY + this.y - pathY, r * 2, r * 2);
      }
    }
  }

  loop() {
    if (this.sound) {
      this.sound.setLoop(true);
      this.isPlaying = true;
    }
  }

  playAudio() {
    if (this.sound) {
      if (!this.sound.isPlaying()) {
        this.sound.setVolume(0);
        this.sound.play();
      }
    }
  }

  updateAudio() {
    if (this.sound) {
      this.updateVolume();
      this.updatePanning();
    }
  }

  updateVolume() {
    if (this.sound) {
      if (this.navigationState == 'foreground') {
        let d = dist(this.x, this.y, cursorX, cursorY);
        d = constrain(d, 0, this.phantomSoundRadius);
        let aInt = map(d, 0, this.phantomSoundRadius, 100, 0);
        let a = float(aInt) / 100.0;
        this.sound.setVolume(a, .1);
      }
    }
  }

  updatePanning() {
    if (this.sound) {
      let pan = (this.x - width / 2) / (width / 4);
      pan = constrain(pan, -1, 1)
      this.sound.pan(pan);
    }
  }

  fadeOutAudio() {
    if (this.sound) {
      this.sound.setVolume(0, NAVIGATION_FADE_TIME / 1000);
    }
  }

  clicked(e) {
    // only handle click action if no other items have been clicked and items are visible
    if (!itemClickedDuringFrame) {
      if (this.navigationState == 'foreground' || this.navigationState == 'hidden') {
        this.handleClick(e);
      }
    }
  }

  handleClick(e) {
    // nothing to click on in the template class
  }
}

class LinkItem extends NavigationItem {
  constructor(props) {
    super(props)
  }

  handleClick(e) {
    // check if mouse click is within item bounds
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.soundRadius * (2 / 5)) {
      handleCursorExit();
      this.openLinkAfterDelay(this.link)
      itemClickedDuringFrame = true;
    }
  }

  // TODO: Fade the rest of the scene during this time
  async openLinkAfterDelay(link) {
    if (!isScreenFading) {
      isScreenFading = true;
      currentFadeStartTime = Date.now()
    }

    await new Promise(() => {
      setTimeout(() => {
        window.open(link, '_self');
      }, NAVIGATION_FADE_TIME);
    });
  }
}

class GroupItem extends NavigationItem {
  constructor(props) {
    super(props);
    this.subItems = props.subItems;
    this.isActiveGroup = false;
  }

  handleClick(e) {
    // check if mouse click is within item bounds
    // if (this.navigationState == 'foreground') {
    let d = dist(e.clientX, e.clientY, this.x, this.y);
    if (d < this.soundRadius / 4) {
      handleGroupEntryClick(this);
      itemClickedDuringFrame = true;
      return;
    }

    // if clicking outside the center area, exit the group
    let distFromCenter = dist(e.clientX, e.clientY, canvasCenter.x, canvasCenter.y);
    let clickIsOutsideCenter = distFromCenter > window.innerHeight / 3;

    if (clickIsOutsideCenter && this.isActiveGroup) {
      handleGroupExitClick(this);
    }
  }
}
