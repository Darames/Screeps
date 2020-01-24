var flags = {
    run: function() {
        for (var flag in Game.flags) {
            let thisRoom = Game.rooms[Game.flags[flag].pos.roomName];
            let thisFlag = Game.flags[flag];

            if( thisFlag.name.substr(0, 4) == "uPos"){
                thisRoom.memory.upgraderPos = thisFlag.pos;
                thisFlag.remove;
            } else if (thisFlag.name.substr(0, 5) == "claim") {
                Memory.rooms.toClaim.push(thisRoom);
                thisFlag.remove;
            }else if (thisFlag.name.substr(0, 5) == "scout") {
                Memory.rooms.toScout.push(thisRoom);
                thisFlag.remove;
            }
        }
    }
};

module.exports = flags;