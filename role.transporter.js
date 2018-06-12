var moveTo = require('tools.functions');
var variables = require('variables');

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
            for (i = 0; i < variables.spawn(creep).length; i++) {
                if(variables.spawn(creep)[i].energy < variables.spawn(creep)[i].energyCapacity){
                    targets = variables.spawn(creep)[i];
                }
            }
            for (i = 0; i < variables.extensions(creep).length; i++) {
                if(variables.extensions(creep)[i].energy < variables.extensions(creep)[i].energyCapacity){
                    targets = targets + variables.extensions(creep)[i];
                }
            } 
            for (i = 0; i < variables.towers(creep).length; i++) {
                if(variables.towers(creep)[i].energy < variables.towers(creep)[i].energyCapacity){
                    targets = targets + variables.towers(creep)[i];
                }
            } 
            for (i = 0; i < variables.container(creep).length; i++) {
                if(variables.container(creep)[i].store[RESOURCE_ENERGY] < variables.container(creep)[i].storeCapacity && !variables.container(creep)[i].pos.inRangeTo(structure.room.controller, 3)) {
                    targets = targets + variables.container(creep)[i];
                }
            } 

            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //     return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
            //         || (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) 
            //         || (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
            //         || (structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(structure.room.controller, 3) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity )
            //     }
            // });
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