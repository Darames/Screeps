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
            var droppedResources = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES), s => creep.pos.getRangeTo(s));
            var container = _.sortBy(creep.room.find(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}}), s => creep.pos.getRangeTo(s));
            for (i = 0; i < droppedResources.length; i++) {
                creep.pickup(droppedResources[i])
            } 
            if(droppedResources.length) {
                if(creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else {
                if(creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container[0]);
                }
            }
        }
	}
};

module.exports = roleUpgrader;
