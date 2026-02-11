// Sauce's Firen AI.
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
    true, true, true, true, 120, 3, 11, 3, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Explosion.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 16) && AbsRange(enemies[0], 40, 37) &&
      self.state <= 1 && self.hp >= 40 && self.mp >= 300) {
      DuJ();
    }
    // Balls.
    if ((RangeX(enemies[0], -120, -70) || RangeX(enemies[0], 70, 120)) && Math.abs(dz(enemies[0])) <= 20 &&
      self.state <= 1 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 && self.fall == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Flame.
    if (Math.abs(vx(enemies[0])) >= 7 && Math.abs(dz(enemies[0])) <= 40 && IsFacing(enemies[0])) {
      if ((vx(enemies[0]) <= 0 && RangeX(enemies[0], 250, 350)) ||
        (vx(enemies[0]) >= 0 && RangeX(enemies[0], -350, -200))) {
        if ((vz(enemies[0]) < 0 && dz(enemies[0]) > 0) ||
          (vz(enemies[0]) > 0 && dz(enemies[0]) < 0) ||
          (vz(enemies[0]) == 0 && Math.abs(dz(enemies[0])) <= 14)) {
          DdJ();
        }
      }
    }
    if (self.frame == 275) {
      D(1, 0);
    }
    // Burn run.
    if (exist(weapons) && HitAble(weapons[0], 60) && AbsRange(enemies[0], 100, 25) &&
      self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
  }

  // Special direction.
  if (RangeSF(235, 252)) {
    WarningAndSpecialMove[1] = true;
    if (AbsRange(enemies[0], 70, 40) && state(enemies[0]) != 18) {
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

  // Combo - burning punch.
  if (frequency() <= 2 && difficulty == -1 &&
    (state(enemies[0]) == 8 || state(enemies[0]) == 16) &&
    AbsRange(enemies[0], 20, 16)) {
    WarningAndSpecialMove[1] = true;
    if (self.state <= 1 && !RangeSF(60, 69)) {
      if (!facing(enemies[0])) {
        DlJ();
      } else {
        DrJ();
      }
    }
  }
  if (RangeSF(255, 256)) {
    left(0, 0);
    right(0, 0);
  }
  if (RangeSF(257, 261) && state(enemies[0]) != 18) {
    J();
  }
  if (difficulty == -1 && (state(enemies[0]) == 11 || state(enemies[0]) == 18) &&
    AbsRange(enemies[0], 70, 16) && self.hp > 30) {
    WarningAndSpecialMove[1] = true;
    if (dx(enemies[0]) <= -52) {
      left(1, 1);
    } else if (dx(enemies[0]) >= 52) {
      right(1, 1);
    }
    if (AbsRange(enemies[0], 60, 16)) {
      if (dz(enemies[0]) <= 0) {
        up(1, 1);
      } else {
        down(1, 1);
      }
    }
    if (AbsRange(enemies[0], 52, 16) && infront(enemies[0])) {
      left(0, 0);
      right(0, 0);
      up(0, 0);
      down(0, 0);
    }
    if (AbsRange(enemies[0], 55, 14)) {
      A();
    }
  }
}