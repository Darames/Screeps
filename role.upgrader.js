var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('getting energy');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            var resources = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES), s => creep.pos.getRangeTo(s));
            if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;
