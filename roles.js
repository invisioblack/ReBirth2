"use strict";

module.exports = function () {




    Creep.prototype.roleHarvester = function () {

        let buildStructureFlag = this.room.myConstructionSites.length > 0,
            distributeEnergyFlag = this.room.energyCapacityAvailable !== this.room.energyAvailable,
            fillTowerFlag = this.room.hostileCreeps.length > 0,
            repairFlag = this.room.damagedStructures.length > 0;

        this.memoryWorking();

        if (!this.memory.working)
            this.collectEnergy();
        else if (distributeEnergyFlag)
            this.distributeEnergy();
        else
            this.roleUpgrader();

    };

    Creep.prototype.roleUpgrader = function () {

        this.memoryWorking();

        if (!this.memory.working)
            this.collectEnergy();
        else {
            this.upgradeController();
        }
    };

    Creep.prototype.collectEnergy = function () {

        switch (this.memory.role) {

            case 'harvester':
                if (!this.harvest())
                    console.log(`no target to harvest for: ${this.name} ${this.memory.role}`);
                break;

            case 'upgrader':
                if (!this.harvest())
                    console.log(`no target to harvest for: ${this.name} ${this.memory.role}`);
        }

    };
    Creep.prototype.distributeEnergy = function () {

        switch (this.memory.role) {

            case 'harvester':

                let returnCode,
                    target;



                target = this.targetDistributeEnergy();

                if (target)
                    returnCode = this.transfer(target, RESOURCE_ENERGY);

                if (returnCode === ERR_NOT_IN_RANGE)
                    this.travelTo(target);

                else if (returnCode === ERR_FULL) {
                    delete this.memory.target;
                }

                break;
        }

    };
};
