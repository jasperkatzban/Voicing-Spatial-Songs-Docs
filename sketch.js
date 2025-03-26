let canvas, circles;

let PerformanceCircle
let SpatialSongwritingPromptsCircle
let InterfacesCircle
let SoundScoresPublicationCircle
let ProcessCircle
let SweetSpotCircle
let AgencyCircle
let SonicSpaceCircle
let TechnoVoiceCircle
let InspirationCircle

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

const circleItems = {
  Performance: {
    title: 'Performance',
    link: 'https://www.researchcatalogue.net/view/3512750/3512949',
    style: itemStyles.Output,
    soundURL: 'sounds/test-tone-6.mp3',
    sound: undefined,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathScale: 60,
    pathSpeed: .00005,
    pathOffset: 0,
  },
  SpatialSongwritingPrompts: {
    title: 'Spatial Songwriting Prompts',
    link: 'https://www.researchcatalogue.net/view/3512750/3512952',
    style: itemStyles.Output,
    soundURL: 'sounds/test-tone-5.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathScale: 60,
    pathSpeed: .00005,
    pathOffset: Math.PI / 2,
  },
  Interfaces: {
    title: 'Interfaces',
    link: 'https://www.researchcatalogue.net/view/3512750/3512958',
    style: itemStyles.Output,
    soundURL: 'sounds/test-tone-8.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathScale: 60,
    pathSpeed: .00005,
    pathOffset: Math.PI,
  },
  SoundScoresPublication: {
    title: 'Sound Scores Publication',
    link: 'https://www.researchcatalogue.net/view/3512750/3512955',
    style: itemStyles.Output,
    soundURL: 'sounds/test-tone-7.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathOffset: Math.PI,
    pathScale: 60,
    pathSpeed: .00005,
    pathOffset: Math.PI * 1.5,
  },
  Process: {
    title: 'Process',
    link: 'https://www.researchcatalogue.net/view/3512750/3512975',
    style: itemStyles.Process,
    soundURL: 'sounds/test-tone-10.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.roseLeft,
    pathScale: 250,
    pathSpeed: .0001,
    pathOffset: Math.PI / 2,
  },
  SweetSpot: {
    title: 'Sweet Spot',
    link: 'https://www.researchcatalogue.net/view/3512750/3512964',
    style: itemStyles.Thought,
    soundURL: 'sounds/test-tone-9.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitLeft,
    pathScale: 200,
    pathSpeed: .00002,
    pathOffset: Math.PI / 2,
  },
  Agency: {
    title: 'Agency',
    link: 'https://www.researchcatalogue.net/view/3512750/3512967',
    style: itemStyles.Thought,
    soundURL: 'sounds/test-tone-4.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathScale: 250,
    pathSpeed: .0001,
    pathOffset: -Math.PI / 2,
  },
  SonicSpace: {
    title: 'Sonic / Space',
    link: 'https://www.researchcatalogue.net/view/3512750/3512971',
    style: itemStyles.Thought,
    soundURL: 'sounds/test-tone-3.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitLeft,
    pathScale: 150,
    pathSpeed: .00007,
    pathOffset: Math.PI,
  },
  TechnoVoice: {
    title: 'Techno Voice',
    link: 'https://www.researchcatalogue.net/view/3512750/3512961',
    style: itemStyles.Thought,
    soundURL: 'sounds/test-tone-2.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitLeft,
    pathScale: 100,
    pathSpeed: .00007,
    pathOffset: 0,
  },
  Inspiration: {
    title: 'Inspiration',
    link: 'https://www.researchcatalogue.net/view/3512750/3512978',
    style: itemStyles.Inspiration,
    soundURL: 'sounds/test-tone-1.mp3',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pointRadius: 10,
    soundRadius: 100,
    path: paths.orbitRight,
    pathScale: 325,
    pathSpeed: .00002,
    pathOffset: 0,
  },
}

function preload() {

  circleItems.Performance.sound = loadSound(circleItems.Performance.soundURL);
  circleItems.SpatialSongwritingPrompts.sound = loadSound(circleItems.SpatialSongwritingPrompts.soundURL);
  circleItems.Interfaces.sound = loadSound(circleItems.Interfaces.soundURL);
  circleItems.SoundScoresPublication.sound = loadSound(circleItems.SoundScoresPublication.soundURL);
  circleItems.Process.sound = loadSound(circleItems.Process.soundURL);
  circleItems.SweetSpot.sound = loadSound(circleItems.SweetSpot.soundURL);
  circleItems.Agency.sound = loadSound(circleItems.Agency.soundURL);
  circleItems.SonicSpace.sound = loadSound(circleItems.SonicSpace.soundURL);
  circleItems.TechnoVoice.sound = loadSound(circleItems.TechnoVoice.soundURL);
  circleItems.Inspiration.sound = loadSound(circleItems.Inspiration.soundURL);

  PerformanceCircle = new Circle(circleItems.Performance)
  SpatialSongwritingPromptsCircle = new Circle(circleItems.SpatialSongwritingPrompts)
  InterfacesCircle = new Circle(circleItems.Interfaces)
  SoundScoresPublicationCircle = new Circle(circleItems.SoundScoresPublication)
  ProcessCircle = new Circle(circleItems.Process)
  SweetSpotCircle = new Circle(circleItems.SweetSpot)
  AgencyCircle = new Circle(circleItems.Agency)
  SonicSpaceCircle = new Circle(circleItems.SonicSpace)
  TechnoVoiceCircle = new Circle(circleItems.TechnoVoice)
  InspirationCircle = new Circle(circleItems.Inspiration)

}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  colorMode(RGB, 255, 255, 255, 1);
  noCursor();

  circles = [PerformanceCircle,
    SpatialSongwritingPromptsCircle,
    InterfacesCircle,
    SoundScoresPublicationCircle,
    ProcessCircle,
    SweetSpotCircle,
    AgencyCircle,
    SonicSpaceCircle,
    TechnoVoiceCircle,
    InspirationCircle]

  circles.forEach(circle => {
    circle.loop();
  })

  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e, circles))

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

  if ((dx > .1 || dy > .1) && !cursorOnCanvas) {
    cursorOnCanvas = true;
  }

  fill(255, 255, 255, .5)
  ellipse(cursorx, cursory, 15, 15)

  if (cursorOnCanvas) {
    circles.forEach(circle => {
      circle.updateAudio();
    });
  }

  circles.forEach(circle => {
    circle.draw()
  });
}

function handleCursorExit() {
  cursorOnCanvas = false;
  circles.forEach(circle => {
    circle.fadeOut();
  });
}

window.mouseClicked = e => circles.forEach(circle => {
  circle.playAudio()
  circle.clicked(e)
});
window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e, circles);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e, circlesToUpdate) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;

      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if (prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y

        circlesToUpdate.forEach(circle => {
          circle.offsetPhantomPos(dx, dy)
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


    function worldZoom(e, circlesToUpdate) {
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

        circlesToUpdate.forEach(circle => {
          // let { x, y } = calcPos(circle.x, circle.y, zoom);
          // console.log(x, y);
          // console.log(mouseX, mouseY);
          // circle.offsetPhantomPos(x - circle.x, y - circle.y);
          // console.log(zoom)
          // circle.soundRadius
        })
      }

    }

    return { worldZoom }
  }
}


class Circle {
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
      window.open(this.link);
      this.sound.setVolume(0, 1);
      handleCursorExit();
    }
  }
}