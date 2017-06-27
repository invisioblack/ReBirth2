
"use strict";

module.exports = function () {

    Creep.prototype.highlightStructure = function (structure) {

        if (!config.visuals.highlightStructure)
            return;

        if (!structure)
            return;
        if (this.pos.roomName === structure.pos.roomName)
            this.room.visual.structure(structure.pos.x, structure.pos.y, structure.structureType);

    };

    Creep.prototype.sayStatus = function () {

        if (!config.visuals.sayStatus)
            return;

        let roleSay = config.visuals.roleSay[this.memory.role] + ': ' + this.carry[RESOURCE_ENERGY];
        this.room.visual.speech(roleSay, this.pos.x, this.pos.y, this);

    };

    RoomVisual.prototype.creepPathStyle = function (creep) {

        function randomColour() {
            let c = '#';
            while (c.length < 7) {
                c += (Math.random()).toString(16).substr(-6).substr(-1);
            }
            return c;
        }

        creep.memory.pathColour = creep.memory.pathColour ? creep.memory.pathColour : randomColour(); // set colour in memory. Makes tracking easier, and prevents rainbows.

        return {
            color: creep.memory.pathColour,
            lineStyle: 'dashed',
            width: 0.15,
            opacity: 0.5
        };
    };



    RoomVisual.prototype.speech = function (text, x, y, creep) {

        let pointer = [
                [-0.2, -0.8],
                [0.2, -0.8],
                [0, -0.3]
            ],
            speechSize = 0.5,
            speechFont = 'Times New Roman';

        pointer = relPoly(x, y, pointer);
        pointer.push(pointer[0]);


        this.poly(pointer, {
            fill: creep.memory.pathColour,
            stroke: creep.memory.pathColour,
            opacity: 1,
            strokeWidth: 0.1
        });

        this.text(text, x, y - 1, {
            color: config.visuals.colors.speechText,
            backgroundColor: creep.memory.pathColour,
            backgroundPadding: 0.1,
            opacity: 0.8,
            font: speechSize + ' ' + speechFont
        })
    };

    RoomVisual.prototype.structure = function (x, y, type, opts = {}) {
        opts = Object.assign({
            opacity: 1
        }, opts);


        switch (type) {
            case STRUCTURE_EXTENSION:
                this.circle(x, y, {
                    radius: 0.5,
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.circle(x, y, {
                    radius: 0.35,
                    fill: config.visuals.colors.gray,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_SPAWN:
                this.circle(x, y, {
                    radius: 0.65,
                    fill: config.visuals.colors.dark,
                    stroke: '#CCCCCC',
                    strokeWidth: 0.10,
                    opacity: opts.opacity
                });
                this.circle(x, y, {
                    radius: 0.40,
                    fill: config.visuals.colors.energy,
                    opacity: opts.opacity
                });

                break;
            case STRUCTURE_POWER_SPAWN:
                this.circle(x, y, {
                    radius: 0.65,
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.power,
                    strokeWidth: 0.10,
                    opacity: opts.opacity
                });
                this.circle(x, y, {
                    radius: 0.40,
                    fill: config.visuals.colors.energy,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_LINK: {
                let osize = 0.3;
                let isize = 0.2;
                let outer = [
                    [0.0, -0.5],
                    [0.4, 0.0],
                    [0.0, 0.5],
                    [-0.4, 0.0]
                ];
                let inner = [
                    [0.0, -0.3],
                    [0.25, 0.0],
                    [0.0, 0.3],
                    [-0.25, 0.0]
                ];
                outer = relPoly(x, y, outer);
                inner = relPoly(x, y, inner);
                outer.push(outer[0]);
                inner.push(inner[0]);
                this.poly(outer, {
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.poly(inner, {
                    fill: config.visuals.colors.gray,
                    stroke: false,
                    opacity: opts.opacity
                });
                break;
            }
            case STRUCTURE_TERMINAL: {
                let outer = [
                    [0.0, -0.8],
                    [0.55, -0.55],
                    [0.8, 0.0],
                    [0.55, 0.55],
                    [0.0, 0.8],
                    [-0.55, 0.55],
                    [-0.8, 0.0],
                    [-0.55, -0.55]
                ];
                let inner = [
                    [0.0, -0.65],
                    [0.45, -0.45],
                    [0.65, 0.0],
                    [0.45, 0.45],
                    [0.0, 0.65],
                    [-0.45, 0.45],
                    [-0.65, 0.0],
                    [-0.45, -0.45]
                ];
                outer = relPoly(x, y, outer);
                inner = relPoly(x, y, inner);
                outer.push(outer[0]);
                inner.push(inner[0]);
                this.poly(outer, {
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.poly(inner, {
                    fill: config.visuals.colors.light,
                    stroke: false,
                    opacity: opts.opacity
                });
                this.rect(x - 0.45, y - 0.45, 0.9, 0.9, {
                    fill: config.visuals.colors.gray,
                    stroke: config.visuals.colors.dark,
                    strokeWidth: 0.1,
                    opacity: opts.opacity
                });
                break;
            }
            case STRUCTURE_LAB:

                this.circle(x, y - 0.025, {
                    radius: 0.55,
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.circle(x, y - 0.025, {
                    radius: 0.40,
                    fill: config.visuals.colors.gray,
                    opacity: opts.opacity
                });
                this.rect(x - 0.45, y + 0.3, 0.9, 0.25, {
                    fill: config.visuals.colors.dark,
                    stroke: false,
                    opacity: opts.opacity
                }); {
                    let box = [
                        [-0.45, 0.3],
                        [-0.45, 0.55],
                        [0.45, 0.55],
                        [0.45, 0.3]
                    ];
                    box = relPoly(x, y, box);
                    this.poly(box, {
                        stroke: config.visuals.colors.outline,
                        strokeWidth: 0.05,
                        opacity: opts.opacity
                    })
                }
                break;
            case STRUCTURE_TOWER:
                this.circle(x, y, {
                    radius: 0.6,
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.rect(x - 0.4, y - 0.3, 0.8, 0.6, {
                    fill: config.visuals.colors.gray,
                    opacity: opts.opacity
                });
                this.rect(x - 0.2, y - 0.9, 0.4, 0.5, {
                    fill: config.visuals.colors.light,
                    stroke: config.visuals.colors.dark,
                    strokeWidth: 0.07,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_ROAD:
                this.circle(x, y, {
                    radius: 0.175,
                    fill: config.visuals.colors.road,
                    stroke: false,
                    opacity: opts.opacity
                });
                if (!this.roads) this.roads = [];
                this.roads.push([x, y]);
                break;
            case STRUCTURE_RAMPART:
                this.circle(x, y, {
                    radius: 0.65,
                    fill: '#434C43',
                    stroke: '#5D735F',
                    strokeWidth: 0.10,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_WALL:
                this.circle(x, y, {
                    radius: 0.40,
                    fill: config.visuals.colors.dark,
                    stroke: config.visuals.colors.light,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_STORAGE:
                this.circle(x, y, {
                    fill: config.visuals.colors.energy,
                    radius: 0.35,
                    stroke: config.visuals.colors.dark,
                    strokeWidth: 0.20,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_OBSERVER:
                this.circle(x, y, {
                    fill: config.visuals.colors.dark,
                    radius: 0.45,
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                });
                this.circle(x + 0.225, y, {
                    fill: config.visuals.colors.outline,
                    radius: 0.20,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_NUKER:
                let outline = [
                    [0, -1],
                    [-0.47, 0.2],
                    [-0.5, 0.5],
                    [0.5, 0.5],
                    [0.47, 0.2],
                    [0, -1]
                ];
                outline = relPoly(x, y, outline);
                this.poly(outline, {
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.05,
                    fill: config.visuals.colors.dark,
                    opacity: opts.opacity
                });
                let inline = [
                    [0, -.80],
                    [-0.40, 0.2],
                    [0.40, 0.2],
                    [0, -.80]
                ];
                inline = relPoly(x, y, inline);
                this.poly(inline, {
                    stroke: config.visuals.colors.outline,
                    strokeWidth: 0.01,
                    fill: config.visuals.colors.gray,
                    opacity: opts.opacity
                });
                break;
            case STRUCTURE_CONTAINER:
                this.rect(x - 0.225, y - 0.3, 0.45, 0.6, {
                    fill: "yellow",
                    opacity: opts.opacity,
                    stroke: config.visuals.colors.dark,
                    strokeWidth: 0.10
                });
                break;
            default:
                this.circle(x, y, {
                    fill: config.visuals.colors.light,
                    radius: 0.35,
                    stroke: config.visuals.colors.dark,
                    strokeWidth: 0.20,
                    opacity: opts.opacity
                });
                break;
        }
    };


    function relPoly(x, y, poly) {
        return poly.map(p => {
            p[0] += x;
            p[1] += y;
            return p
        })
    }



};
