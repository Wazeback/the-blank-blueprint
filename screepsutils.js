const screepUtils = { 

    getHarvesterRespawnAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'harvester' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'harvester' && creep.creep.respawn == true).length;
    },
    getUpgraderRespawnAmount: function(screeps, CreepSpawnList) { 
        return _.filter(screeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'upgrader' && creep.creep.respawn == true).length;
    },
    getBuilderRespawnAmount: function(screeps, CreepSpawnList) { 
        return  _.filter(screeps, (creep) => creep.memory.role == 'builder' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'builder' && creep.creep.respawn == true).length;
    },
    getRepairerRespawnAmount: function(screeps, CreepSpawnList) { 
       return _.filter(screeps, (creep) => creep.memory.role == 'repairer' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'repairer' && creep.creep.respawn == true).length;
    },
    getDefenderRespawnAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'defender' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'defender' && creep.creep.respawn == true).length;
    },
    getMoverRespawnAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'mover' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'mover' && creep.creep.respawn == true).length;
    },
    getScoutRespawnAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'scout' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'scout' && creep.creep.respawn == true).length;
    },
    getRoomClaimerRespawnAmount:function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'roomclaimer' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'roomclaimer' && creep.memory.respawn == true).length;
    },
    getAttackerAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'attacker').length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'attacker').length;
    },
    getDefenderAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'defender').length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'defender').length;
    },
    getHarvesterAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'harvester').length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'harvester').length;
    },
    getUpgraderAmount: function(screeps, CreepSpawnList) { 
        return _.filter(screeps, (creep) => creep.memory.role == 'upgrader').length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'upgrader').length;
    },
    getBuilderAmount: function(screeps, CreepSpawnList) { 
        return  _.filter(screeps, (creep) => creep.memory.role == 'builder').length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'builder').length;
    },
    getRepairerAmount: function(screeps, CreepSpawnList) { 
        return _.filter(screeps, (creep) => creep.memory.role == 'repairer').length +
         _.filter(CreepSpawnList, (creep) => creep.creep.role == 'repairer').length;
    },
    getMoverAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'mover').length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'mover').length;
    },
    getScoutAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'scout').length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'scout').length;
    },
    getRoomClaimerAmount:function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'roomclaimer').length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'roomclaimer').length;
    },
    getRangedBuilderAmount: function(screeps, CreepSpawnList) {
        return _.filter(screeps, (creep) => creep.memory.role == 'rangedbuilder').length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'rangedbuilder').length;
    },
    getTargetWithDestroy: function(creep, target) {
        const path = PathFinder.search(creep.pos, { pos: target.pos, range: 3 });
        if (!path && path.incomplete) return; 
        const pathLength = path.path.length;
        let obstacles = [];
        for (let i = 0; i < pathLength; i++) {
            const step = path.path[i];
            const objectRoomPos = new RoomPosition(step.x, step.y, step.roomName)
            var objects = objectRoomPos.look();
            for (let j = 0; j < objects.length; j++) {
                const object = objects[j];
                if (object.type == "structure" && (
                    object.structure.structureType === STRUCTURE_WALL ||
                    object.structure.structureType === STRUCTURE_RAMPART ) ) {
                    obstacles.push(object.structure);  
                }
            }
        }
        if(obstacles.length == 0) return;
        const objectsWithPathDistance = obstacles.map((objectVAL) => {
            const pathDistance = PathFinder.search(creep.pos, { pos: objectVAL.pos, range: 1 }).path.length;
            return { objectVAL, pathDistance };
        });
        return objectsWithPathDistance.reduce((prev, curr) => {return prev.pathDistance < curr.pathDistance ? prev : curr;}).objectVAL;
    },
    getBestSpawnLocation: function(room) {
        const sources = room.find(FIND_SOURCES);
        const controller = room.controller;
        const minerals = room.find(FIND_MINERALS);
    
        let bestLocation;
        let bestScore = Number.NEGATIVE_INFINITY;
    
        for (let x = 3; x < 47; x++) {
            for (let y = 3; y < 47; y++) {
                const pos = new RoomPosition(x, y, room.name);
                var score = 0;

                const terrain = room.lookForAt(LOOK_TERRAIN, pos);
                const structures = room.lookForAt(LOOK_STRUCTURES, pos);
                if (structures.length === 0) {
                    if( terrain == 'plain' || terrain == 'swamp' ) {

                        const sourceDistances = sources.map(source => pos.getRangeTo(source));
                        const totalSourceDist = _.sum(sourceDistances);
                        score += 10000 / (totalSourceDist + 1); // Add 1 to prevent division by zero

                        // Calculate distance to controller
                        const controllerDist = pos.getRangeTo(controller);
                        const controllerScore = controllerDist ? 5 / controllerDist : 0;
                        score += controllerScore;

                        // Calculate distance to minerals
                        const mineralDistances = minerals.map(mineral => pos.getRangeTo(mineral));
                        const minMineralDist = _.min(mineralDistances);
                        const mineralScore = minMineralDist ? 1 / minMineralDist : 0;
                        score += mineralScore;

                        // Penalize positions that are too close to the room boundaries
                        const distanceToEdge = Math.min(x - 10, 40 - x, y - 10, 40 - y);
                        const edgePenalty = distanceToEdge > 5 ? 0 : (5 - distanceToEdge) * 20;
                        score -= edgePenalty;

                        // Bonus score for positions closer to the center of the room
                        const distanceToCenter = Math.sqrt(Math.pow(pos.x - 25, 2) + Math.pow(pos.y - 25, 2));
                        const centerBonus = 10 / (distanceToCenter + 1); // Add 1 to prevent division by zero
                        score += centerBonus;
                    } else continue
                } else continue ;
                if (score > bestScore) {
                    bestLocation = pos;
                    bestScore = score;
                }
            }
            
        }
        // console.log(validPos)
        bestLocation.createConstructionSite(STRUCTURE_SPAWN);
        
    },
    getBestSource: function(creep, room, target) {
        // TODO: remember that u do use a pathfinding here so you could cache it and use it for later movement
        const roomObject = Game.rooms[room];
        let bestSource = null;
        let bestScore = Infinity;
        let fewestAssignedCreeps = Infinity;
        let sourceWithFewestAssignedCreeps = null;
        const creepsInRoom = _.filter(Game.creeps, (creep) => creep.memory.home == room.name);
        const currentCreepStoreAmount = creep.store.getCapacity(RESOURCE_ENERGY);
        for (let source in roomObject.memory.sources) {
            const sourceId = source;
            const sourceObject = Game.getObjectById(sourceId);
            const sourceEnergy = sourceObject.energy;
            const sourcePos = new RoomPosition(sourceObject.pos.x, sourceObject.pos.y, sourceObject.room.name);
            let assignedCreeps = _.filter(creepsInRoom, (creep) => creep.memory.targetSource == sourceId && creep.store[RESOURCE_ENERGY] > 0.25 * currentCreepStoreAmount).length;
            if (assignedCreeps >= roomObject.memory.sources[source].validHarvesterPos.length) {
                continue;
            }
            const pathToSource = creep.pos.findPathTo(sourcePos, { ignoreCreeps: true, ignoreRoads: true }).length;
            const pathToTarget = sourcePos.findPathTo(target, { ignoreCreeps: true, ignoreRoads: true }).length;
            const totalDistance = pathToSource + pathToTarget;
            let score = (sourceEnergy / 100) + (totalDistance);
            if (sourceEnergy < 200) {
                score = 1000000;
            }
            if (score < bestScore) {
                bestSource = sourceId;
                bestScore = score;
            }
            if (assignedCreeps < fewestAssignedCreeps) {
                fewestAssignedCreeps = assignedCreeps;
                sourceWithFewestAssignedCreeps = sourceId;
            }
        }
        if (bestSource == null) {
            bestSource = sourceWithFewestAssignedCreeps;
        }
        return bestSource;
    }, 
         
}

module.exports = screepUtils;