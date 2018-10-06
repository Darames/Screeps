var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        // get claim flag
        for (var flag in Game.flags) {
            if( Game.flags[flag].name.substr(0, 5) == "claim" ){
                var claimFlag = Game.flags[flag];
                var claimFlagRoom = Game.flags[flag].pos.roomName ;
            }
        }
        
        if( creep.pos.isNearTo(claimFlag) ) {
            creep.claimController(creepRoom.controller)
        } else {
            creep.moveTo(claimFlag); 
        }
    }
};

module.exports = roleClaimer;

// Game.spawns['Darames'].spawnCreep([CLAIM,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "Claimer1", {memory: {role: 'claimer'}});