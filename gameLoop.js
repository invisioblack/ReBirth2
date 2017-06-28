"use strict";

module.exports = function () {


    const
        MY_ROOMS = _.filter(Game.rooms, {myRoom: true});

    let spawns, tier, rcl;

    garbageCollector();

    for (let currentRoom of MY_ROOMS) {

        //currentRoom.buildRoads();

        // role scan
        spawns = currentRoom.mySpawns;

        if (Game.time % config.delay.roleScan === 0) {
            if (spawns.length > 1 && currentRoom.canSpawn)
                _.filter(spawns, function (spawn) {
                    return spawn.memory.masterSpawn === true
                })[0].roleScan();
            else if (currentRoom.canSpawn)
                spawns[0].roleScan();
        }
    }

    Object.keys(Game.creeps).forEach(creeps => {

        let creep = Game.creeps[creeps];

        if (!creep.spawning) {

            // sayStatus
            creep.sayStatus();

            // set preSpawn
            if (creep.memory.preSpawn === undefined)
                creep.memory.preSpawn = creep.body.length * 3;

            if (creep.memory.role === 'harvester')
                creep.roleHarvester();

            else if (creep.memory.role === 'upgrader')
                creep.roleUpgrader();

        }

    });


};

let garbageCollector = function () {

    if (Game.time % config.delay.garbageCollector.creeps === 0) {
        Object.keys(Memory.creeps).forEach(creep => {
            if (!creep)
                delete Memory.creeps[creep];
        });
    }

    if (Game.time % config.delay.garbageCollector.flags === 0) {
        Object.keys(Memory.flags).forEach(flag => {
            if (!flag)
                delete Memory.flags[flag];
        });
    }

    if (Game.time % config.delay.garbageCollector.structures === 0) {
        Object.keys(Memory.structures).forEach(id => {
            if (!id) {
                console.log("Garbage collecting structure " + id + ', ' + JSON.stringify(Memory.structures[id]));
                delete Memory.structures[id];
            }
        });
    }
};


