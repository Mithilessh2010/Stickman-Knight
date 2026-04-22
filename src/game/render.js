import { ARENA_W, ARENA_H, GROUND_Y, ENTITY_HEIGHT } from './constants.js';

export function drawBackground(ctx) {
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
    } else if (def.type === 'teleport') {
      armSwing = -0.6;
      weaponAngle = -0.8;
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
  }
  ctx.restore();
}

export function drawStickmanPortrait(ctx, ch, x, y, t) {
  const fakeEnt = {
    pos: { x, y }, vel: { vx: 0, vy: 0 }, facing: 1,
    animTime: t, state: 'idle', character: ch,
    flashTime: 0, dead: false, action: null,
    parryActive: 0, frozen: 0, buff: null
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
  }
  ctx.restore();
}

export function drawEffects(ctx, world) {
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
    }
    ctx.restore();
  }
}

export function renderWorld(ctx, world) {
  let sx = 0, sy = 0;
  if (world.shake.mag > 0) {
    sx = (Math.random() - 0.5) * world.shake.mag;
    sy = (Math.random() - 0.5) * world.shake.mag;
  }
  ctx.save();
  ctx.translate(sx, sy);
  drawBackground(ctx);

  const ents = [world.player, world.enemy].slice().sort((a, b) => a.pos.y - b.pos.y);
  for (const ent of ents) drawStickman(ctx, ent);

  for (const p of world.projectiles) drawProjectile(ctx, p);

  drawEffects(ctx, world);

  ctx.restore();
}
