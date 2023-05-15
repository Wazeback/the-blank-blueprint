
var creepDeath = require('./creepspawner').HandleCreepDeath;
var getBestSource = require('./screepsutils').getBestSource;
let markedAsDead = false;

var upgrader = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        const spawn = Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS)[0];
        if (creep.room == Game.rooms[creep.memory.home]) { 
            // Check if creep is carrying energy and if it's full
            if (creep.memory.upgrader && creep.store.getFreeCapacity() == 0) {
                creep.memory.upgrader = false;
                creep.memory.target = false;
            }
            // Check if creep is not carrying energy and if it's empty
            if (!creep.memory.upgrader && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrader = true;
                creep.memory.target = false;
            }
            if (!creep.memory.target) {
                const targetStructure = creep.room.controller;
                if (targetStructure) {
                    creep.memory.target = targetStructure.id;
                    creep.memory.targetSource = getBestSource(creep, creep.memory.home, targetStructure);
                } else {
                    creep.memory.target = false;
                    return;
                }
            }
            var target = Game.getObjectById(creep.memory.target);
            // If creep is carrying energy, take it to the nearest spawn or extension
            if (!creep.memory.upgrader) {
                if (target) {
                    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
                    }
                }
            }
            // If creep is not carrying energy, go to the nearest energy source and harvest
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
        else {
            creep.moveTo(spawn);
        }
    }
};

module.exports = upgrader;
