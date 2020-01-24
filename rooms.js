let actions = require('actions');
let transporter = require('creep.transporter');

// let letiables = require('letiables');


let room = {

    run: function () {
        if (Memory.rooms.toClaim) {
            let rangeToClaimRoom = [];
            for (const roomName in Game.rooms) {
                let thisRoom = Game.rooms[roomName];
                if (thisRoom.controller.my) {
                    let claimRoom = Memory.rooms.toClaim[0];
                    let roomX = thisRoom.name.slice(1, 3), roomY = thisRoom.name.slice(4),
                        claimRoomX = claimRoom.slice(1, 3), claimRoomY = claimRoom.slice(4),
                        roomRange = Math.abs(roomX - claimRoomX) + Math.abs(roomY - claimRoomY);
                    if (roomRange = 1){
                        thisRoom.memory.claiming = claimRoom;
                        Memory.rooms.toClaim.shift();  
                    } else {
                        rangeToClaimRoom.push([thisRoom.name, roomRange]);
                    }
                }
            }
            if (rangeToClaimRoom.length > 1) {
                rangeToClaimRoom.sort(function(a, b) {
                    return a[1] - b[1];
                });
            }
            if (rangeToClaimRoom.length >= 1) {
                thisRoom.memory.claiming = rangeToClaimRoom[0][0];
            }
            
        }
        
        for (const roomName in Game.rooms) {
            let thisRoom = Game.rooms[roomName];

            this.memory(thisRoom);
            this.spawns(thisRoom);

            if (thisRoom.memory.towers) {
                structureTower.run(nameRoom, thisRoom.memory.damagedStructures);
            }

            transporter.targets(thisRoom);
            actions.setEnergyTargets(thisRoom);
            
        }
    },

    memory: function (thisRoom) {
        if (thisRoom.controller.my) {
            thisRoom.visual.text(Game.cpu.bucket, 48, 48, { align: 'right', opacity: 0.8 });
            thisRoom.creeps = _.filter(Game.creeps, c => c.room.name == thisRoom.name && c.my);
            thisRoom.sources = thisRoom.find(FIND_SOURCES);
            thisRoom.constructionSites = _.filter(Game.constructionSites, cS => cS.room.name == thisRoom.name);
            thisRoom.damagedStructures = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return ((100 * structure.hits) / structure.hitsMax != 100) && structure.structureType != STRUCTURE_CONTROLLER; } });
            thisRoom.damagedStructures = _.filter(thisRoom.damagedStructures, (structures) => (structures.structureType != "constructedWall" && structures.structureType != "rampart") || (structures.structureType == "constructedWall" && !(structures.hits > 170000)) || (structures.structureType == "rampart" && !(structures.hits > 170000)));
            thisRoom.structures = _.filter(Game.structures, s => s.room.name == thisRoom.name);
            thisRoom.container = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 5));
            thisRoom.controllerContainer = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 5));
            thisRoom.spawns = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_SPAWN);
            thisRoom.extensions = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_EXTENSION);
            thisRoom.towers = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_TOWER);
            thisRoom.links = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_LINK);
            thisRoom.sourceLinks = _.filter(thisRoom.structures, s => s.structureType == STRUCTURE_LINK && (s.pos.inRangeTo(thisRoom.source[0], 3) || s.pos.inRangeTo(thisRoom.source[1], 3)));
            thisRoom.droppedEnergy = thisRoom.find(FIND_DROPPED_RESOURCES, { filter: (r) => { return r.resourceType == RESOURCE_ENERGY } });
        } // got my contorler
    },

    spawns: function () {
        if (thisRoom.controller !== 'undefined') {
            thisRoom.roomGotSpawn = false;
            if (thisRoom.spawns.length > 0) { thisRoom.roomGotSpawn = true; }
        }
        if (thisRoom.roomGotSpawn == true) {
            let roomCapacity = thisRoom.energyCapacityAvailable;
            let creeps;
            creeps.harvesters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'harvester');
            creeps.transporters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'transporter');
            creeps.upgraders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'upgrader');
            creeps.builders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'builder');
            if (thisRoom.memory.claiming) {
                creeps.claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == thisRoom.name && creep.memory.role == 'claimer');
            }
            let spawn = thisRoom.spawns[0];
            let harvestersLimit = 1;
            let transportersLimit = 1;
            let upgradersLimit = 1;
            let buildersLimit = 1;
            let claimersLimit = 1;

            if (thisRoom.spawns.length > 1 && thisRoom.spawns[0].spawning) { spawn = thisRoom.spawns[1]; }
            if (roomCapacity > 1200) { harvestersLimit = 2; }
            if (roomCapacity > 1200) { transportersLimit = 2; }
            if (roomCapacity > 1200) { upgradersLimit = 1; }
            if (roomCapacity > 1200) { buildersLimit = 1; }


            if (creeps.harvesters.length < harvestersLimit) {
                let newName = 'Harvester' + Game.time;
                let source = 0;
                let harvesterOnSource = _.filter(roomCreeps, (creep) => creep.memory.source == 0);
                let body = [WORK, MOVE];
                let bodyCost = 150;
                let moveCount = 1;
                let stepCost = 150;
                if (harvesterOnSource.length) { source = 1; }

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 650) {
                    body = body.concat([WORK]);
                    bodyCost = bodyCost + 100;
                    stepCost = 100;
                    if (moveCount = 3) {
                        body = body.concat([MOVE]);
                        moveCount = moveCount + 1;
                        bodyCost = bodyCost + 50;
                        stepCost = stepCost + 50;
                    }
                }

                spawn.spawnCreep(body, newName, { memory: { role: 'harvester', source: source } });
            } else if (creeps.transporters.length < transportersLimit) {
                let newName = 'Transporter' + Game.time;
                let body = [CARRY, MOVE, CARRY, MOVE];
                let bodyCost = 200;
                let stepCost = 200;

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 1400) {
                    body = body.concat([CARRY, MOVE]);
                    bodyCost = bodyCost + 100;
                    stepCost = 100;
                }
                spawn.spawnCreep(body, newName, { memory: { role: 'transporter', delivering: 'false', target: 'none' } });
            } else if (creeps.upgraders.length < upgradersLimit) {
                let newName = 'Upgrader' + Game.time;
                let body = [WORK, MOVE, CARRY, MOVE];
                let bodyCost = 250;
                let carryCount = 1;
                let stepCost = 250;

                while ((bodyCost + stepCost) < roomCapacity && thisRoom.controller.level < 8) {
                    body = body.concat([WORK, MOVE]);
                    bodyCost = bodyCost + 150;
                    stepCost = 150;
                    if (carryCount = 3) {
                        body = body.concat([CARRY, MOVE]);
                        carryCount = carryCount + 1;
                        bodyCost = bodyCost + 100;
                        stepCost = stepCost + 100;
                    }
                }
                spawn.spawnCreep(body, newName, { memory: { role: 'upgrader' } });
            } else if (creeps.builders.length < buildersLimit) {
                let newName = 'Builder' + Game.time;
                let body = [WORK, MOVE, CARRY, MOVE];
                let bodyCost = 250;
                let stepCost = 250;

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 2000) {
                    body = body.concat([WORK, MOVE, CARRY, MOVE]);
                    bodyCost = bodyCost + 250;
                    stepCost = 250;
                }
                spawn.spawnCreep(body, newName, { memory: { role: 'builder' } });
            } else if (creeps.claimers.length = 0 && thisRoom.memory.claiming) {
                let newName = 'Builder' + Game.time;
                let body = [WORK, MOVE, CARRY, MOVE];
                let bodyCost = 250;
                let stepCost = 250;

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 2000) {
                    body = body.concat([WORK, MOVE, CARRY, MOVE]);
                    bodyCost = bodyCost + 250;
                    stepCost = 250;
                }
                spawn.spawnCreep(body, newName, { memory: { role: 'builder' } });
            }
            // else if(mDefender.length < mDefenderLimit) {
            //     let newName = 'MeleeDefender' + Game.time;
            //     if(roomCapacity <= 600){
            //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'defender'}});
            //     } else if(roomCapacity <= 1200){
            //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'defender'}});
            //     } else {
            //         spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'defender'}});
            //     }
            // }

            // if (thisRoom.energyAvailable <= 600) {
            //     if (creeps.harvesters.length < 1) {
            //         //backup harvester
            //         let newName = 'BHarvester' + Game.time;
            //         spawn.spawnCreep([WORK, WORK, MOVE, MOVE], newName, { memory: { role: 'harvester', source: 1 } });
            //     } else if (creeps.transporters.length < 1) {
            //         //backup transporter
            //         let newName = 'BTransporter' + Game.time;
            //         spawn.spawnCreep([CARRY, CARRY, MOVE, MOVE], newName,
            //             { memory: { role: 'transporter', delivering: 'false', target: 'none' } });
            //     }
            // }

            if (spawn.spawning) {
                let spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    'spawn ' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    { align: 'left', opacity: 0.8 });
            }
        }
    }
};

module.exports = room;
