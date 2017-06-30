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

    } else
        return 'OK';

};



module.exports = {

    harvest: function () {

        const
            MY_ROOMS = _.filter(Game.rooms, {myRoom: true});

        for (let room of MY_ROOMS)
            _.filter(room.myCreeps, {memory: {working: false}}).forEach(creep => {
                if (!creep.spawning)
                    creep.harvestTask();
            })


    }

};



