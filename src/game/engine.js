import {
  ARENA_W, GROUND_Y, GRAVITY, FRICTION, AIR_FRICTION, MAX_FALL, ENTITY_HALF_W, ENTITY_HEIGHT,
  DEFAULT_STOCKS, RESPAWN_INVINCIBILITY, RESPAWN_DELAY, HIT_PAUSE_MAX, BLAST_ZONE
} from './constants.js';
import { CHARACTERS } from './characters.js';
import {
  spawnHitBurst, spawnRing, spawnShockwave, spawnSlash, spawnSpark, spawnDust, spawnTrail, updateParticles
} from './particles.js';
import { audioManager } from './audio.js';
import {
  DROP_THROUGH_FRAMES,
  findCurrentPlatform,
  findLandingPlatform,
  getActiveStage,
  getSpawnPoints,
  getStageBounds,
  getStagePlatform,
  setActiveStage,
  updateStage
} from './stage.js';

export function createEntity(charId, spawn, facing, isPlayer) {
  const ch = CHARACTERS[charId];
  return {
    id: isPlayer ? 'player' : 'enemy',
    isPlayer,
    character: ch,
    pos: { x: spawn.x, y: spawn.y },
    vel: { vx: 0, vy: 0 },
    facing,
    hp: ch.maxHp,
    damagePercent: 0,
    stocks: DEFAULT_STOCKS,
    onGround: false,
    state: 'fall',
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
    respawnTimer: 0,
    respawnInvincible: 0,
    airJumps: 1,
    maxAirJumps: 1,
    hitId: 0,
    platformId: null,
    dropTimer: 0,
    landTime: 0,
    deathLanded: false,
    input: { left: false, right: false, down: false, jump: false, jumpPressed: false }
  };
}

export function createWorld(playerId, enemyId, options = {}) {
  setActiveStage(options.stage || 'battlefield');
  updateStage(0);
  const spawn = getSpawnPoints();
  const player = createEntity(playerId, spawn.player, 1, true);
  const enemy = createEntity(enemyId, spawn.enemy, -1, false);
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
    victoryPlayed: false,
    hitPause: 0,
    koText: null,
    mode: options.mode || 'smash',
    training: options.mode === 'training',
    aiDifficulty: options.aiDifficulty || 1,
    stageId: options.stage || 'battlefield',
    tick: 0
  };
}

const ACTION_KEYS = ['basic', 'ability1', 'ability2', 'ultimate'];

