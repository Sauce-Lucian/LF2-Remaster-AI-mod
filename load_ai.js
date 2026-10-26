if (typeof window !== "undefined") {
  if (typeof T7ES !== "undefined") window.T7ES = T7ES;
  if (typeof FouV !== "undefined") window.FouV = FouV;
  if (typeof TIJj !== "undefined") window.TIJj = TIJj;
}
const DEBUG_AI = 1;
const loadDataIdentifier = "u0";

const nameMap = {
  "A": "attack",
  "D": "Th",
  "DJA": "eo",
  "DdA": "io",
  "DdJ": "Kh",
  "DlA": "ho",
  "DlJ": "jh",
  "DrA": "so",
  "DrJ": "Qh",
  "DuA": "$h",
  "DuJ": "qh",
  "J": "v1",
  "aaction": "xn",
  "act": "rh",
  "action": "action",
  "arest": "Dn",
  "attacking": "er",
  "backgrounds": "es",
  "backhurtact": "$n",
  "bdefend": "In",
  "bdefend_counter": "if",
  "bdy_count": "Dr",
  "bdys": "wr",
  "blink": "vs",
  "centerx": "Sr",
  "centery": "br",
  "clone": "parent",
  "cost": "ma",
  "cover": "Gn",
  "ctimer": "K_",
  "current_background": "ts",
  "current_stage": "Ca",
  "daction": "Zn",
  "dark_hp": "ks",
  "dash_distance": "Qr",
  "dash_distancez": "jr",
  "dash_height": "Hr",
  "data": "h0",
  "decrease": "qn",
  "default_centerx": "hr",
  "default_centery": "ar",
  "difficulty": "ss",
  "dircontrol": "tr",
  "down": "G0",
  "dvx": "Mn",
  "dvy": "yn",
  "dvz": "sr",
  "effect": "effect",
  "elapsed_time": "ih",
  "exists": "Fs",
  "facing": "_h",
  "fall": "wn",
  "frame": "B_",
  "frame1": "B_",
  "frames": "f",
  "fronthurtact": "Kn",
  "gameInstance": "g",
  "h": "Fe",
  "heal": "gf",
  "heavy_running_speed": "zr",
  "heavy_running_speedz": "Wr",
  "heavy_walking_speed": "Gr",
  "heavy_walking_speedz": "Or",
  "hit_Da": "ur",
  "hit_Dj": "mr",
  "hit_Fa": "nh",
  "hit_Fj": "_r",
  "hit_Ua": "dr",
  "hit_Uj": "gr",
  "hit_a": "lr",
  "hit_d": "cr",
  "hit_j": "oo",
  "hit_ja": "pr",
  "holding_a": "ws",
  "holding_d": "Vh",
  "holding_down": "Mh",
  "holding_j": "Dh",
  "holding_left": "yh",
  "holding_right": "wh",
  "holding_up": "Bh",
  "hp": "As",
  "hurtable": "Qn",
  "injury": "kn",
  "itr_count": "yr",
  "itrs": "Mr",
  "jaction": "zn",
  "join": "join",
  "jump_distance": "Pr",
  "jump_distancez": "Jr",
  "jump_height": "Zr",
  "kind": "kind",
  "left": "left",
  "max_hp": "Is",
  "mode": "Lh",
  "mp": "Ts",
  "next": "next",
  "num": "index",
  "objects": "ys",
  "oid": "Rn",
  "pic": "nr",
  "pickedact": "Un",
  "pickingact": "Nn",
  "rand": "P1",
  "ratio": "ratio",
  "reserve": "kl",
  "resized": "ii",
  "respond": "Tn",
  "right": "right",
  "rowing_distance": "$r",
  "rowing_height": "Kr",
  "running_frame_rate": "Nr",
  "running_speed": "Ur",
  "running_speedz": "Rr",
  "small_x_shift": "O1",
  "source_id": "L_",
  "stage_bound": "Zo",
  "stage_clear": "Fh",
  "state": "state",
  "taction": "Wn",
  "team": "group",
  "times": "Il",
  "up": "I1",
  "upscale": "J2",
  "vaction": "On",
  "vrest": "Vn",
  "w": "w",
  "wait": "wait",
  "walking_frame_rate": "vr",
  "walking_speed": "Xr",
  "walking_speedz": "Yr",
  "weapon_drop_hurt": "t2",
  "weapon_held": "Jh",
  "weapon_hp": "qr",
  "weapon_type": "zh",
  "weaponact": "ir",
  "when_clear_goto_phase": "Tl",
  "width": "w",
  "x": "x",
  "x_velocity": "lh",
  "y": "y",
  "y_velocity": "dh",
  "z_velocity": "uh",
  "zwidth": "An",
  "zwidth1": "Ys",
  "zwidth2": "Xs"
};


