let side;

function setup() {
  setSeeds();

  side = min(windowWidth, windowHeight);
  createCanvas(side, side);

  noLoop();
}

function draw() {
  setSeeds();

  let shapes = [];
  let w = width;
  let g = int(random(5, 15));

  const rw = (v) => v * width;
  const rh = (v) => v * height;
  const rs = (v) => v * side;

  background(
    int(random(180, 220)), 
    int(random(180, 220)),
    int(random(180, 220))
  );

  for (let i = 0; i < g; i++) {
    let bufW = rs(0.006);
    let bufH = rs(0.017);

    let buffer = createGraphics(bufW, bufH);
    buffer.pixelDensity(int(random(1, 11)));

    buffer.background(
      int(random(200)),
      int(random(44, 212)),
      int(random(44, 212))
    );
    buffer.stroke(
      int(random(38)),
      int(random(44, 212)),
      int(random(44, 212))
    );
    buffer.strokeWeight(rs(random(0.001, 0.004)));

    buffer.line(
      random(rs(0.01)),
      random(rs(0.01)),
      random(rs(0.01)),
      random(rs(0.01))
    );

    buffer.rect(
      0,
      0,
      random(bufW * 0.8),
      random(bufH * 0.8)
    );

    let speeds = [-5, -4, -4, -3, -3, -3, -3, -2, -1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 4, 5];
    let speed = speeds[int(random(speeds.length))];

    shapes.push({ buffer, w, speed });

    w -= rs(random(0.067, 0.084));
  }

  for (let s of shapes) {
    push();
    translate(width / 2, height / 2);

    rotate((2 * PI * s.speed) / 100);

    let stepX = s.buffer.width;
    let stepY = s.buffer.height;
    let r = s.w / 2;

    for (let x = -r; x < r; x += stepX) {
      for (let y = -r; y < r; y += stepY) {
        if (dist(0, 0, x, y) < r) {
          image(s.buffer, x, y);
        }
      }
    }
    pop();
  }

  triggerPreview(); 
}

function windowResized() {
  setSeeds();
  side = min(windowWidth, windowHeight);
  resizeCanvas(side, side);
  redraw();
} 