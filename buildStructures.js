"use strict";


module.exports = function () {

    Room.prototype.buildRoads = function () {

        // build roads
        let rcl = this.controller.level,
            tier = 'RCL_' + String(rcl);

        if (rcl >= 2 && rcl <= 5) {

            if (this.memory.roads === undefined)
                this.memory.roads = {};

            if (this.memory.roads[tier] === undefined
                || (this.memory.roads[tier] !== undefined && this.memory.roads[tier] === false && Game.time % config.delay.roadBuilding === 0))
                this.memory.roads[tier] = this.createRoads();
        }
    };
};
