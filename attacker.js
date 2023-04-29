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
        if(!creep.memory.targetRoom) return;
        const targetRoom = creep.memory.targetRoom;
        if(creep.pos.roomName != targetRoom.pos.roomName) {
            const MoveToRoom =  new RoomPosition(targetRoom.pos.x, targetRoom.pos.y, targetRoom.pos.roomName);  
            creep.moveTo(MoveToRoom);
            reep.memory.attacking = false;
            return;
        } 


        if (!creep.memory.target) {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) creep.memory.target = target.id;  
        }
        if (creep.memory.target) {
            const target = Game.getObjectById(creep.memory.target);
            if (!target) { delete creep.memory.target; return; } // delete if it dead
            // Check if creep is tired before issuing any move or attack commands
            if (!creep.memory.attacking && creep.fatigue > 0) {
                return;
            }
            // Attack the target from a safe distance
            if (creep.pos.inRangeTo(target, 3)) {
                creep.rangedAttack(target);
                creep.memory.attacking = true;
            } else {
                var PathGenTarget = getTargetWithDestroy(creep, target);
                if(!PathGenTarget) PathGenTarget = target;
                if (creep.pos.inRangeTo(PathGenTarget.pos, 3)) {
                    creep.rangedAttack(PathGenTarget);
                    creep.memory.attacking = true;
                } else { 
                    creep.moveTo(PathGenTarget);
                    creep.fatigue = 2;
                    creep.memory.attacking = false;
                }
            }
            // TODO: remember to add check for it it is a screep or a sturcture
            if (creep.pos.inRangeTo(target.pos, 2)) {
                const direction = target.pos.getDirectionTo(creep.pos);
                const oppositeDirection = (direction + 3) % 8 + 1;
                const oppositePos = creep.room.find(oppositeDirection, { range: 3 });
                creep.moveTo(oppositePos);
                // creep.fatigue = 2;
                // creep.memory.attacking = false;
            }
        } 
    }
}

module.exports = attacker;
