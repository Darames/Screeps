// var variables = require('variables');

var actions = {
    
    /** @param {Creep} creep **/
    
    withdraw: function(creep,target){
        if( !creep.pos.isNearTo( target ) ) {
            creep.moveTo( target, {reusePath: 20, maxOps: 300} ); 
        }else {
            creep.withdraw( target, RESOURCE_ENERGY );
        }
    },
    
    transfer: function(creep,target){
        if( !creep.pos.isNearTo( target ) ) {
            creep.moveTo( target, {reusePath: 20, maxOps: 300} ); 
        }else {
            creep.transfer( target, RESOURCE_ENERGY );
        }
    },
    
    getElement: function(roomName, sId) {
        var thisRoom = Game.rooms[roomName];
        var element = Game.getObjectById(sId);
        if( element == "null" ){ thisRoom.memory.scanMode = true; }
        return element;
    },
    
    setEnergyTargets: function(roomName){
        var thisRoom = Game.rooms[roomName];
        if(thisRoom.storage && thisRoom.container){
            var targets = thisRoom.container.concat(thisRoom.storage);
        } else if(thisRoom.container){
            var targets = thisRoom.container;
        } else {
            var targets = thisRoom.droppedEnergy;
        }
        thisRoom.energyTargets = targets;
    },
    
    getEnergy: function(creep){
        var creepRoom = Game.rooms[creep.pos.roomName];
        var energyTargets = _.sortBy( creepRoom.energyTargets, s => s.pos.getRangeTo(creep) );
        // toDo
        
        function withdraw(creep, target){
            if( !creep.pos.isNearTo( target ) ) {
                creep.moveTo(target, {reusePath: 20, maxOps: 300});
            } else {
                var droppedEnergy = _.sortBy( creepRoom.droppedEnergy, s => s.pos.getRangeTo(creep) );
                if( !creep.pos.isNearTo(droppedEnergy[0]) ){
                    creep.pickup( droppedEnergy[0] );
                } else {
                    creep.withdraw( target, RESOURCE_ENERGY );
                }
            }
        }

        if( energyTargets[0].structureType ){
            if ( energyTargets.length > 1 && energyTargets[0].store[RESOURCE_ENERGY] < creep.carryCapacity){
                if( energyTargets[0].store[RESOURCE_ENERGY] < creep.carryCapacity && energyTargets[1].store[RESOURCE_ENERGY] < creep.carryCapacity  ) {
                    withdraw(creep, energyTargets[0]);
                } else if( energyTargets[0].store[RESOURCE_ENERGY] < creep.carryCapacity ) {
                    withdraw(creep, energyTargets[1]);
                } else {
                    withdraw(creep, energyTargets[0]);
                }
            } else {
                withdraw(creep, energyTargets[0]);
            }
        } else {
            if( !creep.pos.isNearTo( energyTargets[0] ) ) {
                creep.moveTo(energyTargets[0], {reusePath: 20, maxOps: 300});
            } else {
                creep.pickup( energyTargets[0] );
            }
        }
    }

};

module.exports = actions;
