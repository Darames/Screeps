var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvestersLimit = 2;

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var upgradersLimit = 1;

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var buildersLimit = 1;
    // console.log('Harvesters: ' + harvesters.length);
    
    // for(var name in Game.rooms) {
    //     console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    // }

    if(harvesters.length < harvestersLimit) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Darames'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    if(upgraders.length < upgradersLimit && harvesters.length == harvestersLimit) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Darames'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    if(builders.length < buildersLimit && harvesters.length == harvestersLimit) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        Game.spawns['Darames'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
    }
    
    if(Game.spawns['Darames'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Darames'].spawning.name];
        Game.spawns['Darames'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Darames'].pos.x + 1, 
            Game.spawns['Darames'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