const getProxiedObject = (() => {
  const proxyCache = new WeakMap();

  function wrap(target, mapping) {
    if (target === null || typeof target !== "object") return target;
    if (proxyCache.has(target)) return proxyCache.get(target);

    const handler = {
      get(obj, prop, receiver) {
        if (prop === Symbol.iterator) {
          return (function* () {
            for (const value of obj) {
              yield wrap(value, mapping);
            }
          })();
        }
        const dataFileProp = mapping.data;
        const frameProp = mapping.frame;
        if (prop === "state") {
          if (
            obj &&
            obj[dataFileProp] &&
            obj[dataFileProp].f &&
            obj[frameProp] !== undefined &&
            obj[dataFileProp].f[obj[frameProp]]
          ) {
            const stateValue = obj[dataFileProp].f[obj[frameProp]].state;
            return wrap(stateValue, mapping);
          }
        } else if (prop === "id") {
          if (obj && obj[dataFileProp]) {
            const idValue = obj[dataFileProp].id;
            return wrap(idValue, mapping);
          }
        } else if (prop === "type") {
          if (obj && obj[dataFileProp]) {
            const typeValue = obj[dataFileProp].type;
            return wrap(typeValue, mapping);
          }
        } else if (prop === "bdefend") {
          if (obj) {
            const obj_bdefend = obj[nameMap['bdefend']];
            const obj_bdefend_counter = obj[nameMap['bdefend_counter']];
            const bdefendValue = obj_bdefend !== undefined ? obj_bdefend : obj_bdefend_counter;
            return bdefendValue;
          }
        }

        const mangledProp = mapping[prop] || prop;
        const value = Reflect.get(obj, mangledProp, receiver);

        if (DEBUG_AI && value === undefined) {
          if (typeof prop !== 'symbol' && prop !== 'then') {
            console.warn(`[AI Proxy] Property '${String(prop)}' not found on object.`);
          }
        }

        return wrap(value, mapping);
      },
      set(obj, prop, value, receiver) {
        if (prop === "state") {
          return true;
        }
        const mangledProp = mapping[prop] || prop;
        return Reflect.set(obj, mangledProp, value, receiver);
      },
      has(obj, prop) {
        if (prop === "state") {
          return true;
        }
        const mangledProp = mapping[prop] || prop;
        return Reflect.has(obj, mangledProp);
      },
    };

    const proxy = new Proxy(target, handler);
    proxyCache.set(target, proxy);
    return proxy;
  }

  return wrap;
})();

const aiHelpers = {
  left(self, a = 1, b = 0) {
    self.left = a;
    self.holding_left = b;
  },
  right(self, a = 1, b = 0) {
    self.right = a;
    self.holding_right = b;
  },
  up(self, a = 1, b = 0) {
    self.up = a;
    self.holding_up = b;
  },
  down(self, a = 1, b = 0) {
    self.down = a;
    self.holding_down = b;
  },
  J(self, a = 1, b = 0) {
    self.J = a;
    self.holding_j = b;
  },
  D(self, a = 1, b = 0) {
    self.D = a;
    self.holding_d = b;
  },
  A(self, a = 1, b = 0) {
    self.A = a;
    self.holding_a = b;
  },
  DJA(self) {
    self.DJA = 3;
  },
  DrA(self) {
    self.DrA = 3;
  },
  DlA(self) {
    self.DlA = 3;
  },
  DuA(self) {
    self.DuA = 3;
  },
  DdA(self) {
    self.DdA = 3;
  },
  DrJ(self) {
    self.DrJ = 3;
  },
  DlJ(self) {
    self.DlJ = 3;
  },
  DuJ(self) {
    self.DuJ = 3;
  },
  DdJ(self) {
    self.DdJ = 3;
  },
  abs: Math.abs,
};

