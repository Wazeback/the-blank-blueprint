
// TODO: remember to add a string splice beceause rn 1 flag can exist at 1 time
var screepUtils = require('./screepsutils');
var spawnAttacker = require('./creepspawner').spawnAttacker;
const attackerMax  = 1;

var handleFlags = {
  run: function() {

    const GameFlags = Game.flags;

    for (const flagName in GameFlags) {
      if(flagName.length < 4) return;
      const flag = GameFlags[flagName];
      // Handle attacking
      if(flag.color == 1) {
        const roomsInMemory = Object.keys(Memory.rooms);
        if(Game.rooms[flagName] && !roomsInMemory.includes(Game.flags[flagName].pos.roomName)) {
          const screeps = _.groupBy(Game.creeps, creep => creep.memory.home);
          const attackers = screepUtils.getAttackerAmount(screeps[flagName], Game.rooms[flagName].memory.CreepSpawnList);
          if(attackers < attackerMax) {
            spawnAttacker(attackerMax, attackers, flagName);
          }
        }
      }
    }
  },

};

module.exports = handleFlags;
