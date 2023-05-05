
var screepUtils = require('./screepsutils');
var spawnAttacker = require('./creepspawner').spawnAttacker;
const attackerMax  = 1;

var handleFlags = {
  run: function() {

    const GameFlags = Game.flags;

    for (const flagName in GameFlags) {
      if(flagName.length < 4) return;
      let myArray = flagName.split(',');
      var roomName = myArray[0];
      const flag = GameFlags[flagName];
      // Handle attacking
      if(flag.color == COLOR_RED) {
        const roomsInMemory = Object.keys(Memory.rooms);
        if(Game.rooms[roomName] && !roomsInMemory.includes(Game.flags[flagName].pos.roomName)) {
          const screeps = _.groupBy(Game.creeps, creep => creep.memory.home);
          const attackers = screepUtils.getAttackerAmount(screeps[roomName], Game.rooms[roomName].memory.CreepSpawnList);
          if(attackers < attackerMax) {
            spawnAttacker(attackerMax, attackers, roomName, flagName);
          }
        }
      }
      if(flag.color == COLOR_RED) {
        const roomsInMemory = Object.keys(Memory.rooms);
        if(Game.rooms[roomName] && !roomsInMemory.includes(Game.flags[flagName].pos.roomName)) {
          const screeps = _.groupBy(Game.creeps, creep => creep.memory.home);
          // TODO: create claimer role so it can claim shit
        }
      }
    }
  },
  placeFlag: function(flagName, roomName, color) {
    Game.rooms[roomName].createFlag(25, 25, flagName, color);
  }
};

module.exports = handleFlags;
