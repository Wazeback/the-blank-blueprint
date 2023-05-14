var harvester = require('./harvester');
var upgrader = require('./upgrader');
var builder = require('./builder');
var repairer = require('./repairer');
var mover = require('./mover');
var defender = require('./defender');
var rangedbuilder = require('./rangedbuilder');
var rangeddefender =  require('./rangeddefender')

var attacker = require('./attacker');
var cleaner = require('./cleaner');
var wallbreaker = require('./wallbreaker');
var scout = require('./scout');
var roomclaimer = require('./roomclaimer')


var creepspawner = require('./creepspawner');
var getDefenderAmount = require('./screepsutils').getDefenderAmount;
var getRangedBuilderAmount = require('./screepsutils').getRangedBuilderAmount
var getBestSpawnLocation = require('./screepsutils').getBestSpawnLocation;

var buildManager = require ('./manager_build')

var home = {
    run: function(home, creeps) {
        this.setRoomMemory(home);
        this.handleStage(home, creeps);
        this.handleDefence(home, creeps)
        
        _.forEach(creeps, (creep) => {
            eval(creep.memory.role).run(creep);
            // creep.suicide();
        })


        creepspawner.HandleSpawnCreep(home)
        buildManager.run(home)

    },
    handleStage: function(room, homeCreeps) {
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        var AvailableEnergy = spawn.room.energyAvailable;
    
        if (AvailableEnergy <= 500) room.memory.stage = 0;
        else if (AvailableEnergy <= 700) room.memory.stage = 1;
        else room.memory.stage = 2;
    
        if(room.memory.oldControllerLevel != room.controller.level) {
            room.memory.buildStatus = {
                SatusplaceRoadsToSource: false,
                SatusplaceStorage: false,
                StatusPlaceExtensions: false,
            };
        }
        
        if (room.memory.stage != room.memory.oldStage || Game.time - room.memory.lastCreepSpawnTick >= 20) {
            creepspawner.HandleInitCreeps(room, homeCreeps);
            room.memory.oldStage = room.memory.stage;
            room.memory.lastCreepSpawnTick = Game.time;
            room.memory.oldControllerLevel = room.controller.level;
            // FIXME: this is everymuch a fix to stuff not spawning maybe find better way of checking soon....
            room.memory.buildStatus = {
                SatusplaceRoadsToSource: false,
                SatusplaceStorage: false,
                StatusPlaceExtensions: false,
            };
        }
        

    },
    setRoomMemory: function(room) {
        if(!room.memory.oldStage) room.memory.oldStage = 0;
        if(!room.memory.lastCreepSpawnTick) room.memory.lastCreepSpawnTick = Game.time;
        if(!room.memory.oldControllerLevel) room.memory.oldControllerLevel = room.controller.level;
        if (!room.memory.spawnpos) {
            const spawn = room.find(FIND_MY_SPAWNS)[0];
            if (spawn) room.memory.spawnpos = spawn.pos;
            else room.memory.spawnpos = getBestSpawnLocation(room);
        }
        if(!room.memory.buildStatus) {
            room.memory.buildStatus = {
                SatusplaceRoadsToSource: false,
                SatusplaceStorage: false,
                StatusPlaceExtensions: false,
            }
        }
        if (!room.memory.sources) room.memory.sources = {};
        if (Object.keys(room.memory.sources).length > 0) return;
        var sources = room.find(FIND_SOURCES);
        for (var source of sources) {
            if (!room.memory.sources[source.id]) {
                room.memory.sources[source.id] = {
                    sourcePos: source.pos,
                    validHarvesterPos: [],
                    sourceId: source.id,
                };
                for (var dx = -1; dx <= 1; dx++) {
                    for (var dy = -1; dy <= 1; dy++) {
                        if (dx == 0 && dy == 0) continue;
                        var pos = new RoomPosition(source.pos.x + dx, source.pos.y + dy, source.pos.roomName);
                        if (pos.lookFor(LOOK_TERRAIN)[0] != "wall") room.memory.sources[source.id].validHarvesterPos.push(pos);   
                    }
                }
            }
        }
    },
    // TODO: spawn differnt type defender based on HOSTILE body parts
    handleDefence: function(room, creeps) {
        const HOSTILE = room.find(FIND_HOSTILE_CREEPS);
        if (HOSTILE.length === 0) return;
        const defenderAmount = getDefenderAmount(creeps, room.memory.CreepSpawnList);
        const numDefenders = Math.ceil(HOSTILE.length / 2);
        if(defenderAmount >= numDefenders) return;
        const enemyHasWork = _.some(HOSTILE, creep => creep.body.some(part => part.type === WORK));
        const enemyHasRangedAttack = _.some(HOSTILE, creep => creep.body.some(part => part.type === RANGED_ATTACK));
        const enemyHasAttack = _.some(HOSTILE, creep => creep.body.some(part => part.type === ATTACK));
        const enemyHasHeal = _.some(HOSTILE, creep => creep.body.some(part => part.type === HEAL));
        
        if (enemyHasWork || enemyHasRangedAttack || enemyHasAttack || enemyHasHeal) {
            for (let i = 0; i <  numDefenders - defenderAmount; i++) {
                room.memory.CreepSpawnList.push({
                    creep: {
                        bodyparts: [],
                        role: 'defender',
                        prio: 5,
                        home: room.name,
                        respawn: false
                    }
                });
            }
        }
    },
    help: function(home, creeps, help) {
        var spawn = Game.rooms[home.name].find(FIND_MY_SPAWNS)[0];
        if (!spawn) return;
        const rangedbuilders = getRangedBuilderAmount(creeps, home.memory.CreepSpawnList)
        if(rangedbuilders < 1) {
            home.memory.CreepSpawnList.push({
                creep: {
                    bodyparts: [],
                    role: 'rangedbuilder',
                    prio: 200,
                    home: home.name,
                    respawn: false,
                    targetRoom: help.name,
                }
            });
        };
        
    },

}


module.exports = home;