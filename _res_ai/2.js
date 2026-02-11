// Sauce's John AI.
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
  let chase = -1;
  for (let i = 0; i < 400; i++) { // There can only be one biscuit on the field.
    if (game.exists[i] && getId(i) == 214 && team(i) == self.team) {
      chase = i;
      break;
    }
  }
  let shield = -1;
  for (let i = 0; i < 400; i++) { // There can only be one force field on the field.
    if (game.exists[i] && getId(i) == 200 && RangeTF(i, 60, 65) && team(i) == self.team) {
      shield = i;
      break;
    }
  }

  // Arguments for id_basic_move:
  // punch melee, second type of dash attack melee, jump attack melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need, run attack need, jump attack need,
  // All the detected objects.
  WarningAndSpecialMove = id_basic_move(
    true, true, true, true, 140, 3, 11, 3, 11, 180, 30,
    false, false, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Heal self.
    if (frequency() <= 1 && limit <= 1 &&
      (!AbsRange(enemies[0], 250, 60) || state(enemies[0]) == 14) &&
      self.state <= 1 && self.dark_hp - self.hp >= 100 && self.mp >= 350 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdJ();
      limit++; // Can only be used twice.
    }
    // Balls.
    if ((RangeX(enemies[0], -200, -130) || RangeX(enemies[0], 130, 200)) &&
      Math.abs(dz(enemies[0])) <= 20 && self.state <= 1 && self.mp >= 75 &&
      blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Force field.
    if (((state(enemies[0]) == 8 || (shield == -1 && exist(weapons) && HitAble(weapons[0], 60))) &&
        (HitAble(enemies[0], 274) || HitAble(enemies[0], 275))) &&
      self.state <= 1 && blink(enemies[0]) == 0 && state(enemies[0]) != 7 && state(enemies[0]) != 14 && self.mp >= 100 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    if (shield == -1 && WarningAndSpecialMove[0] && self.state <= 1 && self.fall == 0 && self.blink == 0 &&
      !((state(enemies[0]) == 5 || RangeTF(enemies[0], 90, 94)) && IsFacing(enemies[0])) && self.mp >= 100) {
      if (Math.abs(dy(enemies[0])) <= 40) {
        if (dx(enemies[0]) < 0) {
          DlJ();
        } else {
          DrJ();
        }
      }
      if (exist(balls)) {
        if (dx(balls[0]) < 0) {
          DlJ();
        } else {
          DrJ();
        }
      }
    }
    // Biscuit.
    if (chase == -1 && AbsRange(enemies[0], 80, 100) && Math.abs(dz(enemies[0])) >= 40 &&
      self.state <= 1 && self.mp >= 250 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuA();
    }
  }

  // Special direction.
  if (RangeSF(235, 243) || RangeSF(300, 306)) {
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