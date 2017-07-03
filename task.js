"use strict";

Creep.prototype.harvestTask = function () {


    this.memoryWorking();

    if (!this.memory.working) {

        if (!this.memory.target)
            this.getHarvestTarget();

        let target = Game.getObjectById(this.memory.target),
            harvest = this.harvest(target);

        if (harvest === ERR_NOT_IN_RANGE)
            this.travelTo(target);

    }

};

module.exports = {

    collectEnergy: function () {

        let notWorkingCreeps = _.filter(Game.creeps, {memory: {working: false}});

        if (notWorkingCreeps.length === 0)
            return true;
        else {
            notWorkingCreeps.forEach(creep => {
                if (!creep.spawning)
                    creep.harvestTask();
            });
            return false;
        }
    }






};



