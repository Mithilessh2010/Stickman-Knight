import { tryAction } from './engine.js';
import { ARENA_W, GROUND_Y } from './constants.js';
import { getStageBounds, getStagePlatform } from './stage.js';

const PREFERRED_RANGE = {
  sword: 70, spear: 100, mage: 260, brute: 64,
  assassin: 55, archer: 300, elemental: 220, summoner: 240,
  paladin: 100, berserker: 80, gunslinger: 240, necromancer: 180
};

export function updateAI(world, self, target) {
  if (self.dead) return;
  if (!self.ai) self.ai = { state: 'approach', timer: 0, decision: 0, lastAction: 0 };
  const ai = self.ai;
  ai.timer += 1; ai.decision -= 1; ai.lastAction += 1;
  const dx = target.pos.x - self.pos.x;
  const dist = Math.abs(dx);
  self.facing = dx >= 0 ? 1 : -1;
  const ch = self.character;
  const preferred = ch.aiRange || PREFERRED_RANGE[ch.id] || 80;
  const stage = getStageBounds(42);

  self.input.left = false; self.input.right = false; self.input.down = false; self.input.jump = false;

  if (target.dead || target.respawnTimer > 0) {
    holdCenterStage(self);
    return;
  }

  if (self.action || self.state === 'hurt' || self.frozen > 0) return;

  const offstage = self.pos.x < stage.left || self.pos.x > stage.right || self.pos.y > GROUND_Y + 24;
  if (offstage) {
    const homeDir = self.pos.x < ARENA_W / 2 ? 1 : -1;
    self.facing = homeDir;
    if (homeDir > 0) self.input.right = true; else self.input.left = true;
    if (!self.onGround && (self.vel.vy > -2 || self.pos.y > GROUND_Y - 80)) self.input.jump = true;
    const recovery = pickRecovery(self);
    if (recovery && self.cooldowns[recovery] <= 0) tryAction(world, self, recovery);
    return;
  }

  if (avoidPlatformEdge(self)) return;

  if (ai.decision <= 0) {
    ai.decision = 30 + Math.floor(Math.random() * 40); // Longer delays, less frequent decisions
    if (ai.lastAction > 80 && Math.random() < 0.25) { // Much lower ability usage (0.25 instead of 0.5)
      const ability = pickAbility(world, self, target, dist);
      if (ability && tryAction(world, self, ability)) { ai.lastAction = 0; return; }
    }
  }

  const tooClose = shouldBackOff(ch, dist, preferred);
  const inRange = dist <= preferred;
  const onSoftPlatform = self.onGround && self.platformId && self.platformId !== 'main';
  const targetAbove = target.pos.y < self.pos.y - 56;
  const targetBelow = target.pos.y > self.pos.y + 68;

  if (onSoftPlatform && targetBelow && Math.abs(dx) < 150) {
    self.input.down = true;
    self.input.jump = true;
    return;
  }

  if (tooClose) {
    if (dx > 0) self.input.left = true; else self.input.right = true;
    if (prefersRange(ch) && self.onGround && Math.random() < 0.04)
      self.input.jump = true;
  } else if (!inRange) {
    if (dx > 0) self.input.right = true; else self.input.left = true;
    if (targetAbove && self.onGround) self.input.jump = true;
    if (ch.id === 'summoner' && world.minions && world.minions.filter(m => m.owner === self).length >= 2) {
      self.input.left = false; self.input.right = false;
    }
  } else {
    if (self.cooldowns.basic <= 0 && Math.random() < 0.2) { // Much less basic attack spam (0.2 instead of 0.55)
      if (tryAction(world, self, 'basic')) ai.lastAction = 0;
    } else if (Math.random() < 0.02) {
      if (Math.random() < 0.5) self.input.left = true; else self.input.right = true;
    }
  }

  if (targetBelow && onSoftPlatform && dist < preferred * 1.1) {
    self.input.left = false;
    self.input.right = false;
    self.input.down = true;
    self.input.jump = true;
  }

  avoidPlatformEdge(self);
}

function getCurrentPlatformBounds(self, margin = 34) {
  const platform = getStagePlatform(self.platformId) || null;
  if (platform) {
    const half = platform.width / 2 - margin;
    return { left: platform.x - half, right: platform.x + half, center: platform.x };
  }
  const main = getStageBounds(margin);
  return { ...main, center: ARENA_W / 2 };
}

function holdCenterStage(self) {
  const bounds = getCurrentPlatformBounds(self, 70);
  const centerDx = bounds.center - self.pos.x;
  if (Math.abs(centerDx) > 24) {
    if (centerDx > 0) self.input.right = true;
    else self.input.left = true;
    self.facing = centerDx > 0 ? 1 : -1;
  }
  if (!self.onGround && self.pos.y > GROUND_Y - 80) self.input.jump = true;
}

