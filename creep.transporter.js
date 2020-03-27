var actions = require('actions');

var transporter = {
	/** @param {Creep} creep **/

	priority: function (target) {
		if (((target.energy * 100) / target.energyCapacity) < 60) {
			target.priority = target.priority + 1;
			if (((target.energy * 100) / target.energyCapacity) < 40) {
				target.priority = target.priority + 1;
			}
		}
	},

	targets: function (thisRoom) {
		let containers;
		if (thisRoom.container) { containers = thisRoom.container; }
		let targets = new Array();
	
		for (let sId in thisRoom.spawns) {
			let spawn = thisRoom.spawns[sId];
			if (spawn.energy < spawn.energyCapacity) {
				spawn.priority = 5;
				targets.push(spawn);
			}
		}
		if (thisRoom.extensions.length > 0) {
			for (let exId in thisRoom.extensions) {
				let extension = thisRoom.extensions[exId];
				if (extension !== null) {
					if (extension.energy < extension.energyCapacity) {
						extension.priority = 2;
						this.priority(extension);
						targets.push(extension);
					}
				}
			}
		}
		if (thisRoom.structures.towers.length > 0) {
			for (let tId in thisRoom.structures.towers) {
				let tower = thisRoom.structures.towers[tId];
				if (tower.energy < tower.energyCapacity) {
					tower.priority = 1;
					this.priority(tower);
					targets.push(tower);
				}
			}
		}
		if (thisRoom.controllerContainer.length > 0) {
			for (let ccId in thisRoom.controllerContainer) {
				let controllerContainer = thisRoom.controllerContainer[ccId];
				if (controllerContainer.store[RESOURCE_ENERGY] < controllerContainer.storeCapacity) {
					controllerContainer.priority = 1;
					this.priority(controllerContainer);
					controllerContainer.energy = controllerContainer.store[RESOURCE_ENERGY];
					controllerContainer.energyCapacity = controllerContainer.storeCapacity;
					targets.push(controllerContainer);
				}
			}
		}
		if (thisRoom.storage.length > 0) {
			let storage = thisRoom.storage;
			if (storage.store[RESOURCE_ENERGY] < (storage.storeCapacity / 2)) {
				storage.priority = -1;
				storage.energy = storage.store[RESOURCE_ENERGY]; storage.energyCapacity = storage.storeCapacity;
				targets.push(storage);
			}
		}
		targets = _.sortBy(targets, s => s.priority);
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
				if (creep.store[RESOURCE_ENERGY] >= (target.energyCapacity - target.energy)) {
					removedTarget = targets.shift();
					creepRoom.transporterTargets = targets;
				}
			} else {
				creep.memory.target = "none";
			}
			return target;
		}

		if (creep.memory.target === "none" && creep.memory.delivering) {
			let targets = creepRoom.transporterTargets; targets = _.sortByAll(targets, [s => s.priority, s => creep.pos.getRangeTo(s)]);
			target = newTarget(creep, targets);
		} else if (creep.memory.target != "none" && target.energy == target.energyCapacity) {
			let targets = creepRoom.transporterTargets; targets = _.sortByAll(targets, [s => s.priority, s => creep.pos.getRangeTo(s)]);
			target = newTarget(creep, targets);
		}

		if ((creep.memory.delivering && creep.store.energy == 0) || !creep.memory.delivering) {
			actions.getEnergy(creep); // geting energy
			creep.memory.target = "none";
			if (creep.memory.delivering) { creep.memory.delivering = false; }// set refill mode
			if (creep.store.energy == creep.store.getCapacity()) { creep.memory.delivering = true; } // set deliver mode
		} else {
			if (target) {
				if (creep.pos.isNearTo(target)) {
					creep.transfer(target, RESOURCE_ENERGY);
				} else {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' }, maxOps: 400 });
				}
			} else {
				if (creep.store.energy < creep.store.getCapacity()) {
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
