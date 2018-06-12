var moveTo = require('tools.functions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // set upgrading mode
        if(creep.memory.upgrading && creep.carry.energy == 0) { creep.memory.upgrading = false; creep.say('get energy'); }
        // set geting energy mode
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) { creep.memory.upgrading = true; creep.say('upgrade'); }
        // upgrading Controller
	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) { creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}}); }
        }
        else {
            // geting energy
            moveTo.sourceContainer(creep);
        }
	}
};

module.exports = roleUpgrader;
