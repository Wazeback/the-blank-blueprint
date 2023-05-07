// Mover role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;

var mover = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
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
        } else creep.moveTo(spawn);
    }
};

module.exports = mover;
