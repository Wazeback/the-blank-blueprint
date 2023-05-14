var utils =  require('./utils');
var home = require('./home');
var handleFlags = require('./handleflags')
var IGNORE_LIST = require('./IGNORE_LIST').IGNORE_LIST
let tickCounter = 0;

if (!Memory.scoutRooms) Memory.scoutRooms = {};
if (!Memory.ignore) Memory.ignore = IGNORE_LIST;

// TODO: !!!!!!!! ROLES STILL GO TO SET RESOURCES.. || halfway done just need to apply it to extra screep roles
// TODO: make sure the scout and roomclaimer dont spawn in if ur below level 5 or something
// TODO: remmeber to remove flags when room is claimed

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

    // const room = Game.rooms["W8N4"]

    //     // Remove all storage structures
    //     const storages = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
    //     for (const storage of storages) {
    //     storage.destroy();
    //     }

    //     // Remove all extension structures
    //     const extensions = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } });
    //     for (const extension of extensions) {
    //     extension.destroy();
    //     }

    //     // Remove all road structures
    //     const roads = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_ROAD } });
    //     for (const road of roads) {
    //     road.destroy();
    //     }

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
