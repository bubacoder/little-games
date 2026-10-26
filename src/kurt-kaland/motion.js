// Parabolikus ugrás: a nyuszi a talajról indul és ugyanoda érkezik vissza.
export const HOP_DURATION = 0.64;
export function hopPose(elapsed, duration = HOP_DURATION) {
  const p = Math.max(0, Math.min(1, elapsed / duration));
  return { p, lift: 4 * p * (1 - p), lean: Math.sin(2 * Math.PI * p) * .12,
    squash: Math.max(0, 1 - Math.abs(p - .94) / .06) * .12 };
}

export function smoothToward(current, target, dt, rate = 8) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

// A teljes buckasor ugyanazzal az eltolással mozog; landoláskor sem ugrik másik helyre.
export function obstacleOffset(index, cleared, hop, hopActive, exitDistance = 0) {
  return 80 + (index - cleared) * 160 - (hopActive ? hop.p * 160 : 0) - exitDistance;
}

export function edgeOpacity(x) {
  return Math.max(0, Math.min(1, (x + 24) / 60));
}
