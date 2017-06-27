"use strict";


global.blackBox = (x) => JSON.stringify(x, null, 2);

global.deleteCS = function (roomName) {

    let constructionSites = Game.rooms[roomName].myConstructionSites;

    constructionSites.forEach(site => {
        site.remove();
    })

};

global.kill = function (name) {
        Game.creeps[name].suicide();
    };

global.killAll = function () {

        for (let creepGlobal in Game.creeps)
            if (Game.creeps.hasOwnProperty(creepGlobal))
                Game.creeps[creepGlobal].suicide();
    };

global.countCreeps = function (roomName) {

    let creepGlobal = Game.rooms[roomName].myCreeps,
        creepCountGlobal = _.countBy(creepGlobal, 'memory.role');

    Object.keys(creepCountGlobal).forEach(role => {
        console.log(role + ':', creepCountGlobal[role]);
    });

};

global.moveReusePath = function (express) {

    if (express === true && Game.cpu.bucket > 99)
        return 5;
    let
        minSteps = 10,
        maxSteps = 60,
        range = maxSteps - minSteps;

    return minSteps + Math.floor((1 - (Game.cpu.bucket / 10000)) * range);
};
