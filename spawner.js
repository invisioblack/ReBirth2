// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';


module.exports = function () {

    StructureSpawn.prototype.createCustomCreep =
        function (energyCapacity, roleName, remoteNumber) {


            let size = 0,
                numberOfSources = this.room.sources.length,
                sizeLimit,
                numberOfBodyParts,
                finalBody = [],
                bodyParts = {
                    work: 0,
                    carry: 0,
                    move: 0,
                    attack: 0,
                    ranged_attack: 0,
                    claim: 0,
                    heal: 0
                },
                bodyObject;

            const RCL = this.room.controller.level;

            switch (roleName) {

                case 'harvester':

                    bodyParts.work = 2; // 200
                    bodyParts.carry = 1; // 50
                    bodyParts.move = 1; // 50
                    size = 300;
                    sizeLimit = 1;
                    break;

                case 'stationaryHarvester':

                    energyCapacity >= 550 ? bodyParts.work = 5 : bodyParts.work = Math.ceil(energyCapacity / 100) - 1;
                    bodyParts.move = 1;
                    energyCapacity >= 550 ? size = 550 : size = energyCapacity;
                    sizeLimit = 1;
                    break;

                case 'remoteStationaryHarvester':

                    bodyParts.work = 5; // 500
                    bodyParts.move = 3; // 150
                    size = 650;
                    sizeLimit = 1;
                    break;

                case 'remoteRepairer':

                    bodyParts.work = 2; // 300
                    bodyParts.carry = 2; // 150
                    bodyParts.move = 2; // 150
                    size = 600;
                    sizeLimit = 1;
                    break;


                case 'hauler':

                    bodyParts.carry = 2; // 100
                    bodyParts.move = 2; // 100
                    size = 200;

                    switch (remoteNumber) {

                        case 0:

                            if (numberOfSources === 2)
                                sizeLimit = RCL;
                            else if (numberOfSources === 1)
                                sizeLimit = Math.floor(RCL / 2);
                            break;

                        case 1:

                            if (numberOfSources === 2)
                                sizeLimit = Math.floor(RCL * 1.5);
                            else if (numberOfSources === 1)
                                sizeLimit = Math.floor(RCL * 0.75);
                            break;

                        case 2:

                            if (numberOfSources === 2)
                                sizeLimit = RCL * 2;
                            else if (numberOfSources === 1)
                                sizeLimit = Math.floor(RCL * 1.5);
                            break;
                    }

                    break;

                case 'miniClaimer':
                    bodyParts.claim = 1; //600
                    bodyParts.move = 1; //50
                    size = 650;
                    sizeLimit = 1;
                    roleName = 'claimer';
                    break;

                case 'claimer':
                    bodyParts.claim = 2; // 1200
                    bodyParts.move = 2; // 100
                    size = 1300;
                    sizeLimit = 1;
                    break;

                case 'protector':
                    bodyParts.ranged_attack = 3; // 450
                    bodyParts.move = 3; // 150
                    size = 600;
                    sizeLimit = 2;
                    break;

                case 'warrior':
                    bodyParts.ranged_attack = 3; // 450
                    bodyParts.move = 3; // 150
                    size = 600;
                    sizeLimit = 1;
                    break;

                case 'miner':
                    bodyParts.work = 10; // 1000
                    bodyParts.move = 2; // 100
                    size = 1100;
                    sizeLimit = 1;
                    break;

                case 'demolisher':
                    bodyParts.work = 1; // 100
                    bodyParts.carry = 2; // 100
                    bodyParts.move = 2; // 100
                    size = 300;
                    sizeLimit = 5;
                    break;

                case 'controllerAttacker':
                    bodyParts.claim = 5; // 3000
                    bodyParts.move = 5; // 250
                    size = 3250;
                    sizeLimit = 1;
                    break;


                default:

                    bodyObject = creepProp.bodyPlans[roleName][energyCapacity];


                    if (_.isUndefined(bodyObject))
                        bodyObject = creepProp.bodyPlans[roleName].default;
                    else
                        sizeLimit = 1;

                    Object.keys(bodyObject).forEach(parts => {
                        bodyParts[parts] = bodyObject[parts];
                    });

                    size = bodySize(bodyObject);

            }

            let numberOfFullSets = Math.floor(energyCapacity / size);

            numberOfBodyParts = _.sum(bodyParts);

            // TODO sizelimit = 3  + spawn.room.memory.remoteHaulerScale?

            if (!sizeLimit || sizeLimit * numberOfBodyParts > 50) {
                if (roleName !== 'remoteHauler')
                    sizeLimit = Math.floor(50 / numberOfBodyParts);
                else
                    sizeLimit = 3;
            }

            if (numberOfFullSets > sizeLimit)
                numberOfFullSets = sizeLimit;


            if (numberOfFullSets > 0) {
                // BodySets
                for (let i = 0; i < numberOfFullSets; i++)
                    Object.keys(bodyParts).forEach(parts => {
                        for (let i = 0; i < bodyParts[parts]; i++)
                            finalBody.push(parts);
                    });

                // create creep with the created body and the given role
                return this.createCreep(finalBody, getName(roleName), {
                    role: roleName,
                    subRole: '---',
                    working: false,
                    spawn: this.id,
                    homeroom: this.room.name,
                });
            }


            function bodySize(bodyPlans) {

                let bodySize = 0;
                Object.keys(bodyPlans).forEach(parts => {
                    bodySize += creepProp.partSize[parts] * bodyPlans[parts];
                });
                return bodySize;
            }

            function getName(role) {
                let isNameTaken,
                    tries = 0;

                do {
                    tries++;
                    isNameTaken = Game.creeps[role + '_' + tries] !== undefined;
                } while (isNameTaken);


                return role + '_' + tries;
            }

        };

};
