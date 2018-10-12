var actions = require('actions');

var transporter = {
    /** @param {Creep} creep **/

    targets: function(roomName){
		if(thisRoom.container){ var containers = thisRoom.container; }
		var targets = new Array();
		function priority(target){
			if( ( ( target.energy * 100 ) / target.energyCapacity ) < 60 ){
					target.priority = target.priority + 1;
				if( ( ( target.energy * 100 ) / target.energyCapacity ) < 40 ){
					target.priority = target.priority + 1;
				}
			}
		}
	    for (var sId in thisRoom.spawns) {
		    let spawn = thisRoom.spawns[sId];
			if(spawn.energy < spawn.energyCapacity){ 
                spawn.priority = 5; 
                targets.push(spawn); 
            }
        }
        if(thisRoom.extensions.length > 0){
            for (var exId in thisRoom.extensions) {
                let extension = thisRoom.extensions[sId];
                if(extension !== null){
				    if(extension.energy < extension.energyCapacity){ 
                        extension.priority = 2; 
						priority(extension);
                        targets.push(extension); 
                    }
				}
            }
        }
        if(creepRoom.towers.length > 0){
			for (var tId in thisRoom.towers) {
				let tower = creepRoom.towers[tId];
				if(tower.energy < tower.energyCapacity){ 
                    tower.priority = 1; 
					priority(tower);
                    targets.push(tower); 
                }
			}
		}
        if(thisRoom.controllerContainer.length > 0){
            for (var ccId in thisRoom.controllerContainer) {
                let controllerContainer = thisRoom.controllerContainer[ccId];
                if(controllerContainer.store[RESOURCE_ENERGY] < controllerContainer.storeCapacity){
					controllerContainer.priority = 1;
					priority(controllerContainer);
					controllerContainer.energy = controllerContainer.store[RESOURCE_ENERGY]; 
                    controllerContainer.energyCapacity = controllerContainer.storeCapacity;
					targets.push(controllerContainer);
				}
            }
        }
		if(thisRoom.storage.length > 0){
			var storage = thisRoom.storage;
			if(storage.store[RESOURCE_ENERGY] < (storage.storeCapacity / 2)){
				storage.priority = -1;
				storage.energy = storage.store[RESOURCE_ENERGY]; storage.energyCapacity = storage.storeCapacity;
				targets.push(storage); 
			}
		}
		targets = _.sortBy( targets, 'priority' );
		thisRoom.transporterTargets =  targets;
	},
	
    run: function(creep) {
		var creepRoom = Game.rooms[creep.pos.roomName];
		var targets = creepRoom.transporterTargets; targets = _.sortByAll( targets, 'priority', s => creep.pos.getRangeTo(s) );
		var target = Game.getObjectById(creep.memory.target);
		if( typeof creep.memory.delivering === 'undefined' ){ creep.memory.delivering = false; }
        if( typeof creep.memory.target === 'undefined' ){ creep.memory.target = "none"; }

		function newTarget(creep, targets){
			if(targets.length > 0) {
                creep.memory.target = targets[0].id;
                target = targets[0];
            } else {
                creep.memory.target = "none";
            }
			return target;
		}
        if( creep.memory.target === "none" && creep.memory.delivering ){
            target = newTarget(creep, targets);
        } else if( creep.memory.target != "none" && ( target.energy == target.energyCapacity ) ){
            target = newTarget(creep, targets);
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
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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

module.exports = transporter;
