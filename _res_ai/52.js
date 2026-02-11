// Sauce's Julian AI.
include("functions.js");
include("moves.js");

function id() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Hit armour.
  const HitArmour = self.bdefend > 0 && self.fall == 0;

  // Arguments for id_basic_move:
  // punch melee, second type of dash attack melee, jump attack melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need, run attack need, jump attack need,
  // All the detected objects.
  WarningAndSpecialMove = id_basic_move(
    true, true, true, true,
    130, 3, 11, 3, 11, 180, 30,
    false, true, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Balls.
    if (((AbsRange(enemies[0], 250, 70) && Math.abs(dz(enemies[0])) >= 40) ||
        (AbsRange(enemies[0], 250, 20) && Math.abs(dx(enemies[0])) >= 80)) &&
      self.state <= 3 && self.mp >= 10 && !coming(enemies)) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    if (RangeSF(260, 275)) {
      if (!AbsRange(enemies[0], 250, 70) || HitArmour || coming(enemies) || WarningAndSpecialMove[0]) {
        D();
      } else {
        A();
      }
    }
    // Big ball.
    if (AbsRange(enemies[0], 350, 30) && Math.abs(dx(enemies[0])) >= 250 &&
      self.state <= 2 && blink(enemies[0]) == 0 && self.mp >= 125 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    // Explosion.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 13 || state(enemies[0]) == 16) &&
      AbsRange(enemies[0], 80, 37) &&
      self.state <= 2 && self.mp >= 100 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuJ();
    }
    if ((state(enemies[0]) == 6 || state(enemies[0]) == 12) &&
      AbsRange(enemies[0], 80, 37) && Math.abs(dy(enemies[0])) >= 50 &&
      (game.objects[enemies[0]].x == 0 || game.objects[enemies[0]].x == bg_width) &&
      self.state <= 2 && self.mp >= 100 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuJ();
    }
    // Shadows.
    if ((HitArmour || self.fall > 0) && arest(enemies[0]) == 0 && self.mp >= 25) {
      DJA();
    }
    // Singlong.
    if (Math.abs(vx(enemies[0])) >= 7 && Math.abs(dz(enemies[0])) <= 40 &&
      state(enemies[0]) == 5 && self.state <= 2 && !HitArmour) {
      if ((vx(enemies[0]) <= 0 && RangeX(enemies[0], 250, 350)) ||
        (vx(enemies[0]) >= 0 && RangeX(enemies[0], -350, -200))) {
        if ((vz(enemies[0]) < 0 && dz(enemies[0]) > 0) ||
          (vz(enemies[0]) > 0 && dz(enemies[0]) < 0) ||
          (vz(enemies[0]) == 0 &&
            Math.abs(dz(enemies[0])) <= 14)) {
          DuA();
        }
      }
    }
    if (state(enemies[0]) == 12 && AbsRange(enemies[0], 70, 16) &&
      Math.abs(dy(enemies[0])) <= 30 &&
      self.state <= 1 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuA();
    }
    if (self.frame == 79) {
      A();
    }
  }

  // Special direction.
  if (RangeSF(280, 291)) {
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