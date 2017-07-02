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
            MY_ROOMS = _.filter(Game.rooms, function (room) {
                return room.myRoom && room.energyAvailable < room.energyCapacityAvailable;
            });

        let roomCount = 0;

        for (let room of MY_ROOMS) {
            if (room.notWorkingCreeps.length === 0)
                roomCount++;
            else
                room.notWorkingCreeps.forEach(creep => {
                    if (!creep.spawning)
                        creep.harvestTask();
                })
        }

        //console.log(roomCount === MY_ROOMS.length);
        return roomCount === MY_ROOMS.length;
    }
};



