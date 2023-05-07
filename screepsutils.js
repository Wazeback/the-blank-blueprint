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
        const terrain = new Room.Terrain(room.name);
        const sources = room.find(FIND_SOURCES);
        const controller = room.controller;
        const minerals = room.find(FIND_MINERALS);
        const extensions = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } });
    
        let bestLocation;
        let bestScore = Number.NEGATIVE_INFINITY;
    
        for (let x = 3; x < 47; x++) {
            for (let y = 3; y < 47; y++) {
                const pos = new RoomPosition(x, y, room.name);
                let score = 0;
    
                // Calculate distance to sources
                const sourceDistances = sources.map(source => pos.getRangeTo(source));
                const minSourceDist = _.min(sourceDistances);
                const sourceScore = minSourceDist ? 10 / minSourceDist : 0;
                score += sourceScore;
    
                // Calculate distance to controller
                const controllerDist = pos.getRangeTo(controller);
                const controllerScore = controllerDist ? 10 / controllerDist : 0;
                score += controllerScore;
    
                // Calculate distance to minerals
                const mineralDistances = minerals.map(mineral => pos.getRangeTo(mineral));
                const minMineralDist = _.min(mineralDistances);
                const mineralScore = minMineralDist ? 5 / minMineralDist : 0;
                score += mineralScore;
    
                // Calculate distance to extensions
                const extensionDistances = extensions.map(extension => pos.getRangeTo(extension));
                const minExtensionDist = _.min(extensionDistances);
                const extensionScore = minExtensionDist ? 1 / minExtensionDist : 0;
                score += extensionScore;
    
                // Check if the position is on a structure
                const structures = room.lookForAt(LOOK_STRUCTURES, pos);
                if (structures.length > 0) {
                    score = Number.NEGATIVE_INFINITY;
                }
    
                // Check if the position is on a construction site
                const constructionSites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos);
                if (constructionSites.length > 0) {
                    score = Number.NEGATIVE_INFINITY;
                }
    
                // Check if the position is on a source
                for (const source of sources) {
                    if (source.pos.isEqualTo(pos)) {
                        score = Number.NEGATIVE_INFINITY;
                    }
                }
    
                // Check if the position is on the controller
                if (controller.pos.isEqualTo(pos)) {
                    score = Number.NEGATIVE_INFINITY;
                }
                
                // Check if the position is too close to a given object
                const avoidPos = [...sources, controller, ...minerals].map(obj => obj.pos);
                const minAvoidDist = _.min(avoidPos.map(pos => pos.getRangeTo(pos)));
                if (minAvoidDist && pos.findInRange(avoidPos, 3).length > 0) {
                    score = Number.NEGATIVE_INFINITY;
                }
                
                // Check if the position is within the optimal range
                const distance = Math.sqrt(Math.pow(pos.x - 25, 2) + Math.pow(pos.y - 25, 2));
                if (distance < 5) {
                    score = Number.NEGATIVE_INFINITY;
                } else if (distance > 10) {
                    score /= distance;
                }
    
                if (score > bestScore) {
                    bestLocation = pos;
                    bestScore = score;
                }
            }
        }
    
        return bestLocation;
    }
    
      
      
      
         
}

module.exports = screepUtils;