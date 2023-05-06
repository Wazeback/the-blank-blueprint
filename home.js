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

var buildManager = require ('./manager_build')

var home = {
    run: function(home, creeps) {
        if (!home.memory.spawnpos) {
            const spawn = home.find(FIND_MY_SPAWNS)[0];
            if (spawn) {
            home.memory.spawnpos = spawn.pos;
    }
        }
        this.handleStage(home, creeps);
        this.handleDefence(home, creeps)
        
        _.forEach(creeps, (creep) => {
            eval(creep.memory.role).run(creep);
        })

        creepspawner.HandleSpawnCreep(home)

        buildManager.run(home)

    },
    handleStage: function(room, homeCreeps) {
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        var AvailableEnergy = spawn.room.energyAvailable;
    
        if (AvailableEnergy <= 500) {
            room.memory.stage = 0; // Early game
        } else if (AvailableEnergy <= 700) {
            room.memory.stage = 1; // Mid game
        } else {
            room.memory.stage = 2; // Late game
        }
        if(!room.memory.oldStage) room.memory.oldStage = 0;
        if(!room.memory.lastCreepSpawnTick) room.memory.lastCreepSpawnTick = Game.time;

        if (room.memory.stage != room.memory.oldStage || Game.time - room.memory.lastCreepSpawnTick >= 20) {
            creepspawner.HandleInitCreeps(room, homeCreeps);
            room.memory.oldStage = room.memory.stage;
            room.memory.lastCreepSpawnTick = Game.time; // Record the tick when creeps were last spawned
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
    // TODO: remember to add to spawnList instead for global stuff
    help: function(home, creeps, help) {
        var spawn = Game.rooms[home.name].find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            var rangedbuilderAmount = _.filter(creeps, (creep) => creep.memory.role === 'rangedbuilder');
            var rangeddefederAmount = _.filter(creeps, (creep) => creep.memory.role === 'rangeddefender');

            if( rangeddefederAmount.length < 0 &&  home.memory.stage > 3) {
                spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], 'RangedDefender' + Game.time, {memory: {role: 'rangeddefender', home: home.name, help: help.name} });
            } else if( rangedbuilderAmount.length < 2 &&  home.memory.stage > 3) {
                spawn.spawnCreep(HarvesterStage[home.memory.stage], 'RangedBuilder' + Game.time, {memory: {role: 'rangedbuilder', home: home.name, help: help.name} });
            }
        }
    },

}


module.exports = home;