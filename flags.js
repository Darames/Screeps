var blueprint = require('blueprints');

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
                this.showBuild(blueprint.mainBase, thisFlag)
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
    },
    showBuild: function (buildBlueprint, thisFlag) {
        const buildings = buildBlueprint.buildings;

        for (const buildingskey in buildings) {
            const building = buildings[buildingskey];

            for (const buildingkey in building) {
                const buildingpos = building[buildingkey];

                for (const poskey in buildingpos) {
                    const buildingpos = building[poskey];
                    let color = 'red';
                    if (buildingskey == 'spawn') {
                        color = 'blue';
                    }
                    if (buildingskey == 'road') {
                        color = 'grey';
                    }
                    if (buildingskey == 'extension') {
                        color = 'yellow';
                    }

                    thisFlag.room.visual.circle(
                        thisFlag.pos.x + buildingpos.x, thisFlag.pos.y + pos.y,
                    {fill: color, radius: 0.15, stroke: 'transparent'});
                }

            }

        }
    },
};

module.exports = flags;