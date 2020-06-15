var harvester = require('creep.harvester');
var builder = require('creep.builder');
var transporter = require('creep.transporter');
var upgrader = require('creep.upgrader');


// var claimer = require('role.claimer');
// var remoteBuilder = require('role.remoteBuilder');

var creeps = {
    run: function () {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        for (let nameCreep in Game.creeps) {
            let creep = Game.creeps[nameCreep];
            
            // if(creep.memory.role == 'transporter') {
            //     var found = creep.pos.lookFor(LOOK_STRUCTURES);
            //     // console.log(found);
            //     if(!found.length) {
            //         creep.pos.createConstructionSite(STRUCTURE_ROAD);
            //     }
            // }

            if (creep.memory.role == 'harvester') {
                harvester.run(creep);
                continue;
            } else if (creep.memory.role == 'upgrader') {
                upgrader.run(creep);
                continue;
            } else if (creep.memory.role == 'builder') {
                builder.run(creep);
                continue;
            } else if (creep.memory.role == 'transporter') {
                transporter.run(creep);
                continue;
            } else if (creep.memory.role == 'claimer') {
                // roleClaimer.run(creep);
                continue;
            } else if (creep.memory.role == 'remoteBuilder') {
                // roleRemoteBuilder.run(creep);
                continue;
            } else if (creep.memory.role == 'scout') {

                if (creep.pos.roomName != Memory.rooms.toScout[0]) {
                    creep.moveTo(new RoomPosition(25, 25, Memory.rooms.toScout[0]));
                }
                continue;
                // Game.spawns['Darames'].spawnCreep([MOVE], "Scout", {memory: {role: 'scout'}});

            }
        }
    }
};

module.exports = creeps;
