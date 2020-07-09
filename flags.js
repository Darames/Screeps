let blueprint = require('blueprints');

let flags = {
    run: function () {
        for (let flag in Game.flags) {
            let thisRoom = Game.rooms[Game.flags[flag].pos.roomName];
            let thisFlag = Game.flags[flag];

            let command = '';
            let operator = '';

            if (thisFlag.name.substr(0, 4) === 'uPos') {
                thisRoom.memory.upgraderPos = thisFlag.pos;
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 5) === 'claim') {
                Memory.rooms.toClaim.push(thisRoom);
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 5) === 'scout') {
                Memory.rooms.toScout.push(thisRoom);
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 8) === 'mainBase') {
                blueprint.showBuild(blueprint.mainBase, thisFlag)
                if (typeof thisRoom.memory.blueprint !== 'undefined') {
                    if (thisRoom.memory.blueprint.build === true) {
                        thisRoom.memory.blueprint.template = 'mainBase';
                        thisRoom.memory.blueprint.markerPos = {};
                        thisRoom.memory.blueprint.markerPos.x = thisFlag.pos.x;
                        thisRoom.memory.blueprint.markerPos.y = thisFlag.pos.y;
                        thisRoom.memory.blueprint.roomLvl = 0;
                        thisFlag.remove();
                    }
                }
                continue;
            } else if (thisFlag.name.substr(0, 14) === 'buildBlueprint') {
                thisRoom.memory.blueprint = {};
                thisRoom.memory.blueprint.build = true;
                thisFlag.remove();
                continue;
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