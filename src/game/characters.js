// Each character has totally distinct mechanics — no shared abilities.
// Cooldowns are in ticks (60 ticks = 1 second).

export const CHARACTERS = {
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
  }
};
