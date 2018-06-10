var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		var damagedStructures = creep.room.find(FIND_STRUCTURES,{ filter: (structure) => {
			return ( (100*structure.hits)/structure.hitsMax != 100 );
		}});


	    if(creep.memory.building && creep.carry.energy == 0 || creep.memory.repairing && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.memory.repairing = false;
			creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        
            if(!constructionSites.length) {
				creep.memory.repairing = true;
				creep.say('repair');
			} else {
				creep.memory.building = true;
				creep.say('build');
			}
	    }

	    if(creep.memory.building) {
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                creep.memory.repairing = true;
                creep.memory.building = false;
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    } else if(creep.memory.repairing){
			if(damagedStructures.length) {
                if(creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                creep.memory.repairing = false;
                creep.memory.building = true;
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
		} else {
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
	    }
	}
};

module.exports = roleBuilder;
