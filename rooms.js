let actions = require('actions');
let transporter = require('creep.transporter');
let structures = require('structures');

// let letiables = require('letiables');


let room = {

    run: function () {
        if (typeof Memory.rooms.toClaim !== 'undefined') {
            if (Memory.rooms.toClaim.length > 0) {
                this.claimRooms();
            }
        }

        for (const roomName in Game.rooms) {
            let thisRoom = Game.rooms[roomName];
            if (typeof thisRoom.controller !== 'undefined') {
                if (thisRoom.controller.my) {
                    this.memory(thisRoom);
                    this.spawns(thisRoom);
                    transporter.targets(thisRoom);
                    actions.setEnergyTargets(thisRoom);
                    structures.run(thisRoom);
                }
            }
        }
    },

    claimRooms: function () {
        let rangeToClaimRoom = [];
        let claimRoom = Memory.rooms.toClaim[0];

        for (const roomName in Game.rooms) {
            let thisRoom = Game.rooms[roomName];
            if (typeof thisRoom.controller !== 'undefined') {
                if (thisRoom.controller.my) {
                    let roomX = thisRoom.name.slice(1, 3), roomY = thisRoom.name.slice(4),
                        claimRoomX = claimRoom.slice(1, 3), claimRoomY = claimRoom.slice(4),
                        roomRange = Math.abs(roomX - claimRoomX) + Math.abs(roomY - claimRoomY);
                    if (roomRange = 1) {
                        thisRoom.memory.claiming = claimRoom;
                        Memory.rooms.toClaim.shift();
                    } else {
                        rangeToClaimRoom.push([thisRoom.name, roomRange]);
                    }
                }
            }
        }

        if (rangeToClaimRoom.length > 1) { rangeToClaimRoom.sort(function (a, b) { return a[1] - b[1]; }); }
        if (rangeToClaimRoom.length >= 1) { Game.rooms[rangeToClaimRoom[0][0]].memory.claiming = claimRoom; }
    },

    memory: function (thisRoom) {
        if (typeof thisRoom.memory.limits === 'undefined') {
            thisRoom.memory.limits = {
                'tran': { 'value': 1, 'autoChange': true },
                'upgr': { 'value': 1, 'autoChange': false },
                'buil': { 'value': 1, 'autoChange': true },
                'harv': { 'value': 1, 'autoChange': false },
                'capacity': thisRoom.energyCapacityAvailable
            };
        }

        thisRoom.visual.text(Game.cpu.bucket, 48, 48, { align: 'right', opacity: 0.8 });
        thisRoom.creeps = _.filter(Game.creeps, c => c.room.name == thisRoom.name && c.my);
        thisRoom.creeps.harvesters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'harvester');
        thisRoom.creeps.transporters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'transporter');
        thisRoom.creeps.upgraders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'upgrader');
        thisRoom.creeps.builders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'builder');
        if (thisRoom.memory.claiming) {
            thisRoom.creeps.claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == thisRoom.name && creep.memory.role == 'claimer');
        }
        thisRoom.sources = thisRoom.find(FIND_SOURCES);
        thisRoom.constructionSites = _.filter(Game.constructionSites, cS => cS.room.name == thisRoom.name);
        thisRoom.damagedStructures = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return ((100 * structure.hits) / structure.hitsMax != 100) && structure.structureType != STRUCTURE_CONTROLLER; } });
        thisRoom.damagedStructures = _.filter(thisRoom.damagedStructures, (structures) => (structures.structureType != "constructedWall" && structures.structureType != "rampart") || (structures.structureType == "constructedWall" && !(structures.hits > 170000)) || (structures.structureType == "rampart" && !(structures.hits > 170000)));
        thisRoom.droppedEnergy = thisRoom.find(FIND_DROPPED_RESOURCES, { filter: (r) => { return r.resourceType == RESOURCE_ENERGY } });
        thisRoom.limits = thisRoom.memory.limits;

        if (typeof thisRoom.memory.scanMode === 'undefined') {
            thisRoom.memory.scanMode = true;
            thisRoom.memory.constructionSites = thisRoom.constructionSites;
        } else {
            if (thisRoom.constructionSites) {
                if (thisRoom.constructionSites.length != thisRoom.memory.constructionSites.length) {
                    thisRoom.memory.scanMode = true;
                    thisRoom.memory.constructionSites = thisRoom.constructionSites;
                }
            }
        }

        if (thisRoom.memory.scanMode === true) {
            thisRoom.structuresAll = _.filter(Game.structures, s => s.room.name == thisRoom.name);
            thisRoom.container = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 5));
            thisRoom.controllerContainer = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(s.room.controller, 5));
            thisRoom.spawns = _.filter(Game.spawns, s => s.room.name == thisRoom.name);
            thisRoom.extensions = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_EXTENSION);
            thisRoom.structures = {
                'towers': _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_TOWER)
            };
            thisRoom.links = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_LINK);
            thisRoom.sourceLinks = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_LINK && (s.pos.inRangeTo(thisRoom.sources[0], 3) || s.pos.inRangeTo(thisRoom.sources[1], 3)));
            thisRoom.storage = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_STORAGE);

            thisRoom.memory.structuresAll = [];
            thisRoom.memory.container = [];
            thisRoom.memory.controllerContainer = [];
            thisRoom.memory.spawns = [];
            thisRoom.memory.extensions = [];
            thisRoom.memory.structures = [];
            thisRoom.memory.storage = [];
            thisRoom.memory.links = [];
            thisRoom.memory.sourceLinks = [];

            if (typeof thisRoom.structuresAll !== 'undefined') {
                for (let i = 0; i < thisRoom.structuresAll.length; i++) { thisRoom.memory.structuresAll.push(thisRoom.structuresAll[i].id); }
            }
            if (typeof thisRoom.container !== 'undefined') {
                for (let i = 0; i < thisRoom.container.length; i++) { thisRoom.memory.container.push(thisRoom.container[i].id); }
            }
            if (typeof thisRoom.controllerContainer !== 'undefined') {
                for (let i = 0; i < thisRoom.controllerContainer.length; i++) { thisRoom.memory.controllerContainer.push(thisRoom.controllerContainer[i].id); }
            }
            if (typeof thisRoom.spawns !== 'undefined') {
                for (let i = 0; i < thisRoom.spawns.length; i++) { thisRoom.memory.spawns.push(thisRoom.spawns[i].id); }
            }
            if (typeof thisRoom.extensions !== 'undefined') {
                for (let i = 0; i < thisRoom.extensions.length; i++) { thisRoom.memory.extensions.push(thisRoom.extensions[i].id); }
            }
            if (typeof thisRoom.structures !== 'undefined') {
                for (let i = 0; i < thisRoom.structures.towers.length; i++) { thisRoom.memory.towers.push(thisRoom.towers[i].id); }
            }
            if (typeof thisRoom.storage !== 'undefined') {
                for (let i = 0; i < thisRoom.storage.length; i++) { thisRoom.memory.storage.push(thisRoom.storage[i].id); }
            }
            if (typeof thisRoom.links !== 'undefined') {
                for (let i = 0; i < thisRoom.links.length; i++) { thisRoom.memory.links.push(thisRoom.links[i].id); }
            }
            if (typeof thisRoom.sourceLinks !== 'undefined') {
                for (let i = 0; i < thisRoom.sourceLinks.length; i++) { thisRoom.memory.sourceLinks.push(thisRoom.sourceLinks[i].id); }
            }


            thisRoom.memory.scanMode = false;
        } else {
            for (let id in thisRoom.memory.structuresAll) { thisRoom.structuresAll.push(actions.getElement(thisRoom.name, thisRoom.memory.structuresAll[id])); }
            for (let id in thisRoom.memory.container) { thisRoom.container.push(actions.getElement(thisRoom.name, thisRoom.memory.container[id])); }
            for (let id in thisRoom.memory.controllerContainer) { thisRoom.controllerContainer.push(actions.getElement(thisRoom.name, thisRoom.memory.controllerContainer[id])); }
            for (let id in thisRoom.memory.spawns) { thisRoom.spawns.push(actions.getElement(thisRoom.name, thisRoom.memory.spawn[id])); }
            for (let id in thisRoom.memory.extensions) { thisRoom.extensions.push(actions.getElement(thisRoom.name, thisRoom.memory.extensions[id])); }
            if (typeof thisRoom.memory.structures !== 'undefined') {
                for (let id in thisRoom.memory.structures.towers) { thisRoom.towers.push(actions.getElement(thisRoom.name, thisRoom.memory.towers[id])); }
            }
            for (let id in thisRoom.memory.storage) { thisRoom.storage.push(actions.getElement(thisRoom.name, thisRoom.memory.storage[i].id)); }
            for (let id in thisRoom.memory.links) { thisRoom.links.push(actions.getElement(thisRoom.name, thisRoom.memory.links[id])); }
            for (let id in thisRoom.memory.sourceLinks) { thisRoom.sourceLinks.push(sactions.getElement(thisRoom.name, thisRoom.memory.ourceLinks[id])); }
        }
    },

    spawns: function (thisRoom) {
        thisRoom.roomGotSpawn = false;
        if (thisRoom.spawns.length > 0) { thisRoom.roomGotSpawn = true; }
        if (thisRoom.roomGotSpawn == true) {
            let roomCapacity = thisRoom.energyCapacityAvailable;
            let creeps = thisRoom.creeps;
            let spawn = thisRoom.spawns[0];
            let limits = thisRoom.limits;

            if (thisRoom.spawns.length > 1 && thisRoom.spawns[0].spawning) { spawn = thisRoom.spawns[1]; }
            if (roomCapacity > 1200) {
                limits.harv.value = 2;
                limits.capacity = roomCapacity;

                if (limits.capacity === roomCapacity && limits.tran.value <= 2 && limits.tran.autoChange) {
                    thisRoom.memory.limits.tran.value = 2;
                    thisRoom.memory.limits.tran.autoChange = false;
                }
                if (limits.capacity === roomCapacity && limits.buil.autoChange) {
                    thisRoom.memory.limits.buil.value = 0;
                    thisRoom.memory.limits.buil.autoChange = false;
                }
            }

            let newName = '';
            let body = [];
            let memory = {};

            if (creeps.harvesters.length < limits.harv.value) {
                newName = 'Harvester' + Game.time;
                let source = 0;
                let harvesterOnSource = _.filter(creeps, (creep) => creep.memory.source == 0);
                body = [WORK, MOVE];
                let bodyCost = 150;
                let moveCount = 1;
                let stepCost = 150;
                if (harvesterOnSource.length > 0) { source = 1; }
                memory = { role: 'harvester', source: source };

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
            } else if (creeps.transporters.length < limits.tran.value) {
                newName = 'Transporter' + Game.time;
                body = [CARRY, MOVE, CARRY, MOVE];
                let bodyCost = 200;
                let stepCost = 200;
                memory = { role: 'transporter', delivering: 'false', target: 'none' };

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 1400) {
                    body = body.concat([CARRY, MOVE]);
                    bodyCost = bodyCost + 100;
                    stepCost = 100;
                }
            } else if (creeps.upgraders.length < limits.upgr.value) {
                newName = 'Upgrader' + Game.time;
                body = [WORK, MOVE, CARRY, MOVE];
                let bodyCost = 250;
                let carryCount = 1;
                let stepCost = 250;
                memory = { role: 'upgrader' };

                while ((bodyCost + stepCost) < roomCapacity && thisRoom.controller.level < 8 && bodyCost < 1400) {
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
            } else if (creeps.builders.length < limits.buil.value) {
                newName = 'Builder' + Game.time;
                body = [WORK, MOVE, CARRY, MOVE];
                let bodyCost = 250;
                let stepCost = 250;
                memory = { role: 'builder' };

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 2000) {
                    body = body.concat([WORK, MOVE, CARRY, MOVE]);
                    bodyCost = bodyCost + 250;
                    stepCost = 250;
                }
            } else if (creeps.claimers.length = 0 && thisRoom.memory.claiming) {
                newName = 'Claimer' + Game.time;
                body = [CLAIM, MOVE, MOVE];
                memory = { role: 'claimer' };
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

            // if (thisRoom.energyAvailable <= 300 && thisRoom.energyAvailable != roomCapacity) {
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

            if (newName && body && memory) {
                spawn.spawnCreep(body, newName, { memory: memory });
            }
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
