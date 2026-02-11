// Sauce's Freeze AI.
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
  if (frequency() <= 2) {
    // Whirlwind.
    if (((frequency() <= 1 && state(enemies[0]) <= 1 && fall(enemies[0]) == 0 &&
          AbsRange(enemies[0], 60, 35) && Math.abs(dz(enemies[0])) >= 30 && blink(enemies[0]) == 0) ||
        (state(enemies[0]) == 13 && AbsRange(enemies[0], 150, 30))) &&
      self.state <= 1 && self.mp >= 300) {
      DuJ();
    }
    // Balls.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 16 || (exist(weapons) && HitAble(weapons[0], 60) &&
        state(enemies[0]) != 13)) && (RangeX(enemies[0], -70, -30) || RangeX(enemies[0], 30, 70)) &&
      Math.abs(dz(enemies[0])) <= 20 && self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 100 &&
      !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Down punch.
    if ((RangeX(enemies[0], -200, -100) || RangeX(enemies[0], 100, 200)) &&
      Math.abs(dz(enemies[0])) >= 20 && Math.abs(dz(enemies[0])) <= 30 &&
      state(enemies[0]) != 12 && state(enemies[0]) != 13 && blink(enemies[0]) == 0 && self.mp >= 150 &&
      !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    // Ice sword.
    if (frequency() <= 1 && !AbsRange(enemies[0], 350, 70) &&
      !(self.weapon_held != -1 && getId(self.weapon_held) == 213) &&
      self.state <= 1 && self.mp >= 150 && self.blink == 0 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdJ();
    }
  }

  // Special direction.
  if (RangeSF(235, 252)) {
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

  // Combo - freezeing dash attack.
  if (frequency() <= 3 && (state(enemies[0]) == 12 || state(enemies[0]) == 13) && dy(enemies[0]) <= -20) {
    WarningAndSpecialMove[1] = true;
    if (!(self.weapon_held != -1 && getId(self.weapon_held) == 213)) {
      if (vy(enemies[0]) >= 6) {
        dash_to(enemies[0]);
      } else {
        if (vx(enemies[0]) >= 0) {
          left(1, 1);
        } else {
          right(1, 1);
        }
      }
    } else if (AbsRange(enemies[0], 100, 14)) {
      if (infront(enemies[0])) {
        turn();
      } else {
        left(0, 0);
        right(0, 0);
      }
      if (!infront(enemies[0])) {
        J();
      }
      if (self.frame == 212) {
        A();
      }
      if (frequency() <= 3 && self.state == 4 && state(enemies[0]) == 12) {
        if (dx(enemies[0]) < 0) {
          left(1, 0);
        } else {
          right(1, 0);
        }
        A();
      }
    }
  }
}