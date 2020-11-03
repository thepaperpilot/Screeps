const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        creep.moveTo(sources)
        creep.harvest(sources)
    }
}

module.exports = roleHarvester
