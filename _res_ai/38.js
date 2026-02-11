// Sauce's Bat AI.
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
    140, 3, 11, 3, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Balls.
    if ((RangeX(enemies[0], -180, -120) || RangeX(enemies[0], 120, 180)) &&
      Math.abs(dz(enemies[0])) <= 14 &&
      self.state <= 1 && self.mp >= 125 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Speed punch.
    if (AbsRange(enemies[0], 120, 16) && Math.abs(dx(enemies[0])) >= 90 &&
      self.state <= 1 && blink(enemies[0]) == 0 && state(enemies[0]) != 7 && state(enemies[0]) != 14 && self.mp >= 50 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    if (RangeSF(121, 123) && (self.ctimer <= 10 || (coming(enemies) && self.blink == 0))) {
      DdA();
    }
    // Bat.
    if (((state(enemies[0]) == 8 || (exist(weapons) && HitAble(weapons[0], 60))) || (AbsRange(enemies[0], 80, 100) &&
        Math.abs(dz(enemies[0])) >= 40)) &&
      self.state <= 1 && self.mp >= 200 &&
      !WarningAndSpecialMove[0]) {
      DuJ();
    }
  }
}