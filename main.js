var room = require('rooms');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTransporter = require('role.transporter');
var structureTower = require('structure.tower');
var roleClaimer = require('role.claimer');
var roleRemoteBuilder = require('role.remoteBuilder');

module.exports.loop = function () {
    // console.log(Game.cpu.bucket);

    //toDo = flags deklarieren und dann übergeben wenn gebraucht z.B an creep upgrader
    for (var flag in Game.flags) {
        if( Game.flags[flag].name.substr(0, 4) == "uPos"){
            Game.rooms[Game.flags[flag].pos.roomName].upgraderFlag = Game.flags[flag];
        }
    }
    
    // console.log(Game.getObjectById("blub"));

    //toDo = harvester anpassen sourcefindung bei einem container defekt
    //toDo = wenn drop näher dann drop
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    room.memory(); //room memory update
    room.spawn(); //room spawn creeps
    
    for(var nameRoom in Game.rooms){
        
        var damagedStructures = Game.rooms[nameRoom].find(FIND_STRUCTURES,{
            filter: (structure) => {
                return ( ( 100 * structure.hits ) / structure.hitsMax != 100 ) && structure.structureType != STRUCTURE_CONTROLLER; 
            } 
        });

        if(Game.rooms[nameRoom].memory.towers){
            structureTower.run(nameRoom, damagedStructures);
        }
    }
    for(var nameCreep in Game.creeps) {
        var creep = Game.creeps[nameCreep];
        
        // if(creep.memory.role == 'transporter') {
        //     var found = creep.pos.lookFor(LOOK_STRUCTURES);
        //     // console.log(found);
        //     if(!found.length) {
        //         creep.pos.createConstructionSite(STRUCTURE_ROAD);
        //     }
        // }
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }else if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }else if(creep.memory.role == 'remoteBuilder') {
            roleRemoteBuilder.run(creep);
        }else if(creep.memory.role == 'scout') {
        
            if(creep.pos.roomName != "E36S29" ){
                creep.moveTo(new RoomPosition(25, 25, 'E36S29'));
                console.log(creep.pos.roomName);
            } else {
                creep.moveTo(new RoomPosition(25, 48, 'E36S29'));
                creep.say("I'm there");
            }
            // Game.spawns['Darames'].spawnCreep([MOVE], "Scout", {memory: {role: 'scout'}});
            
        }
    }
}
