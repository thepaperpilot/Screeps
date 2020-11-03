const energyStructures = [
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
    STRUCTURE_CONTAINER
]

const roleCollector = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
			let sources = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
			    filter: t => t.energy > 0
			})
    		if (sources) {
    		    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}})
    		    creep.withdraw(sources, RESOURCE_ENERGY)
    		} else {
    		    sources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        			filter: r => r.resourceType === RESOURCE_ENERGY && r.energy > 50
        		})
    		    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}})
			    creep.pickup(sources)
    		}
		} else {
			let target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
    			filter: c => c.memory.role == "builder" && c.energy < (c.energyCapacity - 10)
    		})
    		
    		if (!target) target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    			filter: s => energyStructures.includes(s.structureType) && s.energy < s.energyCapacity
    		})
    		
    		// Go to target and give it energy
    		if (creep.pos.isNearTo(target)) {
    			if (target.energy < target.energyCapacity) {
    				creep.transfer(target, RESOURCE_ENERGY)
    			}
    		} else {
    			creep.moveTo(target, {visualizePathStyle: {stroke: '#00aa00'}})
            }
		}
    }
}

module.exports = roleCollector
