const u = {
    splitScreepsByHome: function() {
        if(!Tmp.creepsByHome)
            Tmp.creepsByHome = _.groupBy(Game.creeps, creep => creep.memory.home)
        return Tmp.creepsByHome
    },
    getMyHomes: function() {
        if(!Tmp.myHomes)
            Tmp.myHomes = _.filter(Game.rooms, (room) => u.myHome(room.name))
        return Tmp.myHomes
    },
    getRemotes: function() {
        if(!Tmp.remotes)
            Tmp.remotes = _.filter(Game.rooms, (room) => u.remote(room.name))
        return Tmp.remotes
    },
    myHome: function(roomName) {
        const room = Game.rooms[roomName]
        const hasController = room && room.controller
        return hasController && room.controller.my
    },
    remote: function(roomName) {
        const room = Game.rooms[roomName]
        const hasController = room && room.controller
        return hasController || !room.controller.my
    },
    getHelpList: function () {
        if (!Tmp.helpList) {
            Tmp.helpList = _.filter(Game.rooms, (room) => {
                const spawns = room.find(FIND_MY_SPAWNS);
                return room.controller && room.controller.my && spawns.length === 0;
            });
        }
        return Tmp.helpList;
    }
}
module.exports = u;