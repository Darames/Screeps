var roomMemory = {
    
    run: function() {
        
        for (var roomName in Game.rooms) {
        
            var thisRoom = Game.rooms[roomName];
            
            // for (var constructionSitesName in Game.constructionSites) {
            // console.log(constructionSitesName);
            // }
            if(!thisRoom.memory.scanMode){
                thisRoom.memory.scanMode = true;
            }
            if(Game.constructionSites){
                thisRoom.memory.scanMode = "preparing";
            }
            
            if(! Game.constructionSites && thisRoom.memory.scanMode === "preparing"){
                thisRoom.memory.scanMode = true;
            }
            if(thisRoom.memory.scanMode === true){
                thisRoom.memory.sources = thisRoom.find(FIND_SOURCES).id;
                thisRoom.memory.container = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER } }).id;
                thisRoom.memory.spawn = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN } }).id;
                thisRoom.memory.extensions = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION } }).id;
                thisRoom.memory.towers = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_TOWER } }).id;
                
                thisRoom.memory.scanMode = false;
            }
        } 
    },
};


module.exports = roomMemory;

