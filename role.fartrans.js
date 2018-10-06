var moveTo = require('tools.functions');
var variables = require('variables');

var roleFarTrans = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var creepRoom = Game.rooms[creep.pos.roomName];
        var sources = creepRoom.find(FIND_SOURCES);
        
        // let costs = new PathFinder.CostMatrix;
        // let pos = creep.pos;
        // console.log( costs.get(pos.x, pos.y) );
        
                
        if(typeof creep.memory.delivering === 'undefined' ){
            creep.memory.delivering = false;
        }
        if( typeof creep.memory.target === 'undefined' ){
            creep.memory.target = "none";
        }
        
        function getTarget(creep){
            var targets = new Array();
            if(creepRoom.memory.container){
                var container = Game.getObjectById(creepRoom.memory.container[i]);
                targets.push(container);
            }
            
            if(creepRoom.memory.extensions.length > 0){
                
                targets.push(source); }
            }
            
            return targets;
        }
        
        function selectTarget(creep, targets){
            if(targets.length > 0) {
                creep.memory.target = targets[0].id;
                target = Game.getObjectById(targets[0].id);
            } else {
                creep.memory.target = "none";
            }
        }
        
        var targets = getTarget(creep);
            
        if( ( creep.memory.target === "none" && creep.memory.delivering ) ){
            selectTarget(creep, targets);
        } else if( creep.memory.target != "none" && ( target.energy == target.energyCapacity ) ){
            selectTarget(creep, targets);
        }

        if( ( creep.memory.delivering && creep.carry.energy == 0 ) || !creep.memory.delivering ) {
                moveTo.container(creep, "withdraw"); // geting energy
                creep.memory.target = "none";
                if( creep.memory.delivering ){ 
                    creep.memory.delivering = false;
                    creep.say( 'refill' );
                }// set refill mode
                if( creep.carry.energy == creep.carryCapacity ) { 
                    creep.memory.delivering = true; 
                    creep.say('deliver'); 
                } // set deliver mode
        } else {
            if(targets.length > 0) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo( target, {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 200 });
                }
            } else {
                if(creep.carry.energy == 0){
                    creep.memory.delivering = false;
                    creep.memory.target = "none";
                    creep.say( "refill" );
                    moveTo.container(creep, "withdraw");
                }else{
                    creep.moveTo(Game.getObjectById(creepRoom.memory.spawn[0]), {visualizePathStyle: {stroke: '#ffffff'}, maxOps: 200});
                    creep.memory.target = "none";
                }
            }
        }
	}
};

module.exports = roleFarTrans;