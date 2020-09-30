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
                Memory.rooms.toClaim.push(thisFlag.pos.roomName);
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 5) === 'scout') {
                Memory.rooms.toScout.push(thisFlag.pos.roomName);
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 8) === 'mainBase') {
                blueprint.showBuild(blueprint.mainBase, thisFlag)
                if (typeof thisRoom.memory.blueprint !== 'undefined') {
                    if (thisRoom.memory.blueprint.build == true) {
                        this.setBlueprint('mainBase', thisFlag, thisRoom);
                    }
                } else {
                    thisRoom.memory.blueprint = {}
                }
                continue;
            } else if (thisFlag.name.substr(0, 4) === 'labs') {
                blueprint.showBuild(blueprint.labs, thisFlag)
                
                if (typeof thisRoom.memory.blueprint !== 'undefined') {
                    if (thisRoom.memory.blueprint.buildLabs == true) {
                        this.setBlueprint('labs', thisFlag, thisRoom);
                    }
                } else {
                    thisRoom.memory.blueprint = {}
                }
                continue;
            } else if (thisFlag.name.substr(0, 14) === 'buildBlueprint') {
                thisRoom.memory.blueprint = {};
                thisRoom.memory.blueprint.build = true;
                thisFlag.remove();
                continue;
            } else if (thisFlag.name.substr(0, 14) === 'buildBlueprintLabs') {
                thisRoom.memory.blueprint = {};
                thisRoom.memory.blueprint.buildLabs = true;
                thisFlag.remove();
                continue;
            }  else {
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
    setBlueprint: function (print, thisFlag, thisRoom){
            if (typeof thisRoom.memory.blueprint.template !== 'undefined') {
                thisRoom.memory.blueprint.templates.push({
                    name: print,
                    markerPos: {
                        x: thisFlag.pos.x,
                        y: thisFlag.pos.y
                    },
                    roomLvl: 0,
                });
            } else {
                thisRoom.memory.blueprint.template = [{
                    name: print,
                    markerPos: {
                        x: thisFlag.pos.x,
                        y: thisFlag.pos.y
                    },
                    roomLvl: 0
                }];
            }
            thisFlag.remove();
    }
};

module.exports = flags;