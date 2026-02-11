// ====Global variable====

// Uses an constructor to record the previous and current positions of self,
// providing data for subsequent stuck detection.
class XandZ {
  constructor() {
    this.x1 = -100;
    this.x2 = -100;
    this.z1 = -100;
    this.z2 = -100;
  }
}

// Initialize an array of 400 XandZ objects.
const position = Array.from({
  length: 400
}, () => new XandZ());

// ====Basic variables====

// Detect all objects on the field,determine their types,store them in corresponding arrays,
// and sort them according to their distance from self.
function detection() {
  let enemies = [];
  let balls = [];
  let drinks = [];
  let weapons = [];
  let FlyingWeapons = [];
  let etc = -1;

  for (let i = 0; i < 400; i++) {
    if (loadTarget(i) != -1) {
      if (target.id == 998) {
        if (self.id == 0 || (mode == 1 && self.team == 1))
          etc = i;
      } else if ((target.type == 0 || target.id == 300) && target.team != self.team && target.hp > 0 &&
        !(target.id == 52 && RangeTF(target.num, 240, 251))) {
        enemies.push(i);
      } else if (target.type == 3 && target.team != self.team) {
        balls.push(i);
      } else if (target.type == 6 && target.state == 1004) {
        drinks.push(i);
      } else if (target.state == 1004 || target.state == 2004) {
        weapons.push(i);
      } else if (target.team != self.team) {
        FlyingWeapons.push(i);
      }
    }
  }

  // Sort.
  const SortByDistance = (a, b) => (Math.abs(dx(a)) + Math.abs(dz(a))) - (Math.abs(dx(b)) + Math.abs(dz(b)));
  if (exist(enemies))
    enemies.sort(SortByDistance);
  if (exist(balls))
    balls.sort(SortByDistance);
  if (exist(drinks))
    drinks.sort(SortByDistance);
  if (exist(weapons))
    weapons.sort(SortByDistance);
  if (exist(FlyingWeapons))
    FlyingWeapons.sort(SortByDistance);

  return [enemies, balls, drinks, weapons, FlyingWeapons, etc];
}

// Calculate the probability of executing the instruction based on the operation of random numbers and difficulty.
function frequency() {
  const frequency = Array(400).fill(0).map(() => rand(6) + difficulty);
  if (self.team == 5) {
    if (difficulty >= 1)
      frequency[self.num] = rand(6) + 2; //Easy mode as stage mode enemies in Easy and Normal.
    else
      frequency[self.num] = rand(6) + 1; //Normal mode as stage mode enemies in Difficult and CRAZY!.
  }
  if (mode == 1 && self.team == 1)
    frequency[self.num] = rand(6) - 1; //CRAZY! mode as stage teammate.
  if (self.clone != -1)
    frequency[self.num] = rand(6) + 2; //Easy mode as clone.
  return frequency[self.num];
  // Hardly <= 1 / Sometimes <= 2 / Often <= 3 / Always <= 4

  //Difficulty randomly distributed:
  //Easy:      2  3  4  5  6  7
  //Normal:    1  2  3  4  5  6
  //Diffcult:  0  1  2  3  4  5
  //CRAZY!:   -1  0  1  2  3  4
}

function getId(i) {
  return game.objects[i].data.id;
}

function type(i) {
  return game.objects[i].data.type;
}

function team(i) {
  return game.objects[i].team;
}

function frame(i) {
  return game.objects[i].frame1;
}

function state(i) {
  return game.objects[i].data.frames[game.objects[i].frame1].state;
}

function fall(i) {
  return game.objects[i].fall;
}

function bdefend(i) {
  return game.objects[i].bdefend;
}

function arest(i) {
  return game.objects[i].arest;
}

function vrest(i) {
  return game.objects[i].vrest;
}

function blink(i) {
  return game.objects[i].blink;
}

// Distance from target.
function dx(i) {
  return game.objects[i].x - self.x;
}

function dy(i) {
  return game.objects[i].y - self.y;
}

function dz(i) {
  return game.objects[i].z - self.z;
}

// Target velocity.
function vx(i) {
  return game.objects[i].x_velocity;
}

function vy(i) {
  return game.objects[i].y_velocity;
}

function vz(i) {
  return game.objects[i].z_velocity;
}

// ====Boolean function====
// Check if another enemies coming.
function coming(enemies) {
  if (enemies.length > 1 && AbsRange(enemies[1], 200, 50) &&
    !(infront(enemies[1]) && enemies.length < 3) &&
    type(enemies[1]) != 5) {
    return true;
  }
  return false;
}

// Check if target exist.
function exist(a) {
  return a.length != 0;
}

// Check if target within the distance range.
function RangeX(i, a, b) {
  const distanceX = game.objects[i].x - self.x;
  return distanceX >= a && distanceX <= b;
}

// Check if self within the frame range.
function RangeSF(a, b) {
  return self.frame >= a && self.frame <= b;
}

// Check if target within the frame range.
function RangeTF(i, a, b) {
  return game.objects[i].frame1 >= a && game.objects[i].frame1 <= b;
}

// Check if target within the absolute X and Z range.
function AbsRange(i, a, b) {
  return Math.abs(game.objects[i].x - self.x) <= a && Math.abs(game.objects[i].z - self.z) <= b;
}

// Check if target in front of self.
function infront(i) {
  return (game.objects[i].x - self.x) * (self.facing ? -1 : 1) > 0;
}

// Check target's facing.
function facing(i) {
  return game.objects[i].facing;
}

