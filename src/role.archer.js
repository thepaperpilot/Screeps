const roleArcher = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const target = getRangedTarget()
        if (target == null) return
        
        // Attack target
		creep.rangedAttack(target)
		
		// Kite target
		if (target.pos.inRangeTo(creep.pos, 2))
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y )
	}
}

module.exports = roleArcher

function getRangedTarget() {
    const closeArcher = creep.pos.findClosestByPath(HOSTILE_CREEPS, {
		filter: enemy => enemy.getActiveBodyparts(RANGED_ATTACK) > 0 &&
		    creep.pos.inRangeTo(enemy, 3)
	})

	if (closeArcher != null)
		return closeArcher
		
	const closeMelee = creep.pos.findClosestByPath(HOSTILE_CREEPS, {
		filter: enemy => enemy.getActiveBodyparts(ATTACK) > 0 &&
		    enemy.getActiveBodyparts(MOVE) > 0 &&
		    creep.pos.inRangeTo(enemy, 3)
	})

	if (closeMelee != null)
		return closeMelee
		
	const closeHealer = creep.pos.findClosestByPath(HOSTILE_CREEPS, {
		filter: enemy => enemy.getActiveBodyparts(HEAL) > 0 &&
		    enemy.getActiveBodyparts(MOVE) > 0 &&
		    creep.pos.inRangeTo(enemy, 3)
	})

	if (closeHealer != null)
		return closeHealer

    return creep.pos.findNearest(HOSTILE_CREEPS)
}
