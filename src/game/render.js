import { ARENA_W, ARENA_H, GROUND_Y, ENTITY_HEIGHT } from './constants.js';

function drawDefaultBackground(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#0a0e17');
  g.addColorStop(0.55, '#0d1320');
  g.addColorStop(1, '#05070a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  ctx.save();
  ctx.globalAlpha = 0.55;
  const grd = ctx.createRadialGradient(ARENA_W / 2, GROUND_Y - 40, 60, ARENA_W / 2, GROUND_Y - 40, 600);
  grd.addColorStop(0, 'rgba(125, 211, 252, 0.18)');
  grd.addColorStop(1, 'rgba(125, 211, 252, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(125, 211, 252, 0.05)';
  for (let i = 0; i < 6; i++) {
    const x = 120 + i * 200;
    ctx.fillRect(x, 200, 14, GROUND_Y - 200);
  }
  ctx.restore();

  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#1a2233');
  gg.addColorStop(1, '#080a10');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const y = GROUND_Y + i * 8 + (i * i * 0.6);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ARENA_W, y);
    ctx.stroke();
  }
}

function drawRooftopBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#0f1419');
  g.addColorStop(0.5, '#1a2332');
  g.addColorStop(1, '#0a0d12');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Neon lights
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const x = (i * ARENA_W / 8) + Math.sin(time * 0.01 + i) * 20;
    const brightness = 0.3 + Math.sin(time * 0.02 + i) * 0.2;
    ctx.globalAlpha = brightness;
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(x, 50, 40, 8);
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#1a1f2e');
  gg.addColorStop(1, '#0d0f15');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

function drawTempleBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#1a1410');
  g.addColorStop(0.5, '#2d2416');
  g.addColorStop(1, '#0f0a05');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Floating dust
  ctx.save();
  ctx.fillStyle = 'rgba(253, 211, 77, 0.08)';
  for (let i = 0; i < 12; i++) {
    const x = (i * ARENA_W / 12 + Math.sin(time * 0.005 + i) * 40) % ARENA_W;
    const y = 100 + Math.sin(time * 0.003 + i * 2) * 80;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#3d342a');
  gg.addColorStop(1, '#1a140a');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(253, 211, 77, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

function drawMountainBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#e0f2fe');
  g.addColorStop(0.5, '#a5f3fc');
  g.addColorStop(1, '#164e63');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Snow particles
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 20; i++) {
    const x = (i * ARENA_W / 20 + time * 0.05) % ARENA_W;
    const y = Math.sin(time * 0.003 + i) * 100 + ARENA_H / 3;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#f0f9ff');
  gg.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(165, 243, 252, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

function drawCyberlabBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#1e1b4b');
  g.addColorStop(0.5, '#2d1b69');
  g.addColorStop(1, '#0f051f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Glitch lines
  ctx.save();
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const offset = Math.sin(time * 0.05 + i) * 20;
    ctx.beginPath();
    ctx.moveTo(0, ARENA_H / 10 * i + offset);
    ctx.lineTo(ARENA_W, ARENA_H / 10 * i + offset);
    ctx.stroke();
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#3d2d5f');
  gg.addColorStop(1, '#1a0a3d');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

function drawForestBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#1f3a2d');
  g.addColorStop(0.5, '#2d4a3f');
  g.addColorStop(1, '#0f1f17');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Falling leaves
  ctx.save();
  for (let i = 0; i < 15; i++) {
    const x = (i * ARENA_W / 15 + Math.sin(time * 0.01 + i) * 60) % ARENA_W;
    const y = (time * 0.2 + i * 50) % ARENA_H;
    ctx.fillStyle = `rgba(52, 211, 153, ${0.3 + Math.sin(time * 0.02 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#4a6b5d');
  gg.addColorStop(1, '#1a2d23');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

function drawScrapyardBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#3d2817');
  g.addColorStop(0.5, '#5c3d2e');
  g.addColorStop(1, '#1a0f05');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Dust clouds
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const x = (i * ARENA_W / 8 + Math.sin(time * 0.01 + i) * 50) % ARENA_W;
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'rgba(251, 146, 60, 0.2)';
    ctx.beginPath();
    ctx.arc(x, 150 + Math.cos(time * 0.01 + i * 2) * 50, 60, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Ground
  const gg = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
  gg.addColorStop(0, '#6b4423');
  gg.addColorStop(1, '#2a1505');
  ctx.fillStyle = gg;
  ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

  ctx.strokeStyle = 'rgba(251, 146, 60, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(ARENA_W, GROUND_Y);
  ctx.stroke();
}

export function drawBackground(ctx, stage = 'rooftop', time = 0) {
  switch (stage) {
    case 'rooftop':
      drawRooftopBackground(ctx, time);
      break;
    case 'temple':
      drawTempleBackground(ctx, time);
      break;
    case 'mountain':
      drawMountainBackground(ctx, time);
      break;
    case 'cyberlab':
      drawCyberlabBackground(ctx, time);
      break;
    case 'forest':
      drawForestBackground(ctx, time);
      break;
    case 'scrapyard':
      drawScrapyardBackground(ctx, time);
      break;
    default:
      drawDefaultBackground(ctx);
  }
}

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function bodyPose(ent) {
  const t = ent.animTime;
  const f = ent.facing;
  let legSwing = 0, armSwing = 0, bob = 0, tilt = 0, weaponAngle = 0;
  const state = ent.state;

  if (state === 'run') {
    legSwing = Math.sin(t * 0.35) * 0.9;
    armSwing = Math.sin(t * 0.35 + Math.PI) * 0.6;
    bob = Math.abs(Math.sin(t * 0.7)) * 3;
  } else if (state === 'idle') {
    bob = Math.sin(t * 0.06) * 1.5;
    armSwing = Math.sin(t * 0.05) * 0.06;
    weaponAngle = Math.sin(t * 0.05) * 0.05;
  } else if (state === 'jump') {
    legSwing = ent.vel.vy < 0 ? -0.6 : 0.4;
    armSwing = -0.4;
  } else if (state === 'hurt') {
    tilt = -0.25 * f;
    armSwing = 0.6;
    legSwing = -0.4;
  } else if (state === 'cast' && ent.action) {
    const a = ent.action;
    const def = a.def;
    const total = def.windup + def.active + def.recovery;
    let local = a.phaseTime;
    if (a.phase === 'active') local += def.windup;
    if (a.phase === 'recovery') local += def.windup + def.active;
    const p = total > 0 ? local / total : 0;

    if (def.type === 'melee') {
      weaponAngle = lerp(-1.0, 1.4, p);
      armSwing = lerp(-0.8, 0.8, p);
      bob = Math.sin(p * Math.PI) * -2;
    } else if (def.type === 'projectile' || def.type === 'rain') {
      weaponAngle = lerp(-0.4, 0.8, Math.min(1, p * 1.3));
      armSwing = -1.0;
    } else if (def.type === 'dashStrike' || def.type === 'charge') {
      weaponAngle = 1.0;
      armSwing = 0.8;
      legSwing = 0.6;
    } else if (def.type === 'parry') {
      weaponAngle = -0.5;
      armSwing = -0.3;
    } else if (def.type === 'shadowStep' || def.type === 'teleport') {
      armSwing = -0.6;
      weaponAngle = -0.8;
    } else if (def.type === 'smokeBomb') {
      armSwing = -1.0;
      weaponAngle = -0.6;
      bob = -2;
    } else if (def.type === 'deathMark') {
      armSwing = 1.2;
      weaponAngle = 1.4;
      bob = Math.sin(p * Math.PI) * -3;
    } else if (def.type === 'flameDash') {
      weaponAngle = 1.0;
      armSwing = 0.8;
      legSwing = 0.6;
    } else if (def.type === 'lavaPool') {
      armSwing = -0.8;
      weaponAngle = -1.0;
      bob = -2;
    } else if (def.type === 'eruption') {
      armSwing = -1.4;
      weaponAngle = -1.6;
      bob = -4;
    } else if (def.type === 'piercingShot') {
      weaponAngle = lerp(-0.6, 0.6, Math.min(1, p * 1.5));
      armSwing = -1.2;
      bob = Math.sin(p * Math.PI) * -2;
    } else if (def.type === 'arrowStorm') {
      weaponAngle = Math.sin(a.phaseTime * 0.15) * 0.4;
      armSwing = -0.8;
    } else if (def.type === 'backflip') {
      weaponAngle = -0.5;
      armSwing = -0.6;
      legSwing = -0.4;
    } else if (def.type === 'summon' || def.type === 'titan') {
      armSwing = -1.2;
      weaponAngle = -1.0;
      bob = Math.sin(p * Math.PI) * -3;
    } else if (def.type === 'boneShield') {
      armSwing = -0.8;
      weaponAngle = -0.5;
    } else if (def.type === 'nova') {
      armSwing = -1.2;
      weaponAngle = -1.4;
      bob = -3;
    } else if (def.type === 'meteor') {
      armSwing = -1.4;
      weaponAngle = -1.6;
      bob = -4;
    } else if (def.type === 'slam') {
      if (a.phase === 'windup') {
        weaponAngle = lerp(0, -1.2, a.phaseTime / Math.max(1, def.windup));
        armSwing = lerp(0, -1.2, a.phaseTime / Math.max(1, def.windup));
        bob = -4;
      } else {
        weaponAngle = 1.4;
        armSwing = 1.2;
      }
    } else if (def.type === 'spin') {
      weaponAngle = (a.phaseTime * 0.5) % (Math.PI * 2) - Math.PI;
      armSwing = Math.sin(a.phaseTime * 0.5) * 1.0;
    } else if (def.type === 'buff') {
      weaponAngle = -0.6;
      armSwing = -1.2;
    } else if (def.type === 'vault') {
      weaponAngle = -0.5;
      armSwing = -0.6;
      legSwing = -0.4;
    }
  }
  return { legSwing, armSwing, bob, tilt, weaponAngle };
}

export function drawStickman(ctx, ent) {
  const f = ent.facing;
  const ch = ent.character;
  const pose = bodyPose(ent);
  const x = ent.pos.x;
  const groundY = ent.pos.y;

  ctx.save();
  ctx.translate(x, groundY + pose.bob);
  ctx.rotate(pose.tilt);

  // stealth — assassin fades out; player sees themselves at 50%, enemy sees at 15%
  if (ent.stealth > 0) {
    const targetAlpha = ent.isPlayer ? 0.5 : 0.15;
    const stealthAlpha = Math.min(targetAlpha, ent.stealth / 150 * targetAlpha);
    ctx.globalAlpha = stealthAlpha;
  }

  if (ent.buff && ent.buff.duration > 0) {
    ctx.save();
    ctx.globalAlpha = 0.5 + Math.sin(ent.animTime * 0.3) * 0.2;
    const aura = ctx.createRadialGradient(0, -ENTITY_HEIGHT / 2, 10, 0, -ENTITY_HEIGHT / 2, 70);
    aura.addColorStop(0, ch.color);
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -ENTITY_HEIGHT / 2, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (ent.frozen > 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#a5f3fc';
    ctx.beginPath();
    ctx.arc(0, -ENTITY_HEIGHT / 2, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const flash = ent.flashTime > 0;
  const lineColor = flash ? '#ffffff' : (ent.dead ? '#5b6477' : ch.color);
  const accent = flash ? '#ffffff' : ch.accent;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const hipY = -36;
  const legLen = 32;
  const lA = pose.legSwing;
  const rA = -pose.legSwing;
  const lFootX = Math.sin(lA) * legLen;
  const lFootY = Math.cos(lA) * legLen + hipY;
  const rFootX = Math.sin(rA) * legLen;
  const rFootY = Math.cos(rA) * legLen + hipY;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(lFootX, lFootY);
  ctx.moveTo(0, hipY); ctx.lineTo(rFootX, rFootY);
  ctx.stroke();

  const chestY = -ENTITY_HEIGHT + 24;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(0, chestY);
  ctx.stroke();

  const headR = 11;
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(0, chestY - headR - 1, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.fillRect(-headR + 2, chestY - headR - 2, headR * 2 - 4, 2.2);
  drawHeadgear(ctx, ch, chestY, headR, accent, lineColor, f);

  const shoulderY = chestY + 6;
  const armLen = 28;
  const backArmA = -pose.armSwing * 0.5;
  const backHandX = Math.sin(backArmA) * armLen * 0.8;
  const backHandY = Math.cos(backArmA) * armLen * 0.8 + shoulderY;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 4.2;
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(backHandX, backHandY);
  ctx.stroke();

  const weaponBase = pose.weaponAngle;
  const armHandX = Math.sin(weaponBase) * armLen * f;
  const armHandY = Math.cos(weaponBase) * armLen + shoulderY;
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(armHandX, armHandY);
  ctx.stroke();

  drawWeapon(ctx, ch, armHandX, armHandY, weaponBase, f, accent);

  ctx.restore();

  if (ent.parryActive > 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, groundY - ENTITY_HEIGHT / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (ent.shield && ent.shield.hp > 0) {
    ctx.save();
    const shieldAlpha = 0.5 + Math.sin(ent.animTime * 0.2) * 0.15;
    ctx.globalAlpha = shieldAlpha;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, groundY - ENTITY_HEIGHT / 2, 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = shieldAlpha * 0.25;
    ctx.fillStyle = '#34d399';
    ctx.fill();
    ctx.restore();
  }
}

function drawHeadgear(ctx, ch, chestY, headR, accent, line, f) {
  ctx.save();
  ctx.fillStyle = accent;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  switch (ch.id) {
    case 'sword':
      ctx.fillRect(-headR, chestY - headR - 14, headR * 2, 4);
      break;
    case 'spear':
      ctx.beginPath();
      ctx.moveTo(-headR, chestY - headR - 3);
      ctx.lineTo(0, chestY - headR - 18);
      ctx.lineTo(headR, chestY - headR - 3);
      ctx.closePath();
      ctx.fill();
      break;
    case 'mage':
      ctx.beginPath();
      ctx.moveTo(-headR - 2, chestY - headR - 2);
      ctx.lineTo(headR + 2, chestY - headR - 2);
      ctx.lineTo(2 * f, chestY - headR - 28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(2 * f, chestY - headR - 28, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'brute':
      ctx.fillRect(-headR + 1, chestY - headR - 12, headR * 2 - 2, 4);
      ctx.beginPath();
      ctx.moveTo(-headR + 2, chestY - headR - 8);
      ctx.lineTo(-headR + 5, chestY - headR - 18);
      ctx.lineTo(-headR + 8, chestY - headR - 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(headR - 8, chestY - headR - 8);
      ctx.lineTo(headR - 5, chestY - headR - 20);
      ctx.lineTo(headR - 2, chestY - headR - 8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'assassin':
      // hood
      ctx.beginPath();
      ctx.arc(0, chestY - headR - 2, headR + 3, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = line;
      ctx.fillRect(-headR - 2, chestY - headR - 2, (headR + 2) * 2, 5);
      break;
    case 'archer':
      // ranger cap
      ctx.beginPath();
      ctx.moveTo(-headR - 3, chestY - headR);
      ctx.lineTo(headR + 3, chestY - headR);
      ctx.lineTo(headR, chestY - headR - 8);
      ctx.lineTo(4 * f, chestY - headR - 18);
      ctx.lineTo(-headR + 2, chestY - headR - 8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'elemental':
      // flame crown
      for (let fi = -1; fi <= 1; fi++) {
        ctx.fillStyle = fi === 0 ? '#fbbf24' : accent;
        ctx.beginPath();
        ctx.moveTo(fi * headR * 0.6 - 3, chestY - headR - 2);
        ctx.lineTo(fi * headR * 0.6, chestY - headR - 10 - Math.abs(fi) * 4);
        ctx.lineTo(fi * headR * 0.6 + 3, chestY - headR - 2);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case 'summoner':
      // bone crown
      ctx.fillRect(-headR, chestY - headR - 10, headR * 2, 4);
      for (let si = 0; si < 3; si++) {
        const sx = -headR + si * headR;
        ctx.beginPath();
        ctx.moveTo(sx - 2, chestY - headR - 6);
        ctx.lineTo(sx, chestY - headR - 18);
        ctx.lineTo(sx + 2, chestY - headR - 6);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case 'paladin':
      // holy helm
      ctx.fillRect(-headR - 2, chestY - headR - 10, headR * 2 + 4, 4);
      ctx.beginPath();
      ctx.moveTo(-headR - 2, chestY - headR - 6);
      ctx.lineTo(-headR - 6, chestY - headR - 16);
      ctx.lineTo(headR + 6, chestY - headR - 16);
      ctx.lineTo(headR + 2, chestY - headR - 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = line;
      ctx.fillRect(-1, chestY - headR - 6, 2, 10);
      break;
    case 'berserker':
      // horned helm
      ctx.fillRect(-headR, chestY - headR - 8, headR * 2, 3);
      ctx.beginPath();
      ctx.moveTo(-headR - 2, chestY - headR - 5);
      ctx.lineTo(-headR - 8, chestY - headR - 18);
      ctx.lineTo(-headR - 4, chestY - headR - 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(headR + 2, chestY - headR - 5);
      ctx.lineTo(headR + 8, chestY - headR - 18);
      ctx.lineTo(headR + 4, chestY - headR - 5);
      ctx.closePath();
      ctx.fill();
      break;
    case 'gunslinger':
      // cowboy hat
      ctx.beginPath();
      ctx.ellipse(0, chestY - headR - 8, headR + 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-headR, chestY - headR - 5, headR * 2, 4);
      break;
    case 'necromancer':
      // reaper hood
      ctx.beginPath();
      ctx.arc(0, chestY - headR - 1, headR + 3, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = line;
      ctx.fillRect(-headR - 3, chestY - headR - 1, (headR + 3) * 2, 4);
      ctx.fillStyle = accent;
      // glowing eyes
      ctx.beginPath();
      ctx.arc(-headR / 2, chestY - headR - 4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headR / 2, chestY - headR - 4, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function drawWeapon(ctx, ch, hx, hy, weaponBase, f, accent) {
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(weaponBase * f);
  switch (ch.weapon) {
    case 'sword':
      ctx.fillStyle = accent;
      ctx.fillRect(-3 * f, -3, 8 * f, 6);
      ctx.fillRect(2 * f, -8, 3 * f, 16);
      ctx.fillStyle = '#e6ebf5';
      ctx.beginPath();
      ctx.moveTo(5 * f, -3);
      ctx.lineTo(48 * f, -2);
      ctx.lineTo(54 * f, 0);
      ctx.lineTo(48 * f, 2);
      ctx.lineTo(5 * f, 3);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    case 'spear':
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18 * f, 0);
      ctx.lineTo(72 * f, 0);
      ctx.stroke();
      ctx.fillStyle = '#e6ebf5';
      ctx.beginPath();
      ctx.moveTo(72 * f, -6);
      ctx.lineTo(92 * f, 0);
      ctx.lineTo(72 * f, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fillRect(-4 * f, -3, 16 * f, 6);
      break;
    case 'staff': {
      ctx.strokeStyle = '#5b21b6';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-14 * f, 8);
      ctx.lineTo(40 * f, -28);
      ctx.stroke();
      const orbX = 40 * f, orbY = -28;
      const grad = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, 14);
      grad.addColorStop(0, '#fde68a');
      grad.addColorStop(0.5, ch.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'fists':
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(8 * f, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#1f2937';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(11 * f, i * 3, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'daggers':
      // dual daggers — front dagger
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.moveTo(6 * f, -2);
      ctx.lineTo(34 * f, -1);
      ctx.lineTo(38 * f, 0);
      ctx.lineTo(34 * f, 1);
      ctx.lineTo(6 * f, 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(2 * f, -4, 6 * f, 8);
      // back dagger offset
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.moveTo(4 * f, -8);
      ctx.lineTo(30 * f, -7);
      ctx.lineTo(34 * f, -6);
      ctx.lineTo(30 * f, -5);
      ctx.lineTo(4 * f, -6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case 'bow': {
      // bow body
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, -0.9, 0.9, false);
      ctx.stroke();
      // string
      ctx.strokeStyle = '#e6ebf5';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(22 * Math.cos(-0.9) * f, 22 * Math.sin(-0.9));
      ctx.lineTo(22 * Math.cos(0.9) * f, 22 * Math.sin(0.9));
      ctx.stroke();
      // nocked arrow
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4 * f, 0);
      ctx.lineTo(28 * f, 0);
      ctx.stroke();
      ctx.fillStyle = '#e6ebf5';
      ctx.beginPath();
      ctx.moveTo(28 * f, -3);
      ctx.lineTo(36 * f, 0);
      ctx.lineTo(28 * f, 3);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'flame': {
      // flame wand
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-10 * f, 4);
      ctx.lineTo(32 * f, -20);
      ctx.stroke();
      // flame tip
      const fx = 32 * f, fy = -20;
      const flameGrad = ctx.createRadialGradient(fx, fy, 1, fx, fy, 16);
      flameGrad.addColorStop(0, '#fff');
      flameGrad.addColorStop(0.3, '#fbbf24');
      flameGrad.addColorStop(0.7, '#fb923c');
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, 16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'tome': {
      // spell tome
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-10 * f, -16, 20 * f, 28);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(-8 * f, -14, 16 * f, 4);
      ctx.fillRect(-8 * f, -8, 16 * f, 4);
      ctx.fillRect(-8 * f, -2, 10 * f, 4);
      // glowing rune
      const tomeGrad = ctx.createRadialGradient(0, -4, 1, 0, -4, 10);
      tomeGrad.addColorStop(0, 'rgba(52,211,153,0.8)');
      tomeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = tomeGrad;
      ctx.beginPath();
      ctx.arc(0, -4, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'axe': {
      // berserker battle axe
      ctx.fillStyle = '#8b7355';
      ctx.fillRect(-2 * f, -2, 6 * f, 4);
      ctx.fillRect(3 * f, -28, 3 * f, 32);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(4 * f, -28);
      ctx.lineTo(28 * f, -32);
      ctx.lineTo(28 * f, -20);
      ctx.lineTo(4 * f, -16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }
    case 'guns': {
      // dual pistols
      // right gun
      ctx.fillStyle = '#27272a';
      ctx.fillRect(4 * f, -6, 28 * f, 4);
      ctx.fillRect(14 * f, -10, 4 * f, 8);
      ctx.fillStyle = accent;
      ctx.fillRect(32 * f, -5, 8 * f, 3);
      // left gun
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2 * f, 4, 26 * f, 4);
      ctx.fillRect(12 * f, 4, 4 * f, 8);
      ctx.fillStyle = accent;
      ctx.fillRect(28 * f, 5, 8 * f, 3);
      ctx.globalAlpha = 1;
      break;
    }
    case 'scythe': {
      // necromancer scythe
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-12 * f, 6);
      ctx.lineTo(28 * f, -32);
      ctx.stroke();
      // blade
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(28 * f, -32, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.moveTo(28 * f - 6, -32);
      ctx.lineTo(28 * f + 6, -32);
      ctx.lineTo(28 * f, -24);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

export function drawStickmanPortrait(ctx, ch, x, y, t) {
  const fakeEnt = {
    pos: { x, y }, vel: { vx: 0, vy: 0 }, facing: 1,
    animTime: t, state: 'idle', character: ch,
    flashTime: 0, dead: false, action: null,
    parryActive: 0, frozen: 0, stealth: 0, shield: null, buff: null
  };
  drawStickman(ctx, fakeEnt);
}

export function drawProjectile(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.kind === 'bolt') {
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, 14);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.4, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === 'spear') {
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-26, 0); ctx.lineTo(14, 0);
    ctx.stroke();
    ctx.fillStyle = '#e6ebf5';
    ctx.beginPath();
    ctx.moveTo(14, -5);
    ctx.lineTo(28, 0);
    ctx.lineTo(14, 5);
    ctx.closePath();
    ctx.fill();
  } else if (p.kind === 'arrow' || p.kind === 'arrow-pierce') {
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-18, 0); ctx.lineTo(10, 0);
    ctx.stroke();
    ctx.fillStyle = p.kind === 'arrow-pierce' ? '#ffffff' : p.color;
    ctx.beginPath();
    ctx.moveTo(10, -4);
    ctx.lineTo(20, 0);
    ctx.lineTo(10, 4);
    ctx.closePath();
    ctx.fill();
    if (p.kind === 'arrow-pierce') {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-18, 0); ctx.lineTo(20, 0);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawMinion(ctx, m, tick) {
  ctx.save();
  ctx.translate(m.x, m.y);
  const bob = Math.abs(Math.sin(m.animTime * 0.25)) * 2;
  ctx.translate(0, -bob);

  const color = m.owner.character.color;
  const alpha = Math.min(1, m.life / 60);
  ctx.globalAlpha = alpha;

  if (m.isTitan) {
    // large bone titan
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    // body
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, -60); ctx.stroke();
    // head
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, -72, 14, 0, Math.PI * 2); ctx.fill();
    // arms
    const armSwing = Math.sin(m.animTime * 0.2) * 0.4;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -52); ctx.lineTo(-28 + armSwing * 10, -36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -52); ctx.lineTo(28 - armSwing * 10, -36); ctx.stroke();
    // legs
    const legSwing = Math.sin(m.animTime * 0.25) * 0.5;
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-16 + legSwing * 8, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(16 - legSwing * 8, 4); ctx.stroke();
    // glow
    const grd = ctx.createRadialGradient(0, -46, 8, 0, -46, 40);
    grd.addColorStop(0, color + '44');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(0, -46, 40, 0, Math.PI * 2); ctx.fill();
    // hp bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-22, -92, 44, 6);
    ctx.fillStyle = color;
    ctx.fillRect(-22, -92, 44 * (m.hp / m.maxHp), 6);
  } else {
    // small bone minion
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -38); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, -46, 9, 0, Math.PI * 2); ctx.fill();
    const aSwing = Math.sin(m.animTime * 0.25) * 0.4;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(-18 + aSwing * 6, -22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(18 - aSwing * 6, -22); ctx.stroke();
    const lSwing = Math.sin(m.animTime * 0.3) * 0.4;
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(-10 + lSwing * 5, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10 - lSwing * 5, 4); ctx.stroke();
    // hp bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-16, -60, 32, 4);
    ctx.fillStyle = color;
    ctx.fillRect(-16, -60, 32 * (m.hp / m.maxHp), 4);
  }
  ctx.restore();
}

export function drawEffects(ctx, world) {
  // lava pools
  if (world.lavaPools) {
    for (const pool of world.lavaPools) {
      ctx.save();
      const pulseFactor = 0.85 + Math.sin(world.tick * 0.12) * 0.15;
      const lavaGrad = ctx.createRadialGradient(pool.x, pool.y, 4, pool.x, pool.y, pool.radius * pulseFactor);
      lavaGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
      lavaGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.45)');
      lavaGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = lavaGrad;
      ctx.beginPath();
      ctx.ellipse(pool.x, pool.y - 4, pool.radius * pulseFactor, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  for (const s of world.shockwaves) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.strokeStyle = s.color;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -10, 18, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const f of world.fallingObjects) {
    if (f.delay && f.delay > 0) {
      ctx.save();
      ctx.translate(f.x, GROUND_Y);
      ctx.strokeStyle = f.kind === 'meteor' ? '#fbbf24' : '#fde68a';
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, -2, f.radius * 0.45, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.save();
    ctx.translate(f.x, f.y);
    if (f.kind === 'meteor') {
      const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 28);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.4, '#fbbf24');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.kind === 'eruption') {
      const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 30);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.3, '#fbbf24');
      grad.addColorStop(0.6, '#fb923c');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.rotate(Math.PI / 2);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-30, 0); ctx.lineTo(14, 0);
      ctx.stroke();
      ctx.fillStyle = '#e6ebf5';
      ctx.beginPath();
      ctx.moveTo(14, -6);
      ctx.lineTo(30, 0);
      ctx.lineTo(14, 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  for (const p of world.particles) {
    const a = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = p.fade ? a : 1;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (0.6 + a * 0.6), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const e of world.effects) {
    const a = Math.max(0, e.life / e.maxLife);
    ctx.save();
    if (e.kind === 'ring') {
      ctx.globalAlpha = a;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.kind === 'slash') {
      ctx.globalAlpha = a * 0.85;
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 4 * a + 2;
      ctx.beginPath();
      ctx.arc(0, 0, e.length * 0.5, -0.7, 0.7);
      ctx.stroke();
      ctx.globalAlpha = a * 0.4;
      ctx.lineWidth = 12 * a;
      ctx.stroke();
    } else if (e.kind === 'shockwave') {
      ctx.globalAlpha = a * 0.8;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = e.width * (1 - a * 0.5);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = a * 0.3;
      ctx.lineWidth = e.width * 3;
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function renderWorld(ctx, world, stage = 'rooftop', time = 0) {
  let sx = 0, sy = 0;
  if (world.shake.mag > 0) {
    sx = (Math.random() - 0.5) * world.shake.mag;
    sy = (Math.random() - 0.5) * world.shake.mag;
  }
  ctx.save();
  ctx.translate(sx, sy);
  drawBackground(ctx, stage, time);

  const ents = [world.player, world.enemy].slice().sort((a, b) => a.pos.y - b.pos.y);
  for (const ent of ents) drawStickman(ctx, ent);

  // draw minions
  if (world.minions) {
    for (const m of world.minions) {
      if (m.dead) continue;
      drawMinion(ctx, m, world.tick);
    }
  }

  for (const p of world.projectiles) drawProjectile(ctx, p);

  drawEffects(ctx, world);

  ctx.restore();
}
