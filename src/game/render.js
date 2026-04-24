import { ARENA_W, ARENA_H, GROUND_Y, ENTITY_HEIGHT, BLAST_ZONE } from './constants.js';
import { STAGE_PLATFORMS } from './stage.js';

function drawLowerAtmosphere(ctx, colors) {
  const g = ctx.createLinearGradient(0, GROUND_Y - 60, 0, ARENA_H);
  g.addColorStop(0, colors[0]);
  g.addColorStop(0.55, colors[1]);
  g.addColorStop(1, colors[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, GROUND_Y - 60, ARENA_W, ARENA_H - (GROUND_Y - 60));

  ctx.save();
  ctx.globalAlpha = 0.28;
  const glow = ctx.createRadialGradient(ARENA_W / 2, GROUND_Y + 30, 10, ARENA_W / 2, GROUND_Y + 30, 420);
  glow.addColorStop(0, colors[3]);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, GROUND_Y - 80, ARENA_W, ARENA_H - (GROUND_Y - 80));
  ctx.restore();
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawArenaPlatform(ctx, platform, time, isMain) {
  const topY = platform.y;
  const halfW = platform.width / 2;
  const left = platform.x - halfW;
  const right = platform.x + halfW;
  const depth = platform.depth;
  const skirt = platform.skirt;
  const lip = platform.lip;

  ctx.save();

  ctx.globalAlpha = isMain ? 0.32 : 0.22;
  const shadow = ctx.createRadialGradient(platform.x, topY + 38, 20, platform.x, topY + 38, platform.width * 0.55);
  shadow.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
  shadow.addColorStop(1, 'transparent');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(platform.x, topY + 34, platform.width * 0.52, isMain ? 42 : 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const islandBottom = topY + skirt;
  const underside = ctx.createLinearGradient(0, topY + 6, 0, islandBottom);
  underside.addColorStop(0, isMain ? '#26364f' : '#24344b');
  underside.addColorStop(1, isMain ? '#0f1728' : '#121b2c');
  ctx.fillStyle = underside;
  ctx.beginPath();
  ctx.moveTo(left + lip, topY + 6);
  ctx.quadraticCurveTo(platform.x, topY + 18, right - lip, topY + 6);
  ctx.lineTo(right - lip * 0.8, islandBottom - 8);
  ctx.quadraticCurveTo(platform.x + halfW * 0.25, islandBottom + 12, platform.x, islandBottom);
  ctx.quadraticCurveTo(platform.x - halfW * 0.25, islandBottom + 12, left + lip * 0.8, islandBottom - 8);
  ctx.closePath();
  ctx.fill();

  const top = ctx.createLinearGradient(0, topY - 10, 0, topY + depth);
  top.addColorStop(0, '#f8fafc');
  top.addColorStop(0.22, isMain ? '#d7ecff' : '#dbeafe');
  top.addColorStop(0.9, isMain ? '#83a7c7' : '#8fb0cd');
  ctx.fillStyle = top;
  roundedRectPath(ctx, left, topY - 10, platform.width, depth, 16);
  ctx.fill();

  const moss = ctx.createLinearGradient(0, topY - 10, 0, topY + 8);
  moss.addColorStop(0, 'rgba(255,255,255,0.7)');
  moss.addColorStop(1, isMain ? 'rgba(148, 163, 184, 0.5)' : 'rgba(125, 211, 252, 0.35)');
  ctx.fillStyle = moss;
  ctx.fillRect(left + 12, topY - 8, platform.width - 24, 6);

  ctx.save();
  ctx.globalAlpha = 0.7 + Math.sin(time * 0.06 + platform.x * 0.01) * 0.08;
  ctx.shadowColor = isMain ? 'rgba(125, 211, 252, 0.55)' : 'rgba(191, 219, 254, 0.45)';
  ctx.shadowBlur = isMain ? 16 : 10;
  ctx.strokeStyle = isMain ? 'rgba(186, 230, 253, 0.8)' : 'rgba(219, 234, 254, 0.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left + 14, topY - 2);
  ctx.lineTo(right - 14, topY - 2);
  ctx.stroke();
  ctx.restore();

  if (isMain) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.ellipse(platform.x, topY + 12, platform.width * 0.32, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStage(ctx, time) {
  for (const platform of STAGE_PLATFORMS) {
    drawArenaPlatform(ctx, platform, time, platform.id === 'main');
  }
}

function drawDefaultBackground(ctx) {
  // Deep dark sky
  const g = ctx.createLinearGradient(0, 0, 0, ARENA_H);
  g.addColorStop(0, '#04060b');
  g.addColorStop(0.5, '#060a12');
  g.addColorStop(1, '#020407');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);

  // Center radial glow
  ctx.save();
  const grd = ctx.createRadialGradient(ARENA_W / 2, GROUND_Y - 20, 0, ARENA_W / 2, GROUND_Y - 20, 500);
  grd.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
  grd.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.restore();

  // Vertical accent pillars
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 210;
    const pillarG = ctx.createLinearGradient(0, 100, 0, GROUND_Y);
    pillarG.addColorStop(0, 'rgba(0, 229, 255, 0)');
    pillarG.addColorStop(0.5, 'rgba(0, 229, 255, 0.04)');
    pillarG.addColorStop(1, 'rgba(0, 229, 255, 0.01)');
    ctx.fillStyle = pillarG;
    ctx.fillRect(x - 1, 80, 2, GROUND_Y - 80);
  }
  ctx.restore();

  drawLowerAtmosphere(ctx, ['rgba(8, 15, 26, 0)', 'rgba(8, 15, 26, 0.55)', '#02050b', 'rgba(0, 229, 255, 0.14)']);
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
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(x, 50, 40, 8);
  }
  ctx.restore();

  drawLowerAtmosphere(ctx, ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.45)', '#070b13', 'rgba(0, 229, 255, 0.15)']);
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

  drawLowerAtmosphere(ctx, ['rgba(61, 52, 42, 0)', 'rgba(61, 52, 42, 0.38)', '#130d06', 'rgba(253, 211, 77, 0.14)']);
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

  drawLowerAtmosphere(ctx, ['rgba(12, 74, 110, 0)', 'rgba(12, 74, 110, 0.22)', '#07263b', 'rgba(255, 255, 255, 0.2)']);
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

  drawLowerAtmosphere(ctx, ['rgba(45, 27, 105, 0)', 'rgba(45, 27, 105, 0.38)', '#11061f', 'rgba(192, 132, 252, 0.16)']);
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

  drawLowerAtmosphere(ctx, ['rgba(26, 45, 35, 0)', 'rgba(26, 45, 35, 0.42)', '#08110c', 'rgba(52, 211, 153, 0.12)']);
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

  drawLowerAtmosphere(ctx, ['rgba(42, 21, 5, 0)', 'rgba(42, 21, 5, 0.48)', '#090302', 'rgba(251, 146, 60, 0.14)']);
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
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function bodyPose(ent) {
  const t = ent.animTime;
  const moveRatio = clamp(Math.abs(ent.vel.vx) / Math.max(1.2, ent.character.speed || 1), 0, 1.35);
  const stride = Math.sin(t * (0.14 + moveRatio * 0.22));
  const landing = ent.landTime > 0 ? ent.landTime / 12 : 0;
  const pose = {
    frontLeg: 0.1,
    backLeg: -0.1,
    backArm: -0.12,
    weaponAngle: 0.18,
    bob: 0,
    tilt: 0,
    hipY: -36,
    chestY: -ENTITY_HEIGHT + 24
  };

  switch (ent.state) {
    case 'run':
      pose.frontLeg = stride * 0.9;
      pose.backLeg = -stride * 0.82;
      pose.backArm = stride * 0.45 + 0.16;
      pose.weaponAngle = -stride * 0.52 - 0.12;
      pose.bob = Math.abs(Math.sin(t * (0.28 + moveRatio * 0.22))) * 2.8;
      pose.tilt = clamp(ent.vel.vx / Math.max(8, ent.character.speed * 3.1), -0.18, 0.18);
      break;
    case 'jump':
      pose.frontLeg = -0.78;
      pose.backLeg = 0.24;
      pose.backArm = -0.55;
      pose.weaponAngle = 0.52;
      pose.tilt = ent.facing * 0.1;
      pose.bob = -1.5;
      break;
    case 'fall':
      pose.frontLeg = 0.42;
      pose.backLeg = 0.74;
      pose.backArm = -0.5;
      pose.weaponAngle = 0.18;
      pose.tilt = -ent.facing * 0.08;
      pose.bob = 1.2;
      break;
    case 'hurt':
      pose.frontLeg = -0.5;
      pose.backLeg = 0.18;
      pose.backArm = 0.72;
      pose.weaponAngle = 1.15;
      pose.tilt = -0.32 * ent.facing;
      pose.bob = 1.5;
      break;
    case 'respawn': {
      const pulse = Math.sin(t * 0.24);
      pose.frontLeg = -0.28 + pulse * 0.08;
      pose.backLeg = 0.18 - pulse * 0.08;
      pose.backArm = -0.88;
      pose.weaponAngle = -0.9 + pulse * 0.08;
      pose.tilt = ent.facing * 0.04;
      pose.bob = -4 + pulse * 1.8;
      break;
    }
    case 'dead':
      if (ent.deathLanded) {
        pose.frontLeg = 1.14;
        pose.backLeg = 0.78;
        pose.backArm = 0.84;
        pose.weaponAngle = 1.5;
        pose.tilt = 1.34 * ent.facing;
        pose.hipY = -24;
        pose.chestY = -48;
        pose.bob = 3.5;
      } else {
        pose.frontLeg = 0.88;
        pose.backLeg = -0.18;
        pose.backArm = -0.9;
        pose.weaponAngle = 1.34;
        pose.tilt = clamp(ent.vel.vx * 0.08, -0.95, 0.95) + ent.facing * 0.16;
        pose.bob = 2;
      }
      break;
    case 'victory': {
      const cheer = Math.sin(t * 0.18);
      pose.frontLeg = 0.14 + cheer * 0.05;
      pose.backLeg = -0.16 - cheer * 0.04;
      pose.backArm = -1.22 - cheer * 0.08;
      pose.weaponAngle = -1.55 + cheer * 0.12;
      pose.tilt = ent.facing * 0.08;
      pose.bob = Math.abs(cheer) * 2.4;
      break;
    }
    case 'cast': {
      const a = ent.action;
      if (!a) break;
      const def = a.def;
      const wind = a.phase === 'windup' ? a.phaseTime / Math.max(1, def.windup || 1) : 1;
      const active = a.phase === 'active' ? a.phaseTime / Math.max(1, def.active || 1) : (a.phase === 'recovery' ? 1 : 0);
      const recovery = a.phase === 'recovery' ? a.phaseTime / Math.max(1, def.recovery || 1) : 0;
      const isSwing = ['melee', 'dashStrike', 'charge', 'flameDash', 'cleave', 'scythe', 'carnage', 'spin'].includes(def.type);
      const isShot = ['projectile', 'rain', 'piercingShot', 'rapidFire', 'execution'].includes(def.type);
      const isChannel = ['nova', 'meteor', 'lavaPool', 'eruption', 'summon', 'titan', 'boneShield', 'shield', 'aura', 'judgment', 'curse', 'explosion', 'buff', 'buffStack'].includes(def.type);
      const isEvade = ['parry', 'shadowStep', 'teleport', 'smokeBomb', 'backflip', 'vault', 'roll'].includes(def.type);

      if (isSwing) {
        pose.frontLeg = a.phase === 'windup' ? -0.55 : 0.34;
        pose.backLeg = a.phase === 'windup' ? 0.2 : -0.2;
        pose.backArm = -0.3;
        pose.tilt = a.phase === 'windup' ? -0.22 * ent.facing : 0.18 * ent.facing;
        pose.weaponAngle = a.phase === 'windup'
          ? lerp(0.55, -1.2, wind)
          : a.phase === 'active'
            ? lerp(-1.2, 1.55, active)
            : lerp(1.55, 0.2, recovery);
        pose.bob = a.phase === 'windup' ? -2.5 : Math.sin(active * Math.PI) * -1.5;
      } else if (isShot) {
        pose.frontLeg = -0.16;
        pose.backLeg = 0.08;
        pose.backArm = -0.72;
        pose.tilt = -0.08 * ent.facing;
        pose.weaponAngle = a.phase === 'windup'
          ? lerp(-0.2, -0.95, wind)
          : a.phase === 'active'
            ? lerp(-0.95, 0.28, active)
            : lerp(0.28, 0.02, recovery);
        pose.bob = -1.4;
      } else if (isChannel) {
        pose.frontLeg = -0.08;
        pose.backLeg = 0.12;
        pose.backArm = -1.05;
        pose.weaponAngle = a.phase === 'windup' ? lerp(-0.2, -1.3, wind) : lerp(-1.3, -0.2, recovery);
        pose.tilt = 0.05 * ent.facing;
        pose.bob = -2.8 - Math.sin(active * Math.PI) * 1.4;
      } else if (isEvade) {
        pose.frontLeg = -0.6;
        pose.backLeg = 0.46;
        pose.backArm = -0.36;
        pose.weaponAngle = def.type === 'roll' ? 1.0 : -0.65;
        pose.tilt = def.type === 'roll' ? 0.35 * ent.facing : -0.16 * ent.facing;
        pose.bob = def.type === 'roll' ? 2.2 : -1.2;
      } else if (def.type === 'deathMark') {
        pose.frontLeg = -0.34;
        pose.backLeg = 0.2;
        pose.backArm = -0.48;
        pose.weaponAngle = a.phase === 'windup' ? lerp(-0.5, -1.2, wind) : lerp(-1.2, 1.42, active || recovery);
        pose.tilt = -0.2 * ent.facing;
        pose.bob = -2.2;
      } else if (def.type === 'arrowStorm') {
        pose.frontLeg = -0.05;
        pose.backLeg = 0.12;
        pose.backArm = -0.76;
        pose.weaponAngle = -0.6 + Math.sin(a.phaseTime * 0.18) * 0.22;
        pose.tilt = -0.04 * ent.facing;
        pose.bob = -1.5;
      } else if (def.type === 'slam') {
        pose.frontLeg = a.phase === 'windup' ? -0.6 : 0.52;
        pose.backLeg = a.phase === 'windup' ? 0.26 : -0.15;
        pose.backArm = -0.22;
        pose.weaponAngle = a.phase === 'windup' ? lerp(0.32, -1.45, wind) : lerp(-1.45, 1.5, active || recovery);
        pose.tilt = a.phase === 'windup' ? -0.18 * ent.facing : 0.14 * ent.facing;
        pose.bob = -3.2;
      }
      break;
    }
    default:
      pose.frontLeg = 0.08 + Math.sin(t * 0.05) * 0.03;
      pose.backLeg = -0.1 - Math.sin(t * 0.05) * 0.03;
      pose.backArm = -0.1 + Math.sin(t * 0.04) * 0.04;
      pose.weaponAngle = 0.14 + Math.sin(t * 0.05) * 0.04;
      pose.bob = Math.sin(t * 0.06) * 1.5;
      pose.tilt = Math.sin(t * 0.04) * 0.015;
      break;
  }

  pose.hipY += landing * 4;
  pose.chestY += landing * 2;
  pose.bob += landing * 1.2;

  return pose;
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

  const baseAlpha = ctx.globalAlpha;

  const flash = ent.flashTime > 0;
  const blink = ent.iframes > 0 && Math.floor(ent.iframes / 6) % 2 === 0;
  const lineColor = flash || blink ? '#ffffff' : (ent.dead ? '#5b6477' : ch.color);
  const accent = flash ? '#ffffff' : ch.accent;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const hipY = pose.hipY;
  const legLen = 32;
  const backFootX = Math.sin(pose.backLeg) * legLen;
  const backFootY = Math.cos(pose.backLeg) * legLen + hipY;
  const frontFootX = Math.sin(pose.frontLeg) * legLen;
  const frontFootY = Math.cos(pose.frontLeg) * legLen + hipY;

  ctx.save();
  ctx.globalAlpha *= ent.onGround ? 0.26 : 0.16;
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.ellipse(0, 2, ent.dead && ent.deathLanded ? 26 : 20, ent.dead && ent.deathLanded ? 8 : 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 4.5;
  ctx.globalAlpha = baseAlpha * 0.68;
  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(backFootX, backFootY);
  ctx.moveTo(0, hipY); ctx.lineTo(frontFootX, frontFootY);
  ctx.stroke();
  ctx.globalAlpha = baseAlpha;

  const chestY = pose.chestY;
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
  const backArmA = pose.backArm;
  const backHandX = Math.sin(backArmA) * armLen * 0.78;
  const backHandY = Math.cos(backArmA) * armLen * 0.78 + shoulderY;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 4.2;
  ctx.globalAlpha = baseAlpha * 0.72;
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(backHandX, backHandY);
  ctx.stroke();
  ctx.globalAlpha = baseAlpha;

  const weaponBase = pose.weaponAngle;
  const armHandX = Math.sin(weaponBase) * armLen * f;
  const armHandY = Math.cos(weaponBase) * armLen + shoulderY;
  ctx.lineWidth = 4.5;
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

  if (ent.respawnInvincible > 0 && !ent.dead) {
    ctx.save();
    const a = Math.min(0.55, ent.respawnInvincible / 150 * 0.55);
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 7]);
    ctx.beginPath();
    ctx.arc(x, groundY - ENTITY_HEIGHT / 2, 42 + Math.sin(ent.animTime * 0.16) * 4, 0, Math.PI * 2);
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
    default:
      if (ch.archetype === 'Sword Fighters') {
        ctx.fillRect(-headR - 1, chestY - headR - 12, headR * 2 + 2, 3);
        ctx.fillRect(4 * f, chestY - headR - 18, 3 * f, 10);
      } else if (ch.archetype === 'Spear Users') {
        ctx.beginPath();
        ctx.moveTo(-headR - 1, chestY - headR - 2);
        ctx.lineTo(0, chestY - headR - 15);
        ctx.lineTo(headR + 1, chestY - headR - 2);
        ctx.closePath();
        ctx.fill();
      } else if (ch.archetype === 'Heavy Brutes') {
        ctx.fillRect(-headR - 2, chestY - headR - 11, headR * 2 + 4, 5);
        ctx.beginPath();
        ctx.moveTo(-headR - 2, chestY - headR - 7);
        ctx.lineTo(-headR - 7, chestY - headR - 17);
        ctx.lineTo(-headR + 2, chestY - headR - 8);
        ctx.closePath();
        ctx.fill();
      } else if (ch.archetype === 'Fast Assassins') {
        ctx.beginPath();
        ctx.arc(0, chestY - headR - 2, headR + 3, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = line;
        ctx.fillRect(-headR - 2, chestY - headR - 2, (headR + 2) * 2, 4);
      } else if (ch.archetype === 'Mages') {
        ctx.beginPath();
        ctx.moveTo(-headR - 2, chestY - headR - 2);
        ctx.lineTo(headR + 2, chestY - headR - 2);
        ctx.lineTo(2 * f, chestY - headR - 25);
        ctx.closePath();
        ctx.fill();
      } else if (ch.archetype === 'Elemental Users') {
        for (let fi = -1; fi <= 1; fi++) {
          ctx.beginPath();
          ctx.moveTo(fi * headR * 0.55 - 3, chestY - headR - 2);
          ctx.lineTo(fi * headR * 0.55, chestY - headR - 12 - Math.abs(fi) * 3);
          ctx.lineTo(fi * headR * 0.55 + 3, chestY - headR - 2);
          ctx.closePath();
          ctx.fill();
        }
      } else if (ch.archetype === 'Ranged Fighters') {
        ctx.beginPath();
        ctx.moveTo(-headR - 3, chestY - headR);
        ctx.lineTo(headR + 4, chestY - headR);
        ctx.lineTo(8 * f, chestY - headR - 15);
        ctx.lineTo(-headR + 2, chestY - headR - 7);
        ctx.closePath();
        ctx.fill();
      } else if (ch.archetype === 'Control / Summoners') {
        ctx.fillRect(-headR, chestY - headR - 10, headR * 2, 4);
        ctx.beginPath();
        ctx.arc(0, chestY - headR - 16, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch.archetype === 'Defensive / Shield Types') {
        ctx.fillRect(-headR - 2, chestY - headR - 10, headR * 2 + 4, 4);
        ctx.beginPath();
        ctx.moveTo(-headR - 3, chestY - headR - 6);
        ctx.lineTo(0, chestY - headR - 18);
        ctx.lineTo(headR + 3, chestY - headR - 6);
        ctx.closePath();
        ctx.fill();
      }
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
  } else if (p.kind === 'bullet') {
    ctx.rotate(Math.atan2(p.vy, p.vx));
    const grad = ctx.createLinearGradient(-12, 0, 18, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, p.color);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(16, 0);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(18, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();
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
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.globalAlpha = a * 0.3;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 14 * a + 6;
      ctx.beginPath();
      ctx.arc(0, 0, e.length * 0.5, -0.7, 0.7);
      ctx.stroke();
      ctx.globalAlpha = a * 0.9;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3 * a + 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, e.length * 0.5, -0.62, 0.62);
      ctx.stroke();
      ctx.globalAlpha = a * 0.65;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 5 * a + 2;
      ctx.beginPath();
      ctx.arc(0, 0, e.length * 0.5, -0.68, 0.68);
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

function drawSmashOverlays(ctx, world) {
  ctx.save();
  ctx.globalAlpha = 0.12 + Math.sin(world.tick * 0.08) * 0.03;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 12]);
  ctx.strokeRect(BLAST_ZONE.left, BLAST_ZONE.top, BLAST_ZONE.right - BLAST_ZONE.left, BLAST_ZONE.bottom - BLAST_ZONE.top);
  ctx.restore();

  if (world.koText) {
    const k = world.koText;
    const a = Math.max(0, k.time / k.maxTime);
    const pop = 1 + (1 - a) * 0.24;
    ctx.save();
    ctx.translate(k.x, k.y);
    ctx.scale(pop, pop);
    ctx.globalAlpha = Math.min(1, a * 1.4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 78px Bebas Neue, Impact, sans-serif';
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.strokeText('KO', 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('KO', 0, 0);
    ctx.font = '800 18px Barlow Condensed, Arial, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillStyle = k.color;
    ctx.fillText(k.text, 0, 54);
    ctx.restore();
  }

  if (world.winner) {
    const winner = world.winner === 'player' ? world.player : world.enemy;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.38)';
    ctx.fillRect(0, 0, ARENA_W, ARENA_H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 86px Bebas Neue, Impact, sans-serif';
    ctx.lineWidth = 12;
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeText('GAME', ARENA_W / 2, ARENA_H / 2 - 20);
    ctx.fillStyle = winner.character.color;
    ctx.fillText('GAME', ARENA_W / 2, ARENA_H / 2 - 20);
    ctx.font = '800 22px Barlow Condensed, Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${winner.character.name} wins`, ARENA_W / 2, ARENA_H / 2 + 48);
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
  drawStage(ctx, time);

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
  drawSmashOverlays(ctx, world);

  ctx.restore();
}
