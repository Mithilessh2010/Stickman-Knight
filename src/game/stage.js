import { ARENA_W, GROUND_Y } from './constants.js';

export const DROP_THROUGH_FRAMES = 16;

const BG_BY_TYPE = {
  battlefield: 'rooftop',
  lava: 'scrapyard',
  islands: 'forest',
  moving: 'cyberlab',
  vertical: 'mountain',
  special: 'temple'
};

const ICON_BY_TYPE = {
  battlefield: '▣',
  lava: '⊕',
  islands: '◆',
  moving: '◉',
  vertical: '△',
  special: '✦'
};

const platform = (id, kind, x, y, width, depth = 22, extra = {}) => ({
  id, kind, x, baseX: x, y, baseY: y, width, depth,
  lip: extra.lip ?? (kind === 'solid' ? 26 : 18),
  skirt: extra.skirt ?? (kind === 'solid' ? 54 : 30),
  ...extra
});

function makeStage(type, index, config) {
  const id = index === 0 ? config.baseId : `${config.baseId}-${index + 1}`;
  const color = config.color;
  return {
    id,
    name: config.name,
    tag: config.tag,
    desc: config.desc,
    color,
    icon: ICON_BY_TYPE[type],
    type,
    background: config.background || BG_BY_TYPE[type],
    lavaBottom: !!config.lavaBottom,
    windX: config.windX || 0,
    slippery: !!config.slippery,
    platforms: config.platforms,
    spawns: config.spawns || null
  };
}

function battlefield(index, cfg) {
  const mainY = GROUND_Y + (cfg.mainYOffset || 0);
  const center = ARENA_W * 0.5 + (cfg.centerOffset || 0);
  return makeStage('battlefield', index, {
    baseId: 'battlefield',
    name: cfg.name,
    tag: 'BALANCED',
    desc: cfg.desc,
    color: cfg.color,
    platforms: [
      platform('main', 'solid', center, mainY, cfg.mainW, 44),
      platform('side-left', 'soft', center - cfg.sideX, mainY - cfg.sideY, cfg.sideW),
      platform('side-right', 'soft', center + cfg.sideX, mainY - cfg.sideY, cfg.sideW),
      platform('top', 'soft', center + (cfg.topOffset || 0), mainY - cfg.topY, cfg.topW, 20)
    ]
  });
}

function lava(index, cfg) {
  const mainY = GROUND_Y + (cfg.mainYOffset || -18);
  return makeStage('lava', index, {
    baseId: 'lava',
    name: cfg.name,
    tag: 'LAVA',
    desc: cfg.desc,
    color: cfg.color,
    lavaBottom: true,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, mainY, cfg.mainW, 42),
      platform('side-left', 'soft', ARENA_W * 0.5 - cfg.sideX, mainY - cfg.sideY, cfg.sideW),
      platform('side-right', 'soft', ARENA_W * 0.5 + cfg.sideX, mainY - cfg.sideY, cfg.sideW),
      ...(cfg.topW ? [platform('top', 'soft', ARENA_W * 0.5 + (cfg.topOffset || 0), mainY - cfg.topY, cfg.topW, 20)] : [])
    ]
  });
}

function islands(index, cfg) {
  return makeStage('islands', index, {
    baseId: 'islands',
    name: cfg.name,
    tag: 'ISLANDS',
    desc: cfg.desc,
    color: cfg.color,
    platforms: [
      platform('main-left', 'solid', ARENA_W * 0.5 - cfg.leftX, GROUND_Y + cfg.leftY, cfg.leftW, 42),
      platform('main-right', 'solid', ARENA_W * 0.5 + cfg.rightX, GROUND_Y + cfg.rightY, cfg.rightW, 42),
      platform('side-left', 'soft', ARENA_W * 0.5 - cfg.softLeftX, GROUND_Y - cfg.softLeftY, cfg.softLeftW),
      platform('side-right', 'soft', ARENA_W * 0.5 + cfg.softRightX, GROUND_Y - cfg.softRightY, cfg.softRightW),
      ...(cfg.topW ? [platform('top', 'soft', ARENA_W * 0.5 + (cfg.topOffset || 0), GROUND_Y - cfg.topY, cfg.topW, 20)] : [])
    ]
  });
}

