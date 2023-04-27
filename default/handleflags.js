const { includes, at } = require("lodash");

// TODO: remember to add a string splice beceause rn 1 flag can exist at 1 time
var screepUtils = require('./screepsutils');
const attackerMax  = 2;

var handleFlags = {
  run: function() {

    const GameFlags = Game.flags;

    for (const flagName in GameFlags) {
      if(flagName.length < 4) return;
      const flag = GameFlags[flagName];
      if(flag.color == 1) {
        const roomsInMemory = Object.keys(Memory.rooms);
        if(Game.rooms[flagName] && !roomsInMemory.includes(Game.flags[flagName].pos.roomName)) {
          const screeps = _.groupBy(Game.creeps, creep => creep.memory.home);
          const attackers = screepUtils.getAttackerAmount(screeps[flagName], Game.rooms[flagName].memory.CreepSpawnList);
          if(attackers < attackerMax) {
            this.spawnAttacker(attackerMax, attackers, flagName);
          }
        }
      }

    }
  },


  spawnAttacker: function(attackerMax, attackers, flagName) {
      for(i = 0; i < attackerMax - attackers; i++) {
        Game.rooms[flagName].memory.CreepSpawnList.push({
            creep: {
                bodyparts: [MOVE,MOVE,RANGED_ATTACK],
                role: 'attacker',
                prio: 1001,
                home: flagName,
                targetRoom: Game.flags[flagName].pos.roomName,
                respawn: false,
            }
        });    
      }
  },

};

module.exports = handleFlags;
