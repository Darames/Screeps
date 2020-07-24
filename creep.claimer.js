import { moveTo } from 'actions';

let roleClaimer = {
    /** @param {Creep} creep **/
    claimer: function(creep) {
        const creepRoom = Game.rooms[creep.pos.roomName];
        const claimRoom = creepRoom.memory.claiming.room;
        const roomToClaim = Game.rooms[claimRoom];
        
        if( creep.pos.isNearTo({x: 25, y: 25, roomName: claimRoom}) ) {
            creep.claimController(creepRoom.controller)
        } else {
            moveTo(creep, {x: 25, y: 25, roomName: claimRoom});
        }
    }
};

export default roleClaimer;