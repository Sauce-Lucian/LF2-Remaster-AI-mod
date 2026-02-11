// Sauce's Woody AI.
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
    true, true, true, true, 110, 3, 11, 3, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Super punch.
    if (((exist(weapons) && HitAble(weapons[0], 60)) ||
        state(enemies[0]) == 8 ||
        (frequency() <= 2 && state(enemies[0]) == 12) ||
        (self.frame == 110 && self.bdefend > 0)) &&
      HitAble(enemies[0], 72) && (self.state <= 1 || self.state == 7) && blink(enemies[0]) == 0 &&
      !WarningAndSpecialMove[0]) {
      DuA();
    }
    // Balls.
    if ((RangeX(enemies[0], -300, -200) || RangeX(enemies[0], 200, 300)) &&
      Math.abs(dz(enemies[0])) >= 20 && Math.abs(dz(enemies[0])) <= 40 &&
      self.state <= 1 && self.mp >= 125 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Cleg.
    if ((RangeX(enemies[0], -80, -60) || RangeX(enemies[0], 60, 80)) &&
      Math.abs(dz(enemies[0])) <= 10 &&
      blink(enemies[0]) == 0 &&
      state(enemies[0]) != 7 && state(enemies[0]) != 12 && state(enemies[0]) != 14 &&
      infront(enemies[0]) && self.state <= 1 && self.mp >= 50 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdA();
    }
    // Fly crash.
    if ((RangeX(enemies[0], -120, -50) || RangeX(enemies[0], 50, 120)) &&
      Math.abs(dz(enemies[0])) <= 30 &&
      ((dz(enemies[0]) == 0 || Math.abs(dx(enemies[0])) / Math.abs(dz(enemies[0])) >= 3.6) || Math.abs(dz(enemies[0])) <= 16) &&
      blink(enemies[0]) == 0 && state(enemies[0]) >= 2 && state(enemies[0]) != 7 && state(enemies[0]) != 14 && self.mp >= 200 &&
      !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
  }

  // Special direction.
  if (RangeSF(235, 253)) {
    WarningAndSpecialMove[1] = true;
    if (dz(enemies[0]) <= -16) {
      up(1, 1);
    } else if (dz(enemies[0]) >= 16) {
      down(1, 1);
    } else {
      up(0, 0);
      down(0, 0);
    }
  }
}