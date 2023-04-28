var utils =  require('./utils');
var home = require('./home');
var handleFlags = require('./handleflags')
// TODO: make a variable for every room that checks if the room is being attacked then send help.

module.exports.loop = function () {
    global.Tmp = {}
    global.Stats = {}

    // for (const creepName in Memory.creeps) {
    //     // If the creep is dead, remove its memory object
    //     if (!Game.creeps[creepName]) {
    //       delete Memory.creeps[creepName];
    //     }
    // }

    if (!Memory.flags) Memory.flags = {}
    const creepsByHome = utils.splitScreepsByHome();
    const myHomes = utils.getMyHomes();
    const myHomesLength = myHomes.length;
    const helpList = utils.getHelpList();
    const helpListLength = helpList.length


    try {
        handleFlags.run();
      } catch(error) {
        console.log('Error caught:', error);
      }

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
