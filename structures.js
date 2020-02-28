let tower = require('structure.tower');

var structures = {

    run: function (thisRoom) {
        if (thisRoom.structures.towers) {
            tower.run(thisRoom);
        }
    }
};

module.exports = structures;

// https://gist.github.com/chrisinajar/1fbe4ecfd3f503f96227db2433765599 whitelisted attack
