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

            let target = this.room.controller;

            if (target.sign === undefined || target.sign.text !== 'Territory of the Twilight Kingdoms of the East')
                if (this.signController(target, 'Territory of the Twilight Kingdoms of the East') === ERR_NOT_IN_RANGE)
                    this.travelTo(target);

            if (this.upgradeController(target) === ERR_NOT_IN_RANGE)
                this.travelTo(target);


        }
    };

    Creep.prototype.collectEnergy = function () {

        let target;

        switch (this.memory.role) {

            case 'harvester':


                if (!this.memory.target)
                    this.targetSource();

                target = Game.getObjectById(this.memory.target);

                if (target) {
                    if (this.harvest(target) === ERR_NOT_IN_RANGE)
                        this.travelTo(target);
                } else
                    console.log('no target for', this.name);

                break;

            case 'upgrader':


                if (!this.memory.target)
                    this.targetSource();

                target = Game.getObjectById(this.memory.target);

                if (target) {
                    if (this.harvest(target) === ERR_NOT_IN_RANGE)
                        this.travelTo(target);
                } else
                    console.log('no target for', this.name);
        }

    };
    Creep.prototype.distributeEnergy = function () {

        switch (this.memory.role) {

            case 'harvester':

                let returnCode,
                    target;

                if (!this.memory.target)
                    this.targetDistributeEnergy();

                target = Game.getObjectById(this.memory.target);

                if (target)
                    returnCode = this.transfer(target, RESOURCE_ENERGY);

                if (returnCode === ERR_NOT_IN_RANGE)
                    this.travelTo(target);

                else if (returnCode === ERR_FULL)
                    target = this.targetDistributeEnergy();
                break;
        }

    };






};
