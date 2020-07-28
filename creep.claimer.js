let actions = require('actions');

let roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = creepRoom.memory.claiming.room;
        const roomToClaim = Game.rooms[claimRoom];
        
        if( creepRoom.name == claimRoom ) {
            if (creep.pos.isNearTo(creepRoom.controller)) {
                creep.claimController(creepRoom.controller)
            } else {
                actions.moveTo(creep, creepRoom.controller);
            }
            
        } else {
            actions.moveTo(creep, {x: 25, y: 25, roomName: claimRoom});
        }
    }
};

module.exports = roleClaimer;