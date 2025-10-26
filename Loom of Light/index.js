let cs;
let spacing, cols, rows;
let flowField = [];
let palette = [], isDarkMode = false;

let freq1, freq2, freq3;
let phase1, phase2, phase3;
let angleMultiplier;

function setup() {
    cs = min(windowWidth, windowHeight);
    createCanvas(cs, cs);
    colorMode(HSL, 360, 100, 100, 100);
    setSeeds();

    spacing = cs * 0.015;
    cols = floor(width / spacing) + 1;
    rows = floor(height / spacing) + 1;

    freq1 = random(0.5, 3) / cs;
    freq2 = random(0.5, 3) / cs;
    freq3 = random(0.1, 2) / cs;
    phase1 = random(100);
    phase2 = random(100);
    phase3 = random(100);
    angleMultiplier = random(0.5, 2);

    for (let y = 0; y < rows; y++) {
        flowField[y] = [];
        for (let x = 0; x < cols; x++) {
            flowField[y][x] = {
                angle: noise(x * 0.1, y * 0.1) * TWO_PI * 2,
                strength: noise(x * 0.05, y * 0.05)
            };
        }
    }

    const palettes = [
        [45, 60, 75, 90, 105, 30, 120, 135],
        [180, 195, 210, 225, 240, 165, 255, 270],
        [320, 330, 340, 350, 0, 310, 10, 20],
        [120, 135, 150, 165, 180, 105, 195, 210],
        [270, 285, 300, 315, 330, 255, 345, 0]
    ];

    let chosen = random(palettes);
    let baseHue = random(chosen);
    isDarkMode = random() > 0.7;

    palette = Array.from({ length: 12 }, () => {
        let h = (baseHue + random(-40, 40) + 360) % 360;
        let s = isDarkMode ? random(50, 90) : random(60, 100);
        let l = isDarkMode ? random(20, 50) : random(50, 80);
        let a = random(70, 95);
        return color(h, s, l, a);
    });

    let contrastHue = (baseHue + 150 + random(-30, 30)) % 360;
    for (let i = 0; i < 6; i++) {
        let h = (contrastHue + random(-20, 20) + 360) % 360;
        let s = isDarkMode ? random(40, 80) : random(70, 100);
        let l = isDarkMode ? random(25, 60) : random(40, 75);
        let a = random(60, 90);
        palette.push(color(h, s, l, a));
    }

    background(isDarkMode ? 240 : 60, 30, isDarkMode ? 8 : 95);
    noLoop(); 
}

function draw() {
    background(isDarkMode ? 240 : 60, 30, isDarkMode ? 8 : 95, 95);

    for (let i = 0; i < cols * rows * 0.4; i++) {
        let x = random(width);
        let y = random(height);
        drawOrganicShape(x, y);
    }
  
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
            drawingContext.shadowColor = isDarkMode ? 
                color(340, 80, 60, 60) : 
                color(0, 0, 100, 50);

            drawCurve(px, py);
        }
    }

    drawStructuralElements();

    triggerPreview(); 
}

function drawOrganicShape(centerX, centerY) {
    let shapeSize = cs * random(0.04, 0.28);
    
    let planes = floor(random(2, 5));
    for (let p = 0; p < planes; p++) {
        let planeColor = random(palette);
        planeColor.setAlpha(random(60, 90));
        fill(planeColor);
        stroke(random(palette));
        strokeWeight(1);
        
        beginShape();
        for (let i = 0; i < 4; i++) {
            let angle = (i / 4) * TWO_PI + random(-PI/6, PI/6);
            let radius = shapeSize * random(0.5, 1.5);
            
            let x = centerX + cos(angle) * radius;
            let y = centerY + sin(angle) * radius;
            vertex(x, y);
        }
        endShape(CLOSE);
        
        stroke(random(palette));
        strokeWeight(1);
        for (let i = 0; i < 2; i++) {
            let angle1 = random(TWO_PI);
            let angle2 = angle1 + PI/2 + random(-PI/4, PI/4);
            let r1 = shapeSize * random(0.2, 0.8);
            let r2 = shapeSize * random(0.2, 0.8);
            
            line(centerX + cos(angle1) * r1, centerY + sin(angle1) * r1,
                 centerX + cos(angle2) * r2, centerY + sin(angle2) * r2);
        }
    }
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

function drawStructuralElements() {
    stroke(isDarkMode ? color(0, 0, 100, 10) : color(0, 0, 0, 15));
    strokeWeight(1);

    for (let x = 0; x < width; x += spacing * 2) line(x, 0, x, height);
    for (let y = 0; y < height; y += spacing * 2) line(0, y, width, y);
}

function windowResized() {
    setSeeds();
    cs = min(windowHeight, windowWidth);
    resizeCanvas(cs, cs);
    spacing = cs * 0.02;
    cols = floor(width / spacing);
    rows = floor(height / spacing);
    
    freq1 = random(0.5, 3) / cs;
    freq2 = random(0.5, 3) / cs;
    freq3 = random(0.1, 2) / cs;
    phase1 = random(100);
    phase2 = random(100);
    phase3 = random(100);
    angleMultiplier = random(0.5, 2);
    
    redraw();
}