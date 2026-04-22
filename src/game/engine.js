import { ARENA_W, GROUND_Y, GRAVITY, FRICTION, AIR_FRICTION, MAX_FALL, ENTITY_HALF_W, ENTITY_HEIGHT } from './constants.js';
import { CHARACTERS } from './characters.js';
import {
  spawnHitBurst, spawnRing, spawnSlash, spawnDust, spawnTrail, updateParticles
} from './particles.js';

export function createEntity(charId, x, facing, isPlayer) {
  const ch = CHARACTERS[charId];
  return {
    id: isPlayer ? 'player' : 'enemy',
    isPlayer,
    character: ch,
    pos: { x, y: GROUND_Y },
    vel: { vx: 0, vy: 0 },
    facing,
    hp: ch.maxHp,
    onGround: true,
    state: 'idle',
    stateTime: 0,
    animTime: 0,
    action: null,
    cooldowns: { basic: 0, ability1: 0, ability2: 0, ultimate: 0 },
    flashTime: 0,
    iframes: 0,
    hurtTime: 0,
    knockTime: 0,
    parryActive: 0,
    frozen: 0,
    stealth: 0,
    shield: null,
    buff: null,
    dead: false,
    hitId: 0,
    input: { left: false, right: false, jump: false }
  };
}

export function createWorld(playerId, enemyId) {
  const player = createEntity(playerId, ARENA_W * 0.3, 1, true);
  const enemy = createEntity(enemyId, ARENA_W * 0.7, -1, false);
  return {
    player, enemy,
    entities: [player, enemy],
    projectiles: [],
    particles: [],
    effects: [],
    shockwaves: [],
    fallingObjects: [],
    lavaPools: [],
    minions: [],
    shake: { mag: 0, time: 0 },
    overTime: 0,
    winner: null,
    tick: 0
  };
}

const ACTION_KEYS = ['basic', 'ability1', 'ability2', 'ultimate'];

export function tryAction(world, ent, key) {
  if (ent.dead || ent.action || ent.frozen > 0 || ent.hurtTime > 0) return false;
  if (ent.cooldowns[key] > 0) return false;
  const def = ent.character[key];
  if (!def) return false;

  ent.hitId += 1;
  ent.action = {
    key, def, phase: 'windup', phaseTime: 0, spawned: false, tickHits: 0
  };
  ent.cooldowns[key] = def.cooldown;
  ent.state = 'cast';
  ent.stateTime = 0;

  if (def.type === 'vault') {
    ent.vel.vy = def.jumpVy;
    ent.vel.vx = def.jumpVx * ent.facing;
    ent.onGround = false;
  } else if (def.type === 'buff') {
    ent.buff = { duration: def.duration, dmgMul: def.dmgMul, speedMul: def.speedMul, dr: def.dr };
    spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, ent.character.color, 80);
    addShake(world, 6, 12);
  } else if (def.type === 'parry') {
    ent.parryActive = def.active;
  } else if (def.type === 'backflip') {
    ent.vel.vy = def.flipVy;
    ent.vel.vx = def.flipVx * ent.facing;
    ent.onGround = false;
    ent.iframes = 18;
  } else if (def.type === 'smokeBomb') {
    ent.stealth = def.stealthDuration;
    ent.stealthSpeed = def.speedBoost;
    ent.iframes = 24;
    spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#4b5563', 70);
    for (let i = 0; i < 16; i++) {
      spawnTrail(world, ent.pos.x + (Math.random()-0.5)*40, ent.pos.y - 20 - Math.random()*50, '#6b7280');
    }
  } else if (def.type === 'shadowStep') {
    const targetX = clampX(ent.pos.x + ent.facing * def.distance);
    for (let i = 0; i < 8; i++) {
      spawnTrail(world, ent.pos.x + (targetX - ent.pos.x) * (i / 8), ent.pos.y - ENTITY_HEIGHT / 2, ent.character.color);
    }
    ent.pos.x = targetX;
    ent.iframes = def.iframes || 16;
  }
  return true;
}

