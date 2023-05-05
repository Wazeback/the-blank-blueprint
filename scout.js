var creepDeath = require('./creepspawner').HandleCreepDeath;
var placeFlag = require('./handleflags').placeFlag;
let markedAsDead = false;
var scout = {
    run: function(creep) {
        // Handles Dying
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
    //   creep.suicide();
        if (creep.memory.targetRoom == undefined) {
            var exits = Game.map.describeExits(creep.room.name);
            var directions = Object.keys(exits);
            var randomDirection = directions[Math.floor(Math.random() * directions.length)];
            var randomExit = exits[randomDirection];
            if (randomExit == creep.memory.lastScoutedRoom) return;
            creep.memory.targetRoom = String(randomExit);
            var noFlag = true;

        }
      
        if (creep.room.name !== creep.memory.targetRoom) {
                const roomCenter = new RoomPosition(25, 25, creep.memory.targetRoom);
                if( creep.moveTo(roomCenter) != 0) {
                    creep.memory.targetRoom = undefined;
                }
        } else {
            for (const flagName in Game.flags) {
                const flag = Game.flags[flagName];
                if (flag && flag.room == creep.room) {
                    if(!Memory.rooms[creep.memory.targetRoom]){
                        noFlag = false;
                        flag.remove();
                    }
                }  
            }
            if ((!Memory.scoutRooms[creep.memory.targetRoom] && !Memory.rooms[creep.memory.targetRoom]) || !noFlag) {
                Memory.scoutRooms[creep.memory.targetRoom] = {
                sources: creep.room.find(FIND_SOURCES) || [],
                minerals: creep.room.find(FIND_MINERALS),
                structures: creep.room.find(FIND_STRUCTURES),
                hostileCreeps: creep.room.find(FIND_HOSTILE_CREEPS),
                controllerLevel: creep.room.controller ? creep.room.controller.level : null,
                controllerOwner: creep.room.controller ? creep.room.controller.owner ? creep.room.controller.owner.username : null : null,
                hostileStructures: creep.room.find(FIND_HOSTILE_STRUCTURES),
                safeModeAvailable: creep.room.controller ? creep.room.controller.safeModeAvailable : false,
                safeModeCooldown: creep.room.controller ? creep.room.controller.safeModeCooldown : null,
                invaderCore: creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_INVADER_CORE}})[0]
                };
                const roomOwner = Memory.scoutRooms[creep.memory.targetRoom].controllerOwner;
                const scoutRoomMem = Memory.scoutRooms[creep.memory.targetRoom];
                 
                if (roomOwner != null && roomOwner != creep.owner.username && !Memory.ignore[roomOwner]) {
                    const flagName = creep.memory.home + ",SCOUTFLAG,ATTACK," + Game.time;
                    placeFlag(flagName, creep.room.name, COLOR_RED);
                }
                if(roomOwner == null && scoutRoomMem.hostileCreeps.length < 1 && scoutRoomMem.hostileStructures.length < 1 && scoutRoomMem.sources.length > 1 && !creep.room.reservation) {
                    const flagName = creep.memory.home + ",SCOUTFLAG,CLAIM," + Game.time;
                    console.log("it placed a flag")
                    placeFlag(flagName, creep.room.name, COLOR_CYAN);
                }
            }
            creep.memory.lastScoutedRoom = creep.memory.targetRoom;
            creep.memory.targetRoom = undefined;
        }
    }   
}

module.exports = scout;
