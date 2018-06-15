var roomMemory = {
    
    /** @param {Creep} creep **/
    
    run: function(creep) {
        for (i = 0; i < Game.rooms.length; i++) {
            if(Game.constructionSites){
                Game.rooms[i].memory.scanMode = true;
            }
            if(Game.rooms[i].memory.scanMode = true){
                Game.rooms[i].memory.sources = creep.room.find(FIND_SOURCES).id;
                Game.rooms[i].memory.container = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER } }).id;
                Game.rooms[i].memory.spawn = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN } }).id;
                Game.rooms[i].memory.extensions = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION } }).id;
                Game.rooms[i].memory.towers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_TOWER } }).id;
            }
        } 
    },
};


module.exports = roomMemory;

