let actions = require('actions');

let roleRemoteBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = Game.rooms[creepRoom.memory.homeRoom].memory.claiming.room;
        const room = Game.rooms[claimRoom];
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
                creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
                // actions.moveTo(creep, new RoomPosition(25, 25, claimRoom));
	        } else {
	            if(constructionSites.length) {
                    if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}}); 
                    }
                }
	        }
		} else {
		    if(creep.pos.roomName != claimRoom){
                creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
	            // actions.moveTo(creep, new RoomPosition(25, 25, claimRoom));
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