// Check if the character facing the target.
function IsFacing(i) {
  return (self.facing && !game.objects[i].facing) || (!self.facing && game.objects[i].facing);
}

// Compare the previous position with the current position's X and Z to check if self is stuck,
// using XandZ array's data.
function stuck() {
  position[self.num].x2 = position[self.num].x1;
  position[self.num].x1 = self.x;
  position[self.num].z2 = position[self.num].z1;
  position[self.num].z1 = self.z;

  if (position[self.num].x1 == position[self.num].x2 &&
    position[self.num].z1 == position[self.num].z2 &&
    [1, 2, 4, 5].includes(self.state)) {
    return true;
  }
  return false;
}

// The following two functions determine hitbox and hurtbox with respect to the object through complex calculations,
// don't delve into unnecessary details.

// Check if self can hit target.
function HitAble(i, frame) {
  const obj = game.objects;
  const obj_f = obj[i].data.frames;
  const obj_sf = obj[self.num].data.frames;
  const obj_sitr = obj_sf[frame].itrs;
  const obj_bdy = obj_f[obj[i].frame1].bdys;

  if (obj_f[obj[i].frame1].bdy_count > 0) {
    const itrx1 = self.x + (obj_sitr[0].x - obj_sf[frame].centerx) * (self.facing ? -1 : 1);
    const itrx2 = self.x + (obj_sitr[0].x - obj_sf[frame].centerx + obj_sitr[0].w) * (self.facing ? -1 : 1);
    const bdyx1 = game.objects[i].x + (obj_bdy[0].x - obj_f[obj[i].frame1].centerx) * (facing(i) ? -1 : 1);
    const bdyx2 = game.objects[i].x + (obj_bdy[0].x - obj_f[obj[i].frame1].centerx + obj_bdy[0].w) * (facing(i) ? -1 : 1);
    const itry1 = self.y - obj_sf[frame].centery + obj_sitr[0].y;
    const itry2 = self.y - obj_sf[frame].centery + obj_sitr[0].y + obj_sitr[0].h;
    const bdyy1 = game.objects[i].y - obj_f[obj[i].frame1].centery + obj_bdy[0].y;
    const bdyy2 = game.objects[i].y - obj_f[obj[i].frame1].centery + obj_bdy[0].y + obj_bdy[0].h;

    if (((itrx2 >= bdyx1 && itrx1 <= bdyx2) ||
        (itrx2 <= bdyx1 && itrx1 >= bdyx2) ||
        (itrx2 >= bdyx2 && itrx1 <= bdyx1) ||
        (itrx2 <= bdyx2 && itrx1 >= bdyx1)) &&
      (itry2 >= bdyy1 && itry1 <= bdyy2) &&
      Math.abs(dz(i)) <= 16) {
      return true;
    }
  }
  return false;
}

// Check if target can hit self.
function GoingToBeHited(i) {
  const obj = game.objects;
  const obj_f = obj[i].data.frames;
  const obj_sf = obj[self.num].data.frames;
  const obj_itr = obj_f[obj[i].frame1].itrs;
  const obj_sbdy = obj_sf[obj[self.num].frame1].bdys;

  if (obj_f[obj[i].frame1].itr_count > 0 && obj_itr[0].kind == 0 && obj_sf[self.frame].bdy_count > 0) {
    const itrx1 = game.objects[i].x + (obj_itr[0].x - obj_f[obj[i].frame1].centerx) * (facing(i) ? -1 : 1);
    const itrx2 = game.objects[i].x + (obj_itr[0].x - obj_f[obj[i].frame1].centerx + obj_itr[0].w) * (facing(i) ? -1 : 1);
    const bdyx1 = self.x + (obj_sbdy[0].x - obj_sf[self.frame].centerx) * (self.facing ? -1 : 1);
    const bdyx2 = self.x + (obj_sbdy[0].x - obj_sf[self.frame].centerx + obj_sbdy[0].w) * (self.facing ? -1 : 1);
    const itry1 = game.objects[i].y - obj_f[obj[i].frame1].centery + obj_itr[0].y;
    const itry2 = game.objects[i].y - obj_f[obj[i].frame1].centery + obj_itr[0].y + obj_itr[0].h;
    const bdyy1 = self.y - obj_sf[self.frame].centery + obj_sbdy[0].y;
    const bdyy2 = self.y - obj_sf[self.frame].centery + obj_sbdy[0].y + obj_sbdy[0].h;

    if (((itrx2 >= bdyx1 && itrx1 <= bdyx2) ||
        (itrx2 <= bdyx1 && itrx1 >= bdyx2) ||
        (itrx2 >= bdyx2 && itrx1 <= bdyx1) ||
        (itrx2 <= bdyx2 && itrx1 >= bdyx1)) &&
      (itry2 >= bdyy1 && itry1 <= bdyy2) &&
      Math.abs(dz(i)) <= 16) {
      return true;
    }
    if (dx(i) * vx(i) <= 0 &&
    (Math.abs(dx(i)) <= Math.abs(vx(i)) * 7 &&
    ((vz(i) == 0 || Math.abs(dz(i)) <= Math.abs(vz(i)) * 7) ||
    (vy(i) != 0 && Math.abs(dy(i)) <= Math.abs(vy(i)) * 10))) &&
    Math.abs(dx(i)) <= 100 && Math.abs(dy(i)) <= 100 && Math.abs(dz(i)) <= 20) {
      return true;
    }
  }
  return false;
}