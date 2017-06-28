"use strict";

module.exports = function () {


    const
        MY_ROOMS = _.filter(Game.rooms, {myRoom: true});

    let rooms,
        spawns,
        tier,
        rcl,
        currentRoom;

    garbageCollector();


    // spawning, roadBuilding
    for (let room of MY_ROOMS) {

        //room.buildRoads();

        // role scan
        spawns = room.mySpawns;

        if (Game.time % config.delay.roleScan === 0) {
            if (spawns.length > 1 && room.canSpawn)
                _.filter(spawns, function (spawn) {
                    return spawn.memory.masterSpawn === true
                })[0].roleScan();
            else if (room.canSpawn)
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


    // visuals
    if (config.visuals.roomVisual && config.visuals.allRooms)
        rooms = Game.rooms;
    else if (config.visuals.roomVisual)
        rooms = MY_ROOMS;
    else
        rooms = false;

    if (rooms) {
        for (let room in rooms) {

            currentRoom = rooms[room];

            //console.log(currentRoom);

            if (!_.get(Memory, 'visualStats.cpu'))
                _.set(Memory, 'visualStats.cpu', []);

            Memory.visualStats.cpu.push({
                limit: Game.cpu.limit,
                bucket: Game.cpu.bucket,
                cpu: Game.cpu.getUsed()
            });
            if (Memory.visualStats.cpu.length >= 100)
                Memory.visualStats.cpu.shift();


            currentRoom.visual.drawGlobal();
            currentRoom.visual.drawRoomInfo(currentRoom);
            if (currentRoom.mySpawns.length === 1)
                currentRoom.visual.drawSpawnInfo(currentRoom.mySpawns[0]);
            else
                for (let spawn of currentRoom.mySpawns)
                    currentRoom.visual.drawSpawnInfo(spawn);

            if (currentRoom.towers !== undefined)
                for (let tower of currentRoom.towers)
                    currentRoom.visual.drawTowerInfo(tower);

            for (let source of currentRoom.sources)
                currentRoom.visual.drawSourceInfo(source);

            if (currentRoom.containers !== undefined)
                for (let container of currentRoom.containers)
                    currentRoom.visual.drawContainerInfo(container);

            if (currentRoom.storage !== undefined)
                currentRoom.visual.drawStorageInfo(currentRoom.storage);

            if (currentRoom.terminal !== undefined)
                currentRoom.visual.drawTerminalInfo(currentRoom.terminal);

            currentRoom.visual.drawMineralInfo(currentRoom.minerals[0]);

        }
    }
};

let garbageCollector = function () {

    if (Game.time % config.delay.garbageCollector.creeps === 0) {
        Object.keys(Memory.creeps).forEach(creep => {
            if (!Game.creeps[creep])
                delete Memory.creeps[creep];
        });
    }

    if (Game.time % config.delay.garbageCollector.flags === 0) {
        Object.keys(Memory.flags).forEach(flag => {
            if (!Game.flags[flag])
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


