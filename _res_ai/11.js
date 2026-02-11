// Sauce's Davis AI.
include("functions.js");
include("moves.js");

let limit;

function id() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Rules.
  if (elapsed_time <= 1 || (mode == 1 && self.team == 1)) {
    limit = 0;
  }

  // Arguments for id_basic_move:
  // punch melee, second type of dash attack melee, jump attack melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need, run attack need, jump attack need,
  // All the detected objects.
  WarningAndSpecialMove = id_basic_move(
    true, true, true, true, 110, 5, 11, 5, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Many punch.
    if (RangeSF(121, 123) && (self.ctimer <= 10 || (coming(enemies) && self.blink == 0))) {
      DdA();
    }
    if (((exist(weapons) && HitAble(weapons[0], 60)) ||
        state(enemies[0]) == 8 || state(enemies[0]) == 16 ||
        (self.frame == 110 && self.bdefend > 0)) &&
      HitAble(enemies[0], 271) && (self.state <= 1 || self.state == 7) &&
      blink(enemies[0]) == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[0]) {
      DdA();
    }
    // Balls.
    if ((RangeX(enemies[0], -140, -90) || RangeX(enemies[0], 90, 140)) &&
      Math.abs(dz(enemies[0])) <= 30 &&
      self.state <= 1 && self.mp >= 160 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Jumphit.
    if ((self.fall >= 10 && AbsRange(enemies[0], 60, 14) && fall(enemies[0]) == 0) ||
      (RangeSF(281, 282) && state(enemies[0]) == 12 && self.mp >= 25)) {
      DuJ();
    }
    if (self.frame == 292 && HitAble(enemies[0], 293)) {
      A();
    }
    // Singlong.
    if (frequency() <= 1 && limit <= 1 && (self.state <= 2 || RangeSF(102, 107)) &&
      HitAble(enemies[0], 301) && Math.abs(dz(enemies[0])) <= 16 &&
      self.mp >= 225 && state(enemies[0]) != 7 && blink(enemies[0]) == 0) {
      DuA();
      limit++; // Can only be used twice.
    }
  }

  // Special direction.
  if ((RangeX(enemies[0], -200, -90) || RangeX(enemies[0], 90, 200)) && RangeSF(240, 266)) {
    WarningAndSpecialMove[1] = true;
    if (AbsRange(enemies[0], 70, 40)) {
      A(0, 0);
    } else if ((state(enemies[0]) != 14 || !infront(enemies[0])) && fall(enemies[0]) <= 20) {
      A();
    }
    if (dz(enemies[0]) <= -14) {
      up(1, 1);
    } else if (dz(enemies[0]) >= 14) {
      down(1, 1);
    } else {
      up(0, 0);
      down(0, 0);
    }
  }
}