function progressAction(world, ent) {
  const a = ent.action;
  if (!a) return;
  const def = a.def;
  a.phaseTime += 1;

  if (a.phase === 'windup' && a.phaseTime >= def.windup) {
    a.phase = 'active';
    a.phaseTime = 0;
    onActiveEnter(world, ent);
  }
  if (a.phase === 'active') {
    onActiveTick(world, ent);
    if (a.phaseTime >= def.active) {
      a.phase = 'recovery';
      a.phaseTime = 0;
    }
  }
  if (a.phase === 'recovery' && a.phaseTime >= def.recovery) {
    if (def.type === 'arrowStorm') {
      ent._stormTick = 0;
      ent._stormDef = null;
    }
    ent.action = null;
    ent.state = 'idle';
    ent.stateTime = 0;
    if (def.type === 'parry') ent.parryActive = 0;
  }
}

function onActiveEnter(world, ent) {
  const def = ent.action.def;
  const f = ent.facing;
  const cx = ent.pos.x;
  const cy = ent.pos.y - ENTITY_HEIGHT / 2;

  switch (def.type) {
    case 'melee': {
      spawnSlash(world, cx + f * (def.range * 0.45), cy, f * 0.2, def.range, ent.character.color);
      break;
    }
    case 'projectile': {
      const px = cx + f * 32;
      const py = cy - 4;
      const id = ent.character.id;
      const isBolt = id === 'mage' || id === 'elemental' || id === 'summoner';
      const isArrow = id === 'archer';
      world.projectiles.push({
        kind: isBolt ? 'bolt' : isArrow ? 'arrow' : 'spear',
        owner: ent, hitId: ent.hitId,
        x: px, y: py, vx: def.projSpeed * f, vy: 0,
        life: def.projLife,
        damage: scaledDamage(ent, def.damage),
        knockback: def.knockback,
        color: def.projColor || ent.character.color,
        radius: isBolt ? 8 : 6,
        rot: 0
      });
      break;
    }
    case 'dashStrike': {
      ent.vel.vx = def.dashSpeed * f;
      ent.iframes = 6;
      spawnSlash(world, cx + f * 40, cy, f * 0.1, def.range, ent.character.color);
      break;
    }
    case 'charge': {
      ent.vel.vx = def.dashSpeed * f;
      break;
    }
    case 'teleport': {
      const targetX = clampX(cx + f * def.distance);
      for (let i = 0; i < 10; i++) {
        spawnTrail(world, cx + (targetX - cx) * (i / 10), cy, ent.character.color);
      }
      ent.pos.x = targetX;
      ent.iframes = 14;
      break;
    }
    case 'nova': {
      spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#a5f3fc', def.radius);
      break;
    }
    case 'meteor': {
      const target = otherOf(world, ent);
      const tx = target ? target.pos.x : ent.pos.x + f * 200;
      world.fallingObjects.push({
        kind: 'meteor', x: tx, y: -80, vy: 0, fall: 9, target: GROUND_Y,
        owner: ent, hitId: ent.hitId, damage: scaledDamage(ent, def.damage),
        radius: def.radius, knockback: def.knockback, life: 200
      });
      break;
    }
    case 'rain': {
      const target = otherOf(world, ent);
      const baseX = target ? target.pos.x : ent.pos.x;
      const count = def.count;
      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * 70 + (Math.random() - 0.5) * 30;
        world.fallingObjects.push({
          kind: 'spear-rain', x: baseX + offset, y: -100 - i * 20, vy: 0,
          fall: 10, target: GROUND_Y, delay: i * 8,
          owner: ent, hitId: ent.hitId * 100 + i,
          damage: scaledDamage(ent, def.damage), radius: 40,
          knockback: def.knockback, life: 240
        });
      }
      break;
    }
    case 'piercingShot': {
      const f2 = ent.facing;
      world.projectiles.push({
        kind: 'arrow-pierce', owner: ent, hitId: ent.hitId,
        x: ent.pos.x + f2 * 32, y: ent.pos.y - ENTITY_HEIGHT / 2,
        vx: def.projSpeed * f2, vy: 0,
        life: def.projLife, damage: scaledDamage(ent, def.damage),
        knockback: def.knockback, color: '#ffffff',
        radius: 7, piercing: true, hitSet: new Set()
      });
      addShake(world, 4, 8);
      break;
    }
    case 'arrowStorm': {
      ent._stormTick = 0;
      ent._stormDef = def;
      break;
    }
    case 'deathMark': {
      const target3 = otherOf(world, ent);
      if (target3 && !target3.dead) {
        const dx3 = target3.pos.x - ent.pos.x;
        const dy3 = (target3.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.abs(dx3) <= def.range && Math.abs(dy3) <= def.hitH / 2) {
          applyHit(world, ent, target3, scaledDamage(ent, def.damage), def.knockback);
          spawnRing(world, target3.pos.x, target3.pos.y - ENTITY_HEIGHT / 2, '#a78bfa', 90);
          addShake(world, 10, 16);
        }
      }
      break;
    }
    case 'flameDash': {
      ent.vel.vx = def.dashSpeed * ent.facing;
      ent.iframes = 8;
      break;
    }
    case 'lavaPool': {
      world.lavaPools = world.lavaPools || [];
      world.lavaPools.push({
        x: ent.pos.x, y: GROUND_Y,
        radius: def.radius, damage: def.damage,
        duration: def.duration, owner: ent, hitTimer: 0
      });
      spawnRing(world, ent.pos.x, GROUND_Y, '#fb923c', def.radius);
      break;
    }
    case 'eruption': {
      const target4 = otherOf(world, ent);
      const tx4 = target4 ? target4.pos.x : ent.pos.x + ent.facing * 200;
      world.fallingObjects.push({
        kind: 'eruption', x: tx4, y: -80, vy: 0, fall: 11, target: GROUND_Y,
        owner: ent, hitId: ent.hitId, damage: scaledDamage(ent, def.damage),
        radius: def.radius, knockback: def.knockback, life: 200
      });
      break;
    }
    case 'summon':
    case 'titan': {
      const side = ent.facing;
      const mx = clampX(ent.pos.x + side * 80);
      world.minions = world.minions || [];
      world.minions.push({
        owner: ent, x: mx, y: GROUND_Y, vx: 0, vy: 0,
        hp: def.minionHp, maxHp: def.minionHp, damage: def.minionDamage,
        speed: def.minionSpeed, life: def.minionLife,
        isTitan: def.type === 'titan', attackCd: 0, dead: false,
        animTime: 0, facing: side
      });
      spawnRing(world, mx, GROUND_Y, ent.character.color, def.type === 'titan' ? 80 : 50);
      addShake(world, def.type === 'titan' ? 10 : 4, 12);
      break;
    }
    case 'boneShield': {
      ent.shield = { hp: def.shieldHp, maxHp: def.shieldHp, duration: def.duration };
      spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#34d399', 60);
      break;
    }
    case 'slam': {
      world.shockwaves.push({
        owner: ent, hitId: ent.hitId, x: ent.pos.x, y: GROUND_Y,
        speed: def.shockSpeed, dir: 1, range: def.radius, traveled: 0,
        damage: scaledDamage(ent, def.damage), knockback: def.knockback, color: ent.character.color
      });
      world.shockwaves.push({
        owner: ent, hitId: ent.hitId, x: ent.pos.x, y: GROUND_Y,
        speed: def.shockSpeed, dir: -1, range: def.radius, traveled: 0,
        damage: scaledDamage(ent, def.damage), knockback: def.knockback, color: ent.character.color
      });
      addShake(world, 10, 18);
      spawnDust(world, ent.pos.x, GROUND_Y);
      break;
    }
    case 'spin': {
      addShake(world, 4, 8);
      break;
    }
    default: break;
  }
}

