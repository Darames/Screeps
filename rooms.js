let actions = require('actions');
let transporter = require('creep.transporter');
let structures = require('structures');
var blueprint = require('blueprints');


let room = {

    run: function () {
        if (typeof Memory.rooms.toClaim !== 'undefined') {
            if (Memory.rooms.toClaim.length > 0) {
                this.claimRooms();
            }
        }

        for (let roomName in Game.rooms) {
            let thisRoom = Game.rooms[roomName];
            if (typeof thisRoom.controller !== 'undefined') {
                if (thisRoom.controller.my) {
                    this.memory(thisRoom);
                    this.startSpawning(thisRoom, roomName);
                    transporter.targets(thisRoom);
                    actions.setEnergyTargets(thisRoom);
                    structures.run(thisRoom);
                }
            }
            if (typeof thisRoom.memory.blueprint !== 'undefined') {
                if (thisRoom.memory.blueprint.build === true) {
                    blueprint.build(thisRoom.memory.blueprint.template[0], thisRoom);
                }
            }
        }
        
        for (const room in Memory.rooms) {
            if (typeof Memory.rooms[room].scanMode == 'undefined' && room != 'toClaim') {
                delete Memory.rooms[room];
            }
        }
    },

    claimRooms: function () {
        let rangeToClaimRoom = [];
        let claimRoom = Memory.rooms.toClaim[0];
        if (claimRoom == null) {
            Memory.rooms.toClaim.shift();
        }
        for (const roomName in Game.rooms) {
            let thisRoom = Game.rooms[roomName];

            if (typeof thisRoom.controller !== 'undefined') {
                if (thisRoom.controller.my) {
                    let roomX = thisRoom.name.slice(1, 3), 
                        roomY = thisRoom.name.slice(4),
                        claimRoomX = claimRoom.slice(1, 3), 
                        claimRoomY = claimRoom.slice(4),
                        roomRange = Math.abs(roomX - claimRoomX) + Math.abs(roomY - claimRoomY);
                    if (roomRange == 1) {
                        thisRoom.memory.claiming.room = claimRoom;
                        thisRoom.memory.claiming.status = 'claiming';
                        Memory.rooms.toClaim.shift();
                    } else {
                        rangeToClaimRoom.push([thisRoom.name, roomRange]);
                    }
                }
            }
        }
        console.log(Game.rooms[rangeToClaimRoom[0][0]]);
        if (rangeToClaimRoom.length > 1) { rangeToClaimRoom.sort(function (a, b) { return a[1] - b[1]; }); }
        if (rangeToClaimRoom.length) { 
            Game.rooms[rangeToClaimRoom[0][0]].memory.claiming.room = claimRoom;
            Game.rooms[rangeToClaimRoom[0][0]].memory.claiming.status = 'claiming';
            Memory.rooms.toClaim.shift();
        }
    },

    memory: function (thisRoom) {

        if (typeof thisRoom.memory.limits === 'undefined') {
            thisRoom.memory.limits = {
                'tran': { 'value': 1, 'autoChange': true },
                'upgr': { 'value': 1, 'autoChange': false },
                'buil': { 'value': 1, 'autoChange': true },
                'harv': { 'value': 1, 'autoChange': true },
                'capacity': thisRoom.energyCapacityAvailable
            };
        }
        if (typeof thisRoom.memory.claiming === 'undefined') {
            thisRoom.memory.claiming = {};
            thisRoom.memory.claiming.room = 'none'
            thisRoom.memory.claiming.status = 'idle'
        }

        thisRoom.visual.text('bucket: ' + Game.cpu.bucket, 3, 1, { align: 'left', opacity: 0.8 });
        if (Game.cpu.bucket > 9000) {
            Game.cpu.generatePixel()
            console.log('pixel generated')
        }
        let visualPos = 1;
        for (const key in thisRoom.memory.limits) {
            if(key != 'capacity'){
                thisRoom.visual.text(key + ': ' + thisRoom.memory.limits[key].value, 0, visualPos, { align: 'left', opacity: 0.8 });
                visualPos = visualPos + 1;
            }
        }

        thisRoom.creeps = _.filter(Game.creeps, c => c.room.name == thisRoom.name && c.my);
        thisRoom.creeps.harvesters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'harvester');
        thisRoom.creeps.transporters = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'transporter');
        thisRoom.creeps.upgraders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'upgrader');
        thisRoom.creeps.builders = _.filter(thisRoom.creeps, (creep) => creep.memory.role == 'builder');
        if (thisRoom.memory.claiming.status === 'claiming') {
            thisRoom.creeps.claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == thisRoom.name && creep.memory.role == 'claimer');
        }
        if (thisRoom.memory.claiming.status === 'buildSpawn') {
            thisRoom.creeps.remoteBuilder = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == thisRoom.name && creep.memory.role == 'remoteBuilder');
        }
        thisRoom.sources = thisRoom.find(FIND_SOURCES);
        thisRoom.minerals = thisRoom.find(FIND_MINERALS);
        thisRoom.constructionSites = _.filter(Game.constructionSites, cS => cS.room.name == thisRoom.name);
        thisRoom.damagedStructures = thisRoom.find(FIND_STRUCTURES, { filter: (structure) => { return ((structures.structureType != "constructedWall") && (100 * structure.hits) / structure.hitsMax != 100) && structure.structureType != STRUCTURE_CONTROLLER; } });
        thisRoom.damagedStructures = _.filter(thisRoom.damagedStructures, (structures) => (structures.structureType != "constructedWall" && structures.structureType != "rampart") || (structures.structureType == "constructedWall" && !(structures.hits > 170000)) || (structures.structureType == "rampart" && !(structures.hits > 170000)));
        thisRoom.droppedEnergy = thisRoom.find(FIND_DROPPED_RESOURCES, { filter: (r) => { return r.resourceType == RESOURCE_ENERGY } });
        // thisRoom.find(FIND_TOMBSTONES).forEach(tombstone => { if(tombstone.store[RESOURCE_ENERGY] > 0) { thisRoom.droppedEnergy.push(tombstone); } });
        thisRoom.limits = thisRoom.memory.limits;
        
        if (typeof thisRoom.memory.scanMode === 'undefined') {
            thisRoom.memory.scanMode = true;
            thisRoom.memory.constructionSites = [];
            for (let i = 0; i < thisRoom.constructionSites.length; i++) { thisRoom.memory.constructionSites.push(thisRoom.constructionSites[i].id); }
        } else {
            if (thisRoom.constructionSites) {
                if (typeof thisRoom.memory.constructionSites  !== 'undefined') {
                    if (thisRoom.constructionSites.length != thisRoom.memory.constructionSites.length) {
                        thisRoom.memory.scanMode = true;
                        thisRoom.memory.constructionSites = [];
                        for (let i = 0; i < thisRoom.constructionSites.length; i++) { thisRoom.memory.constructionSites.push(thisRoom.constructionSites[i].id); }
                    }
                } else {
                    thisRoom.memory.scanMode = true;
                    thisRoom.memory.constructionSites = [];
                    for (let i = 0; i < thisRoom.constructionSites.length; i++) { thisRoom.memory.constructionSites.push(thisRoom.constructionSites[i].id); }
                }
            }
        }

        // thisRoom.memory.scanMode = true;

        if (thisRoom.memory.scanMode === true) {
            thisRoom.structuresAll = _.filter(Game.structures, s => s.room.name == thisRoom.name);
            thisRoom.container = thisRoom.find(FIND_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 3)}  });
            thisRoom.controllerContainer = thisRoom.find(FIND_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(s.room.controller, 3)}  });
            thisRoom.spawns = _.filter(Game.spawns, s => s.room.name == thisRoom.name);
            thisRoom.extensions = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_EXTENSION);
            thisRoom.structures = {
                'towers': _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_TOWER)
            };
            thisRoom.links = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_LINK);
            thisRoom.sourceLinks = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_LINK && (s.pos.inRangeTo(thisRoom.sources[0], 3) || s.pos.inRangeTo(thisRoom.sources[1], 3)));
            thisRoom.extractor = _.filter(thisRoom.structuresAll, s => s.structureType == STRUCTURE_EXTRACTOR);

            thisRoom.memory.structuresAll = [];
            thisRoom.memory.container = [];
            thisRoom.memory.controllerContainer = [];
            thisRoom.memory.spawns = [];
            thisRoom.memory.extensions = [];
            thisRoom.memory.structures = {
                towers: []
            };
            // thisRoom.memory.storage = [];
            thisRoom.memory.links = [];
            thisRoom.memory.sourceLinks = [];
            thisRoom.memory.extractor = [];

            for (let i = 0; i < thisRoom.structuresAll.length; i++) { thisRoom.memory.structuresAll.push(thisRoom.structuresAll[i].id); }
            for (let i = 0; i < thisRoom.container.length; i++) { thisRoom.memory.container.push(thisRoom.container[i].id); }
            for (let i = 0; i < thisRoom.controllerContainer.length; i++) { thisRoom.memory.controllerContainer.push(thisRoom.controllerContainer[i].id); }
            for (let i = 0; i < thisRoom.spawns.length; i++) { thisRoom.memory.spawns.push(thisRoom.spawns[i].id); }
            for (let i = 0; i < thisRoom.extensions.length; i++) { thisRoom.memory.extensions.push(thisRoom.extensions[i].id); }
            for (let i = 0; i < thisRoom.structures.towers.length; i++) { thisRoom.memory.structures.towers.push(thisRoom.structures.towers[i].id); }
            for (let i = 0; i < thisRoom.links.length; i++) { thisRoom.memory.links.push(thisRoom.links[i].id); }
            for (let i = 0; i < thisRoom.sourceLinks.length; i++) { thisRoom.memory.sourceLinks.push(thisRoom.sourceLinks[i].id); }
            for (let i = 0; i < thisRoom.extractor.length; i++) { thisRoom.memory.extractor.push(thisRoom.extractor[i].id); }

            thisRoom.memory.scanMode = false;
        } else {
            thisRoom.structuresAll = [];
            thisRoom.container = [];
            thisRoom.controllerContainer = [];
            thisRoom.spawns = [];
            thisRoom.extensions = [];
            thisRoom.structures = {
                towers: []
            };
            // thisRoom.storage = [];
            thisRoom.links = [];
            thisRoom.sourceLinks = [];
            thisRoom.extractor = [];
            if (typeof thisRoom.memory.structuresAll !== 'undefined') {
                for (let id in thisRoom.memory.structuresAll) { thisRoom.structuresAll.push(actions.getElement(thisRoom.name, thisRoom.memory.structuresAll[id])); }
            }
            if (typeof thisRoom.memory.container !== 'undefined') {
                for (let id in thisRoom.memory.container) { thisRoom.container.push(actions.getElement(thisRoom.name, thisRoom.memory.container[id])); }
            }
            if (typeof thisRoom.memory.controllerContainer !== 'undefined') {
                for (let id in thisRoom.memory.controllerContainer) { thisRoom.controllerContainer.push(actions.getElement(thisRoom.name, thisRoom.memory.controllerContainer[id])); }
            }
            if (typeof thisRoom.memory.spawns !== 'undefined') {
                for (let id in thisRoom.memory.spawns) { thisRoom.spawns.push(actions.getElement(thisRoom.name, thisRoom.memory.spawns[id])); }
            }
            if (typeof thisRoom.memory.extensions !== 'undefined') {
                for (let id in thisRoom.memory.extensions) { thisRoom.extensions.push(actions.getElement(thisRoom.name, thisRoom.memory.extensions[id])); }
            }
            if (typeof thisRoom.memory.structures !== 'undefined') {
                if (typeof thisRoom.memory.structures.towers !== 'undefined') {
                    for (let id in thisRoom.memory.structures.towers) { thisRoom.structures.towers.push(actions.getElement(thisRoom.name, thisRoom.memory.structures.towers[id])); }
                }
            }
            if (typeof thisRoom.memory.links !== 'undefined') {
                for (let id in thisRoom.memory.links) { thisRoom.links.push(actions.getElement(thisRoom.name, thisRoom.memory.links[id])); }
            }
            if (typeof thisRoom.memory.sourceLinks !== 'undefined') {
                for (let id in thisRoom.memory.sourceLinks) { thisRoom.sourceLinks.push(actions.getElement(thisRoom.name, thisRoom.memory.sourceLinks[id])); }
            }
            if (typeof thisRoom.memory.extractor !== 'undefined') {
                for (let id in thisRoom.memory.extractor) { thisRoom.extractor.push(actions.getElement(thisRoom.name, thisRoom.memory.extractor[id])); }
            }
        }
    },

    startSpawning: function (thisRoom) {
        let roomGotSpawn = false;
        if (thisRoom.spawns.length > 0) { roomGotSpawn = true; }
        if (roomGotSpawn == true) {
            let roomCapacity = thisRoom.energyCapacityAvailable;
            let creeps = thisRoom.creeps;
            let spawn = thisRoom.spawns[0];
            let limits = thisRoom.limits;

            if (thisRoom.memory.claiming.status == 'claiming') {
                limits.clai = {};
                limits.clai.value = 1;
            }
            if (thisRoom.memory.claiming.status == 'buildSpawn') {
                limits.remB = {};
                limits.remB.value = 1;
            }

            if (thisRoom.spawns.length > 1 && thisRoom.spawns[0].spawning) { spawn = thisRoom.spawns[1]; }
            if (roomCapacity > 1200) {
                limits.harv.value = 2;
                thisRoom.memory.limits.harv.autoChange = false;
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

            if (thisRoom.energyAvailable <= roomCapacity && creeps.transporters.length == 0) {
                roomCapacity = thisRoom.energyAvailable;
            }
            if (thisRoom.constructionSites.length > 0 && limits.buil.value == 0) {
                limits.buil.value = 1;
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
                let stepCost = 100;
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
                memory = { role: 'upgrader', upgrading: false };

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
                let builderNr = 1;
                let haveBuilderOne = false
                let bodyCost = 250;
                let stepCost = 250;

                // if (creeps.builders.length >= 1) {
                //     builderNr = creeps.builders.length + 1;
                // }

                creeps.builders.forEach(c => {
                    if(c.memory.builderNr == 1) {
                        builderNr = creeps.builders.length + 1;
                        haveBuilderOne = true;
                    } else {
                        if (c.memory.builderNr > 1 && !haveBuilderOne) {
                            builderNr = creeps.builders.length + 1;
                        } else {
                            builderNr = 1;
                        }
                    }
                });

                memory = { role: 'builder', builderNr: builderNr };

                while ((bodyCost + stepCost) < roomCapacity && bodyCost < 2000) {
                    body = body.concat([WORK, MOVE, CARRY, MOVE]);
                    bodyCost = bodyCost + 250;
                    stepCost = 250;
                }
            } else if (thisRoom.memory.claiming.status === 'claiming') {
                if (creeps.claimers.length == 0) {
                    newName = 'Claimer' + Game.time;
                    body = [CLAIM, MOVE, MOVE];
                    memory = { role: 'claimer', homeRoom: thisRoom.name };
                }
            } else if (thisRoom.memory.claiming.status === 'buildSpawn') {
                if (creeps.remoteBuilder.length == 0) {
                    newName = 'RemoteBuilder' + Game.time;
                    body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    memory = { role: 'remoteBuilder', homeRoom: thisRoom.name };
                }
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
