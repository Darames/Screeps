var moveToSourceContainer = require('tools.functions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		var damagedStructures = creep.room.find(FIND_STRUCTURES,{ filter: (structure) => { return ( (100*structure.hits)/structure.hitsMax != 100 ) && structure.structureType != STRUCTURE_CONTROLLER; } });
        // set get energy mode
	    if(creep.memory.building && creep.carry.energy == 0 || creep.memory.repairing && creep.carry.energy == 0) {
			creep.memory.building = false; creep.memory.repairing = false; creep.say('refill');
        }
        // set building or repairing mode
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity || creep.memory.repairing && creep.carry.energy != creep.carryCapacity) {
            // set repairing mode
            if(!constructionSites.length) { creep.memory.repairing = true; if(!creep.memory.repairing){ creep.say('repair mode'); } } 
            // set building mode
            else { creep.memory.building = true; creep.say('build mode'); }
	    }

	    if(creep.memory.building) {
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {  creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}}); }
            }else {
                creep.memory.repairing = true;
            }
	    } else if(creep.memory.repairing){
			if(damagedStructures.length) {
                if(creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                creep.memory.building = false;
                // parking at spawn
                var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ( structure.structureType == STRUCTURE_SPAWN); } });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
		} else {
			moveToSourceContainer.run(creep);
	    }
	}
};

module.exports = roleBuilder;
