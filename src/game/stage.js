import { ARENA_W, GROUND_Y } from './constants.js';

export const DROP_THROUGH_FRAMES = 16;

const platform = (id, kind, x, y, width, depth = 22, extra = {}) => ({
  id, kind, x, baseX: x, y, baseY: y, width, depth,
  lip: extra.lip ?? (kind === 'solid' ? 26 : 18),
  skirt: extra.skirt ?? (kind === 'solid' ? 54 : 30),
  ...extra
});

export const STAGE_DEFS = {
  battlefield: {
    id: 'battlefield',
    name: 'Battlefield',
    tag: 'CLASSIC',
    desc: 'Balanced main platform with two side platforms and a top platform.',
    color: '#00e5ff',
    icon: '▣',
    background: 'rooftop',
    lavaBottom: false,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, GROUND_Y, 780, 44),
      platform('side-left', 'soft', ARENA_W * 0.5 - 170, GROUND_Y - 78, 220),
      platform('side-right', 'soft', ARENA_W * 0.5 + 170, GROUND_Y - 78, 220),
      platform('top', 'soft', ARENA_W * 0.5, GROUND_Y - 152, 180, 20)
    ]
  },
  lava: {
    id: 'lava',
    name: 'Lava Crucible',
    tag: 'HAZARD',
    desc: 'A narrower platform over an instant-KO lava floor.',
    color: '#fb923c',
    icon: '⊕',
    background: 'scrapyard',
    lavaBottom: true,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, GROUND_Y - 18, 690, 42),
      platform('side-left', 'soft', ARENA_W * 0.5 - 230, GROUND_Y - 118, 180),
      platform('side-right', 'soft', ARENA_W * 0.5 + 230, GROUND_Y - 118, 180),
      platform('top', 'soft', ARENA_W * 0.5, GROUND_Y - 205, 170, 20)
    ]
  },
  islands: {
    id: 'islands',
    name: 'Broken Islands',
    tag: 'GAPS',
    desc: 'Uneven floating islands with gaps and staggered recovery routes.',
    color: '#34d399',
    icon: '◆',
    background: 'forest',
    lavaBottom: false,
    platforms: [
      platform('main-left', 'solid', ARENA_W * 0.5 - 190, GROUND_Y, 360, 42),
      platform('main-right', 'solid', ARENA_W * 0.5 + 210, GROUND_Y - 28, 330, 42),
      platform('side-left', 'soft', ARENA_W * 0.5 - 355, GROUND_Y - 128, 180),
      platform('side-right', 'soft', ARENA_W * 0.5 + 350, GROUND_Y - 160, 190),
      platform('top', 'soft', ARENA_W * 0.5 + 20, GROUND_Y - 230, 210, 20)
    ]
  },
  moving: {
    id: 'moving',
    name: 'Clockwork Drift',
    tag: 'MOVING',
    desc: 'A stable main island with a slow moving platform crossing mid stage.',
    color: '#c084fc',
    icon: '◉',
    background: 'cyberlab',
    lavaBottom: false,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, GROUND_Y, 740, 44),
      platform('side-left', 'soft', ARENA_W * 0.5 - 260, GROUND_Y - 125, 180),
      platform('side-right', 'soft', ARENA_W * 0.5 + 260, GROUND_Y - 125, 180),
      platform('moving-mid', 'soft', ARENA_W * 0.5, GROUND_Y - 190, 190, 20, { moveX: 155, moveSpeed: 0.014 })
    ]
  },
  vertical: {
    id: 'vertical',
    name: 'Sky Ladder',
    tag: 'VERTICAL',
    desc: 'Stacked platforms reward juggling, recovery, and vertical knockouts.',
    color: '#a5f3fc',
    icon: '△',
    background: 'mountain',
    lavaBottom: false,
    platforms: [
      platform('main', 'solid', ARENA_W * 0.5, GROUND_Y, 650, 44),
      platform('low-left', 'soft', ARENA_W * 0.5 - 210, GROUND_Y - 92, 190),
      platform('low-right', 'soft', ARENA_W * 0.5 + 210, GROUND_Y - 172, 190),
      platform('mid', 'soft', ARENA_W * 0.5, GROUND_Y - 245, 210, 20),
      platform('top', 'soft', ARENA_W * 0.5, GROUND_Y - 335, 160, 20)
    ]
  }
};

export const STAGE_LIST = Object.values(STAGE_DEFS);
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
  const bounds = getStageBounds(80);
  const y = Math.min(...STAGE_PLATFORMS.filter((p) => p.kind === 'solid').map((p) => p.y)) - 190;
  return {
    player: { x: bounds.left + 120, y },
    enemy: { x: bounds.right - 120, y }
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