aiHelpers.resetInput = (self) => {
  aiHelpers.up(self, 0, 0);
  aiHelpers.down(self, 0, 0);
  aiHelpers.left(self, 0, 0);
  aiHelpers.right(self, 0, 0);
  aiHelpers.J(self, 0, 0);
  aiHelpers.D(self, 0, 0);
  aiHelpers.A(self, 0, 0);
};

function createAIExecutionContext(selfEntity) {
  const context = {};
  for (const key in aiHelpers) {
    const helper = aiHelpers[key];
    if (typeof helper !== "function") continue;

    if (key === "abs") {
      context[key] = helper;
    } else {
      context[key] = (...args) => helper(selfEntity, ...args);
    }
  }
  return context;
}

const customAIs = {};

async function preprocessIncludes(code, basePath = './_res_ai/') {
    const includeRegex = /include\s*\(\s*"([^"]+)"\s*\);?/gm;
    const includes = [];
    let match;

    while ((match = includeRegex.exec(code)) !== null) {
        includes.push({
            directive: match[0],
            fileName: match[1]
        });
    }

    if (includes.length === 0) {
        return code;
    }

    let processedCode = code;

    for (const include of includes) {
        const filePath = basePath + include.fileName;
        try {
            const resp = await fetch(filePath, { cache: "no-store" });
            if (resp.ok) {
                let includedCode = await resp.text();
                const recursivelyProcessed = await preprocessIncludes(includedCode, basePath);
                processedCode = processedCode.replace(include.directive, recursivelyProcessed);
            } else {
                console.warn(`[AI Include] Failed to fetch ${filePath}`);
                processedCode = processedCode.replace(include.directive, '');
            }
        } catch (error) {
            console.error(`[AI Include] Error fetching ${filePath}:`, error);
            processedCode = processedCode.replace(include.directive, '');
        }
    }

    return processedCode;
}

