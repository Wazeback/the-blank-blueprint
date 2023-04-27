// Builder role
var creepDeath = require('./creepspawner').HandleCreepDeath;

var builder = {
    run: function(creep) {
        if (creep.memory.respawn &&creep.ticksToLive <= 1 || creep.hits <= 0) {
            // Call HandleCreepDeath function and pass in the creep's memory object
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }
        // Check if creep is carrying energy and if it's full
        if (creep.memory.builder && creep.store.getFreeCapacity() == 0) {
            creep.memory.builder = false;
        }
        // Check if creep is not carrying energy and if it's empty
        if (!creep.memory.builder && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.builder = true;
        }
        // If creep is carrying energy, take it to the nearest construction site and build
        if (!creep.memory.builder) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            //if there is nothing to build make the builder repair shit
            } else {
                var target = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax});
                target.sort((a,b) => a.hits - b.hits);
                if(target.length > 0) {
                    if(creep.repair(target[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target[0]);
                    }
                }
            }
        }
        // If creep is not carrying energy, go to the nearest energy source and harvest
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = builder;
