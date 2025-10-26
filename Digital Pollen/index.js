let cs;
let spacing, cols, rows;
let freq1, freq2, freq3, phase1, phase2, phase3;
let angleMultiplier, palette = [], isGothMode = false;

function setup() {
  cs = min(windowWidth, windowHeight);
  createCanvas(cs, cs);
  colorMode(HSL, 360, 100, 100, 100);
  setSeeds();
  noFill();

  spacing = cs * 0.02;
  cols = floor(width / spacing);
  rows = floor(height / spacing);

  freq1 = random(0.5, 3) / cs;
  freq2 = random(0.5, 3) / cs;
  freq3 = random(0.1, 2) / cs;

  phase1 = random(TWO_PI);
  phase2 = random(TWO_PI);
  phase3 = random(TWO_PI);

  angleMultiplier = random([2, 3, 4, 5, 6]);

  const palettes = [
    [200, 220, 260, 280, 300, 180, 240, 320], 
    [0, 10, 340, 350, 20, 30, 330, 15], 
    [330, 345, 10, 15, 25, 300, 320, 350], 
    [290, 310, 325, 340, 355, 270, 280, 300], 
    [250, 270, 300, 320, 0, 220, 280, 340], 
    [120, 140, 160, 180, 200, 100, 220, 240], 
    [30, 45, 60, 75, 90, 15, 105, 120], 
    [160, 180, 200, 220, 240, 140, 260, 280] 
  ];
  
  let chosen = random(palettes);
  let baseHue = random(chosen);
  isGothMode = chosen === palettes[4];

  palette = Array.from({length: 16}, () => {
    let h = (baseHue + random(-80, 80) + 360) % 360;
    let s = isGothMode ? random(30, 70) : random(60, 100); 
    let l = isGothMode ? random(20, 60) : random(40, 85);
    let a = random(80, 100);
    return color(h, s, l, a);
  });

  let complementaryHue = (baseHue + 180) % 360;
  for (let i = 0; i < 8; i++) {
    let h = (complementaryHue + random(-30, 30) + 360) % 360;
    let s = isGothMode ? random(25, 65) : random(65, 95);
    let l = isGothMode ? random(25, 55) : random(45, 80);
    let a = random(70, 95);
    palette.push(color(h, s, l, a));
  }

  background(260, 40, 6);
}

function draw() {
  background(260, 40, 6);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = x * spacing;
      let py = y * spacing;
      
      if (random() > 0.3) continue;
      
      let col = random(palette);
      let alpha = random(60, 100);
      col.setAlpha(alpha);
      stroke(col);
      strokeWeight(cs * random(0.001, 0.003));
      
      drawingContext.shadowBlur = cs * 0.008;
      drawingContext.shadowColor = isGothMode ? 
        color(340, 80, 60, 60) : 
        color(0, 0, 100, 50);

      drawCurve(px, py);
    }
  }

  drawDecorativeElements();
  
  noLoop();
  triggerPreview();
}

function drawCurve(startX, startY) {
  let cx = startX;
  let cy = startY;
  
  beginShape();
  curveVertex(cx, cy);

  let curveLength = cs * random(0.05, 0.15);
  let stepSize = cs * random(0.0015, 0.003);
  let maxDeviation = cs * 0.1;
  
  let segments = floor(curveLength / stepSize);
  
  for (let i = 0; i < segments; i++) {
    if (dist(cx, cy, startX, startY) > maxDeviation) break;
    
    let angle = noise(cx * freq1, cy * freq1, phase1) * TWO_PI * angleMultiplier +
                noise(cx * freq2, cy * freq2, phase2) * TWO_PI +
                noise(cx * freq3, cy * freq3, phase3) * PI;
    
    cx += cos(angle) * stepSize;
    cy += sin(angle) * stepSize;
    
    cx = constrain(cx, -cs * 0.1, cs * 1.1);
    cy = constrain(cy, -cs * 0.1, cs * 1.1);
    
    curveVertex(cx, cy);
  }
  endShape();
}

function drawDecorativeElements() {
  for (let i = 0; i < 3; i++) {
    stroke(random(palette));
    strokeWeight(cs * (0.001 + i * 0.001));
    noFill();
    let offset = cs * (0.05 + i * 0.01);
    let size = cs * (0.9 - i * 0.02);
    rect(offset, offset, size, size);
  }
}

function windowResized() {
  setSeeds();
  cs = min(windowWidth, windowHeight);
  resizeCanvas(cs, cs);

  spacing = cs * 0.02;
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  
  freq1 = random(0.5, 3) / cs;
  freq2 = random(0.5, 3) / cs;
  freq3 = random(0.1, 2) / cs;
  
  redraw();
}  