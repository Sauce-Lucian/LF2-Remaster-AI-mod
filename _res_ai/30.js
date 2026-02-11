// Sauce's Bandit AI.
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
    3, 11, 3, 11, 180, 20,
    false,
    enemies, balls, FlyingWeapons, WarningAndSpecialMove
  );

  return 0;
}