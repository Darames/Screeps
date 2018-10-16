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
    },












    droppedResources: function(creep, droppedResources){
            droppedResources = _.sortBy( droppedResources, s => s.pos.getRangeTo(creep) );
            
            if( !creep.pos.isNearTo( droppedResources[0] ) ) {
                    creep.moveTo(droppedResources[0], {reusePath: 20, maxOps: 300});
             } else {
                    creep.pickup(droppedResources[0]);
             }
        
    },

    container: function(creep, action, specialContainer){
        var creepRoom = Game.rooms[creep.pos.roomName];
        var targets = new Array();
        var droppedResources = new Array();
        var storages = new Array();
        
        if( specialContainer == "controller" && action == "withdraw" ){
            if( creepRoom.memory.controllerContainer !== 'undefined' ){
                for(i = 0; i < creepRoom.memory.controllerContainer.length; i ++){
                    var controllerContainer = Game.getObjectById(creepRoom.memory.controllerContainer[i]);
                    targets.push(controllerContainer);
                }
                if( targets.length ) {
                    if( targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity ){ targets = creepRoom.container; }
                } 
                targets = _.sortBy(targets, s => s.pos.getRangeTo(creep));
            }
        }
        
        if( creepRoom.memory.container !== 'undefined' && !specialContainer || targets.length == 0 ){
            targets = creepRoom.container;
            targets = _.sortBy( targets, s => s.pos.getRangeTo(creep) );
        }
        
        if(creepRoom.memory.storage !== 'undefined'){
            for(i = 0; i < creepRoom.memory.storage.length; i ++){
                var storage = Game.getObjectById(creepRoom.memory.storage[i]);
                    storages.push(storage);
            }
        }

        if( !targets.length ) {
            if(action == "withdraw"){
                for (i = 0; i < variables.droppedResources(creep).length; i++) {
                    droppedResources.push(variables.droppedResources(creep)[i]);
                }  
                droppedResources = _.sortBy( droppedResources, s => s.pos.getRangeTo(creep) );
                 if( !creep.pos.isNearTo( droppedResources[0] ) ) {
                        creep.moveTo(droppedResources[0], {reusePath: 20, maxOps: 300});
                 } else {
                        creep.pickup(droppedResources[0]);
                 }
            }
        }else {
            if(action == "withdraw"){
                // if(storages.length > 0 && creep.memory.role != "upgrader" && storages[0].store[RESOURCE_ENERGY] > (storages[0].storeCapacity / 2) ){
                //     if( !creep.pos.isNearTo( storages[0] ) ) {
                //         creep.moveTo( storages[0], {reusePath: 20,  maxOps: 300} );
                //     }else {
                //         creep.withdraw( storages[0], RESOURCE_ENERGY );
                //     }
                // } else 
                
                if ( targets.length > 1 && targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity ){
                    if ( targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity && targets[1].store[RESOURCE_ENERGY] < creep.carryCapacity && storages.length > 0 ){
                        if( !creep.pos.isNearTo( storages[0] ) ) {
                            creep.moveTo( storages[0], {reusePath: 20, maxOps: 300} ); 
                        }else {
                            creep.withdraw( storages[0], RESOURCE_ENERGY ); return;
                        }
                    } else if( targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity && targets[1].store[RESOURCE_ENERGY] < creep.carryCapacity  ) {
                        if( !creep.pos.isNearTo( targets[0] ) ) {
                            creep.moveTo( targets[0], {reusePath: 20, maxOps: 300} ); 
                        }
                    } else if( targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity ) {
                        if( !creep.pos.isNearTo( targets[1] ) ) {
                            creep.moveTo( targets[1], {reusePath: 20, maxOps: 300} ); 
                        }
                    }
                } else {
                    if(targets[0].store[RESOURCE_ENERGY] < creep.carryCapacity ){
                        for (i = 0; i < variables.droppedResources(creep).length; i++) {
                            droppedResources.push(variables.droppedResources(creep)[i]);
                        }
                        if( !creep.pos.isNearTo( droppedResources[0] ) ) {
                                creep.moveTo(droppedResources[0], {reusePath: 20, maxOps: 300}); 
                         } else { creep.pickup(droppedResources[0]);  }
                    } else if( creep.pos.getRangeTo( targets[0] ) > creep.pos.getRangeTo( droppedResources[0] ) ) {
                        if( !creep.pos.isNearTo( droppedResources[0] ) ) {
                                creep.moveTo(droppedResources[0], {reusePath: 20, maxOps: 300}); 
                         } else { creep.pickup(droppedResources[0]);  }
                    } else if( !creep.pos.isNearTo( targets[0] ) ) {
                        creep.moveTo( targets[0], {reusePath: 20, maxOps: 300} );
                    } else {
                        if( variables.droppedResources(creep).length > 0 ){
                            for (i = 0; i < variables.droppedResources(creep).length; i++) {
                                if( variables.droppedResources(creep)[i].pos.inRangeTo( targets[0], 1 ) ){
                                    if( creep.pickup( variables.droppedResources(creep)[i] ) == ERR_NOT_IN_RANGE ) {
                                        creep.moveTo( variables.droppedResources(creep)[i], {reusePath: 20, maxOps: 300} );
                                        
                                    }
                                } else {
                                    creep.withdraw( targets[0], RESOURCE_ENERGY );
                                    
                                }
                            }
                        } else {
                            creep.withdraw( targets[0], RESOURCE_ENERGY );
                            
                        }
                    }
                }
            } else if (action = "transfer"){
                if( creep.transfer( targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
                    creep.moveTo( targets[0], {reusePath: 20, maxOps: 300} );
                    
                }
            }
        }
    }
};

module.exports = actions;
