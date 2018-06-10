// move to source container
// 
var moveToSourceContainer = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        
        var source = _.sortBy(sources, s => creep.pos.getRangeTo(s));
        var sourceContainer = source[0].pos.findInRange(FIND_STRUCTURES, 2, { filter: (structure) => {return structure.structureType === STRUCTURE_CONTAINER} })
        for (i = 0; i < droppedResources.length; i++) {
            creep.pickup(droppedResources[i]);
        } 
        if(!sourceContainer.length || sourceContainer[0].store[RESOURCE_ENERGY] < creep.carryCapacity) {
            var droppedResource = _.sortBy(droppedResources, s => creep.pos.getRangeTo(s));
            if(creep.pickup(droppedResource[0]) == ERR_NOT_IN_RANGE) { creep.moveTo(droppedResource[0], {visualizePathStyle: {stroke: '#ffaa00'}}); }
        }else {
            if(creep.withdraw(sourceContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(sourceContainer[0]); }
        }
    }
};

module.exports = moveToSourceContainer;