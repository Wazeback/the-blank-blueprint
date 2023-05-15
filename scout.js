var creepDeath = require('./creepspawner').HandleCreepDeath;
var placeFlag = require('./handleflags').placeFlag;
let markedAsDead = false;
var scout = {
    // BUG: scout still gets stuck randomly maybe add more checks
    run: function(creep) {
        // Handles Dying
        if (!markedAsDead && creep.memory.respawn && (creep.ticksToLive <= 10 || creep.hits <= 10)) {
            markedAsDead = true;
            creepDeath(creep.memory);
            return;
        }
        // creep.suicide();
        if (creep.memory.targetRoom == undefined) {
            var exits = Game.map.describeExits(creep.room.name);
            var directions = Object.keys(exits);
            var randomDirection = directions[Math.floor(Math.random() * directions.length)];
            var randomExit = exits[randomDirection];
            if (randomExit == creep.memory.lastScoutedRoom) return;
            creep.memory.targetRoom = randomExit;
            var noFlag = true;
        }
        
        
        if (creep.room.name !== creep.memory.targetRoom) {
            // TODO: maybe make this its own function for pathfinding it is rather big
            const roomCenter = new RoomPosition(25, 25, creep.memory.targetRoom);

            // Check if a path is already cached
            if (!creep.memory.path || creep.memory.path.room != creep.room.name || creep.memory.path.targetRoom != creep.memory.targetRoom) {
              // If no cached path exists or if the cached path is for a different room or target room, calculate a new path
              const path = PathFinder.search(
                creep.pos,
                { pos: roomCenter, range: 1 },
                {
                  roomCallback: (roomName) => {
                    const room = Game.rooms[roomName];
                    if (!room) return;
                    const costs = new PathFinder.CostMatrix();
                    room.find(FIND_STRUCTURES).forEach((structure) => {
                      if (structure.structureType === STRUCTURE_ROAD) {
                        // Set roads to have a lower movement cost so creeps will prefer them
                        costs.set(structure.pos.x, structure.pos.y, 1);
                      } else if (
                        structure.structureType !== STRUCTURE_CONTAINER &&
                        (structure.structureType !== STRUCTURE_RAMPART ||
                          !structure.my ||
                          !Memory.defense[creep.memory.targetRoom] ||
                          !Memory.defense[creep.memory.targetRoom].walls)
                      ) {
                        // Set impassable structures to have a high movement cost so creeps will avoid them
                        costs.set(structure.pos.x, structure.pos.y, 255);
                      }
                    });
                    return costs;
                  },
                  maxOps: 500,
                  plainCost: 2,
                  swampCost: 10,
                }
              );
            
              // Cache the path
              creep.memory.path = {
                path: path.path.map((pos) => ({ x: pos.x, y: pos.y })),
                targetRoom: creep.memory.targetRoom,
                room: creep.room.name,
              };
            }
            // TODO: Move not working not a correct shifting of array moveTo returns 0 
            // Move to the next position in the cached path
            if (creep.memory.path.path.length > 0) {
              const nextPos = new RoomPosition(creep.memory.path.path[0].x, creep.memory.path.path[0].y, creep.memory.path.room);
              if (creep.pos.isEqualTo(nextPos)) {
                // If the creep is already at the next position, remove it from the path
                creep.memory.path.path.shift();
              } else {
                console.log(creep.moveTo(nextPos));
              }
            }
            
            // Clear the cached path if the target room has changed
            if (creep.memory.path && creep.memory.path.targetRoom != creep.memory.targetRoom) {
              creep.memory.path = undefined;
            }



            // const roomCenter = new RoomPosition(25, 25, creep.memory.targetRoom);
            // if( creep.moveTo(roomCenter) != 0) {
            //     creep.memory.targetRoom = undefined;
            // } 
            //this shit eats memory but the other one does not seem to move
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
                    invaderCore: creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_INVADER_CORE}})[0],
                    roughDist: Game.map.findRoute(creep.room.name, creep.memory.home).length,
                    flagType: "",
                };

                const scoutRoomMem = Memory.scoutRooms[creep.memory.targetRoom];

                const roomOwner = scoutRoomMem.controllerOwner;
                if (roomOwner != null && roomOwner != creep.owner.username && !Memory.ignore[roomOwner]) {
                    Memory.scoutRooms[creep.memory.targetRoom].flagType = "ATTACK"
                    const flagName = creep.memory.home + ",SCOUTFLAG,ATTACK," + Game.time;
                    placeFlag(flagName, creep.room.name, COLOR_RED);
                }
                if(roomOwner == null && scoutRoomMem.hostileCreeps.length < 1 && scoutRoomMem.hostileStructures.length < 1 && scoutRoomMem.sources.length > 1 && !creep.room.reservation) {
                    Memory.scoutRooms[creep.memory.targetRoom].flagType = "CLAIM"
                    const flagName = creep.memory.home + ",SCOUTFLAG,CLAIM," + Game.time;
                    placeFlag(flagName, creep.room.name, COLOR_CYAN);
                }
            }
            creep.memory.lastScoutedRoom = creep.memory.targetRoom;
            creep.memory.targetRoom = undefined;
        }
    }   
}

module.exports = scout;
