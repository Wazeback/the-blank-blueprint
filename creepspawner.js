// SpawnHandle handles spawning and creation of creeps

const CREEPROLES = require('./SCREEP_DATA').CREEPROLES
var screepsutils = require('./screepsutils')
const SPHandler = {

    spawnAttacker: function(attackerMax, attackers, flagName) {
        for(i = 0; i < attackerMax - attackers; i++) {
          Game.rooms[flagName].memory.CreepSpawnList.push({
              creep: {
                  bodyparts: [MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                  role: 'attacker',
                  prio: 1001,
                  home: flagName,
                  targetRoom: Game.flags[flagName],
                  respawn: false,
              }
          }
        );    
      }
    },
    HandleSpawnCreep: function(room) {
        var CreepSpawnList = room.memory.CreepSpawnList;
        if(!CreepSpawnList) { room.memory.CreepSpawnList = []; return; }
        if(CreepSpawnList.length < 1 || room.find(FIND_MY_SPAWNS)[0].spawning) return;
        let creep = CreepSpawnList.reduce((prev, curr) => {return prev.creep.prio < curr.creep.prio ? prev : curr;});
        if (room.find(FIND_MY_SPAWNS)[0].spawnCreep((creep.creep.bodyparts.length == 0 ? CREEPROLES[creep.creep.role][room.memory.stage] : creep.creep.bodyparts), creep.creep.role + Game.time, {memory: creep.creep }) != 0) return;
        let index = CreepSpawnList.indexOf(creep);
        CreepSpawnList.splice(index, 1);
        room.memory.CreepSpawnList = CreepSpawnList;
    },
    HandleCreepDeath: function(creep) {
        var CreepSpawnList = Game.rooms[creep.home].memory.CreepSpawnList;
        if(!CreepSpawnList) {room.memory.CreepSpawnList = []; return; } 
        CreepSpawnList = Object.values(Game.rooms[creep.home].memory.CreepSpawnList);
        CreepSpawnList.push({creep: creep});
        Game.rooms[creep.home].memory.CreepSpawnList = CreepSpawnList;
    },
    HandleInitCreeps: function(room, screeps) {
        var CreepSpawnList = room.memory.CreepSpawnList;
        if(!CreepSpawnList) { room.memory.CreepSpawnList = [] };

        const harvesterMax = room.find(FIND_SOURCES).length * 2;
        const upgraderMax = 2;
        const builderMax = 2; // TODO: amount of builders based on construction site
        const defenderMax = 1;
        const repairerMax = 2;
        const moverMax = 2;

        const harvesters = screepsutils.getHarvesterRespawnAmount(screeps, CreepSpawnList);
        const builders = screepsutils.getBuilderRespawnAmount(screeps, CreepSpawnList);
        const upgraders = screepsutils.getUpgraderRespawnAmount(screeps, CreepSpawnList);
        const repairers = screepsutils.getRepairerRespawnAmount(screeps, CreepSpawnList);
        const defenders = screepsutils.getDefenderRespawnAmount(screeps, CreepSpawnList);
        const movers = screepsutils.getMoverRespawnAmount(screeps, CreepSpawnList);


        CreepSpawnList = Object.values(room.memory.CreepSpawnList);
        console.log(typeof CreepSpawnList)
        if(harvesters < harvesterMax) {
            for(i = 0; i < harvesterMax - harvesters; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'harvester',
                        prio: 2,
                        home: room.name,
                        respawn: true,
                    }
                });    
            }
        }
        if(upgraders < upgraderMax) {
            for(i = 0; i < upgraderMax - upgraders; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'upgrader',
                        prio: 10,
                        home: room.name,
                        respawn: true,
                    }
                }); 
            }
        }
        if(builders < builderMax) {
            for(i = 0; i < builderMax - builders; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'builder',
                        prio: 20,
                        home: room.name,
                        respawn: true,
                    }  
                });
            }
        }
        if(defenders < defenderMax) {
            for(i = 0; i < defenderMax - defenders; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'defender',
                        prio: 5,
                        home: room.name,
                        respawn: true,
                    }
                });
            }
        }
        if(repairers < repairerMax) {
            for(i = 0; i < repairerMax - repairers ; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'repairer',
                        prio: 26,
                        home: room.name,
                        respawn: true,
                    } 
                });   
            }     
        }
        if(movers < moverMax) {
            for(i = 0; i < moverMax - movers ; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'mover',
                        prio: 30,
                        home: room.name,
                        respawn: true,
                    } 
                });   
            }     
        }
        room.memory.CreepSpawnList = CreepSpawnList;
    }

}

module.exports = SPHandler;