var flags = require('flags');
var rooms = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    flags.run(); // save new flags in memory
    rooms.run(); // start room controller
    creeps.run(); // start creep controller
}
