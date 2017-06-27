'use strict';

module.exports = function () {

    StructureSpawn.prototype.roleScan = function () {

        const
            RCL = this.room.controller.level,
            CONSTRUCTION_SITES = this.room.myConstructionSites,
            NUMBER_OF_CREEPS = _.sum(Game.creeps, (c) => c.memory.spawn === this.id),
            SOURCES = this.room.sources,
            ALL_STORAGE = this.room.containers.concat(this.room.myStorage),
            HOSTILES = this.room.hostileCreeps,
            NUMBER_OF_SOURCES = SOURCES.length;

        let
            progress = 0,
            plusEnergy = 0,
            totalProgress = 0,
            containersOk,
            roleName,
            returnCode,
            extraCreepNumber,
            extraRoles,
            energyCapacity = this.room.energyCapacityAvailable,
            energyAvailable = this.room.energyAvailable,
            emptySquare = 0,
            currentCreep,

            creep =
                {harvester: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                stationaryHarvester: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                hauler: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                protector: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                claimer: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                remoteRepairer: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                remoteStationaryHarvester: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                remoteHauler: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                builder: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                repairer: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                wallRepairer: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                upgrader: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                miner: {preSpawn: true, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                miniClaimer: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                warrior: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                controllerAttacker: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0},
                demolisher: {preSpawn: false, numberOfPreSpawn: 0, minimumSpawnOf: 0, numberOf: 0}
            };


        // set master spawn
        if (this.room.mySpawns.length === 1 && !this.memory.masterSpawn)
            this.memory.masterSpawn = true;

        // count sourceEnergy, set minimumSpawnOf stationaryHarvesters
        for (let source of SOURCES) {
            emptySquare += source.freeSpaceCount;
            if (source.containerBuilt) {
                creep.stationaryHarvester.minimumSpawnOf++;
            } else if (!source.containerBuilt)
                this.room.createConstructionSite(source.stationaryPos.x, source.stationaryPos.y, STRUCTURE_CONTAINER);
        }

        // set minimumSpawnOf haulers
        if (NUMBER_OF_SOURCES === 1 && creep.stationaryHarvester.minimumSpawnOf === 1)
            creep.hauler.minimumSpawnOf = 2;
        else if (NUMBER_OF_SOURCES > 1)
            creep.hauler.minimumSpawnOf = creep.stationaryHarvester.minimumSpawnOf;

        // minimumSpawnOf of builders
        if (CONSTRUCTION_SITES.length === 0)
            creep.builder.minimumSpawnOf = 0;
        else {
            for (let constructionSite of CONSTRUCTION_SITES) {
                progress += constructionSite.progress;
                totalProgress += constructionSite.progressTotal;
            }
            if (totalProgress - progress <= 1000)
                creep.builder.minimumSpawnOf = 0;
            else
                creep.builder.minimumSpawnOf = Math.ceil((totalProgress - progress) / 5000);
        }

        // minimumSpawnOf builders correcting
        if (RCL <= 4) {
            if (creep.builder.minimumSpawnOf > NUMBER_OF_SOURCES * 2)
                creep.builder.minimumSpawnOf = NUMBER_OF_SOURCES;
        } else if (creep.builder.minimumSpawnOf > NUMBER_OF_SOURCES)
            creep.builder.minimumSpawnOf = Math.ceil(NUMBER_OF_SOURCES * 1.5);

        // spawning volume of harvester, upgrader, repairer, wallRepairer
        if (RCL <= 2) {

            containersOk = creep.hauler.minimumSpawnOf >= NUMBER_OF_SOURCES;

            if (!containersOk) {
                creep.harvester.minimumSpawnOf = Math.ceil((emptySquare - 1) / 2);
                creep.upgrader.minimumSpawnOf = 1;
                creep.builder.minimumSpawnOf = Math.ceil((emptySquare - 1) / 2);
            } else {
                creep.harvester.minimumSpawnOf = NUMBER_OF_SOURCES;
                creep.upgrader.minimumSpawnOf = NUMBER_OF_SOURCES;
                creep.repairer.minimumSpawnOf = NUMBER_OF_SOURCES;
                creep.wallRepairer.minimumSpawnOf = NUMBER_OF_SOURCES;
            }
        } else {
            creep.upgrader.minimumSpawnOf = Math.ceil(NUMBER_OF_SOURCES * 0.5);
            creep.harvester.minimumSpawnOf = NUMBER_OF_SOURCES;
            creep.repairer.minimumSpawnOf = Math.ceil(NUMBER_OF_SOURCES * 0.5);
            creep.wallRepairer.minimumSpawnOf = Math.ceil(NUMBER_OF_SOURCES * 0.5);
        }

        // count creeps
        Object.keys(creep).forEach(role => {
            currentCreep = _.filter(this.room.myCreeps, {memory: {role: role}});
            creep[role].numberOf = currentCreep.length;
            if (creep[role].preSpawn)
                creep[role].numberOfPreSpawn = _.filter(currentCreep, (function (creep) {
                    return creep.ticksToLive <= creep.memory.preSpawn;
                })).length;
        });

        // harvester number correction
        creep.harvester.minimumSpawnOf = creep.harvester.minimumSpawnOf - creep.stationaryHarvester.numberOf;

        if (creep.harvester.minimumSpawnOf < 0)
            creep.harvester.minimumSpawnOf = 0;

        for (let structure in ALL_STORAGE)
            plusEnergy += ALL_STORAGE[structure].store[RESOURCE_ENERGY];




        // determining spawn role

        // start with upgrader
        if (RCL === 1 && NUMBER_OF_CREEPS === 0)
            roleName = 'upgrader';
        // emergency harvester/hauler
        else if (creep.harvester.numberOf === 0 && creep.stationaryHarvester.numberOf === 0 && energyAvailable >= 300) {
            energyCapacity = energyAvailable;
            roleName = 'harvester';
        } else if (creep.hauler.numberOf === 0  && energyAvailable >= 200 && creep.hauler.minimumSpawnOf > 0
            && (creep.stationaryHarvester.numberOf > 0 || (creep.remoteStationaryHarvester.numberOf > 0 && creep.remoteHauler.numberOf > 0))) {
            energyCapacity = energyAvailable;
            roleName = 'hauler';
        } else {
            for (let role in creep)
                if (creep[role].preSpawn) {
                if (creep[role].numberOf < creep[role].minimumSpawnOf
                    || (creep[role].numberOfPreSpawn > 0 && creep[role].numberOf <= creep[role].minimumSpawnOf)) {
                    roleName = role;
                    break;
                }
            } else if (creep[role].numberOf < creep[role].minimumSpawnOf) {
                roleName = role;
                break;
            }
        }

        // determining extra creep roles
        if (config.extraCreeps && roleName === undefined && HOSTILES.length === 0 && plusEnergy > energyCapacity * 2 && RCL >= 2 && RCL <= 5) {

            extraRoles = ['upgrader', 'wallRepairer', 'repairer'];

            switch (RCL) {

                case 5:
                    extraCreepNumber = Math.ceil(NUMBER_OF_SOURCES / 2);
                    break;

                case 4:
                    extraCreepNumber = NUMBER_OF_SOURCES;
                    break;

                case 3:
                    extraCreepNumber = NUMBER_OF_SOURCES + 1;
                    break;

                case 2:
                    creep.stationaryHarvester.numberOf === NUMBER_OF_SOURCES ? extraCreepNumber = 7 + NUMBER_OF_SOURCES - Math.floor(energyCapacity / 100) : 5 + NUMBER_OF_SOURCES - Math.floor(energyCapacity / 100);
                    break;
            }

            for (let role of extraRoles) {

                if (creep[role].numberOf < creep[role].minimumSpawnOf + extraCreepNumber) {
                    roleName = role;
                    break;
                }
            }
        }

        // spawning
        if (roleName !== undefined) {

            if (this.room.mySpawns.length > 1) {
                for (let spawn of this.room.mySpawns)
                    if (!spawn.spawning) {
                    returnCode = spawn.createCustomCreep(energyCapacity, roleName, creep.remoteStationaryHarvester.numberOf);
                    break;
                }

            } else
                returnCode = this.createCustomCreep(energyCapacity, roleName, creep.remoteStationaryHarvester.numberOf);

            if (returnCode !== OK && returnCode !== ERR_NOT_ENOUGH_ENERGY && !_.isString(returnCode))
                console.log('Spawning error:', this.room.name, roleName, returnCode);
        }
    };
};
