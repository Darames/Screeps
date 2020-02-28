let actions = require('actions');

var harvester = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var sources = creepRoom.sources;
        var targets = creepRoom.container;
        targets = _.filter(targets, s => s.pos.inRangeTo(sources[creep.memory.source], 2));

        // harvest energy
        if (targets.length > 0) {
            if (creep.pos.isEqualTo(targets[0])) {
                creep.harvest(sources[creep.memory.source]);
            } else {
                actions.moveTo(creep, targets[0].pos);
            }
        } else {
            if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                actions.moveTo(creep, sources[creep.memory.source]);
            }
        }
    }
};

module.exports = harvester;