function moving(index, cfg) {
  const mainY = GROUND_Y + (cfg.mainYOffset || 0);
  return makeStage('moving', index, {
    baseId: 'moving',
    name: cfg.name,
    tag: 'MOVING',
    desc: cfg.desc,
    color: cfg.color,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, mainY, cfg.mainW, 44),
      ...(cfg.sideW ? [
        platform('side-left', 'soft', ARENA_W * 0.5 - cfg.sideX, mainY - cfg.sideY, cfg.sideW),
        platform('side-right', 'soft', ARENA_W * 0.5 + cfg.sideX, mainY - cfg.sideY, cfg.sideW)
      ] : []),
      platform('moving-mid', 'soft', ARENA_W * 0.5 + (cfg.moveOffset || 0), mainY - cfg.moveY, cfg.moveW, 20, {
        moveX: cfg.moveX || 0,
        moveY: cfg.moveYRange || 0,
        moveSpeed: cfg.moveSpeed
      }),
      ...(cfg.secondMove ? [platform('moving-high', 'soft', ARENA_W * 0.5 + cfg.secondMove.x, mainY - cfg.secondMove.y, cfg.secondMove.w, 20, {
        moveX: cfg.secondMove.moveX || 0,
        moveY: cfg.secondMove.moveY || 0,
        moveSpeed: cfg.secondMove.speed
      })] : [])
    ]
  });
}

function vertical(index, cfg) {
  const mainY = GROUND_Y + (cfg.mainYOffset || 0);
  return makeStage('vertical', index, {
    baseId: 'vertical',
    name: cfg.name,
    tag: 'VERTICAL',
    desc: cfg.desc,
    color: cfg.color,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, mainY, cfg.mainW, 44),
      platform('low-left', 'soft', ARENA_W * 0.5 - cfg.lowX, mainY - cfg.lowLeftY, cfg.lowW),
      platform('low-right', 'soft', ARENA_W * 0.5 + cfg.lowX, mainY - cfg.lowRightY, cfg.lowW),
      platform('mid', 'soft', ARENA_W * 0.5 + (cfg.midOffset || 0), mainY - cfg.midY, cfg.midW, 20),
      platform('top', 'soft', ARENA_W * 0.5 + (cfg.topOffset || 0), mainY - cfg.topY, cfg.topW, 20)
    ]
  });
}

function special(index, cfg) {
  const mainY = GROUND_Y + (cfg.mainYOffset || 0);
  return makeStage('special', index, {
    baseId: 'special',
    name: cfg.name,
    tag: cfg.tag,
    desc: cfg.desc,
    color: cfg.color,
    background: cfg.background,
    windX: cfg.windX,
    slippery: cfg.slippery,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, mainY, cfg.mainW, 42),
      ...cfg.soft.map((p, i) => platform(`soft-${i + 1}`, 'soft', ARENA_W * 0.5 + p.x, mainY - p.y, p.w, 20, p.extra || {}))
    ]
  });
}

