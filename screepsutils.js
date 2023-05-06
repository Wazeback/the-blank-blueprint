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
}

module.exports = screepUtils;