// Sauce's Template AI for trainning.
include("functions.js");
include("moves.js");

function id() {
  // Defining variables.
  const [enemies, balls, drinks, weapons, FlyingWeapons, etc] = detection();
  
  let WarningAndSpecialMove = [false, false];

  // Arguments for train_basic_move:
  // punch melee, walk and run melee,
  // MaxReboundX, MinX, MaxX, MinZ, MaxZ, DashX, DashZ,
  // All the detected objects.
  WarningAndSpecialMove = train_basic_move(
    true, true,
    110, 3, 11, 3, 11, 180, 30,
    etc, enemies, balls, weapons, FlyingWeapons, WarningAndSpecialMove
  );
}