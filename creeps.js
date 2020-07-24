let harvester = require('creep.harvester');
let builder = require('creep.builder');
let transporter = require('creep.transporter');
let upgrader = require('creep.upgrader');

let remoteBuilder = require('creep.remoteBuilder');
let claimer = require('creep.claimer');

let creeps = {
    run: function () {
        for(let name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        for (let nameCreep in Game.creeps) {
            let creep = Game.creeps[nameCreep];
            
            // if(creep.memory.role == 'transporter') {
            //     let found = creep.pos.lookFor(LOOK_STRUCTURES);
            //     // console.log(found);
            //     if(!found.length) {
            //         creep.pos.createConstructionSite(STRUCTURE_ROAD);
            //     }
            // }

            switch(creep.memory.role) {
                case 'harvester':
                    harvester.run(creep);
                    break;
                case 'upgrader':
                    upgrader.run(creep);
                    break;
                case 'builder':
                    builder.run(creep);
                    break;
                case 'transporter':
                    transporter.run(creep);
                    break;
                case 'claimer':
                    claimer.claimer(creep);
                    break;
                case 'remoteBuilder':
                    remoteBuilder.remoteBuilder(creep);
                    break;
                case 'scout':
                    if (creep.pos.roomName != Memory.rooms.toScout[0]) {
                        creep.moveTo(new RoomPosition(25, 25, Memory.rooms.toScout[0]));
                    }
                    // Game.spawns['Darames'].spawnCreep([MOVE], "Scout", {memory: {role: 'scout'}});
                    break;
                default:
                  // nothing
            }
        }
    }
};

module.exports = creeps;
