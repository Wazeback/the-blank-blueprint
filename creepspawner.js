// SpawnHandle handles spawning and creation of creeps

const CREEPROLES = require('./SCREEP_DATA').CREEPROLES
var screepsutils = require('./screepsutils')

const SPHandler = {

    spawnAttacker: function(attackerMax, attackers, home, fullFlagName) {
        for(i = 0; i < attackerMax - attackers; i++) {
          Game.rooms[home].memory.CreepSpawnList.push({
              creep: {
                  bodyparts: [MOVE,MOVE,WORK,WORK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,MOVE],
                  role: 'attacker',
                  prio: 101,
                  home: home,
                  targetRoom: Game.flags[fullFlagName],
                  respawn: false,
              }
          }
        );    
      }
    },
    spawnRoomClaimer: function(claimerMax, claimers, home, fullFlagName) {
        for(i = 0; i < claimerMax - claimers; i++) {
            Game.rooms[home].memory.CreepSpawnList.push({
                creep: {
                    bodyparts: [MOVE,MOVE,CLAIM,CLAIM],
                    role: 'roomclaimer',
                    prio: 400,
                    home: home,
                    targetRoom: fullFlagName,
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
        // TODO: rember to check if a creep should or not spawn in based on creepspawnlist
        var CreepSpawnList = Game.rooms[creep.home].memory.CreepSpawnList;
        if(!CreepSpawnList) {room.memory.CreepSpawnList = []; return; } 
        CreepSpawnList = Object.values(Game.rooms[creep.home].memory.CreepSpawnList);
        CreepSpawnList.push({creep: creep});
        Game.rooms[creep.home].memory.CreepSpawnList = CreepSpawnList;
    },
    HandleInitCreeps: function(room, screeps) {
        var CreepSpawnList = room.memory.CreepSpawnList;
        if(!CreepSpawnList) { room.memory.CreepSpawnList = [] };

        // const harvesterMax = room.find(FIND_SOURCES).length; //TODO: base of amount of free spaces in room.memory.sources.validSourcesPos.length min 2 max: 4
        // const upgraderMax = 3; // TODO: unless lvl 8 is reached then make it 1;
        // const builderMax = 3; // TODO: amount of builders based on construction site max 3 min 1;
        // const defenderMax = 1;
        // const repairerMax = 2; // TODO: based on the amount of of ramparts / stutures ( not roads) in room;
        // const moverMax = 2; // TODO: based on if there is a storage unit places down
        // const scoutMax = 1; // TODO: remember to disable scout based on tag in memory, scouts are very CPU expensive.


        let harvesterMax = 0;
        let maxFreeSpaces = 0;
        for (const source in room.memory.sources) {
            const freeSpaces = room.memory.sources[source].validHarvesterPos.length;
            if (freeSpaces > maxFreeSpaces) {
                maxFreeSpaces = freeSpaces;
                harvesterMax = Math.min(4, freeSpaces);
            }
        }
        const upgraderMax = room.controller.level < 8 ? 3 : 1; // Max 3 upgraders until level 8, then 1 upgrader
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const energyRequired = _.sum(constructionSites, site => site.progressTotal - site.progress);
        const builderMax = Math.max(1, Math.min(2, Math.ceil(energyRequired /   (1 + room.memory.oldStage ) * 150)));
        const defenderMax = 1; // Max 1 defender
        const ramparts = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_RAMPART } });
        const repairerMax = ramparts ? 2 : 0; // Max 2 repairers, based on the number of ramparts in the room
        const moverMax = room.storage ? 1 : 0; // Max 1 movers if there is a storage, 0 mover otherwise
        const scoutMax = 1; // Max 1 scout



        const harvesters = screepsutils.getHarvesterRespawnAmount(screeps, CreepSpawnList);
        const builders = screepsutils.getBuilderRespawnAmount(screeps, CreepSpawnList);
        const upgraders = screepsutils.getUpgraderRespawnAmount(screeps, CreepSpawnList);
        const repairers = screepsutils.getRepairerRespawnAmount(screeps, CreepSpawnList);
        const defenders = screepsutils.getDefenderRespawnAmount(screeps, CreepSpawnList);
        const movers = screepsutils.getMoverRespawnAmount(screeps, CreepSpawnList);
        const scouts = screepsutils.getScoutRespawnAmount(screeps, CreepSpawnList);

        CreepSpawnList = Object.values(room.memory.CreepSpawnList);
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
            for(i = 0; i < repairerMax - repairers; i++) {
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
        if(scouts < scoutMax) {
            for(i = 0; i < scoutMax - scouts ; i++) {
                CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'scout',
                        prio: 55,
                        home: room.name,
                        respawn: true,
                    } 
                })
            }
        }
        room.memory.CreepSpawnList = CreepSpawnList;
    }
}

module.exports = SPHandler;