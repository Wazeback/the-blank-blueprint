var utils =  require('./utils');
var home = require('./home');
var handleFlags = require('./handleflags')

let tickCounter = 0;

if (!Memory.scoutRooms) Memory.scoutRooms = {};
if (!Memory.ignore) Memory.ignore = {
    Gino: {
        rooms: ["W9N6",
        ]
    }
}

// TODO: !!!!!!!! ROLES STILL GO TO SET RESOURCES
// TODO: add a glabal const that hold all the max amount of screeps.

module.exports.loop = function () {
    global.Tmp = {};
    global.Stats = {};
    tickCounter++;


    // for (const constructionSiteId in Game.constructionSites) {
    //     const constructionSite = Game.constructionSites[constructionSiteId];
    //     if (constructionSite.my) {
    //       constructionSite.remove();
    //     }
    //   }


    if (tickCounter % 20 === 0) handleFlags.run();
    if (tickCounter % 100 === 0) {
        for (const creepName in Memory.creeps) {
            if (!Game.creeps[creepName]) delete Memory.creeps[creepName];
        }
    }
   
    const creepsByHome = utils.splitScreepsByHome();
    const myHomes = utils.getMyHomes();
    const myHomesLength = myHomes.length;
    const helpList = utils.getHelpList();
    // TODO: make a variable for every room that checks if the room is being attacked then send help.
    const helpListLength = helpList.length


    for (let i = 0; i < myHomesLength; i++) {
        const baseHome = myHomes[i];
        if (baseHome.find(FIND_MY_SPAWNS)[0]) {
            const baseCreeps = creepsByHome[baseHome.name];
            home.run(baseHome, baseCreeps);
            for (let j = 0; j < helpListLength; j++) {
                home.help(baseHome, baseCreeps, helpList[j]);
            }
        }
    }

    
};
