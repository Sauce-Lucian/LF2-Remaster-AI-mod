// Sauce's Mark AI.
include("functions.js");
include("moves.js");

function ego() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Arguments for ego_basic_move:
  // punch melee, second type of dash attack melee,
  // MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need,
  // All the detected objects.
  ego_basic_move(
    true, true,
    2, 11, 2, 11, 180, 20,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2) {
    // Run Attack.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 12 || state(enemies[0]) == 16) &&
      HitAble(enemies[0], 86) && self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Run.
    if ((RangeX(enemies[0], -120, -70) || RangeX(enemies[0], 70, 120)) &&
      Math.abs(dz(enemies[0])) <= 20 &&
      self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 77 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
  }

  return 0;
}