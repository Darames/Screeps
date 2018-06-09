var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
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
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            
            
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                        structure.structureType == STRUCTURE_SPAWN ) &&
                            (structure.energy || structure.store[RESOURCE_ENERGY]) < (structure.energyCapacity || structure.storeCapacity);
                    }
            });
            // targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleTransporter;
