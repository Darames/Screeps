var actions = require('actions');

var transporter = {
	/** @param {Creep} creep **/

	transportPriority: function (target) {
		if (((target.store[RESOURCE_ENERGY] * 100) / target.store.getCapacity(RESOURCE_ENERGY)) < 60) {
			target.transportPriority = target.transportPriority + 1;
			if (((target.store[RESOURCE_ENERGY] * 100) / target.store.getCapacity(RESOURCE_ENERGY)) < 40) {
				target.transportPriority = target.transportPriority + 1;
			}
		}
	},

	targets: function (thisRoom) {
		let containers;
		if (thisRoom.container) { containers = thisRoom.container; }
		let targets = new Array();
		let extensionEmpty = false;

		for (let sId in thisRoom.spawns) {
			let spawn = thisRoom.spawns[sId];
			if (spawn.store[RESOURCE_ENERGY] < spawn.store.getCapacity(RESOURCE_ENERGY)) {
				spawn.transportPriority = 20;
				targets.push(spawn);
			}
		}
		if (typeof thisRoom.extensions !== 'undefined') {
			for (let exId in thisRoom.extensions) {
				let extension = thisRoom.extensions[exId];
				if (extension !== null) {
					if (extension.store[RESOURCE_ENERGY] < extension.store.getCapacity(RESOURCE_ENERGY)) {
						extension.transportPriority = 17;
						this.transportPriority(extension);
						targets.push(extension);
						extensionEmpty = true;
					}
				}
			}
		}
		if (typeof thisRoom.structures.towers !== 'undefined') {
			for (let tId in thisRoom.structures.towers) {
				let tower = thisRoom.structures.towers[tId];
				if (tower.store[RESOURCE_ENERGY] < tower.store.getCapacity(RESOURCE_ENERGY)) {
					tower.transportPriority = 1;
					this.transportPriority(tower);
					targets.push(tower);
				}
			}
		}
		if (!extensionEmpty){
    		if (typeof thisRoom.controllerContainer !== 'undefined') {
    			for (let ccId in thisRoom.controllerContainer) {
    				let controllerContainer = thisRoom.controllerContainer[ccId];
    				if (controllerContainer.store[RESOURCE_ENERGY] < controllerContainer.store.getCapacity()) {
    					controllerContainer.transportPriority = 1;
    					this.transportPriority(controllerContainer);
    					targets.push(controllerContainer);
    				}
    			}
    		}
		
			if (typeof thisRoom.storage  !== 'undefined' && thisRoom.storage  != '') {
				let storage = thisRoom.storage;
				if (storage.store[RESOURCE_ENERGY] < (storage.store.getCapacity() / 2)) {
					storage.transportPriority = -1;
					storage.store[RESOURCE_ENERGY] = storage.store[RESOURCE_ENERGY];
					storage.store.getCapacity(RESOURCE_ENERGY) = storage.store.getCapacity();
					targets.push(storage);
				}
			}
		}
		// targets = _.sortBy(targets, s => s.transportPriority);
		targets.sort(function(a, b){
			var x = a.transportPriority;
			var y = b.transportPriority;
			if (x < y) {
				return 1;
			} else if (x > y) {
				return -1;
			} else {
				return 0;
			}
		  });
		thisRoom.transporterTargets = targets;
	},

	run: function (creep) {
		let creepRoom = Game.rooms[creep.pos.roomName];
		let target = Game.getObjectById(creep.memory.target);
		// if( typeof creep.memory.delivering === 'undefined' ){ creep.memory.delivering = false; }
		// if( typeof creep.memory.target === 'undefined' ){ creep.memory.target = "none"; }

		function newTarget(creep, targets) {
			if (targets.length > 0) {
				creep.memory.target = targets[0].id;
				target = targets[0];
				if (creep.store[RESOURCE_ENERGY] >= (target.store.getCapacity(RESOURCE_ENERGY) - target.energy)) {
					let removedTarget = targets.shift();
					creepRoom.transporterTargets = targets;
				}
			} else {
				creep.memory.target = "none";
			}
			return target;
		}
		if (target == null) {
			creepRoom.memory.scanMode = true;
		}
		if (creep.memory.target === "none" && creep.memory.delivering) {
			let targets = creepRoom.transporterTargets;
			// targets = _.sortByAll(targets, [s => s.transportPriority, s => creep.pos.getRangeTo(s)]);
			target = newTarget(creep, targets);
		} else if (creep.memory.target != "none" && target.store[RESOURCE_ENERGY] == target.store.getCapacity(RESOURCE_ENERGY)) {
			let targets = creepRoom.transporterTargets; targets = _.sortByAll(targets, [s => s.transportPriority, s => creep.pos.getRangeTo(s)]);
			target = newTarget(creep, targets);
		}

		if ((creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) || !creep.memory.delivering) {
			actions.getEnergy(creep); // geting energy
			creep.memory.target = "none";
			if (creep.memory.delivering) { creep.memory.delivering = false; }// set refill mode
			if (creep.store[RESOURCE_ENERGY]  == creep.store.getCapacity()) { creep.memory.delivering = true; } // set deliver mode
		} else {
			if (target) {
				if (creep.pos.isNearTo(target)) {
					creep.transfer(target, RESOURCE_ENERGY);
				} else {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' }, maxOps: 400 });
				}
			} else {
				if (creep.store[RESOURCE_ENERGY]  < creep.store.getCapacity()) {
					creep.memory.delivering = false;// set refill mode
					creep.memory.target = "none";
					actions.getEnergy(creep); // geting energy
				} else {
					creep.moveTo(creepRoom.spawns[0], { visualizePathStyle: { stroke: '#ffffff' }, maxOps: 400 });
					creep.memory.target = "none";
				}
			}
		}

	}
};

module.exports = transporter;