const STAGE_GROUPS = [
  [
    battlefield(0, { name: 'Battlefield', desc: 'Classic balanced platform fighting.', color: '#00e5ff', mainW: 780, sideX: 170, sideY: 78, sideW: 220, topY: 152, topW: 180 }),
    battlefield(1, { name: 'Wide Battlefield', desc: 'Longer neutral space with safer recoveries.', color: '#38bdf8', mainW: 880, sideX: 220, sideY: 92, sideW: 210, topY: 170, topW: 190 }),
    battlefield(2, { name: 'Low Battlefield', desc: 'Lower platforms keep fights grounded and fast.', color: '#22d3ee', mainW: 760, sideX: 150, sideY: 62, sideW: 200, topY: 132, topW: 170 }),
    battlefield(3, { name: 'High Battlefield', desc: 'Higher side routes reward aerial pressure.', color: '#7dd3fc', mainW: 760, sideX: 205, sideY: 112, sideW: 190, topY: 205, topW: 165 }),
    battlefield(4, { name: 'Offset Battlefield', desc: 'A slight top-platform offset changes juggles.', color: '#67e8f9', mainW: 800, sideX: 185, sideY: 84, sideW: 205, topY: 162, topW: 175, topOffset: 70 }),
    battlefield(5, { name: 'Compact Battlefield', desc: 'Tighter platform spacing for brawls.', color: '#06b6d4', mainW: 690, sideX: 145, sideY: 84, sideW: 175, topY: 160, topW: 150 })
  ],
  [
    lava(0, { name: 'Lava Crucible', desc: 'A narrow island over an instant-KO lava floor.', color: '#fb923c', mainW: 690, sideX: 230, sideY: 118, sideW: 180, topY: 205, topW: 170 }),
    lava(1, { name: 'Cinder Span', desc: 'Wide ledges give room, but the floor is still fatal.', color: '#f97316', mainW: 760, sideX: 250, sideY: 105, sideW: 170, topY: 190, topW: 180 }),
    lava(2, { name: 'Molten Steps', desc: 'Lower side steps encourage quick escapes from lava.', color: '#fdba74', mainW: 640, sideX: 185, sideY: 82, sideW: 165, topY: 178, topW: 150 }),
    lava(3, { name: 'Volcanic Crown', desc: 'High platforms and a small center demand aerial control.', color: '#f59e0b', mainW: 610, sideX: 250, sideY: 145, sideW: 190, topY: 235, topW: 150 }),
    lava(4, { name: 'Ash Bridge', desc: 'A long bridge over lava with risky upper routes.', color: '#ea580c', mainW: 830, sideX: 300, sideY: 128, sideW: 150, topY: 0, topW: 0 }),
    lava(5, { name: 'Ember Ring', desc: 'Compact stage that forces constant movement.', color: '#ef4444', mainW: 560, sideX: 170, sideY: 100, sideW: 145, topY: 182, topW: 130 })
  ],
  [
    islands(0, { name: 'Broken Islands', desc: 'Uneven islands with gaps and staggered routes.', color: '#34d399', leftX: 190, leftY: 0, leftW: 360, rightX: 210, rightY: -28, rightW: 330, softLeftX: 355, softLeftY: 128, softLeftW: 180, softRightX: 350, softRightY: 160, softRightW: 190, topY: 230, topW: 210, topOffset: 20 }),
    islands(1, { name: 'Twin Isles', desc: 'Two even islands split center stage.', color: '#4ade80', leftX: 230, leftY: 0, leftW: 330, rightX: 230, rightY: 0, rightW: 330, softLeftX: 220, softLeftY: 120, softLeftW: 170, softRightX: 220, softRightY: 120, softRightW: 170, topY: 215, topW: 180 }),
    islands(2, { name: 'Sunken Right', desc: 'One side sits lower, changing chase angles.', color: '#86efac', leftX: 205, leftY: -34, leftW: 350, rightX: 230, rightY: 22, rightW: 310, softLeftX: 345, softLeftY: 150, softLeftW: 170, softRightX: 330, softRightY: 110, softRightW: 185, topY: 245, topW: 170, topOffset: -40 }),
    islands(3, { name: 'Shattered Three', desc: 'Three solid chunks keep center unstable.', color: '#10b981', leftX: 285, leftY: 4, leftW: 240, rightX: 285, rightY: -12, rightW: 240, softLeftX: 0, softLeftY: 92, softLeftW: 230, softRightX: 0, softRightY: 205, softRightW: 180, topY: 0, topW: 0 }),
    islands(4, { name: 'High Islands', desc: 'Upper platforms help recover across the gap.', color: '#22c55e', leftX: 210, leftY: -8, leftW: 320, rightX: 230, rightY: -42, rightW: 320, softLeftX: 365, softLeftY: 170, softLeftW: 165, softRightX: 350, softRightY: 210, softRightW: 165, topY: 295, topW: 160 }),
    islands(5, { name: 'Tight Islands', desc: 'Smaller islands make every launch matter.', color: '#059669', leftX: 170, leftY: 0, leftW: 290, rightX: 185, rightY: -18, rightW: 290, softLeftX: 275, softLeftY: 116, softLeftW: 150, softRightX: 275, softRightY: 144, softRightW: 150, topY: 220, topW: 150 })
  ],
  [
    moving(0, { name: 'Clockwork Drift', desc: 'A slow moving platform crosses mid stage.', color: '#c084fc', mainW: 740, sideX: 260, sideY: 125, sideW: 180, moveY: 190, moveW: 190, moveX: 155, moveSpeed: 0.014 }),
    moving(1, { name: 'Pendulum Deck', desc: 'The moving platform swings wide above center.', color: '#a78bfa', mainW: 720, sideX: 240, sideY: 112, sideW: 165, moveY: 205, moveW: 170, moveX: 230, moveSpeed: 0.011 }),
    moving(2, { name: 'Liftworks', desc: 'A vertical lift changes juggle routes.', color: '#8b5cf6', mainW: 760, sideX: 245, sideY: 118, sideW: 175, moveY: 195, moveW: 185, moveYRange: 65, moveSpeed: 0.018 }),
    moving(3, { name: 'Dual Shuttles', desc: 'Two shuttles create alternating safe spots.', color: '#d8b4fe', mainW: 700, sideW: 0, moveY: 150, moveW: 170, moveX: 185, moveSpeed: 0.012, secondMove: { x: 0, y: 250, w: 150, moveX: -165, speed: 0.015 } }),
    moving(4, { name: 'Short Conveyor', desc: 'A small stage with a low moving route.', color: '#e879f9', mainW: 620, sideX: 205, sideY: 110, sideW: 155, moveY: 150, moveW: 160, moveX: 125, moveSpeed: 0.02 }),
    moving(5, { name: 'Sky Ferry', desc: 'A high ferry rewards patient aerial timing.', color: '#c4b5fd', mainW: 760, sideX: 280, sideY: 95, sideW: 150, moveY: 255, moveW: 210, moveX: 120, moveYRange: 28, moveSpeed: 0.012 })
  ],
  [
    vertical(0, { name: 'Sky Ladder', desc: 'Stacked platforms reward vertical combat.', color: '#a5f3fc', mainW: 650, lowX: 210, lowLeftY: 92, lowRightY: 172, lowW: 190, midY: 245, midW: 210, topY: 335, topW: 160 }),
    vertical(1, { name: 'Tall Tower', desc: 'A higher top platform opens early vertical KOs.', color: '#7dd3fc', mainW: 610, lowX: 190, lowLeftY: 105, lowRightY: 105, lowW: 180, midY: 220, midW: 180, topY: 360, topW: 150 }),
    vertical(2, { name: 'Spiral Tower', desc: 'Platforms spiral upward for chase routes.', color: '#38bdf8', mainW: 680, lowX: 250, lowLeftY: 85, lowRightY: 170, lowW: 165, midY: 260, midW: 190, midOffset: -80, topY: 340, topW: 150, topOffset: 85 }),
    vertical(3, { name: 'Wide Ladder', desc: 'Wider tiers make recovery safer.', color: '#bae6fd', mainW: 760, lowX: 260, lowLeftY: 115, lowRightY: 115, lowW: 210, midY: 235, midW: 240, topY: 330, topW: 190 }),
    vertical(4, { name: 'Needle Peak', desc: 'Narrow top platform creates dangerous juggles.', color: '#0ea5e9', mainW: 590, lowX: 185, lowLeftY: 100, lowRightY: 180, lowW: 155, midY: 255, midW: 155, topY: 352, topW: 100 }),
    vertical(5, { name: 'Cloud Stair', desc: 'Offset cloud steps keep aerial routes readable.', color: '#93c5fd', mainW: 700, lowX: 230, lowLeftY: 80, lowRightY: 155, lowW: 175, midY: 235, midW: 190, midOffset: 65, topY: 320, topW: 150, topOffset: -65 })
  ],
  [
    special(0, { name: 'Wind Shrine', tag: 'WIND', desc: 'A light wind nudges airborne fighters to the right.', color: '#fef3c7', background: 'temple', mainW: 740, windX: 0.045, soft: [{ x: -220, y: 110, w: 170 }, { x: 220, y: 110, w: 170 }, { x: 0, y: 205, w: 170 }] }),
    special(1, { name: 'Counterwind Shrine', tag: 'WIND', desc: 'A leftward wind makes recovery routes unusual.', color: '#fde68a', background: 'temple', mainW: 740, windX: -0.045, soft: [{ x: -230, y: 115, w: 170 }, { x: 230, y: 145, w: 170 }, { x: 0, y: 230, w: 155 }] }),
    special(2, { name: 'Ice Rink', tag: 'SLIPPERY', desc: 'Low-friction ground makes commitments slide farther.', color: '#cffafe', background: 'mountain', mainW: 820, slippery: true, soft: [{ x: -185, y: 90, w: 185 }, { x: 185, y: 90, w: 185 }, { x: 0, y: 175, w: 165 }] }),
    special(3, { name: 'Tiny Dojo', tag: 'SMALL', desc: 'Small platform and tight spacing for close combat.', color: '#fcd34d', background: 'temple', mainW: 520, soft: [{ x: -130, y: 95, w: 135 }, { x: 130, y: 95, w: 135 }, { x: 0, y: 178, w: 125 }] }),
    special(4, { name: 'Big Dojo', tag: 'WIDE', desc: 'A broad stage with low platforms for long neutral.', color: '#fbbf24', background: 'temple', mainW: 940, soft: [{ x: -285, y: 82, w: 210 }, { x: 285, y: 82, w: 210 }, { x: 0, y: 150, w: 200 }] }),
    special(5, { name: 'Gale Rink', tag: 'WIND ICE', desc: 'Wind and slippery footing create chaotic but readable movement.', color: '#e0f2fe', background: 'mountain', mainW: 700, windX: 0.03, slippery: true, soft: [{ x: -210, y: 118, w: 160 }, { x: 210, y: 118, w: 160 }, { x: 0, y: 220, w: 150 }] })
  ]
];

