var creepDeath = require('./creepspawner').HandleCreepDeath;
const markedAsDead = false;
var claim = true;
var roomclaimer = {
    run: function(creep) {
        // Handles Dying
        if (!markedAsDead && creep.memory.respawn && ( creep.ticksToLive <= 10 || creep.hits <= 10 )) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        if(!creep.memory.targetRoom) return;
        if(creep.pos.roomName != creep.memory.targetRoom) {
            const MoveToRoom =  new RoomPosition(25, 25, creep.memory.targetRoom);  
            if(creep.moveTo(MoveToRoom, {reusePath: 50}) == ERR_NO_PATH) {
                let path = creep.pos.findPathTo(MoveToRoom, {maxOps: 200});
                creep.moveByPath(path)
            }
            return;
        }
        target = creep.room.controller;
        if (claim) {
            switch(creep.claimController(target)) {
                case OK:
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_NO_BODYPART:
                    creep.suicide();
                    break;
                case ERR_GCL_NOT_ENOUGH:
                    claim = false;
                    break;
                case ERR_FULL:
                    claim = false;      
                    break;
            }
        } else {
            switch(creep.reserveController(target)) {
                case OK:
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_NO_BODYPART:
                    creep.suicide();
                    break;
            }
        }
        
       
    }
}

module.exports = roomclaimer;