function avoidPlatformEdge(self) {
  const bounds = getCurrentPlatformBounds(self, self.platformId && self.platformId !== 'main' ? 28 : 52);
  const projectedX = self.pos.x + self.vel.vx * 8;
  if (projectedX <= bounds.left || self.pos.x <= bounds.left) {
    self.input.left = false;
    self.input.right = true;
    self.facing = 1;
    return true;
  }
  if (projectedX >= bounds.right || self.pos.x >= bounds.right) {
    self.input.right = false;
    self.input.left = true;
    self.facing = -1;
    return true;
  }
  return false;
}

function prefersRange(ch) {
  return ['Mages', 'Elemental Users', 'Ranged Fighters', 'Control / Summoners'].includes(ch.archetype);
}

function shouldBackOff(ch, dist, preferred) {
  const id = ch.id;
  if (id === 'mage') return dist < preferred * 0.55;
  if (id === 'archer') return dist < preferred * 0.45;
  if (id === 'elemental') return dist < preferred * 0.5;
  if (id === 'summoner') return dist < preferred * 0.6;
  if (prefersRange(ch)) return dist < preferred * 0.52;
  return false;
}

function pickRecovery(self) {
  const mobility = ['ability1', 'ability2'];
  return mobility.find((key) => {
    const def = self.character[key];
    return def && ['vault', 'backflip', 'teleport', 'shadowStep', 'roll', 'flameDash', 'dashStrike'].includes(def.type);
  });
}

function pickAbility(world, self, target, dist) {
  const ch = self.character;
  const choices = [];
  const pressure = Math.min(1, self.damagePercent / 150);
  switch (ch.id) {
    case 'sword':
      if (self.cooldowns.ability1 <= 0 && dist < 130) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 80) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist < 100 && pressure > 0.2) choices.push('ultimate');
      break;
    case 'spear':
      if (self.cooldowns.ability1 <= 0 && dist > 80) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist > 100) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && pressure > 0.25) choices.push('ultimate');
      break;
    case 'mage':
      if (self.cooldowns.ability1 <= 0 && dist < 80) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 130) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && pressure > 0.3) choices.push('ultimate');
      break;
    case 'brute':
      if (self.cooldowns.ability1 <= 0 && dist < 200) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 120) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && pressure > 0.35) choices.push('ultimate');
      break;
    case 'assassin':
      if (self.cooldowns.ability1 <= 0) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && pressure > 0.25) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist < 70) choices.push('ultimate');
      break;
    case 'archer':
      if (self.cooldowns.ability1 <= 0 && dist > 150) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 120) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0) choices.push('ultimate');
      break;
    case 'elemental':
      if (self.cooldowns.ability1 <= 0 && dist < 100) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 200) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && pressure > 0.25) choices.push('ultimate');
      break;
    case 'summoner': {
      const minionCount = (world.minions || []).filter(m => m.owner === self && !m.dead).length;
      if (self.cooldowns.ability1 <= 0 && minionCount < 2) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && !self.shield) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && minionCount < 1) choices.push('ultimate');
      break;
    }
    case 'paladin':
      if (self.cooldowns.ability1 <= 0 && pressure > 0.35) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist < 180) choices.push('ultimate');
      break;
    case 'berserker':
      if (self.cooldowns.ability1 <= 0 && dist < 150) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && self.berserkStacks >= 3) choices.push('ultimate');
      break;
    case 'gunslinger':
      if (self.cooldowns.ability1 <= 0 && dist < 150) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 180) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist > 100 && dist < 300) choices.push('ultimate');
      break;
    case 'necromancer':
      if (self.cooldowns.ability1 <= 0 && dist < 200) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 160) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist < 150) choices.push('ultimate');
      break;
  }
  if (!choices.length) {
    for (const key of ['ability1', 'ability2', 'ultimate']) {
      const ability = ch[key];
      if (!ability || self.cooldowns[key] > 0) continue;
      if (key === 'ultimate' && pressure < 0.22 && dist > preferred * 0.9) continue;
      if (['shield', 'boneShield', 'buff', 'buffStack', 'smokeBomb'].includes(ability.type) && pressure > 0.18) choices.push(key);
      else if (['vault', 'backflip', 'roll', 'teleport', 'shadowStep'].includes(ability.type) && (dist < preferred * 0.55 || pressure > 0.45)) choices.push(key);
      else if (['projectile', 'piercingShot', 'rapidFire', 'execution', 'rain', 'meteor', 'eruption'].includes(ability.type) && dist > preferred * 0.45) choices.push(key);
      else if (['melee', 'dashStrike', 'charge', 'cleave', 'spin', 'carnage', 'scythe', 'slam', 'nova', 'judgment', 'deathMark', 'flameDash', 'explosion', 'curse', 'summon', 'titan', 'aura', 'parry', 'lavaPool'].includes(ability.type) && dist < preferred * 1.45) choices.push(key);
    }
  }
  if (!choices.length) return null;
  return choices[Math.floor(Math.random() * choices.length)];
}
