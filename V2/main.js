var flags = require('flags');
var rooms = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    // for(var name in Memory.creeps) { // moved to creeps Controller
    //     if(!Game.creeps[name]) {
    //         delete Memory.creeps[name];
    //         console.log('Clearing non-existing creep memory:', name);
    //     }
    // }

    flags.run(); //toDo = flags deklarieren und dann übergeben wenn gebraucht z.B an creep upgrader
    rooms.run(); //room memory update
    rooms.spawn(); //room spawn creeps

    //toDo = harvester anpassen sourcefindung bei einem container defekt
    //toDo = wenn drop näher dann drop

    creeps.run();
}
