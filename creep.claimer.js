let actions = require('actions');

let roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = Game.rooms[creep.memory.homeRoom].memory.claiming.room;
        const roomToClaim = Game.rooms[claimRoom];
        
        if( creepRoom.name == claimRoom ) {
            if (creep.pos.isNearTo(creepRoom.controller)) {
                creep.claimController(creepRoom.controller)
            } else {
                actions.moveTo(creep, creepRoom.controller);
            }
            
        } else {
            creep.moveTo(new RoomPosition(25, 25, claimRoom), { reusePath: 100 });
            // actions.moveTo(creep, new RoomPosition(25, 25, claimRoom));
        }

        if (claimRoom.controller.my) {
            Game.rooms[creep.memory.homeRoom].memory.claiming.status = 'buildSpawn';
        }
    }
};

module.exports = roleClaimer;