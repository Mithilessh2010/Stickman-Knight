import { tryAction } from './engine.js';

export function updateAI(world, self, target) {
  if (self.dead || target.dead) return;
  if (!self.ai) {
    self.ai = { state: 'approach', timer: 0, decision: 0, lastAction: 0 };
  }
  const ai = self.ai;
  ai.timer += 1;
  ai.decision -= 1;
  ai.lastAction += 1;

  // Always face the target
  const dx = target.pos.x - self.pos.x;
  const dist = Math.abs(dx);
  self.facing = dx >= 0 ? 1 : -1;

  if (self.action || self.state === 'hurt' || self.frozen > 0) return;

  const ch = self.character;
  const preferredRange = {
    sword: 70, spear: 100, mage: 260, brute: 64
  }[ch.id] || 80;

  if (ai.decision <= 0) {
    ai.decision = 18 + Math.floor(Math.random() * 22);

    if (ai.lastAction > 50 && Math.random() < 0.45) {
      const choices = [];
      if (self.cooldowns.ultimate <= 0 && self.hp < ch.maxHp * 0.7) choices.push('ultimate');
      if (self.cooldowns.ability1 <= 0) choices.push('ability1');
      if (self.cooldowns.ability2 <= 0) choices.push('ability2');
      if (choices.length) {
        const pick = choices[Math.floor(Math.random() * choices.length)];
        let ok = true;
        if (ch.id === 'sword' && pick === 'ability1' && dist < 80) ok = false;
        if (ch.id === 'spear' && pick === 'ability2' && dist < 120) ok = false;
        if (ch.id === 'mage' && pick === 'ability2' && dist > 120) ok = false;
        if (ch.id === 'brute' && pick === 'ability2' && dist < 90) ok = false;
        if (ok && tryAction(world, self, pick)) {
          ai.lastAction = 0;
          return;
        }
      }
    }
  }

  const tooClose = (ch.id === 'mage' && dist < preferredRange * 0.55);
  const inRange = dist <= preferredRange;

  self.input.left = false; self.input.right = false; self.input.jump = false;

  if (tooClose) {
    if (dx > 0) self.input.left = true; else self.input.right = true;
  } else if (!inRange) {
    if (dx > 0) self.input.right = true; else self.input.left = true;
    if (target.pos.y < self.pos.y - 60 && self.onGround) self.input.jump = true;
  } else {
    if (self.cooldowns.basic <= 0 && Math.random() < 0.55) {
      if (tryAction(world, self, 'basic')) ai.lastAction = 0;
    } else {
      if (Math.random() < 0.04) {
        if (Math.random() < 0.5) self.input.left = true; else self.input.right = true;
      }
    }
  }
}
