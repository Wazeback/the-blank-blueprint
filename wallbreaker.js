// Role WallBreaker
let x = 39;
let y = 43;
var creepDeath = require('./creepspawner').HandleCreepDeath;

let markedAsDead = false; 

var wallbreaker = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        // Get target position from flag
        const flag = Game.flags.ATTACKFLAG; // replace with the name of your flag
        if (creep.room.name !== flag.pos.roomName) { // if the Screep is not in the same room as the flag, move to the room
            const path = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName);
            creep.moveTo(path);
        } else { // Destroy walls and ramparts
            var target = new RoomPosition(x, y, flag.pos.roomName);

            const wallsAndRamparts = target.lookFor(LOOK_STRUCTURES).filter(structure => {
                return structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART;
              });

            targetObj = wallsAndRamparts[0];

            let range = creep.pos.getRangeTo(target);
            if (range > 1) {
                creep.moveTo(target);
            } else {
                if(targetObj) {
                    creep.dismantle(targetObj)
                } else {
                    y = y + 1; // update the value of the outer 'y' variable
                    creep.say("is broken men", true);
                }
            }
            
        }
    }
}

module.exports = wallbreaker;
