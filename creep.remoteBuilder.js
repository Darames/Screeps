let actions = require('actions');

let roleRemoteBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const claimRoom = creep.memory.claimRoom;
        const room = Game.rooms[claimRoom];
        // console.log(claimRoom);

        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);

        
        // set get energy mode
	    if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say('refill');
        }
        // set building mode
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
	    }

	    if(creep.memory.building) {
	        if(creep.pos.roomName != room.name){
                // creep.moveTo(25, 25, claimRoom);
                actions.moveTo(creep, {x: 25, y: 25, roomName: claimRoom});
	        } else {
	            if(constructionSites.length) {
                    if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}}); 
                    }
                }
	        }
		} else {
		    if(creep.pos.roomName != claimRoom){
	            creep.moveTo(ClaimFlag);
	        } else {
	            let sources = room.find(FIND_SOURCES);
    			sources = _.sortBy( sources, s => creep.pos.getRangeTo(s) )
                // harvest energy
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                }
	        }
	    }
	}
};

module.exports = roleRemoteBuilder;

// Game.spawns['Darames'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "RemoteBuilder", {memory: {role: 'remoteBuilder'}});