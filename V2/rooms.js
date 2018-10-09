var variables = require('variables');

var room = {
    
    memory: function() {
        function getElement(roomName, sId) {
            var thisRoom = Game.rooms[roomName];
            var element = Game.getObjectById(sId);
            if( element == "null" ){ thisRoom.memory.scanMode = true; }
            return element;
        }
        
        for (var roomName in Game.rooms) {
            var thisRoom = Game.rooms[roomName];
            if(thisRoom.controller.my){
                thisRoom.visual.text( Game.cpu.bucket , 48, 48, {align: 'right', opacity: 0.8});
                thisRoom.sources = thisRoom.find(FIND_SOURCES);
                thisRoom.constructionSites = _.filter(Game.constructionSites, cS => cS.room.name == roomName);
                thisRoom.damagedStructures = creepRoom.find(FIND_STRUCTURES,{ filter: (structure) => { return ( ( 100 * structure.hits ) / structure.hitsMax != 100 ) && structure.structureType != STRUCTURE_CONTROLLER; } });
                thisRoom.structures = _.filter(Game.structures, s => s.room.name == roomName);
                thisRoom.container = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 5 ) );
                thisRoom.controllerContainer = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 5 ) );
                thisRoom.spawns = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_SPAWN );
                thisRoom.extensions = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_EXTENSION );
                thisRoom.towers = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_TOWER  );
                thisRoom.links = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_LINK );
                thisRoom.sourceLinks = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_LINK && ( s.pos.inRangeTo(thisRoom.source[0], 3 ) || s.pos.inRangeTo(thisRoom.source[1], 3 ) ) );
                thisRoom.droppedEnergy = thisRoom.find(FIND_DROPPED_RESOURCES, { filter: (r) => { return r.resourceType == RESOURCE_ENERGY } });
            } // got my contorler
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
                    if(roomCapacity <= 1200){
                        var upgradersLimit = 1;
                    } else if (roomName == "E36S29" || roomName == "E37S27"){
                        var upgradersLimit = 2;
                    } else {
                        var upgradersLimit = 3;
                    }
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
                        if(roomCapacity <= 600){
                            spawn.spawnCreep([CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else if(roomCapacity <= 1200){
                            spawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else if(roomCapacity <= 2000){
                            spawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        } else {
                            spawn.spawnCreep([CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE], newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                        }
                    }else if(upgraders.length < upgradersLimit) {
                        var newName = 'Upgrader' + Game.time;
                        if(roomCapacity <= 600){
                            spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
                        } else if(roomCapacity <= 1200){
                            spawn.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
                        } else{
                            spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
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
