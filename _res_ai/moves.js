// Use a constructor function to store command variables,
// providing data for subsequent command.
class commands {
  constructor() {
    this.come = false;
    this.stay = false;
    this.commander = -1;
    this.ComeX = 0;
    this.ComeZ = 0;
  }
}

// Initialize an array of 400 command objects.
const command = Array.from({
  length: 400
}, () => new commands());

// ====Movement====

// The following three functions are the main functions,
// which receive parameters passed from the character profile and execute all instructions in order.
// The instructions will return WarningAndSpecialMove variable for the next instruction to make judgments.

// The id basic move crafted for the main character,it executes all instructions and represents the most advanced AI.
function id_basic_move(melee, melee2, melee3, melee4, MaxReboundx, MinX, MaxX, MinZ, MaxZ, DashX, DashZ, need, need2, need3, etc, enemies, balls, drinks, weapons, FlyingWeapons, WarningAndSpecialMove) {
  //print(enemies, balls, drinks, weapons, FlyingWeapons);
  clear_all_keys();
  moving_heavy(balls, weapons);
  stage_check();
  jump_up(enemies);
  WarningAndSpecialMove = get_command(etc, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = dodge_or_rebound_balls(MaxReboundx, balls, WarningAndSpecialMove);
  WarningAndSpecialMove = dodge_flying_weapons(FlyingWeapons, WarningAndSpecialMove);
  WarningAndSpecialMove = dodge_attack(enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = defense(enemies, FlyingWeapons, balls, WarningAndSpecialMove);
  WarningAndSpecialMove = drink(enemies, drinks, WarningAndSpecialMove);
  WarningAndSpecialMove = throwing_weapon(enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = get_from_to_enemy(enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = punch(melee, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = grab(enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = dash_attack(MinX, MaxX, MinZ, MaxZ, DashX, DashZ, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = second_type_of_dash_attack(need, melee2, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = run_attack(need2, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = jump_attack(need3, melee3, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = walking_and_running(melee4, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = countermeasure(melee, enemies, balls, WarningAndSpecialMove);
  return WarningAndSpecialMove;
}

// The ego basic move crafted for the minions,it executes some instructions and represents the improved from the base AI.
function ego_basic_move(melee, melee2, MinX, MaxX, MinZ, MaxZ, DashX, DashZ, need, enemies, balls, FlyingWeapons, WarningAndSpecialMove) {
  //print(enemies, balls, drinks, weapons, FlyingWeapons);
  jump_up(enemies);
  WarningAndSpecialMove = dodge_attack(enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = defense(enemies, FlyingWeapons, balls, WarningAndSpecialMove);
  WarningAndSpecialMove = punch(melee, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = dash_attack(MinX, MaxX, MinZ, MaxZ, DashX, DashZ, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = second_type_of_dash_attack(need, melee2, enemies, WarningAndSpecialMove);
  WarningAndSpecialMove = countermeasure(melee, enemies, balls, WarningAndSpecialMove);
}

// The train basic move crafted for the Template,it executes instructions when the player gives a command and for training.
function train_basic_move(melee, melee4, MaxReboundx, MinX, MaxX, MinZ, MaxZ, DashX, DashZ, etc, enemies, balls, weapons, FlyingWeapons, WarningAndSpecialMove) {
  //print(enemies, balls, weapons, FlyingWeapons);
  clear_all_keys();
  moving_heavy(balls, weapons);
  stage_check();
  WarningAndSpecialMove = trainning_command(melee, melee4, MaxReboundx, MinX, MaxX, MinZ, MaxZ, DashX, DashZ, etc, enemies, balls, weapons, FlyingWeapons, WarningAndSpecialMove);
  console.log(FlyingWeapons);
  return WarningAndSpecialMove;
}

function clear_all_keys() {
  left(0, 0);
  right(0, 0);
  up(0, 0);
  down(0, 0);
  D(0, 0);
  J(0, 0);
  A(0, 0);
}

// Press A to pick up heavy weapons or break icicles when self get stuck.
function moving_heavy(balls, weapons) {
  if (frequency() <= 4 && (exist(weapons) || exist(balls)) && stuck()) {
    for (let i = 0; i < weapons.length; i++) {
      if (AbsRange(weapons[i], 80, 30)) A();
    }
    for (let i = 0; i < balls.length; i++) {
      if (AbsRange(balls[i], 80, 30)) A();
    }
  }
}

// Run when stage clear but not all clear.
function stage_check() {
  if (stage_clear && (current_stage - 4) % 10 != 0) {
    right(1, 0);
  }
}

// Flip up when about to be hited.
function jump_up(enemies) {
  if (frequency() <= 2 && exist(enemies)) {
    if (GoingToBeHited(enemies[0]) && self.state == 12) {
      J();
    }
  }
}

// Listen to command.
// using commands array's data.
// Come:Come to the etc.
// Stay:Stay in place until enemy coming.
// Move:Clear above command.
function get_command(etc, enemies, WarningAndSpecialMove) {
  // If self is an enemy on the stage,
  // or the one who issued the command has died,
  // or when the stage is cleared,
  // the command will be cleared.
  if (self.team == 5 ||
    (command[self.num].commander != -1 && game.objects[command[self.num].commander].hp <= 0) ||
    stage_clear ||
    elapsed_time <= 1) {
    command[self.num].commander = -1;
    command[self.num].come = false;
    command[self.num].stay = false;
  }

  // If there is a commander,set ComeX and ComeZ as the position of the command,
  // then determine the type of command and set the corresponding boolean.
  if (etc != -1) {
    for (let i = 0; i <= 7; i++) {
      if (team(i) == self.team && i != self.num && dx(etc) == dx(i) && dz(etc) == dz(i)) {
        command[self.num].commander = i;
      }
    }
    if (command[self.num].commander != -1) {
      if (frame(etc) == 0) {
        command[self.num].come = true;
        command[self.num].ComeX = game.objects[etc].x;
        command[self.num].ComeZ = game.objects[etc].z;
      } else if (frame(etc) == 2) {
        command[self.num].stay = true;
      } else if (frame(etc) == 4) {
        command[self.num].stay = false;
      }
    }
  }

  // If the command is "Come" and the enemy is not nearby,come to the command's position.
  if (command[self.num].come) {
    if ((exist(enemies) && !AbsRange(enemies[0], 180, 40)) || !WarningAndSpecialMove[1]) {
      WarningAndSpecialMove[1] = true;
      command[self.num].come = come_to(command[self.num].ComeX, command[self.num].ComeZ, command[self.num].come);
    }
  } else if (command[self.num].stay) { // else if the command is "Stay" and the enemy is not nearby,clear arrow.
    if (exist(enemies) && !AbsRange(enemies[0], 200, 50)) {
      WarningAndSpecialMove[1] = true;
      clear_arrow();
    }
    if (self.state == 2) {
      turn();
    }
  }
  return WarningAndSpecialMove;
}

// Training commands,determine the number of instructions to be executed through commands.
function trainning_command(melee, melee4, MaxReboundx, MinX, MaxX, MinZ, MaxZ, DashX, DashZ, etc, enemies, balls, weapons, FlyingWeapons, WarningAndSpecialMove) {
  if (stage_clear || elapsed_time <= 1) {
    command[self.num].commander = -1;
    command[self.num].come = false;
    command[self.num].stay = true;
  }

  if (etc != -1) {
    for (let i = 0; i <= 7; i++) {
      if (i != self.num && dx(etc) == dx(i) && dz(etc) == dz(i)) {
        command[self.num].commander = i;
      }
    }
    if (command[self.num].commander != -1) {
      if (frame(etc) == 0) {
        command[self.num].come = !command[self.num].come;
      } else if (frame(etc) == 2) {
        command[self.num].stay = true;
      } else if (frame(etc) == 4) {
        command[self.num].stay = false;
      }
    }
  }

  // If player give the command to stay,won't make any move.
  if (command[self.num].stay) {
    WarningAndSpecialMove[1] = true;
    clear_all_keys();
    if (self.state == 2) {
      turn();
    }
  } else { // otherwise, the attack instructions will be activated.
    WarningAndSpecialMove = throwing_weapon(enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = get_from_to_enemy(enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = punch(melee, enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = grab(enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = dash_attack(MinX, MaxX, MinZ, MaxZ, DashX, DashZ, enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = walking_and_running(melee4, enemies, WarningAndSpecialMove);
  }
  if (command[self.num].come) { // If player give the command to come,it can switch on/off dodging and defending.
    jump_up(enemies);
    WarningAndSpecialMove = dodge_or_rebound_balls(MaxReboundx, balls, WarningAndSpecialMove);
    WarningAndSpecialMove = dodge_flying_weapons(FlyingWeapons, WarningAndSpecialMove);
    WarningAndSpecialMove = dodge_attack(enemies, WarningAndSpecialMove);
    WarningAndSpecialMove = defense(enemies, FlyingWeapons, balls, WarningAndSpecialMove);
    WarningAndSpecialMove = countermeasure(melee, enemies, balls, WarningAndSpecialMove);
  }
  return WarningAndSpecialMove;
}

// Dodge or rebound all balls that state 3000,3005,3006,keep away from them when there are too many.
function dodge_or_rebound_balls(MaxReboundx, balls, WarningAndSpecialMove) {
  if (frequency() <= 3 && exist(balls)) {
    if (AbsRange(balls[0], 300, 30) &&
      dx(balls[0]) * vx(balls[0]) < 0 && [3000, 3005, 3006].includes(state(balls[0]))) {
      WarningAndSpecialMove[0] = true;
      dodge(balls[0], 16);
      if (vx(balls[0]) != 0) {
        if ((self.state <= 2 || self.state == 5) && AbsRange(balls[0], MaxReboundx, 16) &&
          Math.abs(dx(balls[0])) >= 100 && state(balls[0]) == 3000) {
          if (!infront(balls[0]) && !WarningAndSpecialMove[1]) {
            turn();
          }
          A();
        }
      }
    }
    if (balls.length >= 3 && AbsRange(balls[0], 300, 40) && vx(balls[0]) != 0) {
      WarningAndSpecialMove[0] = true;
      WarningAndSpecialMove[1] = true;
      if (Math.abs(dz(balls[0])) >= 30) {
        dodge(balls[1], 30);
      } else {
        get_far_from(balls[1], 300, 40);
      }
    }
    // Dodge,defense shield or dodge flame and whirlwind.
    if (AbsRange(balls[0], 300, 40) && getId(balls[0]) == 200 && RangeTF(balls[0], 60, 65) && infront(balls[0])) {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      if (self.state == 2) {
        turn();
      }
      dodge(balls[0], 30);
      if (AbsRange(balls[0], 45, 18)) {
        D();
      }
    } else if (AbsRange(balls[0], 70, 40) &&
      (getId(balls[0]) == 211 || (getId(balls[0]) == 212 && RangeTF(balls[0], 150, 170)))) {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      dodge(balls[0], 30);
    }
  }
  return WarningAndSpecialMove;
}

// Dodge all flying weapons.
function dodge_flying_weapons(FlyingWeapons, WarningAndSpecialMove) {
  if (frequency() <= 3 && exist(FlyingWeapons) && self.blink == 0) {
    if (dx(FlyingWeapons[0]) * vx(FlyingWeapons[0]) < 0) {
      if (AbsRange(FlyingWeapons[0], 180, 30)) {
        WarningAndSpecialMove[1] = true;
        WarningAndSpecialMove[0] = true;
        dodge(FlyingWeapons[0], 16);
      }
    }
  }
  return WarningAndSpecialMove;
}

function dodge_attack(enemies, WarningAndSpecialMove) {
  if (frequency() <= 3 && exist(enemies) && self.blink == 0) {
    const HitArmour = self.bdefend > 0 && self.fall == 0;

    // Dodge running attack.
    if (AbsRange(enemies[0], 250, 30) && RangeTF(enemies[0], 85, 89)) {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      dodge(enemies[0], 16);
    }

    // Dodge dash attack.
    if (AbsRange(enemies[0], 250, 40) && Math.abs(dy(enemies[0])) > 0 &&
      (state(enemies[0]) == 5 || RangeTF(enemies[0], 40, 44) || RangeTF(enemies[0], 90, 94))) {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      if (frequency() <= 2 &&
        (state(enemies[0]) == 5 ||
          RangeTF(enemies[0], 40, 44) ||
          RangeTF(enemies[0], 90, 94))) {
        if (dx(enemies[0]) <= 0) {
          left(1, 0);
        } else {
          right(1, 0);
        }
      }
      if ([6, 37, 52].includes(self.id)) {
        if (self.fall > 0) // When self get HitArmour.
          dodge(enemies[0], 20);
      } else {
        dodge(enemies[0], 20);
      }
    }

    // Dodge jump attack.
    if (AbsRange(enemies[0], 80, 40) &&
      (Math.abs(dy(enemies[0])) >= 20 ||
        (getId(enemies[0]) == 1 && state(enemies[0]) == 4)) &&
      !GoingToBeHited(enemies[0]) &&
      (state(enemies[0]) == 3 || state(enemies[0]) == 4) &&
      getId(enemies[0]) != 4) {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      dodge_jump_attack(enemies[0]);
    }
  }
  return WarningAndSpecialMove;
}

// Defend against any attack.
function defense(enemies, balls, FlyingWeapons, WarningAndSpecialMove) {
  if (frequency() <= 4 &&
    (exist(enemies) && GoingToBeHited(enemies[0]) ||
      (coming(enemies) && GoingToBeHited(enemies[1])) ||
      (exist(balls) && GoingToBeHited(balls[0])) ||
      (exist(FlyingWeapons) && GoingToBeHited(FlyingWeapons[0]))) && self.blink == 0) {
    if ([6, 37, 52].includes(self.id)) { // When self get HitArmour.
      const HitArmour = self.bdefend > 0 && self.fall == 0;
      if ((HitArmour && arest(enemies[0]) == 0) || self.fall > 0) {
        WarningAndSpecialMove[1] = true;
        WarningAndSpecialMove[0] = true;
        if (!IsFacing(enemies[0])) {
          turn();
        }
        D();
      }
    } else {
      WarningAndSpecialMove[1] = true;
      WarningAndSpecialMove[0] = true;
      if (!IsFacing(enemies[0])) {
        turn();
      }
      D();
    }
  }
  return WarningAndSpecialMove;
}

// Check if there is milk or beer on the field,and choose one based on self's situation,
// then run over to pick it up and drink it.
function drink(enemies, drinks, WarningAndSpecialMove) {
  if (frequency() <= 3 && exist(drinks) &&
    self.team == 1 &&
    !WarningAndSpecialMove[0] && !WarningAndSpecialMove[1] &&
    mode == 1) {
    let milk = -1;
    let beer = -1;
    let choice = -1;
    // Choose milk or beer.
    for (let i = 0; i < drinks.length; i++) {
      if (getId(drinks[i]) == 122) {
        milk = i;
        break;
      }
    }
    for (let i = 0; i < drinks.length; i++) {
      if (getId(drinks[i]) == 123) {
        beer = i;
        break;
      }
    }

    if (self.hp <= self.max_hp / 2 && self.weapon_type == 0 && milk != -1) {
      choice = milk;
    } else if (self.hp >= self.max_hp / 5 * 4 && self.mp <= 150 && self.weapon_type == 0 && beer != -1) {
      choice = beer;
    }
    // Run to drink and pick it.
    if (choice != -1 && game.objects[drinks[choice]].x <= stage_bound) {
      WarningAndSpecialMove[1] = true;
      go_to(drinks[choice], 20);
      if (AbsRange(drinks[choice], 20, 16)) {
        A();
      }
    }
  }

  // Drinking.
  if (self.weapon_type == 6 && (self.hp <= self.max_hp / 2 || self.mp <= 150) &&
    self.state <= 2 && mode == 1 && self.team == 1 &&
    !((AbsRange(enemies[0], 200, 50) || WarningAndSpecialMove[0]) && self.blink == 0)) {
    A();
  }

  // If there is enemy nearby,stop drinking.
  if ((RangeSF(55, 58) && (AbsRange(enemies[0], 200, 50) || WarningAndSpecialMove[0]) && self.blink == 0)) {
    D();
  }
  return WarningAndSpecialMove;
}

// Throw a weapon when there is no one nearby,
// when self's hand is not holding an ice sword or a drink,
// and when self is not Louis.
function throwing_weapon(enemies, WarningAndSpecialMove) {
  if (frequency() <= 4 && exist(enemies) &&
    (!AbsRange(enemies[0], 100, 40) || self.weapon_type == 2 || self.weapon_type == 6) &&
    self.weapon_type != 0 && !(self.id == 6 && self.weapon_type == 1) &&
    !(self.id != 4 && self.weapon_held != -1 && getId(self.weapon_held) == 213) &&
    !(self.weapon_type == 6 && (self.hp <= self.max_hp / 2 || self.mp <= 150) &&
      self.team == 1 && mode == 1)) {
    WarningAndSpecialMove[1] = true;
    if (dx(enemies[0]) <= 0) {
      left(1, 0);
    } else {
      right(1, 0);
    }
    if (self.state == 2) {
      A();
    }
  }
  return WarningAndSpecialMove;
}

function get_from_to_enemy(enemies, WarningAndSpecialMove) {
  if (frequency() <= 2 && exist(enemies)) {
    // When the second enemy approaches and is not a minion,
    // or when the enemy is not a ranged unit or minion and is lying,
    // or self is holding a drink and the enemy approaches, get far away.
    if (self.state <= 2 && fall(enemies[0]) == 0 &&
      ((self.blink <= 14 && coming(enemies) && !RangeTF(enemies[0], 55, 58)) ||
        (state(enemies[0]) == 14 && !coming(enemies) &&
          !([30, 31, 32, 33, 34, 35, 36, 37, 38, 39].includes(getId(enemies[0])) &&
            (mode == 1 || mode == 4) && (self.team == 1 || self.team == 2)) &&
          getId(enemies[0]) != 4 && getId(enemies[0]) != 5) || (blink(enemies[0]) != 0 &&
          self.blink == 0 && !RangeTF(enemies[0], 55, 58) && getId(enemies[0]) != 4 && getId(enemies[0]) != 5) ||
        (self.weapon_type == 6 && (self.hp <= self.max_hp / 2 || self.mp <= 150) && mode == 1))) {
      WarningAndSpecialMove[0] = true;
      WarningAndSpecialMove[1] = true;
      get_far_from(enemies[0], 200, 50);
    }
    // Approach to the enemy while they are drinking.
    if (Math.abs(dx(enemies[0])) >= 150 && RangeTF(enemies[0], 55, 58)) {
      WarningAndSpecialMove[1] = true;
      get_close_to(enemies[0]);
    }
  }
  return WarningAndSpecialMove;
}

// The punch uses too many conditional statements,which need to be carefully studied.
// Most of them involve character-based discussions and countermeasures.
function punch(melee, enemies, WarningAndSpecialMove) {
  if (exist(enemies)) {
    if (melee) {
      if (self.id != 6) { // Self is not Louis.
        if (frequency() <= 2 && AbsRange(enemies[0], 60, 25)) {
          if (self.state <= 1 && !(self.fall > 10 && (fall(enemies[0]) == 0 || bdefend(enemies[0]) == 0)) &&
            !(state(enemies[0]) == 7 && fall(enemies[0]) == 0 && [1, 9, 10, 11].includes(getId(enemies[0]))) &&
            !([1, 2, 7, 8, 9, 11, 52].includes(self.id) && state(enemies[0]) == 8 && self.mp >= 100) &&
            state(enemies[0]) != 13 && state(enemies[0]) != 14 && state(enemies[0]) != 16 &&
            blink(enemies[0]) == 0 &&
            !WarningAndSpecialMove[0] && !WarningAndSpecialMove[1] &&
            !(coming(enemies) && !RangeTF(enemies[0], 55, 58) && fall(enemies[0]) == 0 && self.blink == 0)) {
            if (!infront(enemies[0]) || (AbsRange(enemies[0], 10, 16) && IsFacing(enemies[0]))) {
              turn();
            }
            A();
          }
          if (RangeTF(enemies[0], 110, 111) && fall(enemies[0]) == 0 && bdefend(enemies[0]) > 0 && [1, 9, 10, 11].includes(getId(enemies[0]))) {
            WarningAndSpecialMove[0] = true;
            dodge(enemies[0], 16);
          }
        }
      } else { // Self is Louis.
        const HitArmour = self.bdefend > 0 && self.state != 7 && self.state != 8 && self.fall == 0;
        if (HitAble(enemies[0], 61) && self.fall <= 10 &&
          state(enemies[0]) != 13 && state(enemies[0]) != 14 && state(enemies[0]) != 16 &&
          blink(enemies[0]) == 0) {
          if (frequency() >= 3 && HitAble(enemies[0], 61) &&
            !(state(enemies[0]) == 7 && [1, 9, 10, 11].includes(getId(enemies[0]))) &&
            !(RangeTF(enemies[0], 20, 29) || RangeTF(enemies[0], 30, 39) || (RangeTF(enemies[0], 60, 94) &&
              getId(enemies[0]) != 4 && getId(enemies[0]) != 5 && getId(enemies[0]) != 31)) &&
            !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0] &&
            !(coming(enemies) && !RangeTF(enemies[0], 55, 58))) {
            if (!infront(enemies[0]) || (AbsRange(enemies[0], 10, 16) && IsFacing(enemies[0]))) {
              turn();
            }
            A();
          }
          if (frequency() <= 3 && (HitArmour || fall(enemies[0]) > 0) &&
            !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0] &&
            !(coming(enemies) && !RangeTF(enemies[0], 55, 58) &&
              self.blink == 0)) {
            if (!infront(enemies[0]) || (AbsRange(enemies[0], 10, 16) && IsFacing(enemies[0]))) {
              turn();
            }
            A();
          }
        }
        if (frequency() <= 3 && RangeTF(enemies[0], 110, 111) && fall(enemies[0]) == 0 && bdefend(enemies[0]) > 0 && [1, 9, 10, 11].includes(getId(enemies[0]))) {
          dodge(enemies[0], 20);
        }
      }
    } else { // Self is ranger.
      if (self.id == 5) { // Self is Rudolf.
        if (frequency() <= 2 && AbsRange(enemies[0], 250, 30) &&
          (self.state <= 1 || self.frame == 63 || self.frame == 67) &&
          (Math.abs(dx(enemies[0])) >= 70 || (Math.abs(dx(enemies[0])) >= 50 && (fall(enemies[0]) >= 10 || bdefend(enemies[0]) >= 10))) &&
          Math.abs(dy(enemies[0])) <= 40 && self.fall <= 10 &&
          state(enemies[0]) != 12 && state(enemies[0]) != 13 && state(enemies[0]) != 14 && state(enemies[0]) != 16 &&
          blink(enemies[0]) == 0 && self.mp >= 45 && self.weapon_type == 0 &&
          !WarningAndSpecialMove[0] &&
          !(coming(enemies) && !RangeTF(enemies[0], 55, 58) && self.blink == 0)) {
          WarningAndSpecialMove[1] = true;
          if (!infront(enemies[0])) {
            turn();
          }
          A();
        }
        if (frequency() <= 3 && fall(enemies[0]) <= 40 &&
          Math.abs(dx(enemies[0])) >= 70 && Math.abs(dx(enemies[0])) <= 120 &&
          self.state <= 1 && state(enemies[0]) == 16 && self.mp >= 15 && self.weapon_type == 0 &&
          !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
          WarningAndSpecialMove[1] = true;
          if (!infront(enemies[0])) {
            turn();
          }
          A();
        }
      } else { // Self is Henry or Hunter.
        if (frequency() <= 2 && AbsRange(enemies[0], 600, 40) &&
          Math.abs(dx(enemies[0])) >= 180 && Math.abs(dy(enemies[0])) <= 40 &&
          self.state <= 1 && self.fall <= 10 &&
          state(enemies[0]) != 13 && state(enemies[0]) != 14 && self.weapon_type == 0 &&
          !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0] &&
          !(coming(enemies) && !RangeTF(enemies[0], 55, 58) && self.blink == 0)) {
          WarningAndSpecialMove[1] = true;
          if (!infront(enemies[0])) {
            turn();
          }
          A();
        }
        if (state(enemies[0]) == 8 && self.state <= 1 && AbsRange(enemies[0], 60, 16)) {
          WarningAndSpecialMove[1] = true;
          if (!infront(enemies[0])) {
            turn();
          }
          A();
        }
      }
    }
  }
  return WarningAndSpecialMove;
}

// When the enemy is stunned,walk over and grab them.
// Hit target four times and then throw them away normally.
function grab(enemies, WarningAndSpecialMove) {
  if (frequency() <= 4 && exist(enemies)) {
    //Grab.
    if (state(enemies[0]) == 16 && AbsRange(enemies[0], 170, 30) &&
      !(((self.id == 8 || self.id == 52) && self.mp >= 100) || (self.id == 51 && self.mp >= 250))) {
      WarningAndSpecialMove[1] = true;
      if (dx(enemies[0]) <= -10) {
        left(1, 1);
      } else if (dx(enemies[0]) >= 10) {
        right(1, 1);
      } else {
        if (self.x >= stage_bound / 2) {
          left(1, 1);
        } else {
          right(1, 1);
        }
      }
      if (dz(enemies[0]) <= -16) {
        up(1, 1);
      } else if (dz(enemies[0]) >= 16) {
        down(1, 1);
      }
    }
    //Grabbing.
    if (frequency() <= 3 && (RangeSF(121, 123) || RangeSF(232, 234))) {
      WarningAndSpecialMove[1] = true;
      if (![6, 10, 11, 38].includes(self.id) &&
        ((self.ctimer <= 60 && self.hp > 30) ||
          (coming(enemies) && self.blink == 0))) {
        if (self.x >= bg_width / 2) {
          left(1, 1);
        } else {
          right(1, 1);
        }
      } else {
        left(0, 0);
        right(0, 0);
      }
      A();
    }
  }
  return WarningAndSpecialMove;
}

// The standard dash receives parameters from the character profile,performs complex calculations.
// Can serve as a template.
function dash_attack(MinX, MaxX, MinZ, MaxZ, DashX, DashZ, enemies, WarningAndSpecialMove) {
  const MinDashX = MinX * self.data.dash_distance;
  const MaxDashX = MaxX * self.data.dash_distance;
  const MinDashZ = MinZ * self.data.dash_distancez;
  const MaxDashZ = MaxZ * self.data.dash_distancez;

  if (exist(enemies)) {
    if (frequency() <= 1 && Math.abs(dx(enemies[0])) >= MinDashX && Math.abs(dx(enemies[0])) <= MaxDashX &&
      ((Math.abs(dz(enemies[0])) >= MinDashZ && Math.abs(dz(enemies[0])) <= MaxDashZ) || Math.abs(dz(enemies[0])) <= 16) &&
      ((dz(enemies[0]) == 0 || Math.abs(dx(enemies[0])) / Math.abs(dz(enemies[0])) >= MinDashX / MinDashZ) ||
        Math.abs(dz(enemies[0])) <= 16) && !(RangeTF(enemies[0], 60, 69) && (RangeX(enemies[0], -150, -MinDashX) ||
        RangeX(enemies[0], MinDashX, 150))) &&
      !(state(enemies[0]) == 16 && AbsRange(enemies[0], 150, 30)) &&
      blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      dash_to(enemies[0]);
    }
    // Dash to frozen enemy.
    if (frequency() <= 2 && state(enemies[0]) == 13 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      dash_to(enemies[0]);
    }
    // Attack.
    if (frequency() <= 3 && self.state == 5 && AbsRange(enemies[0], DashX, DashZ) &&
      infront(enemies[0]) && state(enemies[0]) != 14 && blink(enemies[0]) == 0) {
      A();
    }
  }
  return WarningAndSpecialMove;
}

// The second type of dash attack as an attack method for characters that doing reverse dashing.
// Can serve as a template too.
function second_type_of_dash_attack(need, melee, enemies, WarningAndSpecialMove) {
  if (need && exist(enemies)) {
    if (frequency() <= 2 && AbsRange(enemies[0], 130, 60) &&
      Math.abs(dz(enemies[0])) >= 30 &&
      ((!melee && Math.abs(dx(enemies[0])) >= 60) ||
        (melee && Math.abs(dx(enemies[0])) >= 100)) &&
      self.state <= 2 && blink(enemies[0]) == 0 && state(enemies[0]) != 14 &&
      !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
      WarningAndSpecialMove[1] = true;
      if (self.x <= 150 || self.x >= bg_width - 150) {
        random_dash(enemies[0]);
      } else {
        dash_to(enemies[0]);
      }
    }
    if ((melee && self.state == 4 || !melee && self.state == 5) &&
      (AbsRange(enemies[0], 120, 50) && Math.abs(dz(enemies[0])) >= 20) &&
      (melee || (!melee && self.frame != 214))) {
      WarningAndSpecialMove[1] = true;
      turn();
    }
    if (frequency() <= 2 &&
      ((melee && self.frame == 213) ||
        (!melee && [78, 84, 214, 217].includes(self.frame)))) {
      A();
    }
  }
  return WarningAndSpecialMove;
}

// For those characters who need to run attack.
function run_attack(need, enemies, WarningAndSpecialMove) {
  if (need && frequency() <= 2 && exist(enemies) && AbsRange(enemies[0], 100, 25) &&
    Math.abs(dx(enemies[0])) >= 40 &&
    infront(enemies[0]) && state(enemies[0]) != 12 && state(enemies[0]) != 14 &&
    blink(enemies[0]) == 0 && self.state == 2 &&
    !WarningAndSpecialMove[0]) {
    A();
  }
  return WarningAndSpecialMove;
}

// For those characters who need to jump attack.
function jump_attack(need, melee, enemies, WarningAndSpecialMove) {
  if (need && frequency() <= 3 && exist(enemies)) {
    if (((melee && ((self.id == 1 && AbsRange(enemies[0], 80, 30)) ||
            (self.id == 5 && AbsRange(enemies[0], 150, 70))) &&
          Math.abs(dx(enemies[0])) >= 50 && Math.abs(dz(enemies[0])) >= 20) ||
        (!melee && AbsRange(enemies[0], 180, 80) && Math.abs(dx(enemies[0])) >= 150)) &&
      state(enemies[0]) <= 1 && blink(enemies[0]) == 0 && self.state <= 1 && !coming(enemies) &&
      !WarningAndSpecialMove[0] && !WarningAndSpecialMove[1]) {
      J();
    }
    if (self.frame == 212 && (!infront(enemies[0]) || (melee && IsFacing(enemies[0])))) {
      WarningAndSpecialMove[1] = true;
      turn();
    }
    if (((melee && ((self.id == 1 && AbsRange(enemies[0], 80, 25)) ||
        (self.id == 5 && Math.abs(self.y_velocity) <= 1.5 && AbsRange(enemies[0], 150, 60)))) || !melee) &&
      state(enemies[0]) != 14 && blink(enemies[0]) == 0 && [78, 84, 212].includes(self.frame)) {
      A();
    }
  }
  return WarningAndSpecialMove;
}

// Customized walking and running plan has been devised based on the unique circumstances of each character.
function walking_and_running(melee, enemies, WarningAndSpecialMove) {
  if (exist(enemies) && !WarningAndSpecialMove[0] && !WarningAndSpecialMove[1]) {
    if (melee) {
      if (Math.abs(dx(enemies[0])) <= 180 || (self.id == 5 && Math.abs(dx(enemies[0])) <= 300)) { // Walking.
        if (dx(enemies[0]) <= -10 &&
          !(self.id == 5 && dx(enemies[0]) > -100) &&
          !(self.id == 8 && dx(enemies[0]) > -60)) {
          if (frequency() <= 2 && self.state == 2 && state(enemies[0]) <= 1 && !WarningAndSpecialMove[0]) {
            turn();
          }
          left(1, 1);
        } else if (dx(enemies[0]) >= 10 && !(self.id == 5 && dx(enemies[0]) < 100) &&
          !(self.id == 8 && dx(enemies[0]) < 60)) {
          if (frequency() <= 2 && self.state == 2 && state(enemies[0]) <= 1 && !WarningAndSpecialMove[0]) {
            turn();
          }
          right(1, 1);
        }
        if (self.id == 5) { // Rudolf's special rowing.
          if (frequency() <= 2 && AbsRange(enemies[0], 80, 30) &&
            fall(enemies[0]) <= 30 && state(enemies[0]) != 12 && state(enemies[0]) != 14 &&
            !WarningAndSpecialMove[1] && !WarningAndSpecialMove[0]) {
            WarningAndSpecialMove[1] = true;
            if (self.x >= bg_width / 2) {
              left(1, 0);
            } else {
              right(1, 0);
            }
            if (self.state == 2) {
              D();
            }
          }
          if (frequency() <= 3 && AbsRange(enemies[0], 100, 30) &&
            state(enemies[0]) <= 1 &&
            (fall(enemies[0]) == 0 || bdefend(enemies[0]) == 0)) {
            random_dash(enemies[0]);
          }
        }
        if (self.id == 6) { // Louis get far from enemies while hited.
          if (frequency() <= 3 && state(enemies[0]) <= 1 &&
            (fall(enemies[0]) == 0 || bdefend(enemies[0]) == 0) &&
            Math.abs(dz(enemies[0])) <= 30 &&
            (self.bdefend > 0 || self.fall > 0)) {
            get_far_from(enemies[0], 150, 30);
          }
        }
        if (self.id == 8) { // Freeze's walking.
          if ((Math.abs(dx(enemies[0])) <= 30 && Math.abs(dz(enemies[0])) >= 25) ||
            ((state(enemies[0]) == 8 || state(enemies[0]) == 16) &&
              Math.abs(dx(enemies[0])) <= 50 && Math.abs(dz(enemies[0])) <= 20)) {
            if (dx(enemies[0]) >= 0) {
              left(1, 1);
            } else {
              right(1, 1);
            }
          }
        }
      } else { // Running.
        if (dx(enemies[0]) <= 0) {
          left(1, 0);
        } else {
          right(1, 0);
        }
        if (frequency() <= 1 && self.state == 2 && dx(enemies[0]) > 600) { // Dashing.
          J();
        }
      }
      if (Math.abs(dx(enemies[0])) <= 250) {
        if (Math.abs(dz(enemies[0])) <= 20 &&
          (RangeTF(enemies[0], 20, 29) || RangeTF(enemies[0], 35, 39) || (RangeTF(enemies[0], 60, 94) &&
            getId(enemies[0]) != 4 && getId(enemies[0]) != 5))) { // Stop walking while enemy attacking.
          up(0, 0);
          down(0, 0);
        } else if (dz(enemies[0]) <= -16 || self.x == bg_zwidth2) {
          up(1, 1);
        } else if (dz(enemies[0]) >= 16 || self.x == bg_zwidth1) {
          down(1, 1);
        }
      } else if (self.blink == 0) {
        if ((dz(enemies[0]) <= 50 && dz(enemies[0]) >= 0) || self.x == bg_zwidth2) {
          up(1, 1);
        } else if ((dz(enemies[0]) >= -50 && dz(enemies[0]) < 0) || self.x == bg_zwidth1) {
          down(1, 1);
        }
      }
    } else { // Henry's walking.
      if (Math.abs(dx(enemies[0])) >= 400) {
        if (dx(enemies[0]) <= 0) {
          left(1, 1);
        } else {
          right(1, 1);
        }
      } else if (Math.abs(dx(enemies[0])) <= 400 && Math.abs(dx(enemies[0])) >= 150) {
        if (dx(enemies[0]) >= 0) {
          left(1, 1);
        } else {
          right(1, 1);
        }
        if (self.state == 2) {
          J();
        }
      } else {
        random_dash(enemies[0]);
      }
      if (Math.abs(dx(enemies[0])) >= 150) {
        if (Math.abs(dz(enemies[0])) <= 20 && (RangeTF(enemies[0], 20, 29) || RangeTF(enemies[0], 35, 39))) {
          up(0, 0);
          down(0, 0);
        } else if (dz(enemies[0]) <= -16 || self.x == bg_zwidth2) {
          up(1, 1);
        } else if (dz(enemies[0]) >= 16 || self.x == bg_zwidth1) {
          down(1, 1);
        }
      }
    }
  }
  return WarningAndSpecialMove;
}

// Develop countermeasures for each character, with most being flip up to dodging skills.
function countermeasure(melee, enemies, balls, WarningAndSpecialMove) {
  if (frequency() <= 2 && exist(enemies)) {
    switch (game.objects[enemies[0]].data.id) {
      case (1): // Enemy is Deep.
        if (AbsRange(enemies[0], 80, 25) &&
          (RangeTF(enemies[0], 210, 212) || RangeTF(enemies[0], 260, 264) || RangeTF(enemies[0], 277, 280))) {
          dodge(enemies[0], 16);
        }
        if (Math.abs(dz(enemies[0])) <= 16 && blink(enemies[0]) == 0 && RangeTF(enemies[0], 290, 309)) {
          if (self.id == 2) {
            if ((RangeX(enemies[0], -200, -100) || RangeX(enemies[0], 100, 200)) && self.mp >= 100) {
              if (dx(enemies[0]) < 0) {
                DlJ();
              } else {
                DrJ();
              }
            }
          } else if ([4, 6, 50].includes(self.id)) {
            if ((RangeX(enemies[0], -300, -200) || RangeX(enemies[0], 200, 300)) && self.mp >= 150) {
              if (dx(enemies[0]) < 0) {
                DlA();
              } else {
                DrA();
              }
            }
          }
        }
        break;
      case (2): // Enemy is John.
        break;
      case (4): // Enemy is Henry.
        if (self.state == 12 && RangeTF(enemies[0], 237, 239)) {
          J();
        }
        if (frequency() <= 1 && melee) {
          if (self.hp > self.max_hp / 3) {
            if (RangeX(enemies[0], -500, -150) || RangeX(enemies[0], 150, 500)) {
              get_close_to(enemies[0]);
            } else if (Math.abs(dz(enemies[0])) >= 40 && (balls.length && Math.abs(dx(balls[0])) >= 150)) {
              dash_to(enemies[0]);
            }
          }
        }
        if (AbsRange(enemies[0], 400, 16) && frame(enemies[0]) == 239 && self.blink == 0) {
          if (!infront(enemies[0])) {
            turn();
          }
          D();
        }
        if (RangeTF(enemies[0], 250, 255) && AbsRange(enemies[0], 400, 80) && self.blink == 0) {
          WarningAndSpecialMove[1] = true;
          WarningAndSpecialMove[0] = true;
          if (self.state == 2 && !self.facing) {
            left(1, 0);
          } else if (self.state == 2 && self.facing) {
            right(1, 0);
          }
          if (AbsRange(enemies[0], 210, 80)) {
            clear_arrow();
          }
        }
        if ((RangeX(enemies[0], -160, -130) || RangeX(enemies[0], 130, 160))) {
          if (([1, 11].includes(self.id)) && (self.state == 7 || RangeSF(102, 107)) && self.mp >= 25) {
            DuJ();
          } else if (([5, 9].includes(self.id)) && self.state == 7) {
            if (dx(enemies[0]) < 0) {
              DlJ();
            } else {
              DrJ();
            }
          }
        }
        break;
      case (5): // Enemy is Rudolf.
        if (self.state == 12 &&
          (RangeTF(enemies[0], 76, 79) || RangeTF(enemies[0], 86, 89) || RangeTF(enemies[0], 90, 94))) {
          J();
        }
        if (frequency() <= 1 && melee) {
          if (self.hp > self.max_hp / 3) {
            if (RangeX(enemies[0], -500, -150) || RangeX(enemies[0], 150, 500)) {
              get_close_to(enemies[0]);
            } else if (Math.abs(dz(enemies[0])) >= 40 && exist(balls) && Math.abs(dx(balls[0])) >= 150) {
              dash_to(enemies[0]);
            }
          }
        }
        if (Math.abs(dz(enemies[0])) < 40 && exist(balls) && Math.abs(dx(balls[0])) >= 150) {
          dodge(enemies[0], 30);
        }
        if ((RangeX(enemies[0], -160, -130) || RangeX(enemies[0], 130, 160))) {
          if (([1, 11].includes(self.id)) && (self.state == 7 || RangeSF(102, 107)) && self.mp >= 25) {
            DuJ();
          } else if (([5, 9].includes(self.id)) && self.state == 7) {
            if (dx(enemies[0]) < 0) {
              DlJ();
            } else {
              DrJ();
            }
          }
        }
        break;
      case (6): // Enemy is Louis.
        if (AbsRange(enemies[0], 400, 16) && frame(enemies[0]) == 239 &&
          (self.state <= 2 || self.state == 6) &&
          self.blink == 0) {
          if (!infront(enemies[0])) {
            turn();
          }
          D();
        }
        break;
      case (7): // Enemy is Firen.
        if (RangeTF(enemies[0], 72, 75) && AbsRange(enemies[0], 60, 16)) {
          WarningAndSpecialMove[1] = true;
          D(0, 0);
          if (AbsRange(enemies[0], 40, 16)) {
            if (!facing(enemies[0])) {
              left(1, 1);
            } else {
              right(1, 1);
            }
          } else if (Math.abs(dz(enemies[0])) >= 12) {
            dodge(enemies[0], 16);
          }
        }
        if (RangeTF(enemies[0], 285, 289) && AbsRange(enemies[0], 60, 50) && self.blink == 0) {
          D();
        }
        if ((RangeTF(enemies[0], 270, 275)) && Math.abs(dx(enemies[0])) >= 40 && AbsRange(enemies[0], 200, 40)) {
          WarningAndSpecialMove[1] = true;
          dodge(enemies[0], 30);
        }
        if (Math.abs(dz(enemies[0])) <= 16 && blink(enemies[0]) == 0 && RangeTF(enemies[0], 255, 261)) {
          if (self.id == 2) {
            if ((RangeX(enemies[0], -200, -100) || RangeX(enemies[0], 100, 200)) && self.mp >= 100) {
              if (dx(enemies[0]) < 0) {
                DlJ();
              } else {
                DrJ();
              }
            }
          } else if ([4, 6, 50].includes(self.id)) {
            if ((RangeX(enemies[0], -300, -200) || RangeX(enemies[0], 200, 300)) && self.mp >= 150) {
              if (dx(enemies[0]) < 0) {
                DlA();
              } else {
                DrA();
              }
            }
          }
        }
        break;
      case (8): // Enemy is Freeze.
        if ((RangeTF(enemies[0], 250, 252) || RangeTF(enemies[0], 260, 268)) &&
          Math.abs(dx(enemies[0])) >= 40 && AbsRange(enemies[0], 250, 30)) {
          WarningAndSpecialMove[1] = true;
          dodge(enemies[0], 30);
        }
        break;
      case (9): // Enemy is Dennis.
        if (AbsRange(enemies[0], 200, 30) &&
          (RangeTF(enemies[0], 282, 287)) || (AbsRange(enemies[0], 80, 25) && RangeTF(enemies[0], 265, 273))) {
          dodge(enemies[0], 16);
        }
        if (Math.abs(dz(enemies[0])) <= 16 && blink(enemies[0]) == 0 && RangeTF(enemies[0], 280, 290)) {
          if (self.id == 2) {
            if ((RangeX(enemies[0], -200, -100) || RangeX(enemies[0], 100, 200)) && self.mp >= 100) {
              if (dx(enemies[0]) < 0) {
                DlJ();
              } else {
                DrJ();
              }
            }
          } else if ([4, 6, 50].includes(self.id)) {
            if ((RangeX(enemies[0], -300, -200) || RangeX(enemies[0], 200, 300)) && self.mp >= 150) {
              if (dx(enemies[0]) < 0) {
                DlA();
              } else {
                DrA();
              }
            }
          }
        }
        break;
      case (10): // Enemy is Woody.
        if (self.state == 12 && (RangeTF(enemies[0], 70, 72)) && AbsRange(enemies[0], 80, 16)) {
          J(1, 0);
        }
        if (AbsRange(enemies[0], 150, 40) && RangeTF(enemies[0], 70, 72)) {
          WarningAndSpecialMove[1] = true;
          if (AbsRange(enemies[0], 80, 25)) {
            dodge(enemies[0], 16);
          }
        }
        break;
      case (11): // Enemy is Davis.
        if (AbsRange(enemies[0], 80, 25) && RangeTF(enemies[0], 270, 280)) {
          dodge(enemies[0], 16);
        }
        if (frame(enemies[0]) == 274) {
          A();
        }
        if (RangeTF(enemies[0], 73, 75) && AbsRange(enemies[0], 60, 16)) {
          J(0, 0);
        }
        if (RangeTF(enemies[0], 277, 280) && AbsRange(enemies[0], 60, 16)) {
          D(0, 0);
        }
        break;
      case (38): // Enemy is Bat.
        if (RangeTF(enemies[0], 260, 264) && AbsRange(enemies[0], 150, 50)) {
          WarningAndSpecialMove[1] = true;
          get_far_from(enemies[0], 150, 50);
        }
        break;
      case (50): // Enemy is LouisEX.
        if (self.state == 12 && RangeTF(enemies[0], 243, 253) && AbsRange(enemies[0], 100, 16)) {
          J(1, 0);
        }
        break;
      case (51): // Enemy is Firzen.
        if (RangeTF(enemies[0], 250, 257) && AbsRange(enemies[0], 300, 80) && bdefend(enemies[0]) == 0) {
          WarningAndSpecialMove[1] = true;
          get_far_from(enemies[0], 300, 80);
        }
        break;
      case (52): // Enemy is Julian.
        if (RangeTF(enemies[0], 310, 317) && AbsRange(enemies[0], 200, 40) && bdefend(enemies[0]) == 0) {
          WarningAndSpecialMove[1] = true;
          get_far_from(enemies[0], 200, 40);
        }
        break;
      default:
        break;
    }
  }
  return WarningAndSpecialMove;
}

// The following functions are basic instructions,which determine the basic actions of self.

function clear_arrow() {
  left(0, 0);
  right(0, 0);
  up(0, 0);
  down(0, 0);
}

function come_to(ComeX, ComeZ, come) {
  if (Math.abs(self.x - ComeX) <= 80 && Math.abs(self.z - ComeZ) <= 20) {
    come = false;
  }
  if (Math.abs(self.x - ComeX) <= 150) {
    if (self.state == 2) {
      turn();
    } else {
      if (self.x - ComeX >= 0) {
        left(1, 1);
      } else {
        right(1, 1);
      }
    }
  } else {
    if (self.x - ComeX >= 0) {
      left(1, 0);
    } else {
      right(1, 0);
    }
  }
  if (self.z - ComeZ >= 16) {
    up(1, 1);
  } else if (self.z - ComeZ <= -16) {
    down(1, 1);
  }
  return come;
}

function go_to(i, x) {
  if (Math.abs(dx(i)) <= 100) {
    if (dx(i) <= -x) {
      if (self.state == 2) {
        turn();
      } else {
        left(1, 1);
      }
    } else if (dx(i) >= x) {
      if (self.state == 2) {
        turn();
      } else {
        right(1, 1);
      }
    }
  } else {
    if (dx(i) <= 0) {
      left(1, 0);
    } else {
      right(1, 0);
    }
  }
  if (dz(i) <= -16) {
    up(1, 1);
  } else if (dz(i) >= 16) {
    down(1, 1);
  }
}

function turn() {
  if (!self.facing) {
    left(1, 0);
  } else {
    right(1, 0);
  }
}

function dodge(i, z) {
  if (self.z >= bg_zwidth2 - 2 * z && Math.abs(dz(i)) <= z) {
    up(1, 1);
  } else if (self.z <= bg_zwidth1 + 2 * z && Math.abs(dz(i)) <= z) {
    down(1, 1);
  } else if (dz(i) >= 0) {
    up(1, 1);
  } else {
    down(1, 1);
  }
  if (AbsRange(i, 120, 20) && (self.state == 2 || self.frame == 215)) {
    D();
  }
}

function dodge_jump_attack(i) {
  if (self.x >= 150 && self.x <= stage_bound - 150) {
    if (dx(i) > 0) {
      left(1, 1);
    } else if (dx(i) < 0) {
      right(1, 1);
    }
  } else {
    if (self.x >= stage_bound - 150) {
      left(1, 1);
    } else {
      right(1, 1);
    }
  }
  if (dz(i) >= 20 && dz(i) <= 80) {
    up(1, 1);
  } else if (dz(i) >= -80 && dz(i) <= -20) {
    down(1, 1);
  } else {
    if (vz(i) >= 0) {
      up(1, 1);
    } else {
      down(1, 1);
    }
  }
}

function get_far_from(i, x, z) {
  if (AbsRange(i, x, z) && self.state != 5) {
    if (self.x >= 150 && self.x <= stage_bound - 150) {
      if (dx(i) > 0) {
        left(1, 0);
      } else if (dx(i) < 0) {
        right(1, 0);
      }
    } else {
      if (self.x >= stage_bound - 150) {
        left(1, 0);
      } else {
        right(1, 0);
      }
    }
    if (self.z >= (bg_zwidth1 + bg_zwidth2) / 2) {
      up(1, 1);
    } else {
      down(1, 1);
    }
    if (state(i) != 5 && (self.state == 2 || self.frame == 215)) {
      J();
    }
  }
}

function get_close_to(i) {
  if (self.z <= bg_zwidth1 + 90 || self.z >= bg_zwidth2 - 90) {
    if (dx(i) <= 0) {
      left(1, 0);
    } else {
      right(1, 0);
    }
    if (self.z >= bg_zwidth2 - 80) {
      up(1, 1);
    } else if (self.z <= bg_zwidth1 + 80) {
      down(1, 1);
    }
    if (state(i) != 5 && (self.state == 2 || self.frame == 215)) {
      J();
    }
  }
}

function dash_to(i) {
  if (dx(i) <= 0) {
    left(1, 0);
  } else {
    right(1, 0);
  }
  if (dz(i) <= -16) {
    up(1, 1);
  } else if (dz(i) >= 16) {
    down(1, 1);
  } else {
    up(0, 0);
    down(0, 0);
  }
  if (state(i) != 5 && (self.state == 2 || self.frame == 215)) {
    J();
  }
}

function random_dash(i) {
  if (self.state != 5) {
    if (self.x >= bg_width - 150) {
      left(1, 0);
    } else if (self.x <= 150) {
      right(1, 0);
    } else {
      if (rand(100) >= 50) {
        left(1, 0);
      } else {
        right(1, 0);
      }
    }
    if (rand(100) >= 50) {
      up(1, 1);
    } else {
      down(1, 1);
    }
    if (state(i) != 5 && (self.state == 2 || self.frame == 215)) {
      J();
    }
  }
}

// Print the target's information.
function print(enemies, balls, drinks, weapons, FlyingWeapons) {
  clr();
  if (exist(enemies)) {
    console.log("Enemy coming!");
    console.log("Distancex:" + dx(enemies[0]));
    console.log("Distancey:" + dy(enemies[0]));
    console.log("Distancez:" + dz(enemies[0]));
    console.log("Enemy id:" + getId(enemies[0]));
    console.log("Enemy state:" + state(enemies[0]));
    console.log("Enemy frame:" + frame(enemies[0]));
    console.log("Enemy frame:" + frame(enemies[0]));
  }
  if (exist(balls)) {
    console.log("Ball coming!");
    console.log("Distancex:" + dx(balls[0]));
    console.log("Distancey:" + dy(balls[0]));
    console.log("Distancez:" + dz(balls[0]));
  }
  if (exist(weapons)) {
    console.log("Weapon coming!");
    console.log("Distancex:" + dx(weapons[0]));
    console.log("Distancey:" + dy(weapons[0]));
    console.log("Distancez:" + dz(weapons[0]));
  }
  if (exist(drinks)) {
    console.log("There's a drink!");
  }
  if (exist(FlyingWeapons)) {
    console.log("Weapon attacking!");
    console.log("Distancex:" + dx(FlyingWeapons[0]));
    console.log("Distancey:" + dy(FlyingWeapons[0]));
    console.log("Distancez:" + dz(FlyingWeapons[0]));
  }
  console.log("Self frame:" + self.frame);
}