async function loadCustomAI(id) {
  if (!DEBUG_AI && customAIs[id] !== undefined) return;

  try {
    const resp = await fetch(`./_res_ai/${id}.js`, {
      cache: "no-store",
    });
    if (!resp.ok) {
      customAIs[id] = null;
      return;
    }

    let code = await resp.text();
    code = await preprocessIncludes(code);
    
    const definedFunctions = [];

    const transformedCode = code
      .replace(/function\s+([a-zA-Z0-9_]+)\s*\(/g, (match, name) => {
        if (!definedFunctions.includes(name)) definedFunctions.push(name);
        return `const ${name} = function(`;
      })
      .replace(/^([a-zA-Z0-9_]+)\s*=\s*function/gm, (match, name) => {
        if (!definedFunctions.includes(name)) definedFunctions.push(name);
        return `const ${name} = function`;
      });

    const contextKeys = Object.keys(aiHelpers);

    const factoryBody = `
            const clr = console.clear;
            let target = initialTarget;
            let bg_zwidth1, bg_zwidth2, bg_width, difficulty, stage_clear, game, mode, stage_bound, elapsed_time, current_stage;

            const updateGlobals = () => {

                const backgrounds = nameMap.backgrounds;
                const zwidth1 = nameMap.zwidth1;
                const zwidth2 = nameMap.zwidth2;

                const current_background = gameInstance.current_background;
                bg_zwidth1 = T7ES[backgrounds][current_background][zwidth1];
                bg_zwidth2 = T7ES[backgrounds][current_background][zwidth2];
                bg_width = T7ES[backgrounds][current_background].w;
                difficulty = gameInstance.difficulty;
                stage_clear = gameInstance.stage_clear;
                game = gameInstance;
                mode = gameInstance.mode;
                stage_bound = mode == 4 ? gameInstance.stage_bound : bg_width;
                elapsed_time = gameInstance.elapsed_time;
                current_stage = gameInstance.current_stage;
            };
            
            updateGlobals();

            const gameInstanceProp = nameMap.gameInstance;
            const randProp = nameMap.rand;

            const rand = (i) => FouV[gameInstanceProp][randProp](0, i);

            const loadTarget = (index) => {
                target = gameInstance.objects[index];
                return gameInstance.exists[index] ? gameInstance.objects[index].data.type : -1;
            };

            const setTarget = (newTarget) => {
                target = newTarget;
            };

            ${transformedCode}
            
            return { setTarget, updateGlobals, ${definedFunctions.join(", ")} };
        `;

    const factory = new Function(
      "self",
      "initialTarget",
      "gameInstance",
      ...contextKeys,
      factoryBody
    );

    customAIs[id] = {
      factory: factory,
      definedFunctions: definedFunctions,
      executionCache: new WeakMap(),
    };
  } catch (error) {
    console.error(`Error compiling AI Sandbox for ID ${id}:`, error);
    customAIs[id] = null;
  }
}

const originalLoadFile = TIJj.prototype[loadDataIdentifier];
TIJj.prototype[loadDataIdentifier] = async function (...args) {
  await loadCustomAI(this.id);
  return await originalLoadFile.apply(this, args);
};

const originalIdAi = TI2f;
const originalEgoAi = Cr0f;

function runAIFunction(
  aiInfo,
  functionName,
  gameInstance,
  selfEntity,
  targetEntity,
  originalArgs
) {
  if (!aiInfo || typeof aiInfo.factory !== "function") return;

  let aiInstance = aiInfo.executionCache.get(selfEntity);

  if (!aiInstance) {
    const executionContext = createAIExecutionContext(selfEntity);
    const contextValues = Object.values(executionContext);

    aiInstance = aiInfo.factory.apply(null, [
      selfEntity,
      targetEntity,
      gameInstance,
      ...contextValues,
    ]);
    aiInfo.executionCache.set(selfEntity, aiInstance);
  } else {
    aiInstance.setTarget(targetEntity);
    aiInstance.updateGlobals();
  }

  const aiFunction = aiInstance[functionName];

  if (typeof aiFunction === "function") {
    const newArgs = [gameInstance, ...Array.from(originalArgs).slice(1)];
    return aiFunction.apply(null, newArgs);
  }
}

window.TI2f = TI2f = function (t, i) {
  const proxiedGameInstance = getProxiedObject(t, nameMap);
  const currentObj = proxiedGameInstance?.objects?.[i];
  if (!currentObj || !currentObj.data) {
    return originalIdAi.apply(this, arguments);
  }

  const id = currentObj.data.id;
  const source_id = currentObj.source_id;

  const attempts = [
    { key: source_id, name: 'source_id' },
    { key: id, name: 'id' }
  ];

  let selfEntity = null;

  for (const attempt of attempts) {
    const aiInfo = customAIs[attempt.key];

    if (aiInfo && aiInfo.definedFunctions.includes(attempt.name)) {
      try {
        selfEntity = proxiedGameInstance.objects[i];

        if (!selfEntity) {
          break;
        }

        const result = runAIFunction(
          aiInfo,
          attempt.name,
          proxiedGameInstance,
          selfEntity,
          undefined,
          arguments
        );
        
        if (result !== -1) {
          return result;
        }
      } catch (error) {
        console.error(`Error in custom AI (${attempt.name}) for entity ${attempt.key}:`, error);
        return;
      }
    }
  }

  return originalIdAi.apply(this, arguments);
};

window.Cr0f = Cr0f = function (game, targetNum, objectNum, t, h, o, a, n, r, i) {
  const proxiedGameInstance = getProxiedObject(game, nameMap);
  const currentObj = proxiedGameInstance?.objects?.[objectNum];
  if (!currentObj || !currentObj.data) {
    return originalEgoAi.apply(this, arguments);
  }
  const entityId = currentObj.data.id;
  const aiInfo = customAIs[entityId];

  if (aiInfo && aiInfo.definedFunctions.includes("ego")) {
    try {
      const selfEntity = proxiedGameInstance.objects[objectNum];
      const targetEntity = proxiedGameInstance.objects[targetNum];

      if (!selfEntity) {
        return originalEgoAi.apply(this, arguments);
      }

      return runAIFunction(
        aiInfo,
        "ego",
        proxiedGameInstance,
        selfEntity,
        targetEntity,
        arguments
      );
    } catch (error) {
      console.error(`Error in custom AI (ego) for entity ${entityId}:`, error);
      return true;
    }
  }

  return originalEgoAi.apply(this, arguments);
};
