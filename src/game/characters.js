// Each character has totally distinct mechanics — no shared abilities.
// Cooldowns are in ticks (60 ticks = 1 second).

const CORE_CHARACTERS = {
  sword: {
    id: 'sword',
    name: 'Sword Fighter',
    role: 'Duelist',
    tagline: 'Precise strikes and a deadly spinning finisher.',
    color: '#7dd3fc',
    accent: '#0ea5e9',
    weapon: 'sword',
    maxHp: 100,
    speed: 3.4,
    jumpPower: 11,
    basic: {
      name: 'Slash',
      type: 'melee',
      cooldown: 26, windup: 5, active: 7, recovery: 12,
      damage: 11, range: 64, hitH: 56, knockback: 4.2
    },
    ability1: {
      name: 'Lunge',
      type: 'dashStrike',
      cooldown: 110, windup: 4, active: 14, recovery: 14,
      damage: 16, range: 70, hitH: 50, knockback: 6,
      dashSpeed: 12
    },
    ability2: {
      name: 'Riposte',
      type: 'parry',
      cooldown: 180, windup: 0, active: 22, recovery: 16,
      damage: 22, range: 60, hitH: 60, knockback: 8
    },
    ultimate: {
      name: 'Whirlwind',
      type: 'spin',
      cooldown: 720, windup: 6, active: 70, recovery: 18,
      damage: 8, tickRate: 10, radius: 90, knockback: 5
    }
  },

  spear: {
    id: 'spear',
    name: 'Spear Fighter',
    role: 'Skirmisher',
    tagline: 'Long reach, leaping mobility, and a sky storm finisher.',
    color: '#fbbf24',
    accent: '#b45309',
    weapon: 'spear',
    maxHp: 92,
    speed: 3.2,
    jumpPower: 10,
    basic: {
      name: 'Thrust',
      type: 'melee',
      cooldown: 32, windup: 7, active: 6, recovery: 16,
      damage: 13, range: 92, hitH: 30, knockback: 5
    },
    ability1: {
      name: 'Pole Vault',
      type: 'vault',
      cooldown: 130, windup: 6, active: 0, recovery: 8,
      jumpVy: -15, jumpVx: 9
    },
    ability2: {
      name: 'Javelin',
      type: 'projectile',
      cooldown: 150, windup: 10, active: 1, recovery: 22,
      damage: 18, projSpeed: 13, projLife: 90, knockback: 5
    },
    ultimate: {
      name: 'Spear Rain',
      type: 'rain',
      cooldown: 780, windup: 24, active: 90, recovery: 20,
      damage: 14, count: 8, knockback: 4
    }
  },

  mage: {
    id: 'mage',
    name: 'Mage',
    role: 'Caster',
    tagline: 'Arcane bolts, blink mobility, and meteor doom.',
    color: '#c084fc',
    accent: '#7c3aed',
    weapon: 'staff',
    maxHp: 82,
    speed: 2.9,
    jumpPower: 10,
    basic: {
      name: 'Arcane Bolt',
      type: 'projectile',
      cooldown: 36, windup: 8, active: 1, recovery: 14,
      damage: 10, projSpeed: 9, projLife: 80, knockback: 2.5,
      projColor: '#c084fc'
    },
    ability1: {
      name: 'Blink',
      type: 'teleport',
      cooldown: 140, windup: 6, active: 1, recovery: 10,
      distance: 220
    },
    ability2: {
      name: 'Frost Nova',
      type: 'nova',
      cooldown: 240, windup: 12, active: 18, recovery: 18,
      damage: 9, radius: 130, freeze: 80, knockback: 4
    },
    ultimate: {
      name: 'Meteor',
      type: 'meteor',
      cooldown: 700, windup: 30, active: 1, recovery: 30,
      damage: 38, radius: 140, knockback: 9
    }
  },

  brute: {
    id: 'brute',
    name: 'Brute',
    role: 'Heavyweight',
    tagline: 'Crushing fists, shockwaves, and a raging rampage.',
    color: '#f87171',
    accent: '#991b1b',
    weapon: 'fists',
    maxHp: 140,
    speed: 2.6,
    jumpPower: 9.5,
    basic: {
      name: 'Hammer Fist',
      type: 'melee',
      cooldown: 38, windup: 11, active: 7, recovery: 18,
      damage: 16, range: 58, hitH: 62, knockback: 7
    },
    ability1: {
      name: 'Quake Slam',
      type: 'slam',
      cooldown: 200, windup: 14, active: 0, recovery: 20,
      damage: 20, radius: 180, knockback: 9, shockSpeed: 10
    },
    ability2: {
      name: 'Bull Rush',
      type: 'charge',
      cooldown: 170, windup: 6, active: 28, recovery: 14,
      damage: 14, range: 50, hitH: 66, knockback: 12,
      dashSpeed: 9
    },
    ultimate: {
      name: 'Berserk',
      type: 'buff',
      cooldown: 660, windup: 0, active: 1, recovery: 0,
      duration: 360, dmgMul: 1.6, speedMul: 1.4, dr: 0.4
    }
  },

  assassin: {
    id: 'assassin',
    name: 'Assassin',
    role: 'Shadow',
    tagline: 'Vanish, flank, and execute with lethal chain-daggers.',
    color: '#a78bfa',
    accent: '#6d28d9',
    weapon: 'daggers',
    maxHp: 78,
    speed: 4.2,
    jumpPower: 12,
    basic: {
      name: 'Stab',
      type: 'melee',
      cooldown: 22, windup: 3, active: 5, recovery: 10,
      damage: 9, range: 48, hitH: 50, knockback: 2.5
    },
    ability1: {
      name: 'Shadow Step',
      type: 'shadowStep',
      cooldown: 120, windup: 2, active: 1, recovery: 8,
      distance: 180, iframes: 20
    },
    ability2: {
      name: 'Smoke Bomb',
      type: 'smokeBomb',
      cooldown: 200, windup: 4, active: 1, recovery: 10,
      stealthDuration: 150, speedBoost: 1.5
    },
    ultimate: {
      name: 'Death Mark',
      type: 'deathMark',
      cooldown: 680, windup: 8, active: 1, recovery: 16,
      damage: 44, range: 60, hitH: 70, knockback: 6
    }
  },

  archer: {
    id: 'archer',
    name: 'Archer',
    role: 'Marksman',
    tagline: 'Pinpoint arrows, explosive shots, and a storm of volleys.',
    color: '#6ee7b7',
    accent: '#059669',
    weapon: 'bow',
    maxHp: 85,
    speed: 3.1,
    jumpPower: 11,
    basic: {
      name: 'Arrow',
      type: 'projectile',
      cooldown: 28, windup: 9, active: 1, recovery: 12,
      damage: 12, projSpeed: 14, projLife: 100, knockback: 3,
      projColor: '#6ee7b7'
    },
    ability1: {
      name: 'Piercing Shot',
      type: 'piercingShot',
      cooldown: 160, windup: 14, active: 1, recovery: 18,
      damage: 22, projSpeed: 18, projLife: 120, knockback: 7
    },
    ability2: {
      name: 'Backflip',
      type: 'backflip',
      cooldown: 130, windup: 2, active: 1, recovery: 6,
      flipVy: -13, flipVx: -7
    },
    ultimate: {
      name: 'Arrow Storm',
      type: 'arrowStorm',
      cooldown: 740, windup: 16, active: 100, recovery: 20,
      damage: 9, count: 12, projSpeed: 13, knockback: 3
    }
  },

  elemental: {
    id: 'elemental',
    name: 'Elementalist',
    role: 'Fire Mage',
    tagline: 'Scorching flames, lava pools, and a volcanic eruption.',
    color: '#fb923c',
    accent: '#c2410c',
    weapon: 'flame',
    maxHp: 88,
    speed: 3.0,
    jumpPower: 10.5,
    basic: {
      name: 'Fireball',
      type: 'projectile',
      cooldown: 30, windup: 7, active: 1, recovery: 16,
      damage: 11, projSpeed: 10, projLife: 70, knockback: 3.5,
      projColor: '#fb923c'
    },
    ability1: {
      name: 'Flame Dash',
      type: 'flameDash',
      cooldown: 150, windup: 4, active: 22, recovery: 12,
      damage: 10, range: 50, hitH: 60, knockback: 5, dashSpeed: 10
    },
    ability2: {
      name: 'Lava Pool',
      type: 'lavaPool',
      cooldown: 220, windup: 10, active: 1, recovery: 14,
      damage: 6, radius: 80, duration: 180
    },
    ultimate: {
      name: 'Eruption',
      type: 'eruption',
      cooldown: 710, windup: 26, active: 1, recovery: 28,
      damage: 36, radius: 160, knockback: 11
    }
  },

  summoner: {
    id: 'summoner',
    name: 'Summoner',
    role: 'Commander',
    tagline: 'Raise bone warriors, shield walls, and an undead titan.',
    color: '#34d399',
    accent: '#065f46',
    weapon: 'tome',
    maxHp: 90,
    speed: 2.8,
    jumpPower: 10,
    basic: {
      name: 'Soul Bolt',
      type: 'projectile',
      cooldown: 34, windup: 8, active: 1, recovery: 15,
      damage: 9, projSpeed: 8, projLife: 85, knockback: 2,
      projColor: '#34d399'
    },
    ability1: {
      name: 'Summon Minion',
      type: 'summon',
      cooldown: 180, windup: 12, active: 1, recovery: 16,
      minionHp: 40, minionDamage: 8, minionSpeed: 2.8, minionLife: 480
    },
    ability2: {
      name: 'Bone Shield',
      type: 'boneShield',
      cooldown: 230, windup: 6, active: 1, recovery: 10,
      shieldHp: 35, duration: 300
    },
    ultimate: {
      name: 'Titan Rise',
      type: 'titan',
      cooldown: 760, windup: 30, active: 1, recovery: 22,
      minionHp: 120, minionDamage: 18, minionSpeed: 2.2, minionLife: 720
    }
  },

  paladin: {
    id: 'paladin',
    name: 'Paladin',
    role: 'Holy Knight',
    tagline: 'Divine strikes, protective shields, and smite judgment.',
    color: '#fcd34d',
    accent: '#ca8a04',
    weapon: 'sword',
    maxHp: 110,
    speed: 2.7,
    jumpPower: 9.5,
    basic: {
      name: 'Smite',
      type: 'melee',
      cooldown: 30, windup: 6, active: 6, recovery: 14,
      damage: 13, range: 60, hitH: 58, knockback: 5
    },
    ability1: {
      name: 'Divine Shield',
      type: 'shield',
      cooldown: 140, windup: 4, active: 1, recovery: 8,
      shieldHp: 40, duration: 240, dr: 0.6
    },
    ability2: {
      name: 'Consecrate',
      type: 'aura',
      cooldown: 180, windup: 8, active: 1, recovery: 12,
      radius: 150, duration: 200, hpRestore: 2, tickRate: 10
    },
    ultimate: {
      name: 'Divine Judgment',
      type: 'judgment',
      cooldown: 700, windup: 20, active: 1, recovery: 24,
      damage: 40, radius: 180, knockback: 10
    }
  },

  berserker: {
    id: 'berserker',
    name: 'Berserker',
    role: 'Savage Warrior',
    tagline: 'Rend enemies, gain fury stacks, and unleash carnage.',
    color: '#dc2626',
    accent: '#7f1d1d',
    weapon: 'axe',
    maxHp: 135,
    speed: 2.5,
    jumpPower: 9,
    basic: {
      name: 'Rend',
      type: 'melee',
      cooldown: 28, windup: 8, active: 5, recovery: 12,
      damage: 14, range: 62, hitH: 60, knockback: 5.5
    },
    ability1: {
      name: 'Cleave',
      type: 'cleave',
      cooldown: 120, windup: 12, active: 1, recovery: 16,
      damage: 26, range: 80, radius: 90, knockback: 8
    },
    ability2: {
      name: 'Fury Stack',
      type: 'buffStack',
      cooldown: 160, windup: 2, active: 1, recovery: 6,
      duration: 300, damagePerStack: 1.15, speedPerStack: 1.08, maxStacks: 5
    },
    ultimate: {
      name: 'Carnage',
      type: 'carnage',
      cooldown: 680, windup: 10, active: 60, recovery: 20,
      damage: 12, tickRate: 6, radius: 100, knockback: 6, dmgMul: 1.8
    }
  },

  gunslinger: {
    id: 'gunslinger',
    name: 'Gunslinger',
    role: 'Quick Draw',
    tagline: 'Rapid fire shots, rolling dodge, and precision execution.',
    color: '#8b5cf6',
    accent: '#5b21b6',
    weapon: 'guns',
    maxHp: 80,
    speed: 3.8,
    jumpPower: 11.5,
    basic: {
      name: 'Gunshot',
      type: 'projectile',
      cooldown: 20, windup: 4, active: 1, recovery: 8,
      damage: 11, projSpeed: 16, projLife: 95, knockback: 4,
      projColor: '#a78bfa'
    },
    ability1: {
      name: 'Rolling Dodge',
      type: 'roll',
      cooldown: 110, windup: 2, active: 1, recovery: 4,
      dashSpeed: 14, distance: 140, iframes: 24
    },
    ability2: {
      name: 'Rapid Fire',
      type: 'rapidFire',
      cooldown: 150, windup: 6, active: 1, recovery: 14,
      damage: 9, projSpeed: 15, projLife: 90, count: 3, knockback: 3, projColor: '#a78bfa'
    },
    ultimate: {
      name: 'Execution Shot',
      type: 'execution',
      cooldown: 720, windup: 18, active: 1, recovery: 22,
      damage: 45, projSpeed: 20, projLife: 120, knockback: 12
    }
  },

  necromancer: {
    id: 'necromancer',
    name: 'Necromancer',
    role: 'Death Mage',
    tagline: 'Dark curses, corpse explosions, and the reaper\'s scythe.',
    color: '#1f2937',
    accent: '#6366f1',
    weapon: 'scythe',
    maxHp: 95,
    speed: 2.9,
    jumpPower: 10.2,
    basic: {
      name: 'Death Bolt',
      type: 'projectile',
      cooldown: 32, windup: 7, active: 1, recovery: 14,
      damage: 10, projSpeed: 9, projLife: 85, knockback: 2.5,
      projColor: '#6366f1'
    },
    ability1: {
      name: 'Curse',
      type: 'curse',
      cooldown: 140, windup: 8, active: 1, recovery: 10,
      duration: 180, damageReduction: 0.75, speedReduction: 0.8
    },
    ability2: {
      name: 'Corpse Explosion',
      type: 'explosion',
      cooldown: 190, windup: 10, active: 1, recovery: 14,
      damage: 22, radius: 120, knockback: 7
    },
    ultimate: {
      name: 'Reaper\'s Scythe',
      type: 'scythe',
      cooldown: 690, windup: 22, active: 1, recovery: 26,
      damage: 42, range: 100, radius: 100, knockback: 9
    }
  }
};

