// Sauce's LouisEX AI.
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
    true, true, true, true,
    130, 3, 10, 3, 14, 180, 30,
    false, true, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Skills.
  if (frequency() <= 2 && exist(enemies)) {
    // Up spear.
    if (((exist(weapons) && HitAble(weapons[0], 60)) || state(enemies[0]) == 8) &&
      HitAble(enemies[0], 242) && blink(enemies[0]) == 0 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DdA();
    }
    // Air push.
    if ((RangeX(enemies[0], -210, -120) || RangeX(enemies[0], 120, 210)) && (self.state <= 1 || self.state == 9) &&
      Math.abs(dz(enemies[0])) <= 16 &&
      self.mp >= 100 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
      if (self.frame == 263) {
        A();
      }
    }
  }
}