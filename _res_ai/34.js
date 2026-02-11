// Sauce's Sorcerer AI.
include("functions.js");
include("moves.js");

function ego() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Arguments for ego_basic_move:
  // punch melee, second type of dash attack melee,
  // MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // second type of dash attack need,
  // All the detected objects.
  ego_basic_move(
    true, true,
    3, 11, 3, 11, 180, 30,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2) {
    // Fire Balls.
    if ((RangeX(enemies[0], -120, -70) || RangeX(enemies[0], 70, 120)) &&
      Math.abs(dz(enemies[0])) <= 20 &&
      self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 75 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // Ice Balls.
    if ((state(enemies[0]) == 8 || state(enemies[0]) == 16 ||
        (exist(weapons) && HitAble(weapons[0], 60) && state(enemies[0]) != 13)) &&
      (RangeX(enemies[0], -70, -30) || RangeX(enemies[0], 30, 70)) &&
      Math.abs(dz(enemies[0])) <= 20 &&
      self.state <= 1 && blink(enemies[0]) == 0 && self.fall == 0 && self.mp >= 125 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    // Heal self.
    if (!AbsRange(enemies[0], 250, 60) && self.state <= 1 && self.dark_hp - self.hp >= 100 && self.mp >= 350 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdJ();
    }
  }

  return 0;
}