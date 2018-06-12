var variables = require('variables');
// move to source container
// 
var moveTo = {
    
    /** @param {Creep} creep **/

    sourceContainer: function(creep) {
        
        var source = _.sortBy(variables.sources(creep), s => creep.pos.getRangeTo(s));
        var sourceContainer = source[0].pos.findInRange(FIND_STRUCTURES, 2, { filter: (structure) => {return structure.structureType === STRUCTURE_CONTAINER} })
        for (i = 0; i < variables.droppedResources(creep).length; i++) {
            creep.pickup(variables.droppedResources(creep)[i]);
        } 
        if(!sourceContainer.length || sourceContainer[0].store[RESOURCE_ENERGY] < creep.carryCapacity) {
            var droppedResource = _.sortBy(droppedResources, s => creep.pos.getRangeTo(s));
            if(creep.pickup(droppedResource[0]) == ERR_NOT_IN_RANGE) { creep.moveTo(droppedResource[0], {visualizePathStyle: {stroke: '#ffaa00'}}); }
        }else {
            if(creep.withdraw(sourceContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(sourceContainer[0]); }
        }
    },
    controllerContainer: function(creep){
        var controllerContainer = _.sortBy(variables.container(creep).pos.getRangeTo(creep.room.controller));
        if(creep.withdraw(controllerContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(controllerContainer[0]); }
    }
};

module.exports = moveTo;