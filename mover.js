// Mover role
var creepDeath = require('./creepspawner').HandleCreepDeath;


var mover = {
    run: function(creep) {
        if (creep.memory.respawn && creep.ticksToLive <= 1 || creep.hits <= 1) { // Call HandleCreepDeath function and pass in the creep's memory object
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }

        const spawn = Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS)[0];
        if (creep.room == Game.rooms[creep.memory.home]) {
            if (creep.store.getFreeCapacity() != 0) {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE) }
                });
                if (target) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } 
            } else {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
                    }
                });
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.moveTo(spawn);
                }
            }
        } else {
            creep.moveTo(spawn);
        }
    }
};

module.exports = mover;