const ARCHETYPES = {
  sword: {
    archetype: 'Sword Fighters',
    weapon: 'sword',
    maxHp: 102,
    speed: 3.35,
    jumpPower: 10.8,
    aiRange: 78,
    role: 'Blade Duelist',
    basic: { name: 'Blade Cut', type: 'melee', cooldown: 27, windup: 5, active: 6, recovery: 12, damage: 11, range: 64, hitH: 54, knockback: 4.6 }
  },
  spear: {
    archetype: 'Spear Users',
    weapon: 'spear',
    maxHp: 94,
    speed: 3.2,
    jumpPower: 10.4,
    aiRange: 112,
    role: 'Reach Fighter',
    basic: { name: 'Long Thrust', type: 'melee', cooldown: 32, windup: 7, active: 6, recovery: 15, damage: 12, range: 92, hitH: 30, knockback: 5.1 }
  },
  heavy: {
    archetype: 'Heavy Brutes',
    weapon: 'fists',
    maxHp: 136,
    speed: 2.55,
    jumpPower: 9.2,
    aiRange: 72,
    role: 'Heavyweight',
    basic: { name: 'Crush', type: 'melee', cooldown: 38, windup: 11, active: 7, recovery: 18, damage: 16, range: 58, hitH: 62, knockback: 7.2 }
  },
  assassin: {
    archetype: 'Fast Assassins',
    weapon: 'daggers',
    maxHp: 80,
    speed: 4.1,
    jumpPower: 11.8,
    aiRange: 58,
    role: 'Skirmisher',
    basic: { name: 'Quick Cut', type: 'melee', cooldown: 22, windup: 3, active: 5, recovery: 10, damage: 9, range: 50, hitH: 48, knockback: 2.8 }
  },
  mage: {
    archetype: 'Mages',
    weapon: 'staff',
    maxHp: 84,
    speed: 2.95,
    jumpPower: 10.2,
    aiRange: 250,
    role: 'Projectile Mage',
    basic: { name: 'Spell Bolt', type: 'projectile', cooldown: 34, windup: 8, active: 1, recovery: 14, damage: 10, projSpeed: 9, projLife: 82, knockback: 2.7, projectileKind: 'bolt' }
  },
  elemental: {
    archetype: 'Elemental Users',
    weapon: 'flame',
    maxHp: 88,
    speed: 3.05,
    jumpPower: 10.5,
    aiRange: 220,
    role: 'Elementalist',
    basic: { name: 'Element Bolt', type: 'projectile', cooldown: 31, windup: 7, active: 1, recovery: 15, damage: 11, projSpeed: 10, projLife: 75, knockback: 3.4, projectileKind: 'bolt' }
  },
  ranged: {
    archetype: 'Ranged Fighters',
    weapon: 'bow',
    maxHp: 86,
    speed: 3.25,
    jumpPower: 11.1,
    aiRange: 300,
    role: 'Marksman',
    basic: { name: 'Shot', type: 'projectile', cooldown: 28, windup: 8, active: 1, recovery: 12, damage: 11, projSpeed: 14, projLife: 100, knockback: 3.2, projectileKind: 'arrow' }
  },
  control: {
    archetype: 'Control / Summoners',
    weapon: 'tome',
    maxHp: 92,
    speed: 2.85,
    jumpPower: 10,
    aiRange: 210,
    role: 'Controller',
    basic: { name: 'Hex Bolt', type: 'projectile', cooldown: 34, windup: 8, active: 1, recovery: 15, damage: 9, projSpeed: 8, projLife: 86, knockback: 2.4, projectileKind: 'bolt' }
  },
  defense: {
    archetype: 'Defensive / Shield Types',
    weapon: 'sword',
    maxHp: 116,
    speed: 2.75,
    jumpPower: 9.7,
    aiRange: 96,
    role: 'Defender',
    basic: { name: 'Guard Strike', type: 'melee', cooldown: 31, windup: 7, active: 6, recovery: 14, damage: 12, range: 60, hitH: 58, knockback: 5.2 }
  }
};

