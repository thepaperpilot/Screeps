const roleBuilder = require('role.builder')
const roleCollector = require('role.collector')
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')

Object.values(Game.rooms).forEach(handleRoom)

if (!Memory.creeps)
    Memory.creeps = {}

// Good reference: https://github.com/Garethp/Screeps
// https://screepsworld.com/2017/07/warning-novice-zones-are-lies-where-to-spawn-as-a-noob/
// https://wiki.screepspl.us/index.php/Getting_Started
// Errors: https://docs.screeps.com/api/#Constants

module.exports.loop = function () {
    Object.keys(Memory.creeps).forEach(name => {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    })
    
    // Descending priority
    maintainCreepLevels('upgrader', 1, [WORK, WORK, CARRY, MOVE])
    maintainCreepLevels('archer', 1, [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE])
    maintainCreepLevels('builder', 3, [WORK, CARRY, CARRY, MOVE])
    maintainCreepLevels('collector', 2, [CARRY, CARRY, CARRY, MOVE], { extend: [MOVE, CARRY] })
    maintainCreepLevels('harvester', 2, [WORK, WORK, MOVE], { extend: [WORK] })
    maintainCreepLevels('builder', 1, [WORK, CARRY, CARRY, MOVE])
    
    Object.values(Game.creeps).forEach(handleCreep)
}

// TODO create queue
// TODO implement extend
function maintainCreepLevels(role, minAmount, core = [WORK, CARRY, MOVE], opts = {}) {
    if (_.filter(Game.creeps, creep => creep.memory.role == role && (!opts.additionalFilter || opts.additionalFilter(creep))).length < minAmount) {
        const name = role + Game.time
        const result = Game.spawns['Spawn1'].spawnCreep(core, name, { memory: { role } })
        if (result === 0) {
            console.log('Spawning new ' + role + ': ' + name)
        } else console.log('spawning ' + role + ' failed: ' + result)
    }
}

function handleRoom(room) {
    const {x, y} = Game.spawns['Spawn1'].pos
    
    for (let i = -2; i <= 2; i++) {
        room.createConstructionSite(x + i, y - 1, STRUCTURE_EXTENSION)
        console.log('creating extension at', x + i, y - 1)
    }
    
    Object.values(room.find(FIND_SOURCES)).forEach(source => {
        const path = room.findPath(Game.spawns['Spawn1'].pos, source.pos, { ignoreCreeps: true })
        Object.values(path).forEach(pos => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
            console.log('creating road at', pos.x, pos.y)
        })
    })
}

function handleCreep(creep) {
    switch (creep.memory.role) {
        case 'builder': roleBuilder.run(creep); break
        case 'collector': roleCollector.run(creep); break
        case 'harvester': roleHarvester.run(creep); break
        case 'upgrader': roleUpgrader.run(creep); break
    }
}
