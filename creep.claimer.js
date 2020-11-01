let actions = require('actions');

let roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = Game.rooms[creep.memory.homeRoom].memory.claiming.room;
        const roomToClaim = Game.rooms[claimRoom];
        if (typeof creep.memory.wayPoint == 'undefined') {
               creep.memory.wayPoint = 'none';
            }
        
        if( creepRoom.name == claimRoom ) {
            if (creep.pos.isNearTo(creepRoom.controller)) {
                creep.claimController(creepRoom.controller)
            } else {
                creep.moveTo(creepRoom.controller);
                // creep.move(TOP);
            }
            
        } else {
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
            
        }

        if (typeof roomToClaim.controller != 'undefined' && roomToClaim.controller.my) {
            Game.rooms[creep.memory.homeRoom].memory.claiming.status = 'buildSpawn';
        }
    }
};

module.exports = roleClaimer;