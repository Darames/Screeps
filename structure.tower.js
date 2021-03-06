var structureTower = {

    run: function (thisRoom) {
        var towers = new Array();
        if (typeof thisRoom.memory.structures !== 'undefined') {
            if (typeof thisRoom.memory.structures.towers !== 'undefined') {
                for (i = 0; i < thisRoom.memory.structures.towers.length; i++) {
                    let tower = Game.getObjectById(thisRoom.memory.structures.towers[i]);
                    towers.push(tower);
                }
            }
        }
        if (towers.length > 0) {
            var hostiles = thisRoom.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 0) {
                // let username = hostiles[0].owner.username;
                // Game.notify(`User ${username} spotted in room ${roomName}`);

                towers.forEach(tower => tower.attack(hostiles[0]));

            } else if (thisRoom.damagedStructures.length > 0) {

                var roomSpawns = _.filter(Game.spawns, (spawn) => spawn.room == thisRoom);
                thisRoom.damagedStructures = _.filter(thisRoom.damagedStructures, (structures) => (structures.structureType != "constructedWall" && structures.structureType != "rampart") );
                //  || (structures.structureType == "constructedWall" && !(structures.hits > 170000)) || (structures.structureType == "rampart" && !(structures.hits > 170000)));

                for (i = 0; i < towers.length; i++) {
                    if (thisRoom.damagedStructures.length > 0) {
                        towers[i].repair(thisRoom.damagedStructures[0]);
                    }
                }
            }
        }
    }
};

module.exports = structureTower;

// https://gist.github.com/chrisinajar/1fbe4ecfd3f503f96227db2433765599 whitelisted attack
