var creepDeath = require('./creepspawner').HandleCreepDeath;
var getBestSource = require('./screepsutils').getBestSource;
let markedAsDead = false;

var harvester = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        const spawn = Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS)[0];
        if (creep.room == Game.rooms[creep.memory.home]) { 
            // Check if creep is carrying energy and if it's full
            if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
                creep.memory.target = false;
            }
            // Check if creep is not carrying energy and if it's empty
            if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.harvesting = true;
                creep.memory.target = false;
            }
            // creep.memory.target = false;
            if (!creep.memory.target) {
                const targetStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                  filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                  }
                });
                if (targetStructure) {
                  creep.memory.target = targetStructure.id;
                  creep.memory.targetSource = getBestSource(creep, creep.memory.home, targetStructure);
                } else { creep.memory.target = false; return; }
            } 
              
            // creep.memory.harvesting = true;
            if(!creep.memory.harvesting) {
                
            // If creep is carrying energy, take it to the nearest spawn or extension
                let target = Game.getObjectById(creep.memory.target);
                if (target) {
                    if(target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) { creep.memory.target = false; return;}
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            } else {
                var source = Game.getObjectById(creep.memory.targetSource);
                if(creep.memory.target.pos) {
                    if(!source || source.energy < creep.store.getFreeCapacity(RESOURCE_ENERGY)) 
                    creep.memory.targetSource = getBestSource(creep, creep.memory.home, Game.getObjectById(creep.memory.target));
                }
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(source.pos), {reusePath: 50}, {noPathFinding: true} !=  0) {
                        if(creep.moveTo(source.pos), {reusePath: 50}, {noPathFinding: true} != -11) {
                            creep.moveTo(source.pos)
                        }
                    }
                }
            }    
        }
        else {
            creep.moveTo(spawn);
        }
    }
}
module.exports = harvester;
