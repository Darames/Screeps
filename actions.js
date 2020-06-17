// var variables = require('variables');

var actions = {

    /** @param {Creep} creep **/

    pickupEnergy: function (creep, target) {
        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target, { reusePath: 20, maxOps: 300 });
        } else {
            creep.pickup(target, RESOURCE_ENERGY);
        }
    },

    withdraw: function (creep, target) {
        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target, { reusePath: 20, maxOps: 300 });
        } else {
            creep.withdraw(target, RESOURCE_ENERGY);
        }
    },

    transfer: function (creep, target) {
        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target, { reusePath: 20, maxOps: 300 });
        } else {
            creep.transfer(target, RESOURCE_ENERGY);
        }
    },

    getElement: function (roomName, sId) {
        var thisRoom = Game.rooms[roomName];
        var element = Game.getObjectById(sId);
        if (element == null) { thisRoom.memory.scanMode = true; }
        return element;
    },

    setEnergyTargets: function (thisRoom) {
        let targets;
        if (thisRoom.container) {
            targets = thisRoom.container;
        } 
        if (thisRoom.storage) {
            targets = targets.concat(thisRoom.storage);
        }
        // if (thisRoom.droppedEnergy) {
        //     targets = targets.concat(thisRoom.droppedEnergy);
        // }
        thisRoom.energyTargets = targets;
    },

    moveAndGetEnergy: function (creep, energyTarget) {
        if (typeof energyTarget !== 'undefined') {
            if (!creep.pos.isNearTo(energyTarget)) {
                creep.moveTo(energyTarget, { reusePath: 20, maxOps: 300 });
            } else {
                if (typeof energyTarget.structureType  !== 'undefined') {
                    this.withdraw(creep, energyTarget);
                } else {
                    this.pickupEnergy(creep, energyTarget);
                }
            }
        }
    },

    getEnergy: function (creep) {
        let creepRoom = Game.rooms[creep.pos.roomName];
        let energyTargets = creepRoom.energyTargets;
        let droppedEnergy = creepRoom.droppedEnergy;

        if (typeof energyTargets !== 'undefined') {
            if (energyTargets !== null) {
                // energyTargets = _.sortBy(energyTargets, s => s.pos.getRangeTo(creep));

                energyTargets.sort(function(a, b){
                    var x = a.pos.getRangeTo(creep);
                    var y = b.pos.getRangeTo(creep);
                    if (x < y) {return 1;}
                    if (x > y) {return -1;}
                    return 0;
                  });
            }
        }
        if (energyTargets.length > 1) {
            let targetCounter = 0;
            for (let index = 0; index < energyTargets.length; index++) {

                let target = energyTargets[index];
                targetCounter = targetCounter++;

                if (typeof target.structureType !== 'undefined') {

                    if (target.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {

                        if (targetCounter == energyTargets.length) {

                            this.moveAndGetEnergy(creep, target);

                        } else {

                            continue;

                        } // if targetCounter == energyTargets.length
                    } else { this.moveAndGetEnergy(creep, target); } // if target.store[RESOURCE_ENERGY] 

                } else { this.moveAndGetEnergy(creep, target); }// if typeof target.structureType

            } //for energyTargets
        } else { this.moveAndGetEnergy(creep, energyTargets[0]); }
    },

    moveTo: function (creep, target) {
        let range = creep.pos.getRangeTo(target);
        let reusePath = 20;
        let maxOps = 200;

        if (!creep.memory.rangeToTarget) {
            creep.memory.rangeToTarget = range;
        } else if (range == 0) {
            creep.memory.rangeToTarget = null;
        } else {
            range = creep.memory.rangeToTarget;
        }

        if (range < 40) {
            reusePath = range / 2;
        } else {
            reusePath = 20;
        }

        maxOps = reusePath * 10;

        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: reusePath, maxOps: maxOps });
    }
};

module.exports = actions;