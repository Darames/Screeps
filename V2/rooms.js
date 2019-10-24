var variables = require('variables');

var room = {
    
    memory: function() {
        // function getElement(roomName, sId) {
        //     var thisRoom = Game.rooms[roomName];
        //     var element = Game.getObjectById(sId);
        //     if( element == "null" ){ thisRoom.memory.scanMode = true; }
        //     return element;
        // }
        
        for (var roomName in Game.rooms) {
            var thisRoom = Game.rooms[roomName];
            if(thisRoom.controller.my){
                thisRoom.visual.text( Game.cpu.bucket , 48, 48, {align: 'right', opacity: 0.8});
                thisRoom.creeps = _.filter(Game.creeps, c => c.room.name == roomName && c.my);
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

    spawns: function() {
        for (var roomName in Game.rooms) {
            var thisRoom = Game.rooms[roomName];
            if(thisRoom.controller !== 'undefined'){
                var roomGotSpawn = false;
                if(thisRoom.spawns.length > 0){
                    roomGotSpawn = true;
                }
            }
            if(roomGotSpawn = true){
                var roomCapacity = thisRoom.energyCapacityAvailable;
                var harvesters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'harvester');
                var transporters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'transporter');
                var upgraders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'upgrader');
                var builders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'builder');
                //var spawn = thisRoom.spawns[0];
                //if(thisRoom.spawns.length > 1 && thisRoom.spawns[0].spawning ){
                //    spawn = thisRoom.spawns[1];
                //}
                var harvestersLimit = 1;
                var transportersLimit = 1;
                var upgradersLimit = 1;
                var buildersLimit = 1;
                
                
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
    },










    spawns: function() {
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
                        var bodyParts = [WORK,WORK,MOVE,MOVE];
                        if(harvesterOnSource.length){var source = 1;}
                        if(roomCapacity <= 600){
                            var body = bodyParts;
                        } else if(roomCapacity <= 1200){
                            var body = bodyParts.concat(bodyParts);
                        } else {
                            var body = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
                        }
                        spawn.spawnCreep(body, newName, {memory: {role: 'harvester', source: source }});
                    }else if(transporters.length < transportersLimit) {
                        var newName = 'Transporter' + Game.time;
                        var bodyParts = [CARRY,CARRY,MOVE,MOVE];
                        if(roomCapacity <= 600){
                            var body = bodyParts;
                        } else if(roomCapacity <= 1200){
                            var body = bodyParts.concat(bodyParts);
                        } else if(roomCapacity <= 2000){
                            var body = bodyParts.concat(bodyParts, bodyParts);
                        } else {
                            var body = bodyParts.concat(bodyParts, bodyParts, bodyParts, bodyParts, bodyParts, bodyParts);
                        }
                        spawn.spawnCreep(body, newName, {memory: {role: 'transporter', delivering: 'false', target: 'none'}});
                    }else if(upgraders.length < upgradersLimit) {
                        var newName = 'Upgrader' + Game.time;
                        var bodyParts = [WORK,CARRY,MOVE,MOVE];
                        if(roomCapacity <= 600){
                            var body = bodyParts;
                        } else if(roomCapacity <= 1200){
                            var body = bodyParts.concat(bodyParts);
                        } else{
                            var body = bodyParts.concat(bodyParts, bodyParts);
                        }
                        spawn.spawnCreep(body, newName, {memory: {role: 'upgrader'}});
                    }else if(builders.length < buildersLimit) {
                        var newName = 'Builder' + Game.time;
                        var bodyParts = [WORK,CARRY,MOVE,MOVE];
                        if(roomCapacity <= 600){
                            var body = bodyParts;
                        } else if(roomCapacity <= 1200){
                            var body = bodyParts.concat(bodyParts);
                        } else{
                            var body = bodyParts.concat(bodyParts, bodyParts);
                        }
                        spawn.spawnCreep(body, newName, {memory: {role: 'builder'}});
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
    }
};

module.exports = room;
