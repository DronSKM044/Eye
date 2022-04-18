const canvas = document.getElementById("canvas");

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

const ctx = canvas.getContext("2d");
ctx.strokeStyle = "white";
canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: null,
  y: null,
  timer: null,
};

const config = {
  x: null,
  y: null,
  size: null,
  points: [],
};

addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.timer = 0;
});

class Triangle {
  constructor() {
    this.x = canvas.width / 2;
    this.size = (200 * (canvas.width + canvas.height)) / 2500;
    this.y = 0 + this.size + canvas.height * 0.2;
    this.color = "red";
    this.angle = 10 / 19.11;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(
      this.x + this.size * Math.cos(this.angle),
      this.y + this.size * Math.sin(this.angle)
    );

    for (let i = 0; i < 4; i++) {
      let x = this.x + this.size * Math.cos(this.angle + (i * 2 * Math.PI) / 3);
      // izmienenie 'this.angle +' na 'this.angle-'
      // dajot efect wraszenie w 3d prostranstwie
      let y = this.y + this.size * Math.sin(this.angle + (i * 2 * Math.PI) / 3);
      ctx.lineTo(x, y);
      if (i < 3) {
        config.points.push(`x:${x}`, `y:${y}`);
      }
    }

    ctx.strokeStyle = this.colorStroke;
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    config.points = [];
    this.x = canvas.width / 2;
    this.size = (200 * (canvas.width + canvas.height)) / 2500;
    this.y = 0 + this.size + canvas.height * 0.2;

    config.x = this.x;
    config.y = this.y;
    config.size = this.size;
    this.draw();

    //Wraszenie figury;
    // this.angle += 0.01;
  }
}

class Eye extends Triangle {
  constructor() {
    super();
    // this.eyeUp = (100 * this.size) / 200;
    this.eyeDown = 0;
    this.timeFraction = 0;
    // this.r = 40 * (this.size / 160);
    this.radius = (canvas.width + canvas.height) * 0.0002;
    this.eyeGrow = 0;
    this.eyeMoveX = 0;
    this.eyeMoveY = 0;
    this.time = 0;
  }
  draw() {
    //  otsortirowka x- coordianate i y-coordinate
    //   i perewod from string to Int
    // this.x = config.x;
    // this.y = config.y;
    // this.radius = (canvas.width + canvas.height) * 0.0002;
    // this.size = config.size;

    let xCoordinate = [];
    let yCoordinate = [];

    for (let i = 0; i < config.points.length; i++) {
      config.points[i].indexOf("x") == 0
        ? xCoordinate.push(config.points[i].slice(2) * 1)
        : false;
      config.points[i].indexOf("y") == 0
        ? yCoordinate.push(config.points[i].slice(2) * 1)
        : false;
    }
    // sortirowka end

    // poluczenie koordinat centrow storon treugolnika

    let xRightCenter = (xCoordinate[2] + xCoordinate[0]) / 2;
    let xLeftCenter = (xCoordinate[2] + xCoordinate[1]) / 2;

    // otrisowka elementow glaza

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(50,50,50,.4)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.moveTo(xRightCenter, this.y);
    ctx.quadraticCurveTo(this.x, this.y - this.eyeDown, xLeftCenter, this.y);

    ctx.moveTo(xRightCenter, this.y);
    ctx.quadraticCurveTo(this.x, this.y + this.eyeDown, xLeftCenter, this.y);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 4 * (this.size / 400);
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(
      this.x + this.eyeMoveX,
      this.y + this.eyeMoveY,
      this.radius / 1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(
      this.x + this.radius / 1.5 - this.radius / 4 + this.eyeMoveX,
      this.y - this.radius / 1.5 + this.radius / 4 + this.eyeMoveY,
      this.radius / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;

    addEventListener("resize", () => {
      this.timeFraction = 0;
      this.radius = (canvas.width + canvas.height) * 0.02;
    });

    this.blink();
    this.draw();
    mouse.timer >= 10 ? this.eyeAutoMoving() : this.eyeMouseMove();
  }

  eyeMouseMove() {
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    this.eyeMoveX = Math.cos(angle) * this.radius * 0.2;
    this.eyeMoveY = Math.sin(angle) * this.radius * 0.2;
  }

  eyeAutoMoving() {
    //chaotic eye move
    const amplitude = -this.radius / 2 / 12.5;
    const x = 1.5;

    this.time += 0.05;

    let random = Math.round(Math.random() * 24);

    if (random == 0) {
      this.eyeMoveY =
        Math.pow(Math.sin(this.time) * amplitude, 2) *
        ((x + 1) * Math.sin(this.time) * amplitude);
    }

    if (random == 1) {
      this.eyeMoveX =
        Math.pow(Math.sin(this.time) * amplitude, 2) *
        ((x + 1) * Math.sin(this.time) * amplitude);
    }
  }

  blink() {
    mouse.timer += 0.1;
    if (this.eyeDown >= (100 * this.size) / 200) {
      this.eyeDown = (100 * this.size) / 200;
    } else {
      this.eyeDown += Math.sin(this.timeFraction) * 20;
      this.radius += Math.abs(Math.sin(this.timeFraction) * 9);
    }
    this.timeFraction += 0.1;
    if (this.timeFraction >= Math.random() * (100 - 20) + 20) {
      this.timeFraction = 0;
      this.radius = 0;
      this.eyeDown = 0;
    }
  }
}
const triangle = new Triangle();
const eye = new Eye();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  triangle.update();
  eye.update();
  eye.draw();

  requestAnimationFrame(animate);
}

animate();
