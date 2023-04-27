// Defender role
var creepDeath = require('./creepspawner').HandleCreepDeath;

var rangeddefender = {
    run: function(creep) {
        if (creep.memory.respawn && creep.ticksToLive <= 1 || creep.hits <= 0) {
            // Call HandleCreepDeath function and pass in the creep's memory object
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }
        if(creep.room.name == creep.memory.help ) {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            const exitDir = Game.map.findExit(creep.room, Game.rooms[creep.memory.help]);
            const exit = creep.pos.findClosestByPath(exitDir);
            const path = creep.pos.findPathTo(exit, { ignoreCreeps: true });
            
            if (path.length > 0) {
                creep.moveByPath(path, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
    }
}

module.exports = rangeddefender;
