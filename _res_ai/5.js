// Sauce's Rudolf AI.
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
  let clone = false;
  for (let i = 0; i < 400; i++) { // Can't use clone or disappear while clone still alive.
    if (game.exists[i] && self.team == team(i) && target.clone != -1) {
      clone = true;
      break;
    }
  }

  // Arguments for id_basic_move:
  // punch melee, second type of dash attack melee, jump attack melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need, run attack need, jump attack need,
  // All the detected objects.
  WarningAndSpecialMove = id_basic_move(
    false, false, true, true, 300, 5, 11, 5, 11, 180, 40,
    false, false, true,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Prevent enemy rowing.
  if (frequency() <= 2 && (state(enemies[0]) == 12 || RangeTF(enemies[0], 100, 109)) && Math.abs(dy(enemies[0])) <= 60 && self.state <= 1 && infront(enemies[0]) && blink(enemies[0]) == 0) {
    if ((Math.abs(dx(enemies[0])) >= 100 && Math.abs(dx(enemies[0])) <= 140) || (Math.abs(dx(enemies[0])) >= 50 && Math.abs(dx(enemies[0])) <= 100 && Math.abs(dy(enemies[0])) <= 30)) {
      A();
    }
  }

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Clone or disappear.
    if (!clone && limit <= 1 && self.state <= 1 &&
      (!AbsRange(enemies[0], 250, 60) || state(enemies[0]) == 14) &&
      self.mp >= 350 && !WarningAndSpecialMove[0]) {
      limit++; // Can only be used twice.
      if (rand(10) <= 5) {
        DuJ();
      } else {
        DdJ();
      }
    }
    // Five punch.
    if (AbsRange(enemies[0], 150, 40) && Math.abs(dx(enemies[0])) >= 80 &&
      Math.abs(dy(enemies[0])) <= 40 && self.mp >= 100 && self.state <= 1 && self.fall == 0 &&
      state(enemies[0]) != 12 && state(enemies[0]) != 14 && state(enemies[0]) != 16 && blink(enemies[0]) == 0 &&
      !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) <= 0) {
        DlA();
      } else {
        DrA();
      }
    }
    if (self.frame == 289) { // Can't use five punch twice.
      A(0, 0);
    }
    // Jump sword.
    if (getId(enemies[0]) != 6 && (RangeSF(104, 106) || self.frame == 109) &&
      Math.abs(dz(enemies[0])) <= 16 && !RangeTF(enemies[0], 110, 111) &&
      state(enemies[0]) != 12 && state(enemies[0]) != 14 && blink(enemies[0]) == 0 &&
      !WarningAndSpecialMove[0]) {
      if (RangeX(enemies[0], -120, -90)) {
        DlJ();
      } else if (RangeX(enemies[0], 90, 120)) {
        DrJ();
      } else if (Math.abs(dx(enemies[0])) <= 50) {
        if (dx(enemies[0]) <= 0) {
          DlJ();
        } else {
          DrJ();
        }
      }
    }
    if (self.state == 7 && AbsRange(enemies[0], 50, 20) && self.bdefend > 0) {
      if (dx(enemies[0]) >= 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    // Transform.
    if (self.clone != -1 && RangeSF(121, 123) && self.mp >= 150) {
      DJA();
    }
  }

  // Special direction.
  if ((RangeX(enemies[0], -250, -30) || RangeX(enemies[0], 30, 250)) &&
    (RangeSF(59, 69) || RangeSF(285, 289)) &&
    !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
    WarningAndSpecialMove[1] = true;
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