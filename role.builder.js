var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {
			var droppedResources = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES), s => creep.pos.getRangeTo(s));
            for (i = 0; i < droppedResources.length; i++) {
                creep.pickup(droppedResources[i])
            } 
            var container = _.sortBy(creep.room.find(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == structure.structureType == STRUCTURE_CONTAINER)}}), s => creep.pos.getRangeTo(s));
            if(container.length) {
                if(creep.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }else {
                if(creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
	    }
	}
};

module.exports = roleBuilder;
