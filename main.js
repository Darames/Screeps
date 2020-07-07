var flags = require('flags');
var rooms = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    flags.run(); // save new flags in memory
    rooms.run(); // start room controller
    creeps.run(); // start creep controller

    // Game.rooms['W13N53'].memory.scanMode = true;
    // delete Memory.rooms[W9S52];
    
    // console.log('container ', testRoom.container);
    // console.log('controllerContainer ', testRoom.controllerContainer);
}
