// Sauce's Justin AI.
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
    5, 11, 5, 11, 180, 30,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2) {
    // Ball.
    if ((RangeX(enemies[0], -200, -150) || RangeX(enemies[0], 150, 200)) &&
      Math.abs(dz(enemies[0])) <= 30 &&
      self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Punch2.
    if ((RangeX(enemies[0], -60, -40) || RangeX(enemies[0], 40, 60)) &&
      Math.abs(dz(enemies[0])) <= 16 &&
      self.state <= 1 && self.mp >= 75 && blink(enemies[0]) == 0 && infront(enemies[0]) &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdA();
    }
  }

  return 0;
}