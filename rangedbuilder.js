// rangedBuilder role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;

var rangedbuilder = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        if(creep.room.name == creep.memory.help ) {
            // Check if creep is carrying energy and if it's full
            if (creep.memory.rangedbuilder && creep.store.getFreeCapacity() == 0) {
                creep.memory.rangedbuilder = false;
            }
            // Check if creep is not carrying energy and if it's empty
            if (!creep.memory.rangedbuilder && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.rangedbuilder = true;
            }
            // If creep is carrying energy, take it to the nearest construction site and build
            if (!creep.memory.rangedbuilder) {
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
                var sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }  else {
            const exitDir = Game.map.findExit(creep.room, Game.rooms[creep.memory.help]);
            const exit = creep.pos.findClosestByPath(exitDir);
            const path = creep.pos.findPathTo(exit, { ignoreCreeps: true });
            
            if (path.length > 0) {
                creep.moveByPath(path, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
    }
}

module.exports = rangedbuilder;
