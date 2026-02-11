// Sauce's Jan AI.
include("functions.js");
include("moves.js");

function ego() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();

  let WarningAndSpecialMove = [false, false];

  // Check teammate.
  let heal = false;
  for (let i = 0; i < 400; i++) {
    loadTarget(i);
    if (game.exists[i] && type(i) == 0 && self.team == team(i) &&
      game.objects[i].hp > 0 && target.dark_hp - target.hp >= 100) {
      heal = true;
      break;
    }
  }

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
    // Heal.
    if (heal && !AbsRange(enemies[0], 250, 60) &&
      self.state <= 1 && self.mp >= 200 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuJ();
    }
    // Judgement.
    if (AbsRange(enemies[0], 250, 60) && !AbsRange(enemies[0], 300, 40) &&
      self.state <= 1 && self.mp >= 150 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      DuA();
    }
  }

  return 0;
}