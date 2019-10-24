var harvester = require('creep.harvester');
var builder = require('creep.builder');
var transporter = require('creep.transporter');


var upgrader = require('role.upgrader');
var claimer = require('role.claimer');
var remoteBuilder = require('role.remoteBuilder');

var creeps = {
    run: function() {
        for(var roomName in Game.rooms){
            harvester.target(roomName);
            transporter.targets(roomName);
            actions.setEnergyTargets(roomName);
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
                harvester.run(creep);
            }else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }else if(creep.memory.role == 'builder') {
                builder.run(creep);
            }else if(creep.memory.role == 'transporter') {
                transporter.run(creep);
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
};

module.exports = creeps;
