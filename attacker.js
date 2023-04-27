// Attacker role
var creepDeath = require('./creepspawner').HandleCreepDeath;

var attacker = {
    run: function(creep) {
        if (creep.memory.respawn && creep.ticksToLive <= 1 || creep.hits <= 0) {
            // Call HandleCreepDeath function and pass in the creep's memory object
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }

        if(creep.room == creep.memory.targetRoom)  {
            // Check if we have a target
            if (!creep.memory.target) {
                // Find a new target
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    creep.memory.target = target.id;
                }
            }

            // If we have a target
            if (creep.memory.target) {
                const target = Game.getObjectById(creep.memory.target);
                if (!target) {
                    // Clear the target if it no longer exists
                    delete creep.memory.target;
                    return;
                }

                // Attack the target from a safe distance
                if (creep.pos.inRangeTo(target, 3)) {
                    creep.rangedAttack(target);
                } else {
                    creep.moveTo(target, { range: 3 });
                }
        
                if (creep.pos.inRangeTo(target, 3)) {
                    const direction = target.pos.getDirectionTo(creep.pos);
                    const newPosition = target.pos.getAdjacentPosition(direction);
                    creep.moveTo(newPosition, { range: 3 });
                }
            }
        }
        
    }
}

module.exports = attacker;

