var flags = {
    run: function () {
        for (var flag in Game.flags) {
            let thisRoom = Game.rooms[Game.flags[flag].pos.roomName];
            let thisFlag = Game.flags[flag];

            let command = '';
            let operator = '';

            if (thisFlag.name.substr(0, 4) === 'uPos') {
                thisRoom.memory.upgraderPos = thisFlag.pos;
                thisFlag.remove();
            } else if (thisFlag.name.substr(0, 5) === 'claim') {
                Memory.rooms.toClaim.push(thisRoom);
                thisFlag.remove();
            } else if (thisFlag.name.substr(0, 5) === 'scout') {
                Memory.rooms.toScout.push(thisRoom);
                thisFlag.remove();
            } else {
                command = thisFlag.name.substr(0, 4);
                operator = thisFlag.name.substr(4);
            }

            if ((command === 'tran' || command === 'buil' || command === 'upgr' || command === 'harv') && (operator === '+' || operator === '-')) {
                let limit = thisRoom.memory.limits[command];
                if (operator === '+') {
                    limit.value = limit.value + 1;
                } else if (operator === '-') {
                    limit.value = limit.value - 1;
                }
                thisFlag.remove();
            }
        }
    }
};

module.exports = flags;