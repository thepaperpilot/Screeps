const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: spawn => spawn.energy > 0
            })

            if (closestSpawn) {
                creep.moveTo(closestSpawn, {visualizePathStyle: {stroke: '#ffaa00'}})
                creep.withdraw(closestSpawn, RESOURCE_ENERGY)
            }
        } else {
            // First, we're going to check for damaged ramparts. We're using ramparts as the first line of defense
            // and we want them nicely maintained. This is especially important when under attack. The builder will
            // repair the most damaged ramparts first
            const damagedRamparts = Object.values(creep.room.find(Game.STRUCTURES)).filter(s =>
                s.structureType === 'rampart' && s.hits < (s.hitsMax - 50))

            damagedRamparts.sort((a, b) => a.hits - b.hits)

            if (damagedRamparts.length) {
                creep.moveTo(damagedRamparts[0], {visualizePathStyle: {stroke: '#00ff00'}})
                creep.repair(damagedRamparts[0])

                return
            }

            // Next we're going to look for general buildings that have less than 50% health, and we'll go to repair those.
            // We set it at 50%, because we don't want builders abandoning their duty every time a road gets walked on
            const toRepair = Object.values(creep.room.find(Game.STRUCTURES)).filter(s => s.hits / s.hitsMax < .5)

            if (toRepair.length) {
                const structure = toRepair[0]
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#00aa00'}})
                creep.repair(structure)

                return
            }

            // If no repairs are needed, we're just going to go find some structures to build
            const targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
            if (targets) {
                if (!creep.pos.isNearTo(targets)) creep.moveTo(targets, {visualizePathStyle: {stroke: '#0000ff'}})

                if (creep.pos.inRangeTo(targets, 0)) creep.suicide()

                creep.build(targets)
                
                return
            }
            
            // If there's no structures to build, expand our ramparts!
            let ramparts = creep.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_RAMPART })
            if (!ramparts.length) ramparts = [Game.spawns.Spawn1]
            ramparts.forEach(rampart => {
                [
                    [rampart.pos.x - 1, rampart.pos.y],
                    [rampart.pos.x, rampart.pos.y - 1],
                    [rampart.pos.x, rampart.pos.y - 1],
                    [rampart.pos.x, rampart.pos.y + 1],
                    [rampart.pos.x - 1, rampart.pos.y - 1],
                    [rampart.pos.x + 1, rampart.pos.y - 1],
                    [rampart.pos.x - 1, rampart.pos.y + 1],
                    [rampart.pos.x - 1, rampart.pos.y - 1]
                ].forEach(pos => {
                    const tile = creep.room.lookAt(pos[0], pos[1])
                    if(!Object.values(tile).some(s => 
                        (s.type == 'structure' && s.structure.structureType == STRUCTURE_RAMPART) || s.type == 'constructionSite')) {
                        creep.room.createConstructionSite(pos[0], pos[1], STRUCTURE_RAMPART)
                        console.log('creating rampart at', pos[0], pos[1])
                    }
                })
            })
        }
    }
}

module.exports = roleBuilder
