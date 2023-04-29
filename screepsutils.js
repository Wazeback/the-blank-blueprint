const screepUtils = { 

    getHarvesterRespawnAmount: function(screeps, CreepSpawnList) {
        return HarvesterAmount = _.filter(screeps, (creep) => creep.memory.role == 'harvester' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'harvester' && creep.creep.respawn == true).length;
    },
    getUpgraderRespawnAmount: function(screeps, CreepSpawnList) { 
        return UpgraderAmount = _.filter(screeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'upgrader' && creep.creep.respawn == true).length;
    },
    getBuilderRespawnAmount: function(screeps, CreepSpawnList) { 
        return BuilderAmount = _.filter(screeps, (creep) => creep.memory.role == 'builder' && creep.memory.respawn == true).length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'builder' && creep.creep.respawn == true).length;
    },
    getRepairerRespawnAmount: function(screeps, CreepSpawnList) { 
       return RepairerAmount =_.filter(screeps, (creep) => creep.memory.role == 'repairer' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'repairer' && creep.creep.respawn == true).length;
    },
    getDefenderRespawnAmount: function(screeps, CreepSpawnList) {
        return DefenderAmount = _.filter(screeps, (creep) => creep.memory.role == 'defender' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'defender' && creep.creep.respawn == true).length;
    },
    getMoverRespawnAmount: function(screeps, CreepSpawnList) {
        return MoverAmount = _.filter(screeps, (creep) => creep.memory.role == 'mover' && creep.memory.respawn == true).length +
        _.filter(CreepSpawnList, (creep) => creep.creep.role == 'mover' && creep.creep.respawn == true).length;
    },
    getAttackerAmount: function(screeps, CreepSpawnList) {
        return AttackerAmount = _.filter(screeps, (creep) => creep.memory.role == 'attacker').length +
            _.filter(CreepSpawnList, (creep) => creep.creep.role == 'attacker').length;
    },
    getTargetWithDestroy: function(creep, target) {
        const path = PathFinder.search(creep.pos, { pos: target.pos, range: 1 });
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
    }
    
}

module.exports = screepUtils;