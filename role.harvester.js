var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        // var sources = creepRoom.find(FIND_SOURCES);
        var sources = creepRoom.source;
        var targets = new Array();
        
        if( creepRoom.memory.container !== 'undefined'){
            // for(i = 0; i < creepRoom.memory.container.length; i ++){
            //     let container = Game.getObjectById(creepRoom.memory.container[i]);
            //         targets.push(container);
            // }
            targets = creepRoom.container;
            targets = _.filter( targets, s => s.pos.inRangeTo(sources[creep.memory.source], 2) );
        }
        
        // harvest energy
        if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
            if( targets.length > 0 ){
                // if( targets.length == 1 ){
                    creep.moveTo(targets[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                // } else {
                //     creep.moveTo(targets[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                // }
            } else {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
            }
        }
	}
};

module.exports = roleHarvester;
