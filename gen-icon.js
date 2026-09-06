const fs = require("fs");
const { createCanvas } = require("canvas");

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawIcon(size) {
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");
  const s = size / 512; // scale factor

  // Sunny background (full-bleed for maskable icons)
  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, "#ffd23f");
  bg.addColorStop(1, "#ff9f1c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Soft top-left glow
  const glow = ctx.createRadialGradient(size * 0.3, size * 0.28, 0, size * 0.3, size * 0.28, size * 0.7);
  glow.addColorStop(0, "rgba(255,255,255,0.35)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Drop shadow for the brick
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 26 * s;
  ctx.shadowOffsetY = 14 * s;

  // Studs (drawn first, brick body overlaps their lower half → 3D)
  const studCenters = [136, 216, 296, 376];
  const studTop = 150 * s, studH = 70 * s, studW = 54 * s, studR = 16 * s;
  const studGrad = ctx.createLinearGradient(0, studTop, 0, studTop + studH);
  studGrad.addColorStop(0, "#7db3ff");
  studGrad.addColorStop(1, "#3f7fe6");
  studCenters.forEach(cx => {
    ctx.fillStyle = studGrad;
    rr(ctx, cx * s - studW / 2, studTop, studW, studH, studR);
    ctx.fill();
    // stud top highlight
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx * s, studTop + 8 * s, studW / 2, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "rgba(0,0,0,0.28)";
  });

  // Brick body
  const bx = 96 * s, by = 196 * s, bw = 320 * s, bh = 210 * s, br = 40 * s;
  const brick = ctx.createLinearGradient(0, by, 0, by + bh);
  brick.addColorStop(0, "#5aa0ff");
  brick.addColorStop(1, "#2f6fe0");
  ctx.fillStyle = brick;
  rr(ctx, bx, by, bw, bh, br);
  ctx.fill();
  ctx.restore();

  // Glossy highlight across the top of the brick
  ctx.save();
  rr(ctx, bx, by, bw, bh, br);
  ctx.clip();
  const gloss = ctx.createLinearGradient(0, by, 0, by + bh * 0.5);
  gloss.addColorStop(0, "rgba(255,255,255,0.28)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.fillRect(bx, by, bw, bh * 0.5);
  ctx.restore();

  // "ABC" letters
  ctx.font = `900 ${138 * s}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tx = bx + bw / 2, ty = by + bh / 2 + 6 * s;
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillText("ABC", tx, ty + 4 * s);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("ABC", tx, ty);

  return c;
}

[["icons/icon-512.png", 512], ["icons/icon-192.png", 192], ["icons/favicon.png", 64]].forEach(([p, sz]) => {
  fs.writeFileSync(p, drawIcon(sz).toBuffer("image/png"));
  console.log("wrote", p, sz);
});
