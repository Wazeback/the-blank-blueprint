// Upgrader role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;

var upgrader = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
         // Check if creep is carrying energy and if it's full
         if (creep.memory.upgrader && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrader = false;
        }
        // Check if creep is not carrying energy and if it's empty
        if (!creep.memory.upgrader && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrader = true;
        }
        // If creep is carrying energy, take it to the nearest spawn or extension
        if (!creep.memory.upgrader) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTROLLER), range: 3});
            if (target) {
                if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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
};

module.exports = upgrader;
