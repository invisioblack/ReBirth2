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


    Room.prototype.createRoads = function () {

        let RCL = this.controller.level,
            spawn = this.mySpawns,
            sources = this.sources,
            controller = this.controller,
            options = {
                plainCost: 1,
                swampCost: 1
            },
            goal = {},
            goalArray = [],
            path = [];

        switch (RCL) {

            case 2:

                // spawn to source(s)
                for (let source of sources) {
                    goal = {
                        pos: spawn[0].pos,
                        range: 1
                    };
                    path.push(PathFinder.search(source.pos, goal, options).path);
                }

                // closestSourceToController to controller
                for (let source of sources) {
                    goalArray.push({
                        pos: source.pos,
                        range: 1
                    });
                }
                path.push(PathFinder.search(controller.pos, goalArray, options).path);

            break;

            case 3:
            break;
        }
        if (path.length)
            return this.createRoadConstructionSites(path);
        else
            return false;

    };

    Room.prototype.createRoadConstructionSites = function (paths) {

        let returnCode,
            constructionSitesWanted = _.sum(paths, path => path.length),
            constructionSitesCreated = 0,
            numberOfConstructionSites = this.myConstructionSites.length;

        if (constructionSitesWanted <= 100 - numberOfConstructionSites) {

            for (let path of paths) {
                for (let position of path) {
                    returnCode = this.createConstructionSite(position, STRUCTURE_ROAD);
                    if (returnCode === OK)
                        constructionSitesCreated++
                }
            }
            return constructionSitesCreated === constructionSitesWanted;
        }

    };

    Room.prototype.checkArea =

        function (type, posX, posY, range, entity, containEntity) {

            let top = posY - range,
                left = posX - range,
                bottom = posY + range,
                right = posX + range,
                returnArray = [],
                area = [];

            // col has a property which is the x coordinate
            // cell is the terrain type

            switch (containEntity) {

                case true:

                    area = this.lookForAtArea(type, top, left, bottom, right);

                    _.each(area, function (col, y) {
                        _.each(col, function (cell, x) {
                            if (String(cell) === entity) {
                                returnArray.push({
                                    entity: cell,
                                    x: x,
                                    y: y
                                });
                            }
                        });
                    });
                break;

                case false:

                    area = this.lookForAtArea(type, top, left, bottom, right);

                    _.each(area, function (col, y) {
                        _.each(col, function (cell, x) {
                            if (String(cell) !== entity) {
                                returnArray.push({
                                    entity: cell,
                                    x: x,
                                    y: y
                                });
                            }
                        });
                    });
                break;

                default:
                    returnArray = this.lookForAtArea(type, top, left, bottom, right, true);
            }
            return returnArray;
        };
};
