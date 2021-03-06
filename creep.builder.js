var actions = require('actions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var constructionSites = creepRoom.constructionSites;
        var damagedStructures = creepRoom.damagedStructures;

        // set get energy mode
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.memory.repairing = false;
        }

        // set building or repairing mode
        if (!creep.memory.building && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            if (constructionSites.length) {
                creep.memory.building = true;
                creep.memory.repairing = false;
            } else {
                creep.memory.building = false;
                creep.memory.repairing = true;
            }
        }
        if(creep.memory.builderNr == 1 && damagedStructures.length > 0 && creep.store[RESOURCE_ENERGY] != 0 && creepRoom.structures.towers.length < 1) {
            creep.memory.repairing = true;
            creep.memory.building = false;
        }

        if (creep.memory.building) {
            if (constructionSites.length) {
                if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#ffffff' }, maxOps: 200 });
                    creep.build(constructionSites[0]);
                }
            } else {
                creep.memory.repairing = true;
            }
        } else if (creep.memory.repairing) {
            if (damagedStructures.length) {
                if (damagedStructures[0].structureType == "constructedWall") {
                    damagedStructures = _.sortBy(damagedStructures, s => creep.pos.getRangeTo(s));
                    damagedStructures = _.sortBy(damagedStructures, s => (100 * s.hits) / s.hitsMax);
                }
                if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], { visualizePathStyle: { stroke: '#ffffff' }, ignoreRoads: true, maxOps: 200 });
                }
            } else {
                creep.memory.building = false;
                // parking at spawn
                var targets = creepRoom.spawns;
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' }, ignoreRoads: true, maxOps: 200 });
                if (creep.store[RESOURCE_ENERGY] != creep.store.getCapacity()) {
                    creep.memory.repairing = false;
                }
            }
        } else {
            actions.getEnergy(creep);
        }
    }
};

module.exports = roleBuilder;

// Game.spawns['Darames'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "RemoteBuilder", {memory: {role: 'builder'}});
