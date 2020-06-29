var flags = require('flags');
var rooms = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    flags.run(); // save new flags in memory
    rooms.run(); // start room controller
    creeps.run(); // start creep controller

    let testRoom = Game.rooms['W9S52'];
    testRoom.container = testRoom.find(FIND_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && !s.pos.inRangeTo(s.room.controller, 3)}  });
    testRoom.controllerContainer = testRoom.find(FIND_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(s.room.controller, 3)}  });
    
    // console.log('container ', testRoom.container);
    // console.log('controllerContainer ', testRoom.controllerContainer);
}
