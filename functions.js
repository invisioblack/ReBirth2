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

global.textColor = function (message, color = 2) {

    return '<font color="' + config.visuals.colors[color] + '" type="highlight">' + message + "</font>";

};

global.findErrorCode = function (status) {

    let  errorCodes = config.errorCodes;

    for (let error in errorCodes)
        if (errorCodes[error] === status)
            if (error !== undefined)
                return error;

};

['attack','attackController','build','claimController','dismantle','drop',
    'generateSafeMode','harvest','heal','move','moveByPath','moveTo','pickup',
    'rangedAttack','rangedHeal','rangedMassAttack','repair','reserveController',
    'signController','suicide','transfer','upgradeController','withdraw'].forEach(function (method) {

    let original = Creep.prototype[method];
    // Magic
    Creep.prototype[method] = function () {

        function findErrorCode(status) {

            let  errorCodes = config.errorCodes;

            for (let error in errorCodes)
                if (errorCodes[error] === status)
                    if (error !== undefined)
                        return error;

        }

        let status = original.apply(this, arguments);

        if (typeof status === 'number' && status < 0 && status !== -9 && status !== 11)
            console.log(this.name, textColor('action'), textColor(method, 6), textColor('failed with status'), textColor(findErrorCode(status), 7), textColor('at'), textColor(this.pos, 5));

        return status;
    }
});
