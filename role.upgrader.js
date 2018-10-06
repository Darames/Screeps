var moveTo = require('tools.functions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var upgraderFlag = "none";
        
        // get upgrader position flag
        if(Game.rooms[creep.pos.roomName].upgraderFlag){
            upgraderFlag = Game.rooms[creep.pos.roomName].upgraderFlag;
        }

        // set upgrading mode
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            // creep.say('get energy');
        }
        // set geting energy mode
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true; 
	       // creep.say('upgrade');
	    }
        // upgrading Controller
	    if(creep.memory.upgrading) {
	        if(upgraderFlag !== "none"){
	            if(creep.pos.inRangeTo(upgraderFlag, 1)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(upgraderFlag, {maxOps: 200}); 
                    // creep.upgradeController(creepRoom.controller);
                }
	        } else {
	            if(creep.pos.inRangeTo(creepRoom.controller, 2)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(creepRoom.controller, {maxOps: 200}); 
                    // creep.upgradeController(creepRoom.controller);
                }
	        }
        } else {
        // geting energy
            moveTo.container(creep, "withdraw", "controller");
        }
	}
};

module.exports = roleUpgrader;
