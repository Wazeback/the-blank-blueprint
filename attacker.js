// Attacker role

var creepDeath = require('./creepspawner').HandleCreepDeath;
var getTargetWithDestroy = require('./screepsutils').getTargetWithDestroy;

var attacker = {
    run: function(creep) {
        // Handles Dying
        if (creep.memory.respawn && creep.ticksToLive <= 1 || creep.hits <= 0) {
            creepDeath(creep.memory);
            delete Memory.creeps[creep.name];
            creep.suicide();
            return;
        }
        // Handles Moving to the right room
        if(!creep.memory.targetRoom) return;
        const targetRoom = creep.memory.targetRoom;
        if(creep.pos.roomName != targetRoom.pos.roomName) {
            const MoveToRoom =  new RoomPosition(targetRoom.pos.x, targetRoom.pos.y, targetRoom.pos.roomName);  
            creep.moveTo(MoveToRoom);
            return;
        } 
        // Check if we dont have a target
        if (!creep.memory.target) {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) creep.memory.target = target.id;  
        }
        // Check if we dont have a target
        if (creep.memory.target) {
            const target = Game.getObjectById(creep.memory.target);
            if (!target) { delete creep.memory.target; return; } // delete if it dead
            // Check if creep is tired before issuing any move or attack commands
            if (creep.fatigue > 0) {
                return;
            }
            // Attack the target from a safe distance
            if (creep.pos.inRangeTo(target, 3)) {
                creep.rangedAttack(target);
            } else {
                var PathGenTarget = getTargetWithDestroy(creep, target);
                if(!PathGenTarget) PathGenTarget = target;
                if (creep.pos.inRangeTo(PathGenTarget.pos, 3)) {
                    creep.rangedAttack(PathGenTarget);
                } else { 
                    creep.moveTo(PathGenTarget);
                    // Set creep to tired so it waits before issuing another move command
                    creep.fatigue = 2;
                }
            }
            // TODO: remember to add check for it it is a screep or a sturcture
            if (creep.pos.inRangeTo(target.pos, 2)) {
                const direction = target.pos.getDirectionTo(creep.pos);
                const oppositeDirection = (direction + 3) % 8 + 1;
                const oppositePos = creep.room.find(oppositeDirection, { range: 3 });
                creep.moveTo(oppositePos);
                // Set creep to tired so it waits before issuing another move command
                creep.fatigue = 2;
            }
        } 
    }
}

module.exports = attacker;
