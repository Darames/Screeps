var harvester = require('creeps.harvester');
var builder = require('creeps.builder');
var transporter = require('creeps.transporter');


var roleUpgrader = require('role.upgrader');
var roleClaimer = require('role.claimer');
var roleRemoteBuilder = require('role.remoteBuilder');

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
                roleHarvester.run(creep);
            }else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }else if(creep.memory.role == 'builder') {
                builder.run(creep);
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
};

module.exports = creeps;