function onActiveTick(world, ent) {
  const a = ent.action;
  const def = a.def;
  const other = otherOf(world, ent);
  if (!other || other.dead) return;

  switch (def.type) {
    case 'melee':
    case 'dashStrike':
    case 'charge':
    case 'flameDash': {
      const box = meleeHitbox(ent, def);
      if (rectsOverlap(box, entityBox(other))) {
        applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
      }
      if (def.type === 'flameDash' && a.phaseTime % 3 === 0) {
        spawnTrail(world, ent.pos.x, ent.pos.y - 20, '#fb923c');
        spawnTrail(world, ent.pos.x, ent.pos.y - 40, '#fbbf24');
      }
      break;
    }
    case 'arrowStorm': {
      ent._stormTick = (ent._stormTick || 0) + 1;
      if (ent._stormTick % 8 === 0) {
        const sd = ent._stormDef;
        const f3 = ent.facing;
        const spread = (Math.random() - 0.5) * 4;
        world.projectiles.push({
          kind: 'arrow', owner: ent, hitId: ent.hitId + ent._stormTick,
          x: ent.pos.x + f3 * 32, y: ent.pos.y - ENTITY_HEIGHT / 2 - 10,
          vx: sd.projSpeed * f3 + spread, vy: (Math.random() - 0.5) * 2,
          life: 90, damage: scaledDamage(ent, sd.damage),
          knockback: sd.knockback, color: ent.character.color,
          radius: 6, piercing: false
        });
      }
      break;
    }
    case 'parry': {
      const box = meleeHitbox(ent, def);
      if (rectsOverlap(box, entityBox(other)) && a.tickHits === 0 && ent.justParried) {
        applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
        spawnSlash(world, ent.pos.x + ent.facing * 40, ent.pos.y - ENTITY_HEIGHT / 2, 0, 70, '#ffffff');
        ent.justParried = false;
        a.tickHits = 1;
      }
      break;
    }
    case 'nova': {
      if (a.phaseTime === 1) {
        const dx = other.pos.x - ent.pos.x;
        const dy = (other.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.hypot(dx, dy) <= def.radius) {
          applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
          other.frozen = def.freeze;
        }
      }
      break;
    }
    case 'spin': {
      if (a.phaseTime % def.tickRate === 0) {
        const dx = other.pos.x - ent.pos.x;
        const dy = (other.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.hypot(dx, dy) <= def.radius) {
          ent.hitId += 1;
          applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
        }
      }
      if (a.phaseTime % 4 === 0) {
        spawnSlash(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2,
          (a.phaseTime / 6) % (Math.PI * 2), def.radius, ent.character.color);
      }
      break;
    }
    default: break;
  }
}

