// Sauce's Firzen AI.
include("functions.js");
include("moves.js");

function id() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Arguments for id_basic_move:
  // punch melee, second type of dash attack melee, jump attack melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need, run attack need, jump attack need,
  // All the detected objects.
  WarningAndSpecialMove = id_basic_move(
    true, true, true, true,
    110, 3, 11, 3, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Balls.
    if (AbsRange(enemies[0], 120, 16) && (Math.abs(dx(enemies[0])) >= 90 || state(enemies[0]) == 13) &&
      self.state <= 1 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 && self.mp >= 25 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    if (RangeSF(270, 273) && (state(enemies[0]) == 7 || state(enemies[0]) == 12 || state(enemies[0]) == 14)) {
      D();
    }
    // Disaster.
    if (AbsRange(enemies[0], 300, 100) && Math.abs(dz(enemies[0])) >= 60 &&
      self.state <= 3 && self.mp >= 100 &&
      !WarningAndSpecialMove[0]) {
      DuA();
    }
    // Volcano.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 13 || state(enemies[0]) == 16) &&
      AbsRange(enemies[0], 80, 37) &&
      self.state <= 1 && self.mp >= 250 &&
      !WarningAndSpecialMove[0]) {
      DuJ();
    }
  }
}