export const STAGE_LIST = STAGE_GROUPS.flat();
export const STAGE_DEFS = Object.fromEntries(STAGE_LIST.map((stage) => [stage.id, stage]));
export let activeStageId = 'battlefield';
export let STAGE_PLATFORMS = STAGE_DEFS.battlefield.platforms.map(copyPlatform);

function copyPlatform(p) {
  return { ...p };
}

export function setActiveStage(stageId = 'battlefield') {
  activeStageId = STAGE_DEFS[stageId] ? stageId : 'battlefield';
  STAGE_PLATFORMS = STAGE_DEFS[activeStageId].platforms.map(copyPlatform);
}

export function getActiveStage() {
  return STAGE_DEFS[activeStageId] || STAGE_DEFS.battlefield;
}

export function updateStage(tick = 0) {
  const def = getActiveStage();
  STAGE_PLATFORMS = def.platforms.map((p) => {
    const previous = STAGE_PLATFORMS.find((old) => old.id === p.id);
    const next = copyPlatform(p);
    if (p.moveX) next.x = p.baseX + Math.sin(tick * p.moveSpeed) * p.moveX;
    if (p.moveY) next.y = p.baseY + Math.sin(tick * p.moveSpeed) * p.moveY;
    next.prevX = previous?.x ?? next.x;
    next.prevY = previous?.y ?? next.y;
    return next;
  });
}

