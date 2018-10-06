var roleShifter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        
        switch (creep.memory.secondRole) {
            case "coreShifter":
                var storage = creepRoom.storage, 
                termial = creepRoom.terminal, 
                link = creepRoom.coreLink;
                
                if( creep.pos.isNearTo(storage) ) {
                    if( creep.pos.isNearTo(termial) ) {
                        
                    //if link has energy and storage energy not 50% fill energy in storage
                    //if storage energy 50% fill terminal till 100k energy
                    
                    } else {
                        creep.moveTo(termial); 
                    }
                } else {
                    creep.moveTo(storage); 
                }
                break;
            case "coreShifter":
                var link = creep.sourceLink, 
                source = ;
                if( creep.pos.isNearTo(link) ) {
                    if( creep.pos.isNearTo(source) ) {
                    
                    //fill energy from source in link
                    
                    } else {
                        creep.moveTo(source); 
                    }
                } else {
                    creep.moveTo(storage); 
                }
        }
    }
};

module.exports = roleShifter;