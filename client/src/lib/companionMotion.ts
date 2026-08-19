export type CompanionLook = {
  x: number;
  y: number;
  tilt: number;
};

/**
 * Calculates eye pupil offset and robot tilt based on cursor position relative to companion center.
 */
export function getCompanionLook(
  targetX: number,
  targetY: number,
  originX: number,
  originY: number,
): CompanionLook {
  const dx = targetX - originX;
  const dy = targetY - originY;
  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: 0, y: 0, tilt: 0 };
  }

  // Eye pupil offset range: max ~2.5px
  const maxEyeOffset = 2.5;
  const eyeDistance = Math.min(maxEyeOffset, distance / 40);
  const angle = Math.atan2(dy, dx);

  const x = Number((Math.cos(angle) * eyeDistance).toFixed(2));
  const y = Number((Math.sin(angle) * eyeDistance).toFixed(2));

  // Body tilt angle based on horizontal offset: max ~18deg
  const maxTilt = 18;
  const tilt = Number(Math.max(-maxTilt, Math.min(maxTilt, dx / 35)).toFixed(2));

  return { x, y, tilt };
}
