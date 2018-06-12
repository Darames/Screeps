
var variable = {
    
    /** @param {Creep} creep **/
    
    sources: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        return sources;
    },
    droppedResources: function(creep) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        return droppedResources;
    }

};


module.exports = variable;