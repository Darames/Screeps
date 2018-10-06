var variables = {
    
    /** @param {Creep} creep **/
    
    sources: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var sources = creepRoom.find(FIND_SOURCES);
        return sources;
    },
    droppedResources: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var droppedResources = creepRoom.find(FIND_DROPPED_RESOURCES, { filter: (r) => { return r.resourceType == RESOURCE_ENERGY } });
        return droppedResources;
    },
    container: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var container = creepRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER } });
        container.forEach(function(item, index) {
                item["energy"] = item.store[RESOURCE_ENERGY];
                item["energyCapacity"] = item.storeCapacity;
                container[index] = item;
            });
        return container;
    },
    spawn: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var spawn = creepRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN } });
        return spawn;
    },
    extensions: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var extensions = creepRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION } });
        return extensions;
    },
    towers: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var towers = creepRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_TOWER } });
        return towers;
    },
    getElement: function(roomName, sId) {
        var thisRoom = Game.rooms[roomName];
        var element = Game.getObjectById(sId);
        if( element == "null" ){ thisRoom.memory.scanMode = true; }
        return element;
    }
};


module.exports = variables;

