
var screepUtils = require('./screepsutils');
var spawnAttacker = require('./creepspawner').spawnAttacker;
var spawnRoomClaimer = require('./creepspawner').spawnRoomClaimer;

const attackerMax  = 1;
const claimerMax = 1;

var handleFlags = {
  run: function() {
    const screeps = _.groupBy(Game.creeps, creep => creep.memory.home);
    const GameFlags = Game.flags;
    const ATTACK_FLAGS = Object.values(GameFlags).filter(GameFlags => GameFlags.color == COLOR_RED);
    const CLAIMFLAGS = Object.values(GameFlags).filter(GameFlags => GameFlags.color == COLOR_CYAN);
    const closeClaimRooms = Object.keys(Memory.scoutRooms).reduce((smallest, roomName) => {
      const room = Memory.scoutRooms[roomName];
      if (room && room.roughDist && room.flagType == "CLAIM") {
        if (smallest.length < 3) {
          smallest.push(roomName);
          smallest.sort((a, b) => Memory.scoutRooms[a].roughDist - Memory.scoutRooms[b].roughDist);
        } else if (Memory.scoutRooms[roomName].roughDist < Memory.scoutRooms[smallest[2]].roughDist) {
          smallest[2] = roomName;
          smallest.sort((a, b) => Memory.scoutRooms[a].roughDist - Memory.scoutRooms[b].roughDist);
        }
      }
      return smallest;
    }, []);
    
    // Handles Attacking based off of flag
    for(const {name} of ATTACK_FLAGS) {
      const targetHome = name.split(',')[0];
      if(!Memory.rooms[targetHome]) continue;
      const attackers = screepUtils.getAttackerAmount(screeps[targetHome], Memory.rooms[targetHome].CreepSpawnList);
      if(attackers < attackerMax) {
        spawnAttacker(attackerMax, attackers, targetHome, name);
      }
    }
    for(const {name} of CLAIMFLAGS) {
      const targetHome = name.split(',')[0];
      if(!Memory.rooms[targetHome]) continue;
      const claimers = screepUtils.getRoomClaimerAmount(screeps[targetHome], Memory.rooms[targetHome].CreepSpawnList);
      if(claimers < claimerMax) {
        spawnRoomClaimer(claimerMax, claimers, targetHome, closeClaimRooms[closeClaimRooms.length - 1]);
      }
    }
  },

  placeFlag: function(flagName, roomName, color) {
    Game.rooms[roomName].createFlag(25, 25, flagName, color);
  }
};

module.exports = handleFlags;

