// Builder role
var creepDeath = require('./creepspawner').HandleCreepDeath;
var getBestSource = require('./screepsutils').getBestSource;
let markedAsDead = false;

var builder = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        // Check if creep is carrying energy and if it's full
        if (creep.memory.builder && creep.store.getFreeCapacity() == 0) {
            creep.memory.builder = false;
            creep.memory.target = false;
        }
        // Check if creep is not carrying energy and if it's empty
        if (!creep.memory.builder && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.builder = true;
            creep.memory.target = false;
        }
        if (!creep.memory.target) {
            const targetStructure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (targetStructure) {
              creep.memory.target = targetStructure.id;
              creep.memory.targetSource = getBestSource(creep, creep.memory.home, targetStructure);
            } else {
                const targetStructure = creep.room.find(FIND_STRUCTURES);
                const smallestStructure = targetStructure.reduce((prev, current) => {
                    return prev.hits < current.hits ? prev : current;
                });
                
                if (smallestStructure) {
                    creep.memory.target = smallestStructure.id;
                    creep.memory.targetSource = getBestSource(creep, creep.memory.home, smallestStructure);
                }
            }
            if(!creep.memory.target) { creep.memory.target = false; return;}
        } 
        var target = Game.getObjectById(creep.memory.target);
        // If creep is carrying energy, take it to the nearest construction site and build
        if (!creep.memory.builder) {
           
            if (target) {
                if (target instanceof ConstructionSite) {
                    
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (target instanceof Structure) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                // Check if target is out of range
                if (creep.pos.getRangeTo(target) > 3) {
                    creep.moveTo(target);
                }
            }  
        }
        else {
            var source = Game.getObjectById(creep.memory.targetSource);
            if (target == null) {creep.memory.target = false; return}
            if(!source || source.energy < creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                creep.memory.targetSource = getBestSource(creep, creep.memory.home, target);
                return;
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
}

module.exports = builder;
