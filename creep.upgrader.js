var actions = require('actions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var upgraderPos = "none";
        var upgradeContainer = false;
        if( creepRoom.memory.controllerContainer !== 'undefined' ){ upgradeContainer = action.getElement(creepRoom, creepRoom.memory.controllerContainer) }
        
        // get upgrader position flag
        if(creepRoom.memory.upgraderPos){
            upgraderPos = creepRoom.memory.upgraderPos;
        }

        // set upgrading mode
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        // set geting energy mode
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true; 
	    }
        // upgrading Controller
	    if(creep.memory.upgrading) {
	        if(upgraderPos !== "none"){
	            if(creep.pos.inRangeTo(upgraderPos, 1)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(upgraderPos, {maxOps: 200}); 
                    creep.upgradeController(creepRoom.controller);
                }
	        } else {
	            if(creep.pos.inRangeTo(creepRoom.controller, 2)) {
                    creep.upgradeController(creepRoom.controller);
                } else {
                    creep.moveTo(creepRoom.controller, {maxOps: 200}); 
                    creep.upgradeController(creepRoom.controller);
                }
	        }
        } else {
        // geting energy
            if (upgradeContainer) {
                if (upgradeContainer.store[RESOURCE_ENERGY] > 0 ) {
                    actions.withdraw(creep, upgradeContainer);
                    creep.memory.upgrading = true; 
                } else {
                    actions.getEnergy(creep);
                }
            } else {
                actions.getEnergy(creep);
            }
        }
	}
};

module.exports = roleUpgrader;