export function getStagePlatform(id) {
  return STAGE_PLATFORMS.find((p) => p.id === id) || null;
}

export function getStageBounds(padding = 0) {
  const solid = STAGE_PLATFORMS.filter((p) => p.kind === 'solid');
  const platforms = solid.length ? solid : STAGE_PLATFORMS;
  const left = Math.min(...platforms.map((p) => p.x - p.width / 2)) + padding;
  const right = Math.max(...platforms.map((p) => p.x + p.width / 2)) - padding;
  return { left, right, center: (left + right) / 2 };
}

export function getSpawnPoints() {
  const stage = getActiveStage();
  if (stage.spawns) return stage.spawns;
  const bounds = getStageBounds(80);
  const solid = STAGE_PLATFORMS.filter((p) => p.kind === 'solid');
  const y = Math.min(...solid.map((p) => p.y)) - 190;
  const usable = Math.max(260, bounds.right - bounds.left);
  const offset = Math.min(usable * 0.28, 260);
  return {
    player: { x: bounds.center - offset, y },
    enemy: { x: bounds.center + offset, y }
  };
}

export function isWithinPlatform(platform, x, padding = 0) {
  const half = platform.width / 2 + padding;
  return x >= platform.x - half && x <= platform.x + half;
}

export function findCurrentPlatform(x, y, tolerance = 2) {
  let current = null;
  for (const platform of STAGE_PLATFORMS) {
    if (!isWithinPlatform(platform, x, -10)) continue;
    if (Math.abs(y - platform.y) > tolerance) continue;
    if (!current || platform.y < current.y) current = platform;
  }
  return current;
}

export function findLandingPlatform(x, prevY, nextY, ignoreSoft = false) {
  let candidate = null;
  for (const platform of STAGE_PLATFORMS) {
    if (ignoreSoft && platform.kind === 'soft') continue;
    if (!isWithinPlatform(platform, x, 10)) continue;
    if (prevY > platform.y || nextY < platform.y) continue;
    if (!candidate || platform.y < candidate.y) candidate = platform;
  }
  return candidate;
}
