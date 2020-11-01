let actions = require('actions');

var extractorHarvester = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var minerals = creepRoom.minerals;
        var targets = creepRoom.links;
        if (targets === null) {
            creepRoom.memory.scanMode = true;
        }
        targets = _.filter(targets, s => s.pos.inRangeTo(minerals[0], 2));
        
        // harvest energy
        if (targets.length > 0) {
            if (creep.pos.isEqualTo(targets[0])) {
                if (creepRoom.extractor.cooldown == 0) {
                    creep.harvest(minerals[0]);
                }
            } else {
                actions.moveTo(creep, targets[0].pos);
            }
        } else {
            if (creepRoom.extractor.cooldown == 0) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    actions.moveTo(creep, minerals[0]);
                }
            }
        }
    }
};

module.exports = extractorHarvester;
