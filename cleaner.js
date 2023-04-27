// Cleaner role
var creepDeath = require('./creepspawner').HandleCreepDeath;

isThere = false;
var cleaner = {
    run: function(creep) {
        if (creep.memory.respawn && creep.ticksToLive <= 1 || creep.hits <= 0) {
            // Call HandleCreepDeath function and pass in the creep's memory object
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }
        const flag = Game.flags.ATTACKFLAG; // replace with the name of your flag
             
        if (creep.room.name !== flag.pos.roomName) { // if the Screep is not in the same room as the flag, move to the room
          const exitDir = Game.map.findExit(creep.room, flag.pos.roomName);
          const exit = creep.pos.findClosestByPath(exitDir);
          const path = creep.pos.findPathTo(exit, { ignoreCreeps: true });
        
          if (path.length > 0) {
            creep.moveByPath(path);
          }
        } else { // Destroy Spawn if found
            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_SPAWN && s.my == false
            });
            if(spawn.length > 0) {
                if(creep.dismantle(spawn[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn[0]);
                }
            } else {
                var otherStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_RAMPART
                });
                if(otherStructures.length > 0) {
                    var other = creep.pos.findClosestByRange(otherStructures);
                    if(creep.dismantle(other) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(other);
                    }
                } else {
                    creep.say("no break men", true)
                }
            }
        }
    }
}

module.exports = cleaner;

