var moveToSourceContainer = require('tools.functions');

var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // set get energy mode
        if(creep.memory.delivering && creep.carry.energy == 0) { creep.memory.delivering = false; creep.say('get energy'); }
	    if(!creep.memory.delivering) {
            // set delivering mode
            if(creep.carry.energy == creep.carryCapacity) { creep.memory.delivering = true; creep.say('delivering'); }

            // moveToSourceContainer.run(creep);
            
            var droppedResources = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES), s => creep.pos.getRangeTo(s));
            var sources = _.sortBy(creep.room.find(FIND_SOURCES), s => creep.pos.getRangeTo(s));
            var container = sources[0].pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER
                }
            })

            for (i = 0; i < droppedResources.length; i++) {
                creep.pickup(droppedResources[i]);
            } 
            if(!container.length || container[0].store[RESOURCE_ENERGY] < creep.carryCapacity) {
                if(creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else {
                if(creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container[0]);
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN 
                    // || structure.structureType == STRUCTURE_CONTAINER
                    ) && (structure.energy 
                    //|| structure.store[RESOURCE_ENERGY]
                    ) < (structure.energyCapacity 
                    //|| structure.storeCapacity
                    );
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