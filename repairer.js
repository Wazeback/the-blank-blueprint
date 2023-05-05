// Repairer role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;
var repairer = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        // Check if creep is carrying energy and if it's full
        if (creep.memory.repairer && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairer = false;
        }
        // Check if creep is not carrying energy and if it's empty
        if (!creep.memory.repairer && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairer = true;
        }
        // If creep is carrying energy, take it to the nearest construction site and repair
        if (!creep.memory.repairer) {
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART;
                }
            }).sort((a, b) => a.hits - b.hits);
            if(target.length > 0) {
                if(creep.repair(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
            }
        }
        // If creep is not carrying energy, go to the nearest energy source and harvest
        else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = repairer;
