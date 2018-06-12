var variables = {
    
    /** @param {Creep} creep **/
    
    sources: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        return sources;
    },
    droppedResources: function(creep) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        return droppedResources;
    },
    container: function(creep) {
        var container = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER } });
        return container;
    },
};


module.exports = variables;