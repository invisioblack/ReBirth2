"use strict";
module.exports = function () {

    Creep.prototype.targetSource = function () {

        let sources = this.room.sources,
            target;

        if (sources.length === 1)
            target = sources[0].freeSpot;
        else {

            target = _.filter(sources, function (source) {
                return source.freeSpot === true;
            });

            if (target.length > 1)
                target = this.pos.findClosestByPath(target);
            else if (target.length === 1)
                target = target[0];

        }

        this.memory.target = target.id;

    };

    Creep.prototype.targetDistributeEnergy = function () {

        let energyConsumers = this.room.mySpawns.concat(this.room.myExtensions),
            target;



        target = _.filter(energyConsumers, function (energyConsumer) {

            if (energyConsumer.structureType === STRUCTURE_EXTENSION)
                return energyConsumer.energy < energyConsumer.energyCapacity && !energyConsumer.busy;
            else
                return energyConsumer.energy < energyConsumer.energyCapacity;

        });


        if (target.length === 1)
            target = target[0];
        else if (target.length > 1)
            target = this.pos.findClosestByPath(target);

        console.log(target);

        this.memory.target = target.id;
    };

};
