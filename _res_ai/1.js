// Sauce's Deep AI.
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
    true, true, true, true, 160, 3, 11, 3, 11, 100, 20,
    false, false, true,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Blasts.
    if (self.fall == 0 && (RangeX(enemies[0], -140, -30) || RangeX(enemies[0], 30, 140)) &&
      ((dz(enemies[0]) == 0 || Math.abs(dx(enemies[0])) / Math.abs(dz(enemies[0])) >= 3.2) || Math.abs(dz(enemies[0])) <= 14) &&
      Math.abs(dz(enemies[0])) <= 30 &&
      self.state <= 1 && self.mp >= 150 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    if (AbsRange(enemies[0], 60, 14) && state(enemies[0]) == 8 && fall(enemies[0]) >= 10 &&
      self.state <= 1 && self.mp >= 75) {
      if (dx(enemies[0]) > 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Jump_sword1.
    if (((exist(weapons) && HitAble(weapons[0], 60)) || (state(enemies[0]) == 8 && (fall(enemies[0]) == 0 || coming(enemies))) || (self.frame == 110 && self.bdefend > 0)) &&
      HitAble(enemies[0], 262) && blink(enemies[0]) == 0 && (self.state <= 1 || self.state == 7) && self.mp >= 75 &&
      !WarningAndSpecialMove[0]) {
      DdA();
    }
    // Jump_sword2.
    if (frequency() <= 1 &&
      ((self.fall >= 10 && AbsRange(enemies[0], 60, 14) && fall(enemies[0]) == 0) || self.frame == 265) && self.mp >= 75) {
      DuJ();
    }
    if (self.frame == 267 && (HitAble(enemies[0], 269) || HitAble(enemies[0], 270) || HitAble(enemies[0], 271))) {
      A();
    }
    // Dash_sword.
    if (RangeSF(102, 107) && AbsRange(enemies[0], 70, 20) && self.mp >= 150 && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
  }

  // Special direction.
  if ((RangeX(enemies[0], -160, -30) || RangeX(enemies[0], 30, 160)) &&
    Math.abs(dz(enemies[0])) <= 30 && RangeSF(235, 250)) {
    WarningAndSpecialMove[1] = true;
    if (AbsRange(enemies[0], 70, 40)) {
      A(0, 0);
    } else if ((state(enemies[0]) != 14 || !infront(enemies[0])) && self.mp >= 75) {
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