var variables = require('variables');

var room = {
    
    memory: function() {
        
        for (var roomName in Game.rooms) {
            var thisRoom = Game.rooms[roomName];
            let heap = Game.cpu.getHeapStatistics();
            thisRoom.visual.text( Game.cpu.bucket , 48, 48, {align: 'right', opacity: 0.8});
            
            // if(thisRoom.name == "E34S29"){
            //     var scan = true; 
            // }
            
           thisRoom.source = thisRoom.find(FIND_SOURCES);

            if(thisRoom.controller !== 'undefined'){
                if(thisRoom.controller.owner.username == "Darames"){
                    
                    thisRoom.container = new Array();
                    for (var id in thisRoom.memory.container) {
                        thisRoom.container.push( variables.getElement(roomName, thisRoom.memory.container[id]) );
                    }
                    thisRoom.controllerContainer = new Array();
                    for (var id in thisRoom.memory.controllerContainer) {
                        thisRoom.controllerContainer.push( variables.getElement(roomName, thisRoom.memory.controllerContainer[id]) );
                    }
                    thisRoom.spawn = new Array();
                    for (var id in thisRoom.memory.spawn) {
                        thisRoom.spawn.push( variables.getElement(roomName, thisRoom.memory.spawn[id]) );
                    }
                    thisRoom.extensions = new Array();
                    for (var id in thisRoom.memory.extensions) {
                        thisRoom.extensions.push( variables.getElement(roomName, thisRoom.memory.extensions[id]) );
                    }
                    thisRoom.towers = new Array();
                    for (var id in thisRoom.memory.towers) {
                        thisRoom.towers.push( variables.getElement(roomName, thisRoom.memory.towers[id]) );
                    }
                    // thisRoom.links = new Array();
                    // for (var id in thisRoom.memory.links) {
                    //     thisRoom.links.push( variables.getElement(roomName, thisRoom.memory.links[id]) );
                    // }
                    
                    var constructionSitesCount = new Array();
                    for (var constructionSitesName in Game.constructionSites) {
                        if( Game.constructionSites[constructionSitesName].room.name == thisRoom.name ){
                            constructionSitesCount.push(constructionSitesName);
                        }
                    }
                    if(thisRoom.memory.scanMode == ""){ var scan = true; }
                    if(thisRoom.memory.scanMode !== 'undefined'){
                        if(thisRoom.memory.constructionSites){
                            if(constructionSitesCount.length != thisRoom.memory.constructionSites.length){
                                var constructionSites = true;
                                var scan = true;
                                thisRoom.memory.constructionSites = constructionSitesCount;
                            } else if(thisRoom.memory.constructionSites.length > 0){
                                var constructionSites = true;
                            }        
                            if(constructionSites){ thisRoom.memory.scanMode = "waiting"; }
                        } else { 
                            thisRoom.memory.constructionSites = new Array(); 
                            
                        }
                    } else {
                        var constructionSites = true;
                        var scan = true;
                        thisRoom.memory.scanMode = true;
                        thisRoom.memory.constructionSites = constructionSitesCount;
                    }
                    if( ( constructionSites != true && thisRoom.memory.scanMode === "waiting" ) || scan ){
                        thisRoom.memory.scanMode = true;
                    }
                    if(thisRoom.memory.scanMode === true){
                        
                        thisRoom.memory.sources = new Array();
                        thisRoom.memory.container = new Array();
                        thisRoom.memory.controllerContainer = new Array();
                        thisRoom.memory.spawn = new Array();
                        thisRoom.memory.extensions = new Array();
                        thisRoom.memory.towers = new Array();
                        thisRoom.memory.storage = new Array();
                        thisRoom.memory.links = new Array();
                        thisRoom.memory.sourceLinks = new Array();
                        
                        var sources = thisRoom.find(FIND_SOURCES);
                        for(i = 0; i < sources.length; i++){
                            thisRoom.memory.sources.push(sources[i].id);
                        }
                        for (var flag in Game.flags) {
                            // console.log(Game.flags[flag].pos);
                            if( Game.flags[flag].name == "uPos" || Game.flags[flag].name == "uPos2" ){
                                if( Game.flags[flag].pos.roomName == thisRoom.name ){
                                    var upgraderFlag = Game.flags[flag];
                                }
                            }
                        }
                        // var container = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_CONTAINER && !(structure.pos.inRangeTo(structure.room.controller, 3)) && !(structure.pos.inRangeTo(upgraderFlag, 3)) } });
                        var container = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_CONTAINER && !structure.pos.inRangeTo(structure.room.controller, 5 ) } });
                        for(i = 0; i < container.length; i++){
                            thisRoom.memory.container.push(container[i].id);
                        }
                        // var controllerContainer = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER && ( structure.pos.inRangeTo(structure.room.controller, 3) || structure.pos.inRangeTo(upgraderFlag, 3) ) } });
                        var controllerContainer = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(structure.room.controller, 5 ) } });
                        for(i = 0; i < controllerContainer.length; i++){
                            thisRoom.memory.controllerContainer.push(controllerContainer[i].id);
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
                        var storage = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_STORAGE } });
                        for(i = 0; i < storage.length; i++){
                            thisRoom.memory.storage.push(storage[i].id);
                        }
                        var links = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_LINK } });
                        for(i = 0; i < links.length; i++){
                            thisRoom.memory.links.push(links[i].id);
                        }
                        var sourceLinks = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return  structure.structureType == STRUCTURE_LINK && ( structure.pos.inRangeTo(thisRoom.source[0], 3 ) || structure.pos.inRangeTo(thisRoom.source[1], 3 ) ) } });
                        for(i = 0; i < sourceLinks.length; i++){
                            thisRoom.memory.sourceLinks.push(sourceLinks[i].id);
                        }
                        
                        thisRoom.memory.scanMode = false;
                    }
                } // owner Darames
            } // got contorler
        } 
    },
    spawn: function() {
        for (var roomName in Game.rooms) {
            var thisRoom = Game.rooms[roomName];
            if(thisRoom.controller !== 'undefined'){
                var roomGotSpawn = false;
                for(var spawnName in Game.spawns){
                    if(Game.spawns[spawnName].room == thisRoom){
                        roomGotSpawn = true;
                    }
                }
                if(thisRoom.controller.owner.username == "Darames" && roomGotSpawn){
                    
                    var roomCreeps = new Array();
                    for (var creepName in Game.creeps) {
                        var creep = Game.creeps[creepName];
                        if( Game.rooms[creep.pos.roomName] == thisRoom ){
                            roomCreeps.push(creep);
                        }
                    }
                    
                    var roomCapacity = thisRoom.energyCapacityAvailable;
                    // console.log(roomCapacity);
                    
                    var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
                    if(roomCapacity <= 1200){
                        var harvestersLimit = 1;
                        if (roomName == "E37S27"){
                            harvestersLimit = 2;
                        }
                    } else {
                        var harvestersLimit = 2;
                    }
                    var transporters = _.filter(roomCreeps, (creep) => creep.memory.role == 'transporter');
                    if(roomCapacity <= 1200){
                        var transportersLimit = 1;
                    } else if (roomName == "E36S29"){
                        var transportersLimit = 3;
                    } else{
                        var transportersLimit = 2;
                    }
                    var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
                    var upgradersLimit = 1;
                    var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
                    if(roomCapacity <= 1200){
                        var buildersLimit = 1;
                    } else{
                        var buildersLimit = 1;
                    }
                    
                    // if(thisRoom.memory.constructionSites.length > 0){
                    //     buildersLimit = buildersLimit + 1;
                    // }
                    
                    var roomSpawns = _.filter(Game.spawns, (spawn) => spawn.room == thisRoom);
                    var spawn = roomSpawns[0];
                    if(roomSpawns.length > 1){
                        var spawn = roomSpawns[0];
                    }
                    
                    //console.log(roomName + " " + thisRoom.energyCapacityAvailable);
                    
        
                    if(harvesters.length < harvestersLimit) {
                        var newName = 'Harvester' + Game.time; 
                        var source = 0; 
                        // var harvesterOnSource = _.filter(roomCreeps, (creep) => creep.memory.source == 1);
                        var harvesterOnSource = _.filter(roomCreeps, (creep) => creep.memory.source == 0 );
                        if(harvesterOnSource.length){var source = 1;}
                        if(roomCapacity <= 600){
                            spawn.spawnCreep([WORK,WORK,MOVE,MOVE], newName, {memory: {role: 'harvester', source: source }});
                        } else if(roomCapacity <= 1200){
                            spawn.spawnCreep([WORK,WORK,WORK,MOVE,MOVE,MOVE], newName, {memory: {role: 'harvester', source: source }});
                        } else {
                            spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, {memory: {role: 'harvester', source: source }});
                        }
                    }else if(transporters.length < transportersLimit) {
                        var newName = 'Transporter' + Game.time;
                        var bodyParts = [CARRY,CARRY,MOVE,MOVE];
                        if(roomCapacity <= 600){
                            spawn.spawnCreep(bodyParts, newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else if(roomCapacity <= 1200){
                            var body = bodyParts.concat(bodyParts);
                            spawn.spawnCreep(body, newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else if(roomCapacity <= 2000){
                            var body = bodyParts.concat(bodyParts, bodyParts);
                            spawn.spawnCreep(body, newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else {
                            var body = bodyParts.concat(bodyParts, bodyParts, bodyParts, bodyParts, bodyParts, bodyParts);
                            spawn.spawnCreep(body, newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        }
                    }else if(upgraders.length < upgradersLimit) {
                        var newName = 'Upgrader' + Game.time;
                        if(roomCapacity <= 600){
                            spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
                        } else if(roomCapacity <= 1200){
                            spawn.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
                        } else{
                            spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
                        }
                    }else if(builders.length < buildersLimit) {
                        var newName = 'Builder' + Game.time;
                        if(roomCapacity <= 600){
                            spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'builder'}});
                        } else if(roomCapacity <= 1200){
                            spawn.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, {memory: {role: 'builder'}});
                        } else {
                            spawn.spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'builder'}});
                        }
                    }
                    
                    // else if(mDefender.length < mDefenderLimit) {
                    //     var newName = 'MeleeDefender' + Game.time;
                    //     if(roomCapacity <= 600){
                    //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'defender'}});
                    //     } else if(roomCapacity <= 1200){
                    //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'defender'}});
                    //     } else {
                    //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'defender'}});
                    //     }
                    // }
                    
                    
                    if(thisRoom.energyAvailable <= 600) {
                        if (harvesters.length < 1){
                            //backup harvester
                            var newName = 'BHarvester' + Game.time;
                            spawn.spawnCreep([WORK,WORK,MOVE,MOVE], newName, {memory: {role: 'harvester', source: 1 }});
                        } else if (transporters.length < 1) {
                            //backup transporter
                            var newName = 'BTransporter' + Game.time;
                            spawn.spawnCreep([CARRY,CARRY,MOVE,MOVE], newName, 
                                {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } 
                    } 
                    
                    if(spawn.spawning) { 
                        var spawningCreep = Game.creeps[spawn.spawning.name];
                        spawn.room.visual.text(
                            'spawn ' + spawningCreep.memory.role,
                            spawn.pos.x + 1, 
                            spawn.pos.y, 
                            {align: 'left', opacity: 0.8});
                    }
                    
                }
            }
        }
    },
};

module.exports = room;