export function tryAction(world, ent, key) {
  if (ent.dead || ent.action || ent.frozen > 0 || ent.hurtTime > 0) return false;
  if (ent.respawnInvincible > 0) return false;
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

  // Play audio for ability cast
  if (key === 'basic') {
    audioManager.playSfx('attack_basic');
  } else if (key === 'ability1' || key === 'ability2') {
    audioManager.playAbilityCast();
  } else if (key === 'ultimate') {
    audioManager.playUltimate();
  }

  if (def.type === 'vault') {
    ent.vel.vy = def.jumpVy;
    ent.vel.vx = def.jumpVx * ent.facing;
    ent.onGround = false;
    ent.platformId = null;
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
    ent.platformId = null;
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
  const windup = Math.max(0, Number.isFinite(def.windup) ? def.windup : 0);
  const active = Math.max(1, Number.isFinite(def.active) ? def.active : 1);
  const recovery = Math.max(0, Number.isFinite(def.recovery) ? def.recovery : 0);
  const maxActionTime = windup + active + recovery + 30;
  a.totalTime = (a.totalTime || 0) + 1;
  if (a.totalTime > maxActionTime) {
    if (!a.warnedTimeout) {
      console.warn(`Recovered stuck action "${a.key}" for ${ent.character?.name || ent.id}.`);
      a.warnedTimeout = true;
    }
    ent.action = null;
    ent.state = 'idle';
    ent.stateTime = 0;
    ent.parryActive = 0;
    return;
  }
  a.phaseTime += 1;

  if (a.phase === 'windup' && a.phaseTime >= windup) {
    a.phase = 'active';
    a.phaseTime = 0;
    onActiveEnter(world, ent);
  }
  if (a.phase === 'active') {
    onActiveTick(world, ent);
    if (a.phaseTime >= active) {
      a.phase = 'recovery';
      a.phaseTime = 0;
    }
  }
  if (a.phase === 'recovery' && a.phaseTime >= recovery) {
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
        kind: def.projectileKind || (isBolt ? 'bolt' : isArrow ? 'arrow' : 'spear'),
        owner: ent, hitId: ent.hitId,
        x: px, y: py, vx: def.projSpeed * f, vy: 0,
        life: def.projLife,
        damage: scaledDamage(ent, def.damage),
        knockback: def.knockback,
        color: def.projColor || ent.character.color,
        radius: (def.projectileKind || (isBolt ? 'bolt' : isArrow ? 'arrow' : 'spear')) === 'bolt' ? 8 : 6,
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
    // Paladin abilities
    case 'shield': {
      ent.shield = { hp: def.shieldHp, maxHp: def.shieldHp, duration: def.duration, dr: def.dr };
      spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#fcd34d', 70);
      addShake(world, 4, 8);
      break;
    }
    case 'aura': {
      ent._auraActive = { duration: def.duration, radius: def.radius, tickRate: def.tickRate, hpRestore: def.hpRestore, lastTick: 0 };
      spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#fcd34d', def.radius);
      addShake(world, 3, 6);
      break;
    }
    case 'judgment': {
      const target = otherOf(world, ent);
      if (target && !target.dead) {
        const dx = target.pos.x - ent.pos.x;
        const dy = (target.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.hypot(dx, dy) <= def.radius) {
          applyHit(world, ent, target, scaledDamage(ent, def.damage), def.knockback);
          spawnRing(world, target.pos.x, target.pos.y - ENTITY_HEIGHT / 2, '#fcd34d', 100);
          addShake(world, 12, 18);
        }
      }
      break;
    }
    // Berserker abilities
    case 'cleave': {
      ent.vel.vx = 0;
      const box = meleeHitbox(ent, def);
      spawnSlash(world, cx + f * 40, cy, f * 0.2, def.range, ent.character.color);
      break;
    }
    case 'buffStack': {
      if (!ent.furyStacks) ent.furyStacks = 0;
      if (ent.furyStacks < def.maxStacks) ent.furyStacks += 1;
      const dmgMul = Math.pow(def.damagePerStack, ent.furyStacks);
      const speedMul = Math.pow(def.speedPerStack, ent.furyStacks);
      ent.buff = { duration: def.duration, dmgMul: dmgMul, speedMul: speedMul, dr: 0 };
      spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#dc2626', 60);
      addShake(world, 2, 6);
      break;
    }
    case 'carnage': {
      ent.vel.vx = 0;
      addShake(world, 6, 10);
      break;
    }
    // Gunslinger abilities
    case 'roll': {
      ent.vel.vx = def.dashSpeed * f;
      ent.iframes = def.iframes;
      for (let i = 0; i < 8; i++) {
        spawnTrail(world, ent.pos.x + (Math.random() - 0.5) * 30, ent.pos.y - 20, '#8b5cf6');
      }
      break;
    }
    case 'rapidFire': {
      const charColor = ent.character.color;
      for (let i = 0; i < def.count; i++) {
        world.projectiles.push({
          kind: 'bolt', owner: ent, hitId: ent.hitId + i,
          x: cx + f * 32, y: cy - (i - (def.count - 1) / 2) * 12,
          vx: def.projSpeed * f, vy: 0,
          life: def.projLife, damage: scaledDamage(ent, def.damage),
          knockback: def.knockback, color: def.projColor || charColor,
          radius: 7, rot: 0
        });
      }
      addShake(world, 3, 6);
      break;
    }
    case 'execution': {
      world.projectiles.push({
        kind: 'bullet', owner: ent, hitId: ent.hitId,
        x: cx + f * 32, y: cy,
        vx: def.projSpeed * f, vy: 0,
        life: def.projLife, damage: scaledDamage(ent, def.damage),
        knockback: def.knockback, color: '#a78bfa',
        radius: 8, rot: 0
      });
      addShake(world, 8, 14);
      break;
    }
    // Necromancer abilities
    case 'curse': {
      const target = otherOf(world, ent);
      if (target && !target.dead) {
        target._cursed = { duration: def.duration, damageReduction: def.damageReduction, speedReduction: def.speedReduction };
        spawnRing(world, target.pos.x, target.pos.y - ENTITY_HEIGHT / 2, '#6366f1', 80);
        addShake(world, 5, 10);
      }
      break;
    }
    case 'explosion': {
      const target = otherOf(world, ent);
      const tx = target ? target.pos.x : ent.pos.x + f * 200;
      world.fallingObjects.push({
        kind: 'explosion', x: tx, y: GROUND_Y, vy: 0, fall: 0, target: GROUND_Y,
        owner: ent, hitId: ent.hitId, damage: scaledDamage(ent, def.damage),
        radius: def.radius, knockback: def.knockback, life: 10
      });
      spawnRing(world, tx, GROUND_Y, '#6366f1', def.radius);
      addShake(world, 10, 14);
      break;
    }
    case 'scythe': {
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
    // Paladin abilities
    case 'aura': {
      if (ent._auraActive && ent._auraActive.duration > 0) {
        ent._auraActive.lastTick = (ent._auraActive.lastTick || 0) + 1;
        if (ent._auraActive.lastTick >= ent._auraActive.tickRate) {
          ent._auraActive.lastTick = 0;
          if (ent.damagePercent > 0) {
            ent.damagePercent = Math.max(0, ent.damagePercent - ent._auraActive.hpRestore);
            ent.hp = Math.max(0, ent.character.maxHp - ent.damagePercent);
            spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#fcd34d', 40);
          }
        }
      }
      break;
    }
    // Berserker abilities
    case 'cleave': {
      const box = meleeHitbox(ent, def);
      if (rectsOverlap(box, entityBox(other))) {
        applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
      }
      break;
    }
    case 'carnage': {
      if (a.phaseTime % def.tickRate === 0) {
        const dx = other.pos.x - ent.pos.x;
        const dy = (other.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.hypot(dx, dy) <= def.radius) {
          ent.hitId += 1;
          const dmgMul = ent.buff && ent.buff.duration > 0 ? ent.buff.dmgMul : 1;
          applyHit(world, ent, other, scaledDamage(ent, def.damage) * def.dmgMul, def.knockback);
          spawnSlash(world, ent.pos.x + ent.facing * 30, ent.pos.y - ENTITY_HEIGHT / 2, 0, 70, '#dc2626');
        }
      }
      break;
    }
    // Gunslinger abilities
    case 'rapidFire': {
      // Multi-hit happens in onActiveEnter, no per-tick logic needed
      break;
    }
    // Necromancer abilities
    case 'scythe': {
      if (a.phaseTime % 6 === 0) {
        const dx = other.pos.x - ent.pos.x;
        const dy = (other.pos.y - ENTITY_HEIGHT / 2) - (ent.pos.y - ENTITY_HEIGHT / 2);
        if (Math.hypot(dx, dy) <= def.radius) {
          ent.hitId += 1;
          applyHit(world, ent, other, scaledDamage(ent, def.damage), def.knockback);
          spawnSlash(world, ent.pos.x + ent.facing * 40, ent.pos.y - ENTITY_HEIGHT / 2, 0, 80, '#6366f1');
        }
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

function faceOpponent(world, ent) {
  const other = otherOf(world, ent);
  if (!other || other.dead || ent.dead) return;
  const dx = other.pos.x - ent.pos.x;
  if (Math.abs(dx) < 0.001) return;
  ent.facing = dx > 0 ? 1 : -1;
}

function clampX(x) {
  const bounds = getStageBounds(ENTITY_HALF_W + 6);
  return Math.max(bounds.left, Math.min(bounds.right, x));
}

function clampArenaX(x) {
  return Math.max(BLAST_ZONE.left + 30, Math.min(BLAST_ZONE.right - 30, x));
}

function landOnPlatform(world, ent, platform) {
  const wasGrounded = ent.onGround;
  ent.pos.y = platform.y;
  ent.vel.vy = 0;
  ent.onGround = true;
  ent.platformId = platform.id;
  ent.airJumps = ent.maxAirJumps;
  if (!wasGrounded) {
    ent.landTime = 12;
    spawnDust(world, ent.pos.x, platform.y);
    if (Math.abs(ent.vel.vx) > ent.character.speed * 0.7 || ent.dead) {
      spawnShockwave(world, ent.pos.x, platform.y - 2, ent.dead ? '#ffffff' : ent.character.color);
    }
  }
}

function dropThroughPlatform(ent) {
  ent.onGround = false;
  ent.platformId = null;
  ent.dropTimer = DROP_THROUGH_FRAMES;
  ent.pos.y += 4;
  ent.vel.vy = Math.max(ent.vel.vy, 2.4);
  ent.landTime = 0;
}

function updateEntityState(world, ent) {
  if (ent.dead) {
    ent.state = 'dead';
    return;
  }
  if (world.winner && !ent.dead) {
    const won = (world.winner === 'player' && ent === world.player) || (world.winner === 'enemy' && ent === world.enemy);
    if (won && !ent.action && ent.hurtTime <= 0 && ent.frozen <= 0) {
      ent.state = 'victory';
      return;
    }
  }
  if (ent.respawnInvincible > 0 && ent.stateTime < 90) {
    ent.state = 'respawn';
    return;
  }
  if (ent.action) {
    ent.state = 'cast';
    return;
  }
  if (ent.hurtTime > 0) {
    ent.state = 'hurt';
    return;
  }
  if (!ent.onGround) {
    ent.state = ent.vel.vy < 1.2 ? 'jump' : 'fall';
    return;
  }
  ent.state = Math.abs(ent.vel.vx) > 0.6 ? 'run' : 'idle';
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

function approach(current, target, amount) {
  if (current < target) return Math.min(target, current + amount);
  if (current > target) return Math.max(target, current - amount);
  return target;
}

function hasLeftBlastZone(ent) {
  return ent.pos.x < BLAST_ZONE.left ||
    ent.pos.x > BLAST_ZONE.right ||
    ent.pos.y < BLAST_ZONE.top ||
    ent.pos.y > BLAST_ZONE.bottom;
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function sanitizeEntity(world, ent) {
  if (!ent) return;
  const spawn = getSpawnPoints()[ent.isPlayer ? 'player' : 'enemy'];
  const hadInvalidPosition =
    !Number.isFinite(ent.pos?.x) ||
    !Number.isFinite(ent.pos?.y) ||
    !Number.isFinite(ent.vel?.vx) ||
    !Number.isFinite(ent.vel?.vy);

  if (hadInvalidPosition) {
    console.warn(`Reset invalid battle position for ${ent.character?.name || ent.id}.`);
    ent.pos.x = spawn.x;
    ent.pos.y = spawn.y;
    ent.vel.vx = 0;
    ent.vel.vy = 0;
    ent.onGround = false;
    ent.platformId = null;
    ent.dropTimer = 0;
  } else {
    ent.pos.x = finiteOr(ent.pos.x, spawn.x);
    ent.pos.y = finiteOr(ent.pos.y, spawn.y);
    ent.vel.vx = Math.max(-28, Math.min(28, finiteOr(ent.vel.vx, 0)));
    ent.vel.vy = Math.max(-28, Math.min(28, finiteOr(ent.vel.vy, 0)));
  }

  for (const k of ACTION_KEYS) ent.cooldowns[k] = Math.max(0, finiteOr(ent.cooldowns[k], 0));
  ent.damagePercent = Math.max(0, finiteOr(ent.damagePercent, 0));
  ent.hurtTime = Math.max(0, finiteOr(ent.hurtTime, 0));
  ent.knockTime = Math.max(0, finiteOr(ent.knockTime, 0));
  ent.frozen = Math.max(0, finiteOr(ent.frozen, 0));
  ent.respawnTimer = Math.max(0, finiteOr(ent.respawnTimer, 0));
  ent.respawnInvincible = Math.max(0, finiteOr(ent.respawnInvincible, 0));
}

function removeInvalidWorldObjects(world) {
  world.projectiles = world.projectiles.filter((p) =>
    p && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.vx) && Number.isFinite(p.vy) && Number.isFinite(p.life)
  );
  world.shockwaves = world.shockwaves.filter((s) =>
    s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.speed) && Number.isFinite(s.range)
  );
  world.fallingObjects = world.fallingObjects.filter((f) =>
    f && Number.isFinite(f.x) && Number.isFinite(f.y) && Number.isFinite(f.fall) && Number.isFinite(f.target)
  );
  world.lavaPools = (world.lavaPools || []).filter((pool) =>
    pool && Number.isFinite(pool.x) && Number.isFinite(pool.radius) && Number.isFinite(pool.duration)
  );
  world.minions = (world.minions || []).filter((m) =>
    m && Number.isFinite(m.x) && Number.isFinite(m.y) && Number.isFinite(m.vx) && Number.isFinite(m.vy)
  );
}

function spawnKoBurst(world, ent, dir) {
  const color = ent.character.color;
  world.koText = {
    text: `${ent.character.name} KO`,
    color,
    time: 72,
    maxTime: 72,
    x: Math.max(190, Math.min(ARENA_W - 190, ent.pos.x)),
    y: Math.max(130, Math.min(GROUND_Y - 160, ent.pos.y - ENTITY_HEIGHT / 2))
  };
  audioManager.playKo();
  spawnHitBurst(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#ffffff', 40);
  spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, color, 130);
  spawnShockwave(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, '#ffffff');
  for (let i = 0; i < 18; i++) {
    spawnSpark(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, i % 2 ? color : '#ffffff');
  }
  addShake(world, 18, 22);
  world.hitPause = Math.max(world.hitPause, 4);
}

function koEntity(world, ent) {
  if (ent.dead || world.winner) return;
  const dir = ent.pos.x < ARENA_W / 2 ? -1 : 1;
  ent.stocks = world.training ? ent.stocks : Math.max(0, ent.stocks - 1);
  ent.dead = true;
  ent.state = 'dead';
  ent.stateTime = 0;
  ent.action = null;
  ent.queuedAction = null;
  ent.hurtTime = 0;
  ent.knockTime = 0;
  ent.onGround = false;
  ent.platformId = null;
  ent.respawnTimer = (ent.stocks > 0 || world.training) ? RESPAWN_DELAY : 0;
  ent.input.basic = false;
  ent.input.ability1 = false;
  ent.input.ability2 = false;
  ent.input.ultimate = false;
  ent.input.jumpPressed = false;
  spawnKoBurst(world, ent, dir);
  if (!world.training && ent.stocks <= 0) {
    world.winner = ent === world.player ? 'enemy' : 'player';
  }
}

function respawnEntity(world, ent) {
  const spawn = getSpawnPoints()[ent.isPlayer ? 'player' : 'enemy'];
  ent.pos.x = spawn.x;
  ent.pos.y = spawn.y - 80;
  ent.vel.vx = 0;
  ent.vel.vy = 1.5;
  ent.damagePercent = 0;
  ent.hp = ent.character.maxHp;
  ent.dead = false;
  ent.deathLanded = false;
  ent.respawnTimer = 0;
  ent.iframes = RESPAWN_INVINCIBILITY;
  ent.respawnInvincible = RESPAWN_INVINCIBILITY;
  ent.airJumps = ent.maxAirJumps;
  ent.action = null;
  ent.queuedAction = null;
  ent.hurtTime = 0;
  ent.knockTime = 0;
  ent.state = 'fall';
  ent.stateTime = 0;
  ent.input.basic = false;
  ent.input.ability1 = false;
  ent.input.ability2 = false;
  ent.input.ultimate = false;
  ent.input.jumpPressed = false;
  spawnRing(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, ent.character.color, 90);
  spawnHitBurst(world, ent.pos.x, ent.pos.y - ENTITY_HEIGHT / 2, ent.character.color, 16);
}

function applyHit(world, attacker, victim, damage, knockback) {
  if (victim.iframes > 0 || victim.dead) return;
  if (!attacker.isPlayer && world.aiDifficulty) {
    damage *= world.aiDifficulty;
    knockback *= Math.min(1.45, 0.86 + world.aiDifficulty * 0.18);
  }

  if (victim.parryActive > 0) {
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
  // Apply curse damage penalty (curse makes you take MORE damage)
  if (victim._cursed && victim._cursed.duration > 0) {
    damage *= (2 - victim._cursed.damageReduction); // if damageReduction is 0.75, damage is multiplied by 1.25
  }
  // bone shield absorbs damage
  if (victim.shield && victim.shield.hp > 0) {
    const absorbed = Math.min(victim.shield.hp, damage);
    victim.shield.hp -= absorbed;
    damage -= absorbed;
    spawnRing(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, '#34d399', 40);
    if (damage <= 0) return;
  }

  victim.damagePercent = Math.max(0, victim.damagePercent + damage);
  victim.hp = Math.max(0, victim.character.maxHp - victim.damagePercent);
  victim.iframes = 14;
  victim.flashTime = 8;
  victim.hurtTime = 16;
  victim.action = null;
  victim.state = 'hurt';
  victim.stateTime = 0;
  victim.platformId = null;
  victim.landTime = 0;

  const dir = Math.sign(victim.pos.x - attacker.pos.x) || attacker.facing;
  const scale = 1 + victim.damagePercent / 82 + Math.max(0, damage - 8) / 70;
  const launched = knockback * scale;
  victim.vel.vx = dir * launched;
  victim.vel.vy = -Math.min(16, Math.max(4.5, launched * 0.62 + damage * 0.05));
  victim.onGround = false;
  victim.knockTime = Math.min(38, 12 + Math.floor(launched * 1.15));

  // Play hit sound based on damage
  const intensity = damage < 15 ? 'light' : damage < 25 ? 'normal' : 'heavy';
  audioManager.playHit(intensity);

  spawnHitBurst(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, attacker.character.color, 14);
  for (let i = 0; i < 3 + Math.floor(damage / 10); i++) {
    spawnSpark(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, i % 2 === 0 ? '#ffffff' : attacker.character.color);
  }
  if (damage >= 20 || launched >= 9) spawnShockwave(world, victim.pos.x, victim.pos.y - ENTITY_HEIGHT / 2, attacker.character.color);
  addShake(world, Math.min(16, damage * 0.35 + launched * 0.65), 9 + Math.min(10, Math.floor(launched)));
  world.hitPause = Math.max(world.hitPause, Math.min(HIT_PAUSE_MAX, 2 + Math.floor(launched * 0.25)));
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
  // Handle curse duration
  if (ent._cursed) {
    ent._cursed.duration -= 1;
    if (ent._cursed.duration <= 0) ent._cursed = null;
  }
  // Handle aura duration
  if (ent._auraActive) {
    ent._auraActive.duration -= 1;
    if (ent._auraActive.duration <= 0) ent._auraActive = null;
  }
  if (ent.dropTimer > 0) ent.dropTimer -= 1;
  if (ent.landTime > 0) ent.landTime -= 1;
  if (ent.respawnInvincible > 0) ent.respawnInvincible -= 1;

  ent.animTime += 1;
  ent.stateTime += 1;

  const prevY = ent.pos.y;

  if (ent.dead) {
    if (ent.stocks > 0 && ent.respawnTimer > 0) {
      ent.respawnTimer -= 1;
      if (ent.respawnTimer <= 0) respawnEntity(world, ent);
      updateEntityState(world, ent);
      return;
    }
    ent.vel.vy += GRAVITY;
    if (ent.vel.vy > MAX_FALL) ent.vel.vy = MAX_FALL;
    ent.pos.x += ent.vel.vx;
    ent.pos.y += ent.vel.vy;
    ent.pos.x = clampArenaX(ent.pos.x);

    const landingPlatform = findLandingPlatform(ent.pos.x, prevY, ent.pos.y, false);
    if (landingPlatform) {
      const firstDeathLanding = !ent.deathLanded;
      landOnPlatform(world, ent, landingPlatform);
      ent.deathLanded = true;
      ent.vel.vx *= 0.85;
      if (firstDeathLanding) {
        spawnHitBurst(world, ent.pos.x, ent.pos.y - 10, ent.character.color, 12);
        addShake(world, 10, 12);
      }
    } else {
      ent.onGround = false;
      ent.platformId = null;
    }
    updateEntityState(world, ent);
    return;
  }

  faceOpponent(world, ent);

  const canAct = !ent.action && ent.hurtTime <= 0 && ent.frozen <= 0;
  const inp = ent.input;
  const jumpNow = inp.jumpPressed || (!ent.isPlayer && inp.jump);
  const currentPlatform = ent.onGround ? (getStagePlatform(ent.platformId) || findCurrentPlatform(ent.pos.x, ent.pos.y)) : null;
  const inVictory = world.winner && ((world.winner === 'player' && ent === world.player) || (world.winner === 'enemy' && ent === world.enemy));
  if (currentPlatform && (currentPlatform.moveX || currentPlatform.moveY)) {
    ent.pos.x += currentPlatform.x - (currentPlatform.prevX ?? currentPlatform.x);
    ent.pos.y += currentPlatform.y - (currentPlatform.prevY ?? currentPlatform.y);
  }

  if (canAct && ent.queuedAction) {
    tryAction(world, ent, ent.queuedAction);
    ent.queuedAction = null;
  }

  let speedMul = ent.buff ? ent.buff.speedMul : 1;
  if (ent.stealth > 0) speedMul *= (ent.stealthSpeed || 1.5);
  // Apply curse debuff
  if (ent._cursed && ent._cursed.duration > 0) speedMul *= ent._cursed.speedReduction;
  const baseSpeed = ent.character.speed * speedMul;
  const accel = ent.onGround ? Math.max(0.42, baseSpeed * 0.18) : Math.max(0.22, baseSpeed * 0.085);
  const stage = getActiveStage();
  const groundFriction = stage.slippery ? 0.94 : FRICTION;
  if (inVictory) {
    ent.vel.vx *= groundFriction;
  } else if (canAct && ent.knockTime <= 0) {
    if (inp.left) ent.vel.vx = approach(ent.vel.vx, -baseSpeed, accel);
    else if (inp.right) ent.vel.vx = approach(ent.vel.vx, baseSpeed, accel);
    else ent.vel.vx *= ent.onGround ? groundFriction : AIR_FRICTION;

    if (inp.down && jumpNow && currentPlatform?.kind === 'soft') {
      dropThroughPlatform(ent);
    } else if (jumpNow && ent.onGround) {
      ent.vel.vy = -ent.character.jumpPower;
      ent.onGround = false;
      ent.platformId = null;
      spawnDust(world, ent.pos.x, prevY);
    } else if (jumpNow && !ent.onGround && ent.airJumps > 0) {
      ent.airJumps -= 1;
      ent.vel.vy = -ent.character.jumpPower * 0.92;
      spawnDust(world, ent.pos.x, ent.pos.y);
    }
  } else {
    ent.vel.vx *= ent.onGround ? groundFriction : AIR_FRICTION;
  }

  progressAction(world, ent);

  ent.vel.vy += GRAVITY;
  if (ent.vel.vy > MAX_FALL) ent.vel.vy = MAX_FALL;
  if (stage.windX && !ent.onGround) {
    ent.vel.vx = Math.max(-12, Math.min(12, ent.vel.vx + stage.windX));
  }

  ent.pos.x += ent.vel.vx;
  ent.pos.y += ent.vel.vy;
  ent.pos.x = clampArenaX(ent.pos.x);

  const landingPlatform = ent.vel.vy >= 0 ? findLandingPlatform(ent.pos.x, prevY, ent.pos.y, ent.dropTimer > 0) : null;
  if (landingPlatform) {
    landOnPlatform(world, ent, landingPlatform);
  } else {
    ent.onGround = false;
    ent.platformId = null;
  }

  updateEntityState(world, ent);
  ent.input.jumpPressed = false;
  if (!world.winner && (hasLeftBlastZone(ent) || (stage.lavaBottom && ent.pos.y > GROUND_Y + 72))) koEntity(world, ent);
}

function updateProjectiles(world) {
  for (let i = world.projectiles.length - 1; i >= 0; i--) {
    const p = world.projectiles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 1;
    p.rot = (p.rot || 0) + 0.2;
    if ((world.tick + i) % 2 === 0) spawnTrail(world, p.x, p.y, p.color);

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
  updateStage(world.tick);
  sanitizeEntity(world, world.player);
  sanitizeEntity(world, world.enemy);
  removeInvalidWorldObjects(world);
  if (world.koText) {
    world.koText.time -= 1;
    if (world.koText.time <= 0) world.koText = null;
  }
  if (world.hitPause > 0) {
    world.hitPause -= 1;
    updateParticles(world);
    if (world.shake.time > 0) world.shake.time -= 1;
    else world.shake.mag = 0;
    return;
  }
  updateEntity(world, world.player);
  updateEntity(world, world.enemy);
  updateProjectiles(world);
  updateShockwaves(world);
  updateFalling(world);
  updateLavaPools(world);
  updateMinions(world);
  trimWorldLists(world);
  updateParticles(world);
  sanitizeEntity(world, world.player);
  sanitizeEntity(world, world.enemy);
  removeInvalidWorldObjects(world);
  if (world.shake.time > 0) world.shake.time -= 1;
  else world.shake.mag = 0;
  if (world.winner && !world.victoryPlayed) {
    world.victoryPlayed = true;
    audioManager.playVictory();
  }
}

function updateShockwaves(world) {
  for (let i = world.shockwaves.length - 1; i >= 0; i--) {
    const s = world.shockwaves[i];
    s.x += s.speed * s.dir;
    s.traveled += s.speed;
    if (world.tick % 3 === 0 && s.traveled % 12 < s.speed) spawnDust(world, s.x, GROUND_Y);
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
    if ((world.tick + i) % 2 === 0) spawnTrail(world, f.x, f.y, f.kind === 'meteor' ? '#fbbf24' : f.kind === 'eruption' ? '#fb923c' : '#fde68a');
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

function trimWorldLists(world) {
  if (world.projectiles.length > 90) world.projectiles.splice(0, world.projectiles.length - 90);
  if (world.fallingObjects.length > 48) world.fallingObjects.splice(0, world.fallingObjects.length - 48);
  if (world.shockwaves.length > 28) world.shockwaves.splice(0, world.shockwaves.length - 28);
  if (world.lavaPools && world.lavaPools.length > 10) world.lavaPools.splice(0, world.lavaPools.length - 10);
  if (world.minions && world.minions.length > 10) world.minions.splice(0, world.minions.length - 10);
}

export function applyPlayerInput(world, input) {
  const p = world.player;
  p.input.left = input.state.left;
  p.input.right = input.state.right;
  p.input.down = input.state.down;
  p.input.jump = input.state.jump;
  p.input.jumpPressed = input.consumePressed('jump');
  const pressedAction =
    input.consumePressed('basic') ? 'basic' :
      input.consumePressed('ability1') ? 'ability1' :
        input.consumePressed('ability2') ? 'ability2' :
          input.consumePressed('ultimate') ? 'ultimate' : null;

  if (p.dead || p.respawnTimer > 0 || p.respawnInvincible > 0) {
    p.queuedAction = null;
    return;
  }
  if (pressedAction) p.queuedAction = pressedAction;
}
