// Defender role
var creepDeath = require('./creepspawner').HandleCreepDeath;
let markedAsDead = false;
var rangeddefender = {
    run: function(creep) {
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        if(creep.room.name == creep.memory.help ) {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            const exitDir = Game.map.findExit(creep.room, Game.rooms[creep.memory.help]);
            const exit = creep.pos.findClosestByPath(exitDir);
            const path = creep.pos.findPathTo(exit, { ignoreCreeps: true });
            
            if (path.length > 0) {
                creep.moveByPath(path, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
    }
}

module.exports = rangeddefender;
