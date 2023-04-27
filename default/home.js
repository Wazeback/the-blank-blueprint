var harvester = require('./harvester');
var upgrader = require('./upgrader');
var builder = require('./builder');
var repairer = require('./repairer');
var defender = require('./defender');

var rangedbuilder = require('./rangedbuilder');
var rangeddefender =  require('./rangeddefender')

// var attacker = require('./attacker');
var cleaner = require('./cleaner');
var wallbreaker = require('./wallbreaker');
var mover = require('./mover');

var creepspawner = require('./creepspawner');

var home = {
    run: function(home, creeps) {
        this.handleStage(home, creeps);
        this.handleDefence(home)
        
        _.forEach(creeps, (creep) => {
            eval(creep.memory.role).run(creep);
        })

        creepspawner.HandleSpawnCreep(home)

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

        if(room.memory.stage != room.memory.oldStage) {
            creepspawner.HandleInitCreeps(room, homeCreeps);
            room.memory.oldStage = room.memory.stage;
        }
    },

    handleDefence: function(room) {
        var HOSSTILE_ATTACKERS = room.find(FIND_HOSTILE_CREEPS);

        if(HOSSTILE_ATTACKERS.length > 0) {
            defenderMax = 6;
        }
    },

    // TODO: remember to add to spawnList instead for global stuff
    help: function(home, creeps, help) { // Function happens when another rooms spawn is dead
        var spawn = Game.rooms[home.name].find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            var rangedbuilderAmount = _.filter(creeps, (creep) => creep.memory.role === 'rangedbuilder');
            var rangeddefederAmount = _.filter(creeps, (creep) => creep.memory.role === 'rangeddefender');

            if( rangeddefederAmount.length < 0 && stage > 3) {
                spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], 'RangedDefender' + Game.time, {memory: {role: 'rangeddefender', home: home.name, help: help.name} });
            } else if( rangedbuilderAmount.length < 2 && stage > 3) {
                spawn.spawnCreep(HarvesterStage[stage], 'RangedBuilder' + Game.time, {memory: {role: 'rangedbuilder', home: home.name, help: help.name} });
            }
        }
    },
}


module.exports = home;