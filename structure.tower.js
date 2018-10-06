var structureTower = {

    run: function (roomName, damagedStructures) {
        var towerRoom = Game.rooms[roomName];
        var towers = new Array();
        for(i = 0; i < towerRoom.memory.towers.length; i ++){
            let tower = Game.getObjectById(towerRoom.memory.towers[i]);
                towers.push(tower);
        }
        if (towers.length > 0){
            var hostiles = towerRoom.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) {
                let username = hostiles[0].owner.username;
                Game.notify(`User ${username} spotted in room ${roomName}`);
                
                towers.forEach(tower => tower.attack(hostiles[0]));
                
            } else if(damagedStructures.length > 0){
                
                var roomSpawns = _.filter(Game.spawns, (spawn) => spawn.room == towerRoom);
                // if(towerRoom.name == "E36S29"){
                //     // damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType != "constructedWall" &&  structures.structureType != "rampart" ) || ( structures.structureType == "constructedWall" && !(structures.hits > 25000) ) || ( structures.structureType == "rampart" && !(structures.hits > 25000) ) );
                //     damagedStructures = _.filter( damagedStructures, (structures) => ( structures.pos.getRangeTo(roomSpawns[0]) >= 15 && structures.structureType != "constructedWall" &&  structures.structureType != "rampart" ) || ( structures.structureType == "constructedWall" && !(structures.hits > 25000) ) || ( structures.structureType == "rampart" && !(structures.hits > 25000) ) );
                // } else if(towerRoom.name == "E37S27"){
                //     damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType == "constructedWall" && !(structures.hits > 25000) ) || ( structures.structureType == "rampart" && !(structures.hits > 25000) ) );
                // } else {
                //     damagedStructures = _.filter( damagedStructures, (structures) => ( structures.pos.getRangeTo(roomSpawns[0]) >= 15 && structures.structureType != "constructedWall" &&  structures.structureType != "rampart" ) || ( structures.structureType == "constructedWall" && !(structures.hits > 65000) ) || ( structures.structureType == "rampart" && !(structures.hits > 65000) ) );
                // }
                
                if(towerRoom.name == "E34S29"){
                    damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType != "constructedWall" &&  structures.structureType != "rampart" ) || ( structures.structureType == "constructedWall" && !(structures.hits > 175000) ) || ( structures.structureType == "rampart" && !(structures.hits > 175000) ) );
                } else {
                    damagedStructures = _.filter( damagedStructures, (structures) => ( structures.structureType != "constructedWall" &&  structures.structureType != "rampart" ) || ( structures.structureType == "constructedWall" && !(structures.hits > 85000) ) || ( structures.structureType == "rampart" && !(structures.hits > 85000) ) );
                }

                // if(damagedStructures.length > 0){
                //     towers[0].repair(damagedStructures[0]);
                // }
                
                for(i = 0; i < towerRoom.memory.towers.length; i ++){
                    if(damagedStructures.length > 0){
                        towers[i].repair(damagedStructures[0]);
                    }
                }
                
            }
        }
    }
};

module.exports = structureTower;

// https://gist.github.com/chrisinajar/1fbe4ecfd3f503f96227db2433765599 whitelisted attack