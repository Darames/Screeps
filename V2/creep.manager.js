var manager = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var terminal = creepRoom.terminal;
        var storage = creepRoom.storage;
        var creepPosition; creepPosition.x = (storage.pos.x + terminal.pos.x)/2; creepPosition.y = (storage.pos.y + terminal.pos.y)/2;
        
       
        
        
        
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

module.exports = manager;
