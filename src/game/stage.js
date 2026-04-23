import { ARENA_W, GROUND_Y } from './constants.js';

const MAIN_WIDTH = 780;
const SIDE_WIDTH = 220;
const TOP_WIDTH = 180;

export const STAGE_PLATFORMS = [
  {
    id: 'main',
    kind: 'solid',
    x: ARENA_W * 0.5,
    y: GROUND_Y,
    width: MAIN_WIDTH,
    depth: 44,
    lip: 26,
    skirt: 54
  },
  {
    id: 'side-left',
    kind: 'soft',
    x: ARENA_W * 0.5 - 170,
    y: GROUND_Y - 78,
    width: SIDE_WIDTH,
    depth: 22,
    lip: 18,
    skirt: 30
  },
  {
    id: 'side-right',
    kind: 'soft',
    x: ARENA_W * 0.5 + 170,
    y: GROUND_Y - 78,
    width: SIDE_WIDTH,
    depth: 22,
    lip: 18,
    skirt: 30
  },
  {
    id: 'top',
    kind: 'soft',
    x: ARENA_W * 0.5,
    y: GROUND_Y - 152,
    width: TOP_WIDTH,
    depth: 20,
    lip: 16,
    skirt: 28
  }
];

export const DROP_THROUGH_FRAMES = 16;

export function getStagePlatform(id) {
  return STAGE_PLATFORMS.find((platform) => platform.id === id) || null;
}

export function getStageBounds(padding = 0) {
  const main = STAGE_PLATFORMS[0];
  const half = main.width / 2 - padding;
  return {
    left: main.x - half,
    right: main.x + half
  };
}

export function getSpawnPoints() {
  return {
    player: { x: ARENA_W * 0.5 - 280, y: GROUND_Y - 255 },
    enemy: { x: ARENA_W * 0.5 + 280, y: GROUND_Y - 255 }
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
