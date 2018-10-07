var flags = require('flags');
var room = require('rooms');
var creeps = require('creeps');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    flags.run(); //toDo = flags deklarieren und dann übergeben wenn gebraucht z.B an creep upgrader
    room.memory(); //room memory update
    room.spawn(); //room spawn creeps

    //toDo = harvester anpassen sourcefindung bei einem container defekt
    //toDo = wenn drop näher dann drop
    
    
    for(var nameRoom in Game.rooms){
        
        var damagedStructures = Game.rooms[nameRoom].find(FIND_STRUCTURES,{
            filter: (structure) => {
                return ( ( 100 * structure.hits ) / structure.hitsMax != 100 ) && structure.structureType != STRUCTURE_CONTROLLER; 
            } 
        });

        if(Game.rooms[nameRoom].memory.towers){
            structureTower.run(nameRoom, damagedStructures);
        }
    }

    creeps.run();
}
