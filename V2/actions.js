// var variables = require('variables');

var actions = {
    
    /** @param {Creep} creep **/
    
    pickup: function(creep,target){
        if( !creep.pos.isNearTo( target ) ) {
            creep.moveTo( target, {reusePath: 20, maxOps: 300} ); 
        }else {
            creep.pickup( target, RESOURCE_ENERGY );
        }
    },

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
        if( element == null ){ thisRoom.memory.scanMode = true; }
        return element;
    },
    
    setEnergyTargets: function(thisRoom){
        let targets;
        if(thisRoom.storage && thisRoom.container){
            targets = thisRoom.container.concat(thisRoom.storage);
        } else if(thisRoom.container){
            targets = thisRoom.container;
        }
        targets = targets.concat(thisRoom.droppedEnergy);
        thisRoom.energyTargets = targets;
    },
    
    getEnergy: function(creep){
        var creepRoom = Game.rooms[creep.pos.roomName];
        var energyTargets = _.sortBy( creepRoom.energyTargets, s => s.pos.getRangeTo(creep) );

        if (energyTargets.length > 1) {
            let targetCounter = 0;
            for (const target in energyTargets) {
                targetCounter = targetCounter++;
                if (target.structureType) {
                    if ( target.store[RESOURCE_ENERGY] < creep.carryCapacity) {
                        if ( targetCounter == energyTargets.length ) {
                            moveAndGetEnergy( creep, energyTargets[0] );
                        } else {
                            continue;
                        }
                    } else { moveAndGetEnergy( creep, target ); }
                } else { moveAndGetEnergy( creep, target ); }
            }
        } else { moveAndGetEnergy( creep, energyTargets[0] ); }
        
        function moveAndGetEnergy(creep, energyTarget) {
            if( energyTarget.structureType ){
                this.withdraw( creep, energyTarget );
            } else {
                this.pickup( creep, energyTarget );
            }
        }
    }
};

module.exports = actions;