const CORE_ARCHETYPES = {
  sword: 'Sword Fighters',
  spear: 'Spear Users',
  brute: 'Heavy Brutes',
  berserker: 'Heavy Brutes',
  assassin: 'Fast Assassins',
  mage: 'Mages',
  elemental: 'Elemental Users',
  archer: 'Ranged Fighters',
  gunslinger: 'Ranged Fighters',
  summoner: 'Control / Summoners',
  necromancer: 'Control / Summoners',
  paladin: 'Defensive / Shield Types'
};

function move(overrides) {
  return { ...overrides };
}

function character(archetypeKey, config) {
  const base = ARCHETYPES[archetypeKey];
  return {
    ...base,
    ...config,
    basic: { ...base.basic, ...(config.basic || {}) },
    ability1: move(config.ability1),
    ability2: move(config.ability2),
    ultimate: move(config.ultimate)
  };
}

const GENERATED_CHARACTERS = [
  character('sword', {
    id: 'ronin',
    name: 'Ronin',
    role: 'Counter Blade',
    tagline: 'Patient footsies, a low sliding cut, and a sudden hurricane finisher.',
    color: '#38bdf8',
    accent: '#0369a1',
    speed: 3.55,
    basic: { name: 'Iaido Cut', windup: 4, recovery: 13, damage: 10, range: 70, knockback: 4.4 },
    ability1: { name: 'Step Slash', type: 'dashStrike', cooldown: 118, windup: 5, active: 12, recovery: 13, damage: 15, range: 76, hitH: 44, knockback: 6.8, dashSpeed: 11 },
    ability2: { name: 'Blade Catch', type: 'parry', cooldown: 190, windup: 0, active: 18, recovery: 18, damage: 24, range: 62, hitH: 58, knockback: 9 },
    ultimate: { name: 'Gale Circle', type: 'spin', cooldown: 720, windup: 8, active: 58, recovery: 20, damage: 9, tickRate: 11, radius: 96, knockback: 6 }
  }),
  character('sword', {
    id: 'duelist',
    name: 'Fencer',
    role: 'Precision Duelist',
    tagline: 'Long pokes, evasive spacing, and a narrow high-knockback thrust.',
    color: '#bfdbfe',
    accent: '#2563eb',
    maxHp: 88,
    speed: 3.8,
    basic: { name: 'Rapier Jab', cooldown: 24, windup: 4, active: 5, recovery: 10, damage: 8, range: 82, hitH: 26, knockback: 3.6 },
    ability1: { name: 'Advance Lunge', type: 'dashStrike', cooldown: 100, windup: 6, active: 10, recovery: 14, damage: 14, range: 92, hitH: 28, knockback: 7.2, dashSpeed: 13 },
    ability2: { name: 'Disengage', type: 'backflip', cooldown: 120, windup: 2, active: 1, recovery: 7, flipVy: -11.5, flipVx: -8.5 },
    ultimate: { name: 'Final Thrust', type: 'piercingShot', cooldown: 700, windup: 16, active: 1, recovery: 24, damage: 32, projSpeed: 20, projLife: 70, knockback: 13, projectileKind: 'spear' }
  }),
  character('sword', {
    id: 'blade_dancer',
    name: 'Blade Dancer',
    role: 'Flow Striker',
    tagline: 'Dances in and out with short dashes and multi-hit blade arcs.',
    color: '#f0abfc',
    accent: '#c026d3',
    maxHp: 86,
    speed: 4,
    basic: { name: 'Twin Slice', cooldown: 23, windup: 3, active: 6, recovery: 11, damage: 9, range: 58, hitH: 50, knockback: 3.3 },
    ability1: { name: 'Ribbon Dash', type: 'dashStrike', cooldown: 105, windup: 3, active: 16, recovery: 11, damage: 10, range: 55, hitH: 54, knockback: 5.2, dashSpeed: 14 },
    ability2: { name: 'Feint Step', type: 'roll', cooldown: 115, windup: 1, active: 1, recovery: 5, dashSpeed: 13, iframes: 18 },
    ultimate: { name: 'Petal Storm', type: 'carnage', cooldown: 700, windup: 8, active: 54, recovery: 18, damage: 8, tickRate: 7, radius: 88, knockback: 5.6, dmgMul: 1.35 }
  }),
  character('sword', {
    id: 'crusader',
    name: 'Crusader',
    role: 'Armored Sword',
    tagline: 'A sturdy blade fighter with guard pressure and divine burst finishers.',
    color: '#fde68a',
    accent: '#d97706',
    maxHp: 122,
    speed: 2.85,
    basic: { name: 'Heavy Smite', cooldown: 33, windup: 8, active: 6, recovery: 15, damage: 14, range: 60, hitH: 62, knockback: 6 },
    ability1: { name: 'Shield March', type: 'shield', cooldown: 150, windup: 4, active: 1, recovery: 8, shieldHp: 34, duration: 210, dr: 0.45 },
    ability2: { name: 'Radiant Lunge', type: 'dashStrike', cooldown: 150, windup: 8, active: 12, recovery: 16, damage: 18, range: 72, hitH: 58, knockback: 8, dashSpeed: 9 },
    ultimate: { name: 'Sun Judgment', type: 'judgment', cooldown: 720, windup: 22, active: 1, recovery: 24, damage: 38, radius: 170, knockback: 11 }
  }),

  character('spear', {
    id: 'lancer',
    name: 'Lancer',
    role: 'Rush Spear',
    tagline: 'Controls lanes with fast charges and upward recovery vaults.',
    color: '#facc15',
    accent: '#a16207',
    ability1: { name: 'Spear Charge', type: 'charge', cooldown: 150, windup: 7, active: 24, recovery: 14, damage: 13, range: 58, hitH: 46, knockback: 9, dashSpeed: 10 },
    ability2: { name: 'High Vault', type: 'vault', cooldown: 120, windup: 5, active: 0, recovery: 8, jumpVy: -15.5, jumpVx: 7.5 },
    ultimate: { name: 'Banner Breaker', type: 'slam', cooldown: 720, windup: 18, active: 0, recovery: 24, damage: 26, radius: 230, knockback: 10, shockSpeed: 12 }
  }),
  character('spear', {
    id: 'trident',
    name: 'Trident Guard',
    role: 'Zone Spear',
    tagline: 'A wider spear style with close burst control and piercing throws.',
    color: '#67e8f9',
    accent: '#0891b2',
    maxHp: 106,
    speed: 3,
    basic: { name: 'Fork Jab', range: 86, hitH: 42, damage: 12, knockback: 4.7 },
    ability1: { name: 'Tide Jab', type: 'piercingShot', cooldown: 150, windup: 11, active: 1, recovery: 17, damage: 19, projSpeed: 15, projLife: 95, knockback: 6.5, projectileKind: 'spear' },
    ability2: { name: 'Guard Sweep', type: 'melee', cooldown: 115, windup: 9, active: 9, recovery: 16, damage: 16, range: 104, hitH: 34, knockback: 7 },
    ultimate: { name: 'Maelstrom', type: 'nova', cooldown: 710, windup: 16, active: 18, recovery: 24, damage: 24, radius: 155, freeze: 36, knockback: 9 }
  }),
  character('spear', {
    id: 'halberdier',
    name: 'Halberdier',
    role: 'Axe Spear',
    tagline: 'Slow sweeping polearm hits that launch at brutal angles.',
    color: '#fb7185',
    accent: '#be123c',
    weapon: 'axe',
    maxHp: 116,
    speed: 2.75,
    basic: { name: 'Hook Chop', cooldown: 36, windup: 10, active: 7, recovery: 17, damage: 15, range: 82, hitH: 50, knockback: 7 },
    ability1: { name: 'Pole Cleave', type: 'cleave', cooldown: 135, windup: 13, active: 1, recovery: 18, damage: 25, range: 96, radius: 96, knockback: 9 },
    ability2: { name: 'Brace', type: 'parry', cooldown: 180, windup: 0, active: 20, recovery: 16, damage: 18, range: 80, hitH: 48, knockback: 10 },
    ultimate: { name: 'Execution Arc', type: 'scythe', cooldown: 730, windup: 20, active: 1, recovery: 28, damage: 40, range: 112, radius: 112, knockback: 12 }
  }),

  character('heavy', {
    id: 'guardian',
    name: 'Stone Guardian',
    role: 'Anchor Heavy',
    tagline: 'Holds center stage with armor, quake waves, and huge launch power.',
    color: '#94a3b8',
    accent: '#475569',
    weapon: 'fists',
    maxHp: 150,
    speed: 2.25,
    basic: { name: 'Stone Knuckle', windup: 12, damage: 17, range: 56, knockback: 8 },
    ability1: { name: 'Ground Split', type: 'slam', cooldown: 190, windup: 16, active: 0, recovery: 22, damage: 22, radius: 210, knockback: 10, shockSpeed: 9 },
    ability2: { name: 'Granite Guard', type: 'shield', cooldown: 170, windup: 5, active: 1, recovery: 9, shieldHp: 52, duration: 190, dr: 0.55 },
    ultimate: { name: 'Fault Line', type: 'eruption', cooldown: 740, windup: 28, active: 1, recovery: 28, damage: 38, radius: 175, knockback: 12 }
  }),
  character('heavy', {
    id: 'wrestler',
    name: 'Wrestler',
    role: 'Grapple Heavy',
    tagline: 'Short range pressure, body checks, and center-stage slam control.',
    color: '#fdba74',
    accent: '#c2410c',
    maxHp: 132,
    speed: 2.9,
    basic: { name: 'Elbow Smash', cooldown: 34, windup: 8, damage: 15, range: 52, hitH: 60, knockback: 6.6 },
    ability1: { name: 'Shoulder Check', type: 'charge', cooldown: 135, windup: 5, active: 20, recovery: 15, damage: 15, range: 52, hitH: 64, knockback: 10, dashSpeed: 11 },
    ability2: { name: 'Ring Bounce', type: 'backflip', cooldown: 125, windup: 3, active: 1, recovery: 8, flipVy: -12.5, flipVx: -5.5 },
    ultimate: { name: 'Canvas Slam', type: 'slam', cooldown: 700, windup: 12, active: 0, recovery: 24, damage: 30, radius: 165, knockback: 13, shockSpeed: 11 }
  }),
  character('heavy', {
    id: 'juggernaut',
    name: 'Juggernaut',
    role: 'Momentum Heavy',
    tagline: 'Builds speed into armored rushdowns and terrifying late-percent KOs.',
    color: '#ef4444',
    accent: '#7f1d1d',
    maxHp: 146,
    speed: 2.45,
    basic: { name: 'Iron Hook', cooldown: 39, windup: 12, damage: 18, range: 56, knockback: 8 },
    ability1: { name: 'Unstoppable Run', type: 'charge', cooldown: 170, windup: 8, active: 32, recovery: 16, damage: 16, range: 50, hitH: 66, knockback: 12, dashSpeed: 9.5 },
    ability2: { name: 'Overdrive', type: 'buff', cooldown: 230, windup: 0, active: 1, recovery: 0, duration: 210, dmgMul: 1.35, speedMul: 1.3, dr: 0.25 },
    ultimate: { name: 'Meteor Driver', type: 'meteor', cooldown: 760, windup: 30, active: 1, recovery: 30, damage: 42, radius: 150, knockback: 13 }
  }),

  character('assassin', {
    id: 'ninja',
    name: 'Ninja',
    role: 'Air Assassin',
    tagline: 'Teleports through gaps, attacks from odd angles, and escapes vertically.',
    color: '#818cf8',
    accent: '#4338ca',
    speed: 4.25,
    ability1: { name: 'Vanish Step', type: 'shadowStep', cooldown: 105, windup: 2, active: 1, recovery: 8, distance: 210, iframes: 18 },
    ability2: { name: 'Smoke Flip', type: 'backflip', cooldown: 115, windup: 2, active: 1, recovery: 6, flipVy: -13.5, flipVx: -7 },
    ultimate: { name: 'Moon Assassination', type: 'deathMark', cooldown: 690, windup: 7, active: 1, recovery: 16, damage: 40, range: 74, hitH: 72, knockback: 8 }
  }),
  character('assassin', {
    id: 'monk',
    name: 'Monk',
    role: 'Combo Striker',
    tagline: 'Fast hands, evasive rolls, and a circular palm burst.',
    color: '#86efac',
    accent: '#16a34a',
    weapon: 'fists',
    maxHp: 92,
    speed: 3.9,
    basic: { name: 'Palm Jab', cooldown: 21, windup: 3, active: 5, recovery: 9, damage: 8, range: 46, hitH: 54, knockback: 3.2 },
    ability1: { name: 'Dragon Palm', type: 'dashStrike', cooldown: 105, windup: 5, active: 10, recovery: 12, damage: 13, range: 58, hitH: 58, knockback: 7.5, dashSpeed: 12 },
    ability2: { name: 'Flow Roll', type: 'roll', cooldown: 105, windup: 1, active: 1, recovery: 4, dashSpeed: 14, iframes: 22 },
    ultimate: { name: 'Hundred Hands', type: 'spin', cooldown: 690, windup: 6, active: 64, recovery: 18, damage: 6, tickRate: 8, radius: 82, knockback: 4.8 }
  }),
  character('assassin', {
    id: 'reaper',
    name: 'Night Reaper',
    role: 'Scythe Assassin',
    tagline: 'A light reaper with evasive stealth and one decisive crescent launch.',
    color: '#c4b5fd',
    accent: '#7c3aed',
    weapon: 'scythe',
    maxHp: 84,
    speed: 3.75,
    basic: { name: 'Crescent Nick', cooldown: 25, windup: 4, active: 6, recovery: 11, damage: 10, range: 66, hitH: 46, knockback: 4.2 },
    ability1: { name: 'Phase Cut', type: 'teleport', cooldown: 130, windup: 5, active: 1, recovery: 10, distance: 180 },
    ability2: { name: 'Night Veil', type: 'smokeBomb', cooldown: 190, windup: 4, active: 1, recovery: 10, stealthDuration: 130, speedBoost: 1.35 },
    ultimate: { name: 'Reaping Crescent', type: 'scythe', cooldown: 705, windup: 17, active: 1, recovery: 25, damage: 36, range: 112, radius: 118, knockback: 12 }
  }),

  character('mage', {
    id: 'cryomancer',
    name: 'Cryomancer',
    role: 'Ice Mage',
    tagline: 'Slows the fight with freezes, careful spacing, and icy burst control.',
    color: '#a5f3fc',
    accent: '#0891b2',
    basic: { name: 'Ice Shard', projColor: '#a5f3fc', damage: 9, knockback: 2.8 },
    ability1: { name: 'Frost Blink', type: 'teleport', cooldown: 150, windup: 7, active: 1, recovery: 11, distance: 190 },
    ability2: { name: 'Deep Freeze', type: 'nova', cooldown: 230, windup: 13, active: 18, recovery: 18, damage: 8, radius: 145, freeze: 95, knockback: 3.8 },
    ultimate: { name: 'Glacier Fall', type: 'meteor', cooldown: 720, windup: 28, active: 1, recovery: 30, damage: 34, radius: 155, knockback: 10 }
  }),
  character('mage', {
    id: 'stormcaller',
    name: 'Stormcaller',
    role: 'Lightning Mage',
    tagline: 'Fast bolts, evasive blink routes, and sudden lightning judgment.',
    color: '#fde047',
    accent: '#eab308',
    maxHp: 80,
    speed: 3.15,
    basic: { name: 'Spark Bolt', cooldown: 27, windup: 5, projSpeed: 13, projLife: 74, damage: 8, knockback: 3, projColor: '#fde047' },
    ability1: { name: 'Flash Step', type: 'teleport', cooldown: 115, windup: 3, active: 1, recovery: 9, distance: 240 },
    ability2: { name: 'Static Field', type: 'nova', cooldown: 210, windup: 9, active: 14, recovery: 16, damage: 12, radius: 120, freeze: 24, knockback: 7 },
    ultimate: { name: 'Thunder Verdict', type: 'judgment', cooldown: 710, windup: 20, active: 1, recovery: 22, damage: 36, radius: 185, knockback: 12 }
  }),
  character('mage', {
    id: 'illusionist',
    name: 'Illusionist',
    role: 'Trick Mage',
    tagline: 'Slippery caster that vanishes, curses, and punishes bad approaches.',
    color: '#f9a8d4',
    accent: '#db2777',
    weapon: 'staff',
    basic: { name: 'Mirror Bolt', projColor: '#f9a8d4', damage: 9, knockback: 2.5 },
    ability1: { name: 'Mirror Walk', type: 'smokeBomb', cooldown: 160, windup: 4, active: 1, recovery: 10, stealthDuration: 110, speedBoost: 1.28 },
    ability2: { name: 'Misdirect', type: 'curse', cooldown: 155, windup: 8, active: 1, recovery: 11, duration: 150, damageReduction: 0.78, speedReduction: 0.78 },
    ultimate: { name: 'False Star', type: 'meteor', cooldown: 720, windup: 24, active: 1, recovery: 26, damage: 32, radius: 135, knockback: 11 }
  }),

  character('elemental', {
    id: 'pyromancer',
    name: 'Pyromancer',
    role: 'Fire Control',
    tagline: 'Sets hot ground traps, dashes through opponents, and erupts platforms.',
    color: '#fb923c',
    accent: '#ea580c',
    basic: { name: 'Cinder Shot', projColor: '#fb923c', damage: 10, knockback: 3.5 },
    ability1: { name: 'Cinder Dash', type: 'flameDash', cooldown: 140, windup: 4, active: 20, recovery: 12, damage: 10, range: 50, hitH: 60, knockback: 5.5, dashSpeed: 11 },
    ability2: { name: 'Hot Zone', type: 'lavaPool', cooldown: 210, windup: 9, active: 1, recovery: 14, damage: 5, radius: 95, duration: 190 },
    ultimate: { name: 'Magma Crown', type: 'eruption', cooldown: 720, windup: 26, active: 1, recovery: 28, damage: 37, radius: 170, knockback: 12 }
  }),
  character('elemental', {
    id: 'tempest',
    name: 'Tempest',
    role: 'Wind Elemental',
    tagline: 'Uses mobility, wide wind bursts, and platform-safe repositioning.',
    color: '#bae6fd',
    accent: '#0284c7',
    weapon: 'staff',
    speed: 3.45,
    basic: { name: 'Gust Bolt', projSpeed: 12, projColor: '#bae6fd', damage: 9, knockback: 4.2 },
    ability1: { name: 'Wind Vault', type: 'vault', cooldown: 115, windup: 4, active: 0, recovery: 7, jumpVy: -15, jumpVx: 10 },
    ability2: { name: 'Air Burst', type: 'nova', cooldown: 190, windup: 8, active: 12, recovery: 14, damage: 10, radius: 128, freeze: 0, knockback: 8.5 },
    ultimate: { name: 'Cyclone', type: 'spin', cooldown: 700, windup: 8, active: 72, recovery: 18, damage: 7, tickRate: 9, radius: 104, knockback: 5.4 }
  }),
  character('elemental', {
    id: 'geomancer',
    name: 'Geomancer',
    role: 'Earth Elemental',
    tagline: 'A grounded caster with stone shockwaves and heavy rock impacts.',
    color: '#a3e635',
    accent: '#4d7c0f',
    weapon: 'tome',
    maxHp: 104,
    speed: 2.75,
    basic: { name: 'Pebble Shot', projSpeed: 8, projColor: '#a3e635', damage: 12, knockback: 4 },
    ability1: { name: 'Stone Wave', type: 'slam', cooldown: 180, windup: 14, active: 0, recovery: 20, damage: 18, radius: 190, knockback: 9, shockSpeed: 9 },
    ability2: { name: 'Rock Armor', type: 'boneShield', cooldown: 205, windup: 5, active: 1, recovery: 10, shieldHp: 44, duration: 240 },
    ultimate: { name: 'Boulder Drop', type: 'meteor', cooldown: 740, windup: 30, active: 1, recovery: 30, damage: 40, radius: 145, knockback: 12 }
  }),

  character('ranged', {
    id: 'crossbow',
    name: 'Crossbow Ace',
    role: 'Power Marksman',
    tagline: 'Slower shots with sharper knockback and a piercing finisher lane.',
    color: '#bbf7d0',
    accent: '#15803d',
    maxHp: 90,
    speed: 3,
    basic: { name: 'Bolt Shot', cooldown: 34, windup: 11, damage: 14, projSpeed: 16, projLife: 105, knockback: 4.5, projColor: '#bbf7d0' },
    ability1: { name: 'Pinning Bolt', type: 'piercingShot', cooldown: 145, windup: 14, active: 1, recovery: 18, damage: 22, projSpeed: 18, projLife: 115, knockback: 8, projectileKind: 'arrow' },
    ability2: { name: 'Tactical Roll', type: 'roll', cooldown: 115, windup: 2, active: 1, recovery: 5, dashSpeed: 12, iframes: 20 },
    ultimate: { name: 'Ballista Line', type: 'execution', cooldown: 720, windup: 20, active: 1, recovery: 24, damage: 42, projSpeed: 22, projLife: 130, knockback: 13 }
  }),
  character('ranged', {
    id: 'slinger',
    name: 'Slinger',
    role: 'Arc Shooter',
    tagline: 'Mobile projectile fighter with quick pebbles and evasive air control.',
    color: '#fef08a',
    accent: '#ca8a04',
    weapon: 'bow',
    maxHp: 82,
    speed: 3.65,
    basic: { name: 'Stone Flick', cooldown: 22, windup: 4, damage: 8, projSpeed: 12, projLife: 72, knockback: 3.8, projColor: '#fef08a', projectileKind: 'bolt' },
    ability1: { name: 'Ricochet Volley', type: 'rapidFire', cooldown: 135, windup: 5, active: 1, recovery: 13, damage: 7, projSpeed: 13, projLife: 80, count: 4, knockback: 2.7, projColor: '#fef08a' },
    ability2: { name: 'Hop Back', type: 'backflip', cooldown: 105, windup: 2, active: 1, recovery: 5, flipVy: -12, flipVx: -9 },
    ultimate: { name: 'Hailstorm Sling', type: 'rain', cooldown: 710, windup: 18, active: 84, recovery: 20, damage: 11, count: 11, knockback: 5 }
  }),
  character('ranged', {
    id: 'rifleman',
    name: 'Rifleman',
    role: 'Linear Sniper',
    tagline: 'Keeps distance, rolls out of pressure, and fires huge straight KOs.',
    color: '#ddd6fe',
    accent: '#7c3aed',
    weapon: 'guns',
    maxHp: 84,
    speed: 3.25,
    basic: { name: 'Rifle Pop', cooldown: 30, windup: 7, damage: 12, projSpeed: 18, projLife: 110, knockback: 4.2, projColor: '#ddd6fe', projectileKind: 'bullet' },
    ability1: { name: 'Slide Reload', type: 'roll', cooldown: 120, windup: 2, active: 1, recovery: 6, dashSpeed: 13, iframes: 18 },
    ability2: { name: 'Burst Fire', type: 'rapidFire', cooldown: 155, windup: 7, active: 1, recovery: 15, damage: 8, projSpeed: 17, projLife: 92, count: 3, knockback: 3.5, projColor: '#ddd6fe' },
    ultimate: { name: 'Rail Shot', type: 'execution', cooldown: 735, windup: 22, active: 1, recovery: 26, damage: 46, projSpeed: 24, projLife: 140, knockback: 14 }
  }),

  character('control', {
    id: 'beastmaster',
    name: 'Beastmaster',
    role: 'Pet Commander',
    tagline: 'Controls space with a partner summon, shields, and wide command bursts.',
    color: '#4ade80',
    accent: '#166534',
    basic: { name: 'Command Spark', projColor: '#4ade80', damage: 9 },
    ability1: { name: 'Call Wolf', type: 'summon', cooldown: 165, windup: 10, active: 1, recovery: 15, minionHp: 34, minionDamage: 9, minionSpeed: 3.4, minionLife: 420 },
    ability2: { name: 'Pack Guard', type: 'boneShield', cooldown: 215, windup: 6, active: 1, recovery: 10, shieldHp: 32, duration: 260 },
    ultimate: { name: 'Alpha Pack', type: 'titan', cooldown: 760, windup: 28, active: 1, recovery: 22, minionHp: 100, minionDamage: 17, minionSpeed: 2.7, minionLife: 620 }
  }),
  character('control', {
    id: 'puppeteer',
    name: 'Puppeteer',
    role: 'Debuff Controller',
    tagline: 'Weakens enemy movement before creating explosive stage traps.',
    color: '#c084fc',
    accent: '#6d28d9',
    basic: { name: 'Thread Bolt', projColor: '#c084fc', knockback: 2.2 },
    ability1: { name: 'Snare Strings', type: 'curse', cooldown: 135, windup: 7, active: 1, recovery: 10, duration: 170, damageReduction: 0.72, speedReduction: 0.68 },
    ability2: { name: 'Pop Trap', type: 'explosion', cooldown: 175, windup: 9, active: 1, recovery: 13, damage: 18, radius: 105, knockback: 8.5 },
    ultimate: { name: 'Grand Marionette', type: 'nova', cooldown: 720, windup: 18, active: 18, recovery: 22, damage: 24, radius: 165, freeze: 54, knockback: 9 }
  }),
  character('control', {
    id: 'alchemist',
    name: 'Alchemist',
    role: 'Trap Brewer',
    tagline: 'Mixes lingering pools, tosses volatile shots, and detonates center stage.',
    color: '#bef264',
    accent: '#65a30d',
    weapon: 'tome',
    basic: { name: 'Acid Flask', projColor: '#bef264', damage: 10, knockback: 3.1 },
    ability1: { name: 'Caustic Spill', type: 'lavaPool', cooldown: 200, windup: 8, active: 1, recovery: 13, damage: 5, radius: 85, duration: 180 },
    ability2: { name: 'Unstable Vial', type: 'explosion', cooldown: 165, windup: 9, active: 1, recovery: 13, damage: 20, radius: 115, knockback: 7.5 },
    ultimate: { name: 'Gold Comet', type: 'meteor', cooldown: 730, windup: 26, active: 1, recovery: 28, damage: 36, radius: 150, knockback: 12 }
  }),

  character('defense', {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Shield Wall',
    tagline: 'Protects space with shields, aura sustain, and a punishing judgment.',
    color: '#93c5fd',
    accent: '#1d4ed8',
    maxHp: 126,
    speed: 2.6,
    ability1: { name: 'Tower Shield', type: 'shield', cooldown: 135, windup: 4, active: 1, recovery: 8, shieldHp: 48, duration: 230, dr: 0.62 },
    ability2: { name: 'Hold Ground', type: 'aura', cooldown: 190, windup: 8, active: 1, recovery: 12, radius: 120, duration: 190, hpRestore: 1.5, tickRate: 9 },
    ultimate: { name: 'Sentinel Verdict', type: 'judgment', cooldown: 720, windup: 22, active: 1, recovery: 24, damage: 36, radius: 165, knockback: 11 }
  }),
  character('defense', {
    id: 'warden',
    name: 'Warden',
    role: 'Counter Tank',
    tagline: 'A defensive fighter that punishes aggression with parries and body checks.',
    color: '#cbd5e1',
    accent: '#64748b',
    weapon: 'fists',
    maxHp: 130,
    speed: 2.65,
    basic: { name: 'Baton Strike', cooldown: 32, windup: 7, damage: 13, range: 56, knockback: 5.6 },
    ability1: { name: 'Lockdown Parry', type: 'parry', cooldown: 165, windup: 0, active: 24, recovery: 17, damage: 22, range: 58, hitH: 60, knockback: 9 },
    ability2: { name: 'Cell Rush', type: 'charge', cooldown: 155, windup: 7, active: 22, recovery: 15, damage: 14, range: 50, hitH: 62, knockback: 10, dashSpeed: 9 },
    ultimate: { name: 'Iron Sentence', type: 'slam', cooldown: 720, windup: 18, active: 0, recovery: 24, damage: 28, radius: 185, knockback: 12, shockSpeed: 10 }
  }),
  character('defense', {
    id: 'templar',
    name: 'Templar',
    role: 'Holy Defender',
    tagline: 'Slow but resilient, using shielded advances and healing aura pressure.',
    color: '#fef3c7',
    accent: '#f59e0b',
    maxHp: 124,
    speed: 2.7,
    basic: { name: 'Consecrated Cut', damage: 13, knockback: 5.5 },
    ability1: { name: 'Aegis', type: 'shield', cooldown: 145, windup: 4, active: 1, recovery: 8, shieldHp: 42, duration: 240, dr: 0.58 },
    ability2: { name: 'Sacred Ring', type: 'aura', cooldown: 175, windup: 8, active: 1, recovery: 12, radius: 145, duration: 190, hpRestore: 2, tickRate: 10 },
    ultimate: { name: 'Heavenfall', type: 'meteor', cooldown: 735, windup: 30, active: 1, recovery: 28, damage: 38, radius: 150, knockback: 12 }
  })
];

function finalizeCharacter(ch) {
  return {
    ...ch,
    archetype: ch.archetype || CORE_ARCHETYPES[ch.id] || 'Specialists',
    aiRange: ch.aiRange || 90
  };
}

const ACTIVE_GENERATED_IDS = new Set([
  'ronin', 'duelist', 'blade_dancer',
  'lancer', 'trident', 'halberdier',
  'guardian', 'wrestler',
  'ninja', 'monk', 'reaper',
  'cryomancer', 'stormcaller', 'illusionist',
  'pyromancer', 'tempest', 'geomancer',
  'crossbow', 'slinger',
  'beastmaster', 'puppeteer',
  'sentinel', 'warden', 'templar'
]);

function buildRoster(core) {
  const roster = {};
  for (const [id, ch] of Object.entries(core)) {
    roster[id] = finalizeCharacter({ ...ch, id });
  }
  for (const ch of GENERATED_CHARACTERS) {
    if (!ACTIVE_GENERATED_IDS.has(ch.id)) continue;
    roster[ch.id] = finalizeCharacter(ch);
  }
  return roster;
}

export const CHARACTERS = buildRoster(CORE_CHARACTERS);
