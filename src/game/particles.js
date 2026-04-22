export function spawnHitBurst(world, x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 2 + Math.random() * 4;
    world.particles.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1,
      life: 24 + Math.random() * 14, maxLife: 30,
      color, size: 2 + Math.random() * 2, gravity: 0.18, fade: true
    });
  }
}

export function spawnSpark(world, x, y, color) {
  const a = Math.random() * Math.PI * 2;
  const s = 3 + Math.random() * 6;
  world.particles.push({
    x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5,
    life: 14 + Math.random() * 10, maxLife: 20,
    color, size: 1.5 + Math.random() * 1, gravity: 0.25, fade: true
  });
}

export function spawnCrackle(world, x, y, color) {
  for (let i = 0; i < 4; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1.5 + Math.random() * 3;
    world.particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 10 + Math.random() * 8,
      maxLife: 15,
      color,
      size: 1 + Math.random() * 1.5,
      gravity: 0.12,
      fade: true
    });
  }
}

export function spawnTrail(world, x, y, color) {
  world.particles.push({
    x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8,
    vx: (Math.random() - 0.5) * 0.6, vy: -Math.random() * 0.6,
    life: 18, maxLife: 18, color, size: 3 + Math.random() * 2,
    gravity: 0, fade: true
  });
}

export function spawnGlow(world, x, y, color) {
  for (let i = 0; i < 3; i++) {
    world.particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.2,
      life: 20 + Math.random() * 10,
      maxLife: 25,
      color,
      size: 4 + Math.random() * 3,
      gravity: 0.05,
      fade: true
    });
  }
}

export function spawnRing(world, x, y, color, radius) {
  world.effects.push({ kind: 'ring', x, y, r: 4, maxR: radius, color, life: 22, maxLife: 22 });
}

export function spawnSlash(world, x, y, angle, length, color) {
  world.effects.push({ kind: 'slash', x, y, angle, length, life: 10, maxLife: 10, color });
}

export function spawnDust(world, x, y) {
  for (let i = 0; i < 6; i++) {
    world.particles.push({
      x: x + (Math.random() - 0.5) * 18,
      y, vx: (Math.random() - 0.5) * 1.5, vy: -Math.random() * 1.2,
      life: 22, maxLife: 22, color: '#5b6477', size: 2.5, gravity: 0.05, fade: true
    });
  }
}

export function spawnShockwave(world, x, y, color) {
  world.effects.push({
    kind: 'shockwave',
    x, y,
    r: 0,
    maxR: 80,
    color,
    life: 16,
    maxLife: 16,
    width: 3
  });
}

export function updateParticles(world) {
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.life -= 1;
    if (p.life <= 0) world.particles.splice(i, 1);
  }
  for (let i = world.effects.length - 1; i >= 0; i--) {
    const e = world.effects[i];
    e.life -= 1;
    if (e.kind === 'ring') e.r += (e.maxR - e.r) * 0.18;
    if (e.kind === 'shockwave') e.r += (e.maxR - e.r) * 0.22;
    if (e.life <= 0) world.effects.splice(i, 1);
  }
}
