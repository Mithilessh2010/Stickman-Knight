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
  }
};
