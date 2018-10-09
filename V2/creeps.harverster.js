var harvester = {
    /** @param {Creep} creep **/
    target: function(roomName){
    	var thisRoom = Game.rooms[roomName];
	var thisRoom.sources = _.sortBy(thisRoom.sources, s => s.pos.getRangeTo(thisRoom.spawns[0]);
    },
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var sources = creepRoom.sources;
        var targets = creepRoom.container;
        targets = _.filter( targets, s => s.pos.inRangeTo(sources[creep.memory.source], 2) );
        
        // harvest energy
        if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
            if( targets.length > 0 ){
                if( targets.length == 1 ){
                    creep.moveTo(targets[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                } else {
                    creep.moveTo(targets[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                }
            } else {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
            }
        }
	}
};

module.exports = harvester;