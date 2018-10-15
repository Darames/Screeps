var moveTo = require('tools.functions');
var variables = require('variables');

var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        
        // let costs = new PathFinder.CostMatrix;
        // let pos = creep.pos;
        // console.log( costs.get(pos.x, pos.y) );
        
        function getTarget(creep){
            var containers = new Array();
            if(creepRoom.container){
                containers = creepRoom.container;
            }
            
            var targets = new Array();
            for(i = 0; i < creepRoom.spawn.length; i ++){
                // var spawn = Game.getObjectById(creepRoom.memory.spawn[i]);
                var spawn = creepRoom.spawn[i];
                if(spawn.energy < spawn.energyCapacity){ spawn.priority = 5; targets.push(spawn); }
            }
            if(creepRoom.memory.extensions.length > 0){
                for(i = 0; i < creepRoom.memory.extensions.length; i ++){
                    var extension = Game.getObjectById(creepRoom.memory.extensions[i]);
                    if(extension !== null){
                    if(extension.energy < extension.energyCapacity){ extension.priority = 2; targets.push(extension); }
                    }
                }
                
                // for (var exId in creepRoom.extensions) {
                //     console.log(creepRoom.extensions[exId]);
                    
                // }
            }
            if(creepRoom.towers.length > 0){
                for(i = 0; i < creepRoom.memory.towers.length; i ++){
                    // var tower = Game.getObjectById(creepRoom.memory.towers[i]);
                    var tower = creepRoom.towers[i];
                    if(tower.energy < tower.energyCapacity){ tower.priority = 1; targets.push(tower); }
                }
            }
            if(creepRoom.controllerContainer.length > 0){
                for(i = 0; i < creepRoom.controllerContainer.length; i ++){
                    // var controllerContainer = Game.getObjectById(creepRoom.memory.controllerContainer[i]);
                    var controllerContainer = creepRoom.controllerContainer[i];
                    if(controllerContainer.store[RESOURCE_ENERGY] < controllerContainer.storeCapacity){
                        controllerContainer.priority = 1;
                        controllerContainer.energy = controllerContainer.store[RESOURCE_ENERGY]; controllerContainer.energyCapacity = controllerContainer.storeCapacity;
                        targets.push(controllerContainer);
                    }
                }
            }
            if(creepRoom.memory.storage.length > 0){
                if ( containers.length > 1 && containers[0].store[RESOURCE_ENERGY] < creep.carryCapacity ){
                    if ( containers[0].store[RESOURCE_ENERGY] < creep.carryCapacity && containers[1].store[RESOURCE_ENERGY] < creep.carryCapacity){
                        var storage = Game.getObjectById(creepRoom.memory.storage[0]);
                        if(storage.store[RESOURCE_ENERGY] < (storage.storeCapacity / 2)){
                            storage.priority = -1;
                            storage.energy = storage.store[RESOURCE_ENERGY]; storage.energyCapacity = storage.storeCapacity;
                            targets.push(storage); 
                        }
                    }
                }
            }
            
            if(targets.length > 1) {
                for(i = 0; i < targets.length; i ++ ){
                    for( var name in Game.creeps ){
                        var creepsWithTarget = Game.creeps[name];
                        if(creepsWithTarget.id != creep.id){
                            if( creepsWithTarget.memory.role == "transporter" && creepsWithTarget.memory.target == targets[i].id ){
                                targets[i].priority = targets[i].priority - 1;
                                if( creepsWithTarget.carry[RESOURCE_ENERGY] >= (targets[i].energyCapacity - targets[i].energy)){
                                    targets[i].priority = targets[i].priority - 3
                                }
                            }
                        }
                    }
                    // if( targets[i].energy < targets[i].energyCapacity && (targets[i].energyCapacity - targets[i].energy) > creep.carry[RESOURCE_ENERGY] ){
                    //     targets[i].priority = targets[i].priority + 1;
                    // }
                    if( ( ( targets[i].energy * 100 )/targets[i].energyCapacity ) < 60 ){
                            targets[i].priority = targets[i].priority + 1;
                        if( ( ( targets[i].energy * 100 )/targets[i].energyCapacity ) < 40 && targets[i].structureType != "container" ){
                            targets[i].priority = targets[i].priority + 1;
                        // }else if( ( ( targets[i].energy * 100 )/targets[i].energyCapacity ) < 20 && targets[i].structureType == "container"  ){
                        //     targets[i].priority = targets[i].priority + 2;
                        }
                    }
                }
            }
            // targets = _.sortBy( targets, s => creep.pos.getRangeTo(s) );
            if(targets.length > 1){
                var targets = targets.sort(function(a, b){
                    if(a.priority > b.priority){
                        return -1;
                    } else if(a.priority < b.priority){
                        return 1;
                    }
                    return 0;
                });
            }
            return targets;
        }
        
        var targets = getTarget(creep);
        
        var target = Game.getObjectById(creep.memory.target);
        
        if(typeof creep.memory.delivering === 'undefined' ){
            creep.memory.delivering = false;
        }
        if( typeof creep.memory.target === 'undefined' ){
            creep.memory.target = "none";
        }
        
        if( ( creep.memory.target === "none" && creep.memory.delivering ) ){
            if(targets.length > 0) {
                creep.memory.target = targets[0].id;
                target = Game.getObjectById(targets[0].id);
            } else {
                creep.memory.target = "none";
            }
        } else if( creep.memory.target != "none" && ( target.energy == target.energyCapacity ) ){
            if(targets.length > 0) {
                creep.memory.target = targets[0].id;
                target = Game.getObjectById(targets[0].id);
            } else {
                creep.memory.target = "none";
            }
        }

        if( ( creep.memory.delivering && creep.carry.energy == 0 ) || !creep.memory.delivering ) {
            if(creepRoom.memory.storage.length > 2){
                // var droppedResources = new Array();
                // for (i = 0; i < variables.droppedResources(creep).length; i++) {
                //     if(droppedResources.resourceType != "energy"){
                //         droppedResources.push(variables.droppedResources(creep)[i]);
                //     }
                // }
                // if(droppedResources.length > 0){
                //     moveTo.droppedResources(creep, droppedResources);
                    // creep.memory.target = "droppedResources";
                // } else if(droppedResources.length == 0 && _.sum(creep.carry) > 0 && creep.carry.energy == 0){
                    // creep.memory.delivering = true; 
                    // creep.memory.target = "none";
                // } else {
                    moveTo.container(creep, "withdraw"); // geting energy
                    creep.memory.target = "none";
                    if( creep.memory.delivering ){ 
                        creep.memory.delivering = false;
                        creep.say( 'refill' );
                    }// set refill mode
                    if( creep.carry.energy == creep.carryCapacity ) { 
                        creep.memory.delivering = true; 
                        creep.say('deliver'); 
                    } // set deliver mode
                // }
            } else {
                moveTo.container(creep, "withdraw"); // geting energy
                creep.memory.target = "none";
                if( creep.memory.delivering ){ 
                    creep.memory.delivering = false;
                    creep.say( 'refill' );
                }// set refill mode
                if( creep.carry.energy == creep.carryCapacity ) { 
                    creep.memory.delivering = true; 
                    creep.say('deliver'); 
                } // set deliver mode
            }
        } else {
            // if( creep.carry.energy == 0 &&  _.sum(creep.carry) > 0 ) {
                // var targets = new Array();
            //     var target = Game.getObjectById(creepRoom.memory.storage[0]);
            //     if( storage.store[RESOURCE_ENERGY] < (storage.storeCapacity / 2) ){
            //         storage.energy = storage.store[RESOURCE_ENERGY]; storage.energyCapacity = storage.storeCapacity;
            //         targets.push(target); 
            
            //     }
            // }
            
            if(targets.length > 0) {
                if(creep.pos.isNearTo(target)) {
					creep.transfer(target, RESOURCE_ENERGY);
				} else {
                    creep.moveTo( target, {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 400 });
                }
            } else {
                if(creep.carry.energy < creep.carryCapacity){
                    creep.memory.delivering = false;
                    creep.memory.target = "none";
                    creep.say( "refill" );
                    moveTo.container(creep, "withdraw");
                }else{
                    creep.moveTo(Game.getObjectById(creepRoom.memory.spawn[0]), {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 400});
                    creep.memory.target = "none";
                }
            }
        }
	}
};

module.exports = roleTransporter;
