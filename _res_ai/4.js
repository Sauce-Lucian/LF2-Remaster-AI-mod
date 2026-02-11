// Sauce's Henry AI.
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
    false, false, false, false, 300, 4, 8, 4, 8, 100, 20,
    true, false, true, etc,
    enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Prevent enemy rowing.
  if (frequency() <= 2 && (state(enemies[0]) == 12 || RangeTF(enemies[0], 100, 109)) &&
    Math.abs(dy(enemies[0])) <= 60 && self.state <= 1 && infront(enemies[0]) && blink(enemies[0]) == 0) {
    if ((Math.abs(dx(enemies[0])) >= 100 && Math.abs(dx(enemies[0])) <= 140) ||
      (Math.abs(dx(enemies[0])) >= 50 && Math.abs(dx(enemies[0])) <= 100 && Math.abs(dy(enemies[0])) <= 30)) {
      A();
    }
  }

  // Skills.
  if (frequency() <= 2) {
    // Flute.
    if (limit <= 1 && self.state <= 1 && !AbsRange(enemies[0], 100, 25) && AbsRange(enemies[0], 150, 50) &&
      state(enemies[0]) != 14 && self.mp >= 350 &&
      !WarningAndSpecialMove[0]) {
      DuJ();
      limit++; // Can only be used twice.
    }
    if (self.frame == 254) { // Flute must stop at the third sound.
      D();
    }
    // Five arrow.
    if (AbsRange(enemies[0], 400, 60) && Math.abs(dx(enemies[0])) >= 250 && Math.abs(dy(enemies[0])) <= 50 &&
      self.mp >= 150 && self.fall == 0 && infront(enemies[0]) && state(enemies[0]) != 12 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[0]) {
      DJA();
    }
    // Blastpush.
    if (state(enemies[0]) == 16 && self.fall == 0 &&
      (RangeX(enemies[0], -250, -100) || RangeX(enemies[0], 100, 250)) && Math.abs(dz(enemies[0])) <= 16 &&
      self.state <= 1 && self.mp >= 150 && blink(enemies[0]) == 0 &&
      !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Super arrow.
    if (frequency() <= 1 && self.fall == 0 &&
      (RangeX(enemies[0], -400, -350) || RangeX(enemies[0], 350, 400)) && Math.abs(dz(enemies[0])) <= 40 &&
      self.state <= 1 && self.mp >= 200 && blink(enemies[0]) == 0 && state(enemies[0]) != 12 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
      if (dz(enemies[0]) <= -16) {
        up(1, 1);
      } else if (dz(enemies[0]) >= 16) {
        down(1, 1);
      }
    }
  }

  // Special direction.
  if ((RangeX(enemies[0], -400, -30) || RangeX(enemies[0], 30, 400)) &&
    (RangeSF(60, 66) || RangeSF(80, 84) || RangeSF(270, 287))) {
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