import { tryAction } from './engine.js';

const PREFERRED_RANGE = {
  sword: 70, spear: 100, mage: 260, brute: 64,
  assassin: 55, archer: 300, elemental: 220, summoner: 240,
  paladin: 100, berserker: 80, gunslinger: 240, necromancer: 180
};

export function updateAI(world, self, target) {
  if (self.dead || target.dead) return;
  if (!self.ai) self.ai = { state: 'approach', timer: 0, decision: 0, lastAction: 0 };
  const ai = self.ai;
  ai.timer += 1; ai.decision -= 1; ai.lastAction += 1;
  const dx = target.pos.x - self.pos.x;
  const dist = Math.abs(dx);
  self.facing = dx >= 0 ? 1 : -1;
  if (self.action || self.state === 'hurt' || self.frozen > 0) return;
  const ch = self.character;
  const preferred = PREFERRED_RANGE[ch.id] || 80;

  if (ai.decision <= 0) {
    ai.decision = 16 + Math.floor(Math.random() * 20);
    if (ai.lastAction > 45 && Math.random() < 0.5) {
      const ability = pickAbility(world, self, target, dist);
      if (ability && tryAction(world, self, ability)) { ai.lastAction = 0; return; }
    }
  }

  self.input.left = false; self.input.right = false; self.input.jump = false;
  const tooClose = shouldBackOff(ch.id, dist, preferred);
  const inRange = dist <= preferred;

  if (tooClose) {
    if (dx > 0) self.input.left = true; else self.input.right = true;
    if ((ch.id === 'archer' || ch.id === 'mage' || ch.id === 'elemental') && self.onGround && Math.random() < 0.04)
      self.input.jump = true;
  } else if (!inRange) {
    if (dx > 0) self.input.right = true; else self.input.left = true;
    if (target.pos.y < self.pos.y - 60 && self.onGround) self.input.jump = true;
    if (ch.id === 'summoner' && world.minions && world.minions.filter(m => m.owner === self).length >= 2) {
      self.input.left = false; self.input.right = false;
    }
  } else {
    if (self.cooldowns.basic <= 0 && Math.random() < 0.55) {
      if (tryAction(world, self, 'basic')) ai.lastAction = 0;
    } else if (Math.random() < 0.04) {
      if (Math.random() < 0.5) self.input.left = true; else self.input.right = true;
    }
  }
}

function shouldBackOff(id, dist, preferred) {
  if (id === 'mage') return dist < preferred * 0.55;
  if (id === 'archer') return dist < preferred * 0.45;
  if (id === 'elemental') return dist < preferred * 0.5;
  if (id === 'summoner') return dist < preferred * 0.6;
  return false;
}

function pickAbility(world, self, target, dist) {
  const ch = self.character;
  const choices = [];
  const hp = self.hp / ch.maxHp;
  switch (ch.id) {
    case 'sword':
      if (self.cooldowns.ability1 <= 0 && dist < 130) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 80) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && dist < 100 && hp < 0.8) choices.push('ultimate');
      break;
    case 'spear':
      if (self.cooldowns.ability1 <= 0 && dist > 80) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist > 100) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && hp < 0.75) choices.push('ultimate');
      break;
    case 'mage':
      if (self.cooldowns.ability1 <= 0 && dist < 80) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 130) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && hp < 0.7) choices.push('ultimate');
      break;
    case 'brute':
      if (self.cooldowns.ability1 <= 0 && dist < 200) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && dist < 120) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && hp < 0.6) choices.push('ultimate');
      break;
    case 'assassin':
      if (self.cooldowns.ability1 <= 0) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && hp < 0.7) choices.push('ability2');
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
      if (self.cooldowns.ultimate <= 0 && hp < 0.75) choices.push('ultimate');
      break;
    case 'summoner': {
      const minionCount = (world.minions || []).filter(m => m.owner === self && !m.dead).length;
      if (self.cooldowns.ability1 <= 0 && minionCount < 2) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0 && !self.shield) choices.push('ability2');
      if (self.cooldowns.ultimate <= 0 && minionCount < 1) choices.push('ultimate');
      break;
    }
    case 'paladin':
      if (self.cooldowns.ability1 <= 0 && hp < 0.65) choices.push('ability1');
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
  if (!choices.length) return null;
  return choices[Math.floor(Math.random() * choices.length)];
}
