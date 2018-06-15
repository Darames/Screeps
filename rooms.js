var roomMemory = {
    
    run: function() {
        
        for (var roomName in Game.rooms) {
        
            var thisRoom = Game.rooms[roomName];
            
            for (var constructionSitesName in Game.constructionSites) {
            var constructionSites = true;
            }
            
            if(!thisRoom.memory.scanMode){
                thisRoom.memory.scanMode = true;
            }
            if(constructionSites){
                thisRoom.memory.scanMode = "waiting";
            }
            
            if(!constructionSites && thisRoom.memory.scanMode === "waiting"){
                thisRoom.memory.scanMode = true;
            }
            
            if(thisRoom.memory.scanMode === true){
                
                thisRoom.memory.sources = new Array();
                thisRoom.memory.container = new Array();
                thisRoom.memory.spawn = new Array();
                thisRoom.memory.extensions = new Array();
                thisRoom.memory.towers = new Array();
                
                var sources = thisRoom.find(FIND_SOURCES);
                for(i = 0; i < sources.length; i++){
                    thisRoom.memory.sources.push(sources[i].id);
                }
                var container = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER } });
               for(i = 0; i < container.length; i++){
                    thisRoom.memory.container.push(container[i].id);
                }
                var spawn = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN } });
                for(i = 0; i < spawn.length; i++){
                    thisRoom.memory.spawn.push(spawn[i].id);
                }
                var extensions = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION } });
                for(i = 0; i < extensions.length; i++){
                    thisRoom.memory.extensions.push(extensions[i].id);
                }
                var towers = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_TOWER } });
                for(i = 0; i < towers.length; i++){
                    thisRoom.memory.towers.push(towers[i].id);
                }
                
                thisRoom.memory.scanMode = false;
            }
        } 
    },
};


module.exports = roomMemory;

