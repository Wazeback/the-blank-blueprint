// Harvester role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;

var harvester = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        const spawn = Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS)[0];
        if(creep.room == Game.rooms[creep.memory.home]) {
            // Check if creep is carrying energy and if it's full
            if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
            }
            // Check if creep is not carrying energy and if it's empty
            if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.harvesting = true;
            }
            // If creep is carrying energy, take it to the nearest spawn or extension
            if (!creep.memory.harvesting) {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_CONTAINER &&
                                structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTROLLER)});
                    if (target) {
                        if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }   
                    }
                }
            }
            // If creep is not carrying energy, go to the nearest energy place and harvest / withdraw
            else {
                    var sources = creep.room.find(FIND_SOURCES);
                    // var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
            }
        } else creep.moveTo(spawn)
    }
};

module.exports = harvester;
