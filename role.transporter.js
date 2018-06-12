var moveTo = require('tools.functions');

var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // set get energy mode
        if(creep.memory.delivering && creep.carry.energy == 0) { creep.memory.delivering = false; creep.say('refill'); }
	    if(!creep.memory.delivering) {
            // set deliver mode
            if(creep.carry.energy == creep.carryCapacity) { creep.memory.delivering = true; creep.say('deliver mode'); }
            // geting energy
            moveTo.sourceContainer(creep);
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
                    || (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) 
                    || (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
                    || (structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(structure.room.controller, 3) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity )
                }
            });
            // targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}}); }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ( structure.structureType == STRUCTURE_SPAWN ); } });
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleTransporter;