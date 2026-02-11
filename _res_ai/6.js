// Sauce's Louis AI.
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
    true, true, true, true, 170, 3, 8, 6, 14, 90, 30,
    false, true, false,
    etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove
  );

  // Transform.
  if (self.hp <= self.max_hp / 3 && (!AbsRange(enemies[0], 250, 60) || WarningAndSpecialMove[0]) && mode == 1) {
    DJA();
  }

  // Pick up weapon.
  if (exist(weapons)) {
    for (let i = 0; i < weapons.length; i++) {
      if (HitAble(weapons[i], 60) && self.state <= 1 && self.weapon_type == 0) {
        A();
      }
      break;
    }
  }

  // Counter running attack or fake falling.
  if (frequency() <= 2 && Math.abs(dx(enemies[0])) <= 80 && Math.abs(dz(enemies[0])) <= 16 &&
    self.mp >= 50 &&
    !WarningAndSpecialMove[0]) {
    if (HitArmour && self.state == 2) {
      if (!IsFacing(enemies[0])) {
        A();
      } else {
        J();
      }
    }
  }

  // Skills.
  if (frequency() <= 2) {
    // Blastpush.
    if (AbsRange(enemies[0], 350, 14) && Math.abs(dx(enemies[0])) >= 300 &&
      self.state <= 1 && self.mp >= 150 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      if (dx(enemies[0]) < 0) {
        DlA();
      } else {
        DrA();
      }
    }
    // C-throw.
    if (infront(enemies[0]) && (state(enemies[0]) == 8 || (HitArmour && Math.abs(dy(enemies[0])) <= 20 && fall(enemies[0]) == 0)) &&
      AbsRange(enemies[0], 60, 16) && state(enemies[0]) != 14 && blink(enemies[0]) == 0 &&
      (self.state <= 1 || self.state == 7) && self.fall == 0 && self.mp >= 75) {
      DuJ();
    }
    if (RangeSF(121, 123) && self.mp >= 75) {
      J();
    }
    if (RangeSF(261, 270) && self.mp >= 250) {
      J();
    }
    // 1000foot.
    if (((HitArmour && !IsFacing(enemies[0])) || state(enemies[0]) == 8 || state(enemies[0]) == 16) &&
      Math.abs(dx(enemies[0])) >= 60 && Math.abs(dx(enemies[0])) <= 120 && Math.abs(dz(enemies[0])) <= 16 &&
      state(enemies[0]) != 14 && blink(enemies[0]) == 0 && self.fall == 0) {
      if (dx(enemies[0]) <= 0) {
        DlJ();
      } else {
        DrJ();
      }
    }
    // Prevent enemy rowing.
    if (RangeTF(enemies[0], 100, 109) && dy(enemies[0]) <= 40 && Math.abs(dz(enemies[0])) <= 16 &&
      self.state <= 1 && blink(enemies[0]) == 0) {
      if (Math.abs(dx(enemies[0])) >= 100 && Math.abs(dx(enemies[0])) <= 120 && Math.abs(dy(enemies[0])) <= 30) {
        if (dx(enemies[0]) <= 0) {
          DlJ();
        } else {
          DrJ();
        }
      } else if (Math.abs(dx(enemies[0])) >= 50 && Math.abs(dx(enemies[0])) <= 100 && Math.abs(dy(enemies[0])) <= 20) {
        if (dx(enemies[0]) <= 0) {
          DlJ();
        } else if (dx(enemies[0]) <= 0) { // Note: Original code has a duplicate condition here.
          DrJ();
        }
      } else if (Math.abs(dx(enemies[0])) <= 50 && Math.abs(dy(enemies[0])) <= 20) {
        if (!IsFacing(enemies[0])) {
          turn();
        }
        A();
      }
    }
  }
}