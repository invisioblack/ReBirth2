"use strict";

require('./global');

// init structures memory
if (!Memory.structures) {
    console.log('[Memory] Initializing structure memory');
    Memory.structures = {};
}


if (config.profiler.enabled)
    profiler.enable();

let main = function () {

    if (Game.cpu.bucket < 2 * Game.cpu.tickLimit)
        console.log('Skipping tick ' + Game.time + ' due to lack of CPU.');
    else
        gameLoop();

};

module.exports.loop = function () {

    if (config.profiler.enabled) {
        profiler.wrap(function () {
            main();
        });
    } else
        main();

};


