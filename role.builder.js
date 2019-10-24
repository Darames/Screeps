var moveTo = require('tools.functions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
		var constructionSites =  _.filter( Game.constructionSites, (c) => c.pos.roomName == creep.pos.roomName );
		var damagedStructures = creepRoom.find(FIND_STRUCTURES,{ filter: (structure) => { return ( ( 100 * structure.hits ) / structure.hitsMax != 100 ) && structure.structureType != STRUCTURE_CONTROLLER; } });
        var builderNr = creep.memory.builderNr;
        // set get energy mode
	    if(creep.memory.building && creep.carry.energy == 0 || creep.memory.repairing && creep.carry.energy == 0) {
			creep.memory.building = false; creep.memory.repairing = false; creep.say('refill');
        }
        // set building or repairing mode
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity || creep.memory.repairing && creep.carry.energy != creep.carryCapacity) {
            // set repairing mode
            if(!constructionSites.length) { creep.memory.repairing = true; creep.memory.building = false; if(!creep.memory.repairing){ creep.say('repair'); } } 
            // set building mode
            else { creep.memory.building = true; 
                // creep.say('build'); 
            }
	    }

	    if(creep.memory.building) {
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 200});
                    creep.build(constructionSites[0]);
                }
            }else {
                creep.memory.repairing = true;
            }
	    } else if(creep.memory.repairing){
	        if(damagedStructures.length >= 1){builderNr = 0}
	        if(creepRoom.name != "E38S36" || creepRoom.name != "E37S27" || creepRoom.name != "E36S29" ){
	            damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType != "constructedWall" ||  structures.structureType != "rampart" ) || ( structures.structureType == "rampart" && !(structures.hits > 25000) ) );
	        } //  || ( structures.structureType == "constructedWall" && !(structures.hits > 25000) )
			if(damagedStructures.length) {
			 //   damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType != "constructedWall" ||  structures.structureType != "rampart" ) );
    		    if(damagedStructures[builderNr].structureType == "constructedWall"){
    		        damagedStructures = _.sortBy( damagedStructures, s => creep.pos.getRangeTo(s) );
    		        damagedStructures = _.sortBy( damagedStructures, s => ( 100 * s.hits ) / s.hitsMax );
			    }
			 //   damagedStructures = _.sortBy( damagedStructures, s => ( s.hitsMax ));
                if(creep.repair(damagedStructures[builderNr]) == ERR_NOT_IN_RANGE) {
                    if(creepRoom.name == "E36S29" || creepRoom.name == "E37S27"){
                        creep.moveTo(damagedStructures[builderNr], {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 200});
                    } else {
                        creep.moveTo(damagedStructures[builderNr], {visualizePathStyle: {stroke: '#ffffff'}, ignoreRoads: true, maxOps: 200});
                    }
                    creep.repair(damagedStructures[builderNr]);
                }
            }else {
                creep.memory.building = false;
                // parking at spawn
                var targets = creepRoom.spawn;
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, ignoreRoads: true, maxOps: 200});
            }
		} else {
			moveTo.container(creep, "withdraw");
	    }
	}
};

module.exports = roleBuilder;

// Game.spawns['Darames'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "RemoteBuilder", {memory: {role: 'builder'}});
