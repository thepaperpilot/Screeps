const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0)
            creep.memory.upgrading = false
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity)
            creep.memory.upgrading = true

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        } else {
            const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: spawn => spawn.energy > 0
            })

            if (closestSpawn) {
                creep.moveTo(closestSpawn, {visualizePathStyle: {stroke: '#ffaa00'}})
                creep.withdraw(closestSpawn, RESOURCE_ENERGY)
            }
        }
    }
}

module.exports = roleUpgrader
