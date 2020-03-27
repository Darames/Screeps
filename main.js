var flags = require('flags');
var rooms = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    flags.run(); // save new flags in memory
    rooms.run(); // start room controller

    //toDo = harvester anpassen sourcefindung bei einem container defekt
    //toDo = wenn drop näher dann drop

    creeps.run(); // start creep controller
}
