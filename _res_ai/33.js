// Sauce's Jack AI.
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
    3, 11, 3, 11, 180, 20,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2) {
    // Balls.
    if ((RangeX(enemies[0], -300, -150) || RangeX(enemies[0], 150, 300)) &&
      self.state <= 3 && Math.abs(dz(enemies[0])) <= 30 &&
      blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 50 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Singlong.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 16) &&
      HitAble(enemies[0], 302) && (self.state <= 1 || self.state == 7) &&
      self.mp >= 125) {
      DuA();
    }
  }

  return 0;
}