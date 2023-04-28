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
        if(!creep.memory.targetRoom) return;
        const targetRoom = creep.memory.targetRoom;
        if(creep.pos.roomName == targetRoom.pos.roomName)  {
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
                    let obstacles = [];
                    // TODO: extract this into its own function for path finding when there is a object in the way.
                    const path = PathFinder.search(creep.pos, { pos: target.pos, range: 1 });
                    const pathLength = path.path.length;
                    if (path && !path.incomplete) {
                        for (let i = 0; i < pathLength; i++) {
                            const step = path.path[i];
                            const position = new RoomPosition(step.x, step.y, step.roomName);
                            const objects = position.look();
                            for (let j = 0; j < objects.length; j++) {
                                const object = objects[j];
                                if (object.type == "structure" && object.structure.structureType === STRUCTURE_WALL) {
                                    obstacles.push(object.structure);
                                }
                            }
                        }
                        if(obstacles.length > 0) {
                            const objectsWithPathDistance = obstacles.map((objectVAL) => {
                                const pathToObj = PathFinder.search(creep.pos, { pos: objectVAL.pos, range: 1 });
                                const pathDistance = pathToObj.path.length;
                                return { objectVAL, pathDistance };
                            });
                            objectsWithPathDistance.sort((a, b) => a.pathDistance - b.pathDistance);
                            const target = objectsWithPathDistance[0].objectVAL;
                            if (creep.pos.inRangeTo(target.pos, 3)) {
                                creep.rangedAttack(target);
                            } else {
                                creep.moveTo(target)
                            }
                        } else {
                            creep.moveByPath(path.path, { range: 3 });
                        }
                        
                    } else { console.log('connot find path') }
                
        
                    if (creep.pos.inRangeTo(target, 3)) {
                        const direction = target.pos.getDirectionTo(creep.pos);
                        const newPosition = target.pos.getAdjacentPosition(direction);
                        creep.moveTo(newPosition, { range: 3 });
                    }
                }
            }
        } else {
            const MoveToRoom =  new RoomPosition(targetRoom.pos.x, targetRoom.pos.y, targetRoom.pos.roomName);  
            creep.moveTo(MoveToRoom);
        }
        
    }
}

module.exports = attacker;

