// Sauce's Dennis AI.
include("functions.js");
include("moves.js");

function id() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Rules.
  let chase = -1;
  for (let i = 0; i < 400; i++) { // There can only be one chase ball on the field.
    if (game.exists[i] && getId(i) == 215 && team(i) == self.team) {
      chase = i;
      break;
    }
  }

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
    // Many foot.
    if (RangeSF(121, 123) && self.ctimer >= 280 && self.mp >= 75) {
      DdA();
    }
    if (((exist(weapons) && HitAble(weapons[0], 60)) ||
        state(enemies[0]) == 16 ||
        (self.frame == 110 && self.bdefend > 0)) &&
      HitAble(enemies[0], 266) && (self.state <= 1 || self.state == 7) &&
      infront(enemies[0]) && blink(enemies[0]) == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[0]) {
      DdA();
    }
    // Balls.
    if ((RangeX(enemies[0], -130, -100) || RangeX(enemies[0], 100, 130)) && Math.abs(dz(enemies[0])) <= 30 &&
      self.state <= 1 && self.mp >= 160 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // C foot.
    if (((state(enemies[0]) == 8 && HitAble(enemies[0], 282)) ||
        (RangeX(enemies[0], -120, -80) || RangeX(enemies[0], 80, 120))) &&
      Math.abs(dz(enemies[0])) <= 20 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 && state(enemies[0]) != 16 &&
      self.state <= 1 && self.mp >= 100 &&
      !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    if (RangeSF(284, 287) && (state(enemies[0]) == 14 || state(enemies[0]) == 16 || Math.abs(dx(enemies[0])) >= 160)) {
      D();
    }
    // Chase ball.
    if (chase == -1 && AbsRange(enemies[0], 80, 100) && Math.abs(dz(enemies[0])) >= 60 &&
      self.state == 1 && self.mp >= 100 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuA();
    }
  }

  // Special direction.
  if ((RangeX(enemies[0], -200, -100) || RangeX(enemies[0], 100, 200)) &&
    Math.abs(dz(enemies[0])) <= 30 && RangeSF(235, 246)) {
    WarningAndSpecialMove[1] = true;
    if (AbsRange(enemies[0], 80, 40)) {
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