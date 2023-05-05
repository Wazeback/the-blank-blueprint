var creepDeath = require('./creepspawner').HandleCreepDeath;
var getTargetWithDestroy = require('./screepsutils').getTargetWithDestroy;
const markedAsDead = false;

var attacker = {
    run: function(creep) {
        // Handles Dying
        if (!markedAsDead && creep.memory.respawn && ( creep.ticksToLive <= 10 || creep.hits <= 10 )) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        if(!creep.memory.targetRoom) return;
        const targetRoom = creep.memory.targetRoom;
        if(creep.pos.roomName != targetRoom.pos.roomName) {
            const MoveToRoom =  new RoomPosition(targetRoom.pos.x, targetRoom.pos.y, targetRoom.pos.roomName);  
            if(creep.moveTo(MoveToRoom, {reusePath: 50}) == ERR_NO_PATH) {
                let path = creep.pos.findPathTo(MoveToRoom, {maxOps: 200});
                creep.moveByPath(path)
            }
            return;
        }
        // TODO: add a buddy system that heals
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (!target || creep.fatigue > 0) return;
        if (!creep.memory.breakwall) { creep.memory.breakwall = getTargetWithDestroy(creep, target)}
        if (!creep.memory.breakwall) {
            if (creep.pos.inRangeTo(target.pos, 1)) { creep.attack(target); return; }
            if (creep.pos.inRangeTo(target.pos, 2)) {creep.moveTo(creep.room.find((target.pos.getDirectionTo(creep.pos) + 3) % 8 + 1)); return;}
            if (creep.pos.inRangeTo(target, 3)) {creep.rangedAttack(target); return; }
            creep.moveTo(target);
        } else {
            const wall = Game.getObjectById(creep.memory.breakwall.id)
            const breakWall = creep.dismantle(wall)
            if (breakWall == ERR_INVALID_TARGET) { creep.memory.breakwall = false; return;}
            if (breakWall == ERR_NOT_IN_RANGE) { creep.moveTo(wall); }
        }
    }
}

module.exports = attacker;
