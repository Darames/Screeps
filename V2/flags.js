var flags = {
    run: function() {
        for (var flag in Game.flags) {
            if( Game.flags[flag].name.substr(0, 4) == "uPos"){
                Game.rooms[Game.flags[flag].pos.roomName].upgraderFlag = Game.flags[flag];
            }
        }
    }
};

module.exports = flags;