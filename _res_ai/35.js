// Sauce's Monk AI.
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
    3, 11, 3, 11, 180, 30,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2) {
    // Ball.
    if (AbsRange(enemies[0], 350, 16) && Math.abs(dx(enemies[0])) >= 300 &&
      self.state <= 1 && self.mp >= 100 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
  }

  return 0;
}