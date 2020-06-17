var actions = require('actions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let creepRoom = Game.rooms[creep.pos.roomName];
        let upgraderPos = "none";
        let upgradeContainer = false;
        let upgrading = false;

        if (creepRoom.memory.controllerContainer.length) {
            upgradeContainer = actions.getElement(creepRoom, creepRoom.memory.controllerContainer);
        }
        if (typeof creep.memory.upgrading !== 'undefined') { upgrading = creep.memory.upgrading;
        } else { creep.memory.upgrading = false; }

        // get upgrader position flag
        if (creepRoom.memory.upgraderPos) {
            upgraderPos = creepRoom.memory.upgraderPos;
        }

        // set upgrading mode
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        // set geting energy mode
        if (!creep.memory.upgrading && creep.carry.energy == creep.store.getCapacity()) {
            creep.memory.upgrading = true;
        }
        // upgrading Controller
        if (upgrading) {
            if (upgraderPos !== "none") {
                if (creep.pos.inRangeTo(upgraderPos, 1)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(upgraderPos, { maxOps: 200 });
                    creep.upgradeController(creepRoom.controller);
                }
            } else {
                if (creep.pos.inRangeTo(creepRoom.controller, 2)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(creepRoom.controller, { maxOps: 200 });
                    creep.upgradeController(creepRoom.controller);
                }
            }
        } else {
            // geting energy
            if (upgradeContainer) {
                if (upgradeContainer.store[RESOURCE_ENERGY] > 0) {
                    actions.withdraw(creep, upgradeContainer);
                    creep.memory.upgrading = true;
                } else {
                    actions.getEnergy(creep);
                }
            } else {
                actions.getEnergy(creep);
            }
        }
    }
};

module.exports = roleUpgrader;