function scaledDamage(ent, base) {
  let d = base;
  if (ent.buff && ent.buff.duration > 0) d *= ent.buff.dmgMul;
  return d;
}

function otherOf(world, ent) {
  return ent === world.player ? world.enemy : world.player;
}

function clampX(x) {
  return Math.max(40, Math.min(ARENA_W - 40, x));
}

export function entityBox(ent) {
  return {
    x: ent.pos.x - ENTITY_HALF_W,
    y: ent.pos.y - ENTITY_HEIGHT,
    w: ENTITY_HALF_W * 2,
    h: ENTITY_HEIGHT
  };
}

function meleeHitbox(ent, def) {
  const f = ent.facing;
  const w = def.range;
  const h = def.hitH;
  return {
    x: f === 1 ? ent.pos.x : ent.pos.x - w,
    y: ent.pos.y - ENTITY_HEIGHT * 0.85,
    w, h
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function addShake(world, mag, time) {
  if (mag > world.shake.mag) world.shake.mag = mag;
  if (time > world.shake.time) world.shake.time = time;
}

function applyHit(world, attacker, victim, damage, knockback) {
  if (victim.iframes > 0 || victim.dead) return;

  if (victim.parryActive > 0 && victim.character.id === 'sword') {
    victim.parryActive = 0;
    victim.justParried = true;
    spawnRing(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, '#ffffff', 60);
    addShake(world, 6, 10);
    attacker.hurtTime = 24;
    attacker.action = null;
    attacker.state = 'hurt';
    attacker.stateTime = 0;
    attacker.vel.vx *= -0.5;
    return;
  }

  if (victim.buff && victim.buff.duration > 0 && victim.buff.dr) {
    damage *= (1 - victim.buff.dr);
  }
  // bone shield absorbs damage
  if (victim.shield && victim.shield.hp > 0) {
    const absorbed = Math.min(victim.shield.hp, damage);
    victim.shield.hp -= absorbed;
    damage -= absorbed;
    spawnRing(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, '#34d399', 40);
    if (damage <= 0) return;
  }

  victim.hp -= damage;
  victim.iframes = 14;
  victim.flashTime = 8;
  victim.hurtTime = 16;
  victim.action = null;
  victim.state = 'hurt';
  victim.stateTime = 0;

  const dir = Math.sign(victim.pos.x - attacker.pos.x) || attacker.facing;
  victim.vel.vx = dir * knockback;
  victim.vel.vy = -Math.min(6, knockback * 0.6);
  victim.onGround = false;
  victim.knockTime = 14;

  spawnHitBurst(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, attacker.character.color, 14);
  addShake(world, Math.min(10, damage * 0.4), 10);

  if (victim.hp <= 0) {
    victim.hp = 0;
    victim.dead = true;
    victim.state = 'dead';
    victim.stateTime = 0;
    victim.vel.vx = dir * 4;
    victim.vel.vy = -7;
    spawnHitBurst(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, '#ffffff', 30);
  }
}

function updateEntity(world, ent) {
  for (const k of ACTION_KEYS) if (ent.cooldowns[k] > 0) ent.cooldowns[k] -= 1;
  if (ent.flashTime > 0) ent.flashTime -= 1;
  if (ent.iframes > 0) ent.iframes -= 1;
  if (ent.hurtTime > 0) ent.hurtTime -= 1;
  if (ent.knockTime > 0) ent.knockTime -= 1;
  if (ent.parryActive > 0) ent.parryActive -= 1;
  if (ent.frozen > 0) ent.frozen -= 1;
  if (ent.stealth > 0) ent.stealth -= 1;
  if (ent.shield) {
    ent.shield.duration -= 1;
    if (ent.shield.duration <= 0) ent.shield = null;
  }
  if (ent.buff) {
    ent.buff.duration -= 1;
    if (ent.buff.duration <= 0) ent.buff = null;
  }

  ent.animTime += 1;
  ent.stateTime += 1;

  if (ent.dead) {
    ent.vel.vy += GRAVITY;
    if (ent.vel.vy > MAX_FALL) ent.vel.vy = MAX_FALL;
    ent.pos.x += ent.vel.vx;
    ent.pos.y += ent.vel.vy;
    if (ent.pos.y >= GROUND_Y) {
      ent.pos.y = GROUND_Y;
      ent.vel.vy = 0;
      ent.vel.vx *= 0.85;
    }
    ent.pos.x = clampX(ent.pos.x);
    return;
  }

  const canAct = !ent.action && ent.hurtTime <= 0 && ent.frozen <= 0;
  const inp = ent.input;

  if (canAct && ent.queuedAction) {
    tryAction(world, ent, ent.queuedAction);
    ent.queuedAction = null;
  }

  let speedMul = ent.buff ? ent.buff.speedMul : 1;
  if (ent.stealth > 0 && ent.character.id === 'assassin') speedMul *= (ent.character.ability2.speedBoost || 1.5);
  const baseSpeed = ent.character.speed * speedMul;
  if (canAct && ent.knockTime <= 0) {
    if (inp.left) ent.vel.vx = -baseSpeed;
    else if (inp.right) ent.vel.vx = baseSpeed;
    else ent.vel.vx *= ent.onGround ? FRICTION : AIR_FRICTION;
    if (inp.jump && ent.onGround) {
      ent.vel.vy = -ent.character.jumpPower;
      ent.onGround = false;
      spawnDust(world, ent.pos.x, GROUND_Y);
    }
  } else {
    ent.vel.vx *= ent.onGround ? FRICTION : AIR_FRICTION;
  }

  progressAction(world, ent);

  ent.vel.vy += GRAVITY;
  if (ent.vel.vy > MAX_FALL) ent.vel.vy = MAX_FALL;

  ent.pos.x += ent.vel.vx;
  ent.pos.y += ent.vel.vy;

  if (ent.pos.y >= GROUND_Y) {
    if (!ent.onGround) spawnDust(world, ent.pos.x, GROUND_Y);
    ent.pos.y = GROUND_Y;
    ent.vel.vy = 0;
    ent.onGround = true;
  } else {
    ent.onGround = false;
  }
  ent.pos.x = clampX(ent.pos.x);

  if (!ent.action && ent.hurtTime <= 0 && ent.frozen <= 0) {
    if (!ent.onGround) ent.state = 'jump';
    else if (Math.abs(ent.vel.vx) > 0.6) ent.state = 'run';
    else ent.state = 'idle';
  } else if (ent.action) {
    ent.state = 'cast';
  } else if (ent.hurtTime > 0) {
    ent.state = 'hurt';
  }
}

function updateProjectiles(world) {
  for (let i = world.projectiles.length - 1; i >= 0; i--) {
    const p = world.projectiles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 1;
    p.rot = (p.rot || 0) + 0.2;
    spawnTrail(world, p.x, p.y, p.color);

    if (p.piercing) {
      // piercing arrows hit both entities
      const targets = [world.player, world.enemy].filter(e => e !== p.owner && !e.dead);
      for (const target of targets) {
        if (p.hitSet && p.hitSet.has(target.id)) continue;
        const tb = entityBox(target);
        if (p.x > tb.x && p.x < tb.x + tb.w && p.y > tb.y && p.y < tb.y + tb.h) {
          applyHit(world, p.owner, target, p.damage, p.knockback);
          spawnHitBurst(world, p.x, p.y, p.color, 12);
          if (p.hitSet) p.hitSet.add(target.id);
        }
      }
    } else {
      const target = otherOf(world, p.owner);
      if (target && !target.dead) {
        const tb = entityBox(target);
        if (p.x > tb.x && p.x < tb.x + tb.w && p.y > tb.y && p.y < tb.y + tb.h) {
          applyHit(world, p.owner, target, p.damage, p.knockback);
          spawnHitBurst(world, p.x, p.y, p.color, 14);
          world.projectiles.splice(i, 1);
          continue;
        }
      }
    }
    if (p.life <= 0 || p.x < -40 || p.x > ARENA_W + 40 || p.y > GROUND_Y + 20) {
      world.projectiles.splice(i, 1);
    }
  }
}

function updateLavaPools(world) {
  if (!world.lavaPools) return;
  for (let i = world.lavaPools.length - 1; i >= 0; i--) {
    const pool = world.lavaPools[i];
    pool.duration -= 1;
    pool.hitTimer = (pool.hitTimer || 0) + 1;
    // emit fire particles
    if (world.tick % 4 === 0) {
      spawnTrail(world, pool.x + (Math.random() - 0.5) * pool.radius * 1.2, GROUND_Y - 4, '#fb923c');
      spawnTrail(world, pool.x + (Math.random() - 0.5) * pool.radius, GROUND_Y - 8, '#fbbf24');
    }
    // damage anyone standing in it every 20 ticks
    if (pool.hitTimer >= 20) {
      pool.hitTimer = 0;
      const targets = [world.player, world.enemy].filter(e => e !== pool.owner && !e.dead);
      for (const t of targets) {
        if (t.onGround && Math.abs(t.pos.x - pool.x) <= pool.radius) {
          applyHit(world, pool.owner, t, pool.damage, 1);
        }
      }
    }
    if (pool.duration <= 0) world.lavaPools.splice(i, 1);
  }
}

function updateMinions(world) {
  if (!world.minions) return;
  for (let i = world.minions.length - 1; i >= 0; i--) {
    const m = world.minions[i];
    if (m.dead) { world.minions.splice(i, 1); continue; }
    m.life -= 1;
    m.animTime += 1;
    m.attackCd = Math.max(0, m.attackCd - 1);
    if (m.life <= 0) { m.dead = true; continue; }

    // find enemy target (opposite of owner)
    const target = m.owner === world.player ? world.enemy : world.player;
    if (!target || target.dead) continue;

    const dx = target.pos.x - m.x;
    const dist = Math.abs(dx);
    m.facing = dx >= 0 ? 1 : -1;

    const attackRange = m.isTitan ? 80 : 55;
    if (dist > attackRange) {
      m.vx = m.speed * m.facing;
    } else {
      m.vx *= 0.8;
      if (m.attackCd <= 0) {
        m.attackCd = m.isTitan ? 55 : 70;
        applyHit(world, m.owner, target, m.damage, m.isTitan ? 8 : 4);
        spawnHitBurst(world, target.pos.x, target.pos.y - ENTITY_HEIGHT / 2, m.owner.character.color, 10);
      }
    }

    m.vy += GRAVITY;
    if (m.vy > MAX_FALL) m.vy = MAX_FALL;
    m.x += m.vx;
    m.y += m.vy;
    if (m.y >= GROUND_Y) { m.y = GROUND_Y; m.vy = 0; }
    m.x = clampX(m.x);
    m.vx *= 0.85;
  }
}

export function tick(world) {
  world.tick += 1;
  updateEntity(world, world.player);
  updateEntity(world, world.enemy);
  updateProjectiles(world);
  updateShockwaves(world);
  updateFalling(world);
  updateLavaPools(world);
  updateMinions(world);
  updateParticles(world);
  if (world.shake.time > 0) world.shake.time -= 1;
  else world.shake.mag = 0;

  if (!world.winner) {
    if (world.player.dead || world.enemy.dead) world.overTime += 1;
    if (world.overTime > 90) {
      if (world.player.dead && !world.enemy.dead) world.winner = 'enemy';
      else if (world.enemy.dead && !world.player.dead) world.winner = 'player';
      else if (world.player.dead && world.enemy.dead) world.winner = 'enemy';
    }
  }
}

function updateShockwaves(world) {
  for (let i = world.shockwaves.length - 1; i >= 0; i--) {
    const s = world.shockwaves[i];
    s.x += s.speed * s.dir;
    s.traveled += s.speed;
    if (s.traveled % 8 < s.speed) spawnDust(world, s.x, GROUND_Y);
    const target = otherOf(world, s.owner);
    if (target && !target.dead) {
      const tb = entityBox(target);
      if (s.x > tb.x - 12 && s.x < tb.x + tb.w + 12 && target.onGround) {
        applyHit(world, s.owner, target, s.damage, s.knockback);
        world.shockwaves.splice(i, 1);
        continue;
      }
    }
    if (s.traveled >= s.range) world.shockwaves.splice(i, 1);
  }
}

function updateFalling(world) {
  for (let i = world.fallingObjects.length - 1; i >= 0; i--) {
    const f = world.fallingObjects[i];
    if (f.delay && f.delay > 0) { f.delay -= 1; continue; }
    f.y += f.fall;
    f.fall = Math.min(f.fall + 0.3, 18);
    spawnTrail(world, f.x, f.y, f.kind === 'meteor' ? '#fbbf24' : f.kind === 'eruption' ? '#fb923c' : '#fde68a');
    if (f.y >= f.target) {
      const target = otherOf(world, f.owner);
      if (target && !target.dead) {
        const dx = target.pos.x - f.x;
        const dy = (target.pos.y - ENTITY_HEIGHT / 2) - (f.target - 30);
        if (Math.hypot(dx, dy) <= f.radius) {
          applyHit(world, f.owner, target, f.damage, f.knockback);
        }
      }
      const impactColor = f.kind === 'meteor' ? '#fbbf24' : f.kind === 'eruption' ? '#fb923c' : '#fde68a';
      spawnRing(world, f.x, f.target, impactColor, f.radius);
      spawnHitBurst(world, f.x, f.target, impactColor, 22);
      addShake(world, f.kind === 'meteor' || f.kind === 'eruption' ? 14 : 6, 14);
      world.fallingObjects.splice(i, 1);
    }
  }
}

export function applyPlayerInput(world, input) {
  const p = world.player;
  p.input.left = input.state.left;
  p.input.right = input.state.right;
  p.input.jump = input.state.jump;
  if (input.consumePressed('basic')) p.queuedAction = 'basic';
  else if (input.consumePressed('ability1')) p.queuedAction = 'ability1';
  else if (input.consumePressed('ability2')) p.queuedAction = 'ability2';
  else if (input.consumePressed('ultimate')) p.queuedAction = 'ultimate';
}
