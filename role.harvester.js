var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleHarvester;
