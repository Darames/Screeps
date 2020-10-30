let actions = require('actions');

let roleRemoteBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = Game.rooms[creep.memory.homeRoom].memory.claiming.room;
        const room = Game.rooms[claimRoom];
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        
        if (typeof creep.memory.wayPoint == 'undefined') {
           creep.memory.wayPoint = 'none';
        }
        
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
                // creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
                // actions.moveTo(creep, new RoomPosition(25, 25, claimRoom));
                
                // if (creep.memory.wayPoint == 'reached') {
                    creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
                // } else {
                //     creep.moveTo(new RoomPosition(25, 25, 'W9N50'), { reusePath: 100 });
                //     if (creepRoom.name == 'W9N50' ) {
                //         creep.memory.wayPoint = 'reached';
                //     }
                // }
	        } else {
	            if(constructionSites.length) {
                    if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}}); 
                    }
                }
	        }
		} else {
		    if(creep.pos.roomName != claimRoom){
                // creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
	            // actions.moveTo(creep, new RoomPosition(25, 25, claimRoom));
	            
	            // if (creep.memory.wayPoint == 'reached') {
                    creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
                // } else {
                //     creep.moveTo(new RoomPosition(25, 25, 'W9N50'), { reusePath: 100 });
                //     if (creepRoom.name == 'W9N50' ) {
                //         creep.memory.wayPoint = 'reached';
                //     }
                // }
	        } else {
	            let sources = room.find(FIND_SOURCES);
    			sources = _.sortBy( sources, s => creep.pos.getRangeTo(s) )
                // harvest energy
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}, maxOps: 200});
                }
	        }
        }
        if(creep.pos.roomName == claimRoom){
            if (thisRoom.spawns.length > 0) { 
                Game.rooms[creep.memory.homeRoom].memory.claiming.status = 'idle';
            }
        }
	}
};

module.exports = roleRemoteBuilder;

// Game.spawns['Darames'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "RemoteBuilder", {memory: {role: 'remoteBuilder'}});