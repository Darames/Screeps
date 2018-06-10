var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTransporter = require('role.transporter');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvestersLimit = 2;

    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    var transportersLimit = 1;

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var upgradersLimit = 2;

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var buildersLimit = 2;

    if(harvesters.length < harvestersLimit) {
        var newName = 'Harvester' + Game.time;
        var source = 0;
        var harvesterOnSource = _.filter(Game.creeps, (creep) => creep.memory.source == 0 );
        if(harvesterOnSource.length){var source = 1;}

        Game.spawns['Darames'].spawnCreep([WORK,WORK,WORK,MOVE,MOVE], newName, {memory: {role: 'harvester', source: source }});
    }else if(transporters.length < transportersLimit && harvesters.length == harvestersLimit) {
        var newName = 'Transporter' + Game.time;
        Game.spawns['Darames'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'transporter'}});
    }else if(upgraders.length < upgradersLimit && harvesters.length == harvestersLimit && transporters.length == transportersLimit) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Darames'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }else if(builders.length < buildersLimit && harvesters.length == harvestersLimit && transporters.length == transportersLimit) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Darames'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
    }else if(!transporters.length && Game.room.energyAvailable < 510) {
        //backup transporter
        var newName = 'Transporter' + Game.time;
        Game.spawns['Darames'].spawnCreep([CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'transporter'}});
    }
    
    if(Game.spawns['Darames'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Darames'].spawning.name];
        Game.spawns['Darames'].room.visual.text(
            'spawn ' + spawningCreep.memory.role,
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
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
    }
}
