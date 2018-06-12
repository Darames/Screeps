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
    spawn: function(creep) {
        var spawn = creep.room.find(FIND_SPAWN);
        return spawn;
    },
    extensions: function(creep) {
        var extensions = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION } });
        return extensions;
    },
    towers: function(creep) {
        var towers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_TOWER } });
        return towers;
    }
};


module.exports = variables;

