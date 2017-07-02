"use strict";

require('./functions');
require('./room')();
require('./roleScan')();
require('./roles')();
require('./memory')();
require('./targetSelector')();
require('./visual')();
require('./visualRoom')();
require('./spawner')();
require('./properties');
require('./queueAction');

global.gameLoop = require('./gameLoop');
global.profiler = require('./screeps-profiler');
global.Traveller = require('./Traveler');
global.task = require('./task');

global.config = {
    profiler: {
        enabled : false
    },
    test: {
        role: {
            active: true,
            roleName: 'harvester',
            minimumSpawnOf: 1
        },
        build: {
            road: true
        }
    },
    extraCreeps: false,
    delay: {
        garbageCollector : {
            creeps: 3,
            flags: 100,
            structures: 10000
        },
        roadBuilding: 13,
        roleScan: 1
    },
    distance: {
        harvest: 1,
        upgrade: 3
    },
    allies: ['XXX'],
    errorCodes: {
        OK: 0,
        ERR_NOT_OWNER: -1,
        ERR_NO_PATH: -2,
        ERR_NAME_EXISTS: -3,
        ERR_BUSY: -4,
        ERR_NOT_FOUND: -5,
        ERR_NOT_ENOUGH_SOMETHING: -6,
        ERR_INVALID_TARGET: -7,
        ERR_FULL: -8,
        ERR_NOT_IN_RANGE: -9,
        ERR_INVALID_ARGS: -10,
        ERR_TIRED: -11,
        ERR_NO_BODYPART: -12,
        ERR_RCL_NOT_ENOUGH: -14,
        ERR_GCL_NOT_ENOUGH: -15
    },
    visuals: {
        highlightStructure: true,
        sayStatus: true,
        roomVisual: true,
        room: true,
        global: true,
        cpu: true,
        allRooms: true,
        colors: {
            gray: '#555555',
            light: '#AAAAAA',
            road: '#666', // >:D
            energy: '#FFE87B',
            power: '#F53547',
            dark: '#181818',
            outline: '#8FBB93',
            speechText: '#000000',
            7: '#b01028',
            6: '#c5ce3d',
            5: '#26ab3d',
            4: '#809fff',
            3: '#999999',
            2: '#737373',
            1: '#666666',
            0: '#ffffff'
        },
        roleSay: {
            harvester: String.fromCodePoint(0x26CF), // ⛏
            miner: String.fromCodePoint(0x26CF), // ⛏
            hauler: String.fromCodePoint(0x1F69A), //🚚
            remoteHauler: String.fromCodePoint(0x1F69A), //🚚
            miniClaimer: String.fromCodePoint(0x26F3), // ⛳
            claimer: String.fromCodePoint(0x26F3), // ⛳
            protector: String.fromCodePoint(0x2547), // ⸸
            demolisher: String.fromCodePoint(0x1F527), // 🔧
            controllerAttacker: String.fromCodePoint(0x2547), // ⸸
            warrior: String.fromCodePoint(0x2547), // ⸸
            builder: String.fromCodePoint(0x2692), // ⚒
            repairer: String.fromCodePoint(0x1F527), // 🔧
            remoteRepairer: String.fromCodePoint(0x1F527), // 🔧
            wallRepairer: String.fromCodePoint(0x1F3F0), // 🏰
            upgrader: String.fromCodePoint(0x21EA), // ⇪
            stationaryHarvester: String.fromCodePoint(0x26CF), // ⛏
            remoteStationaryHarvester: String.fromCodePoint(0x26CF) // ⛏
        },
        actionSay: {
            attack: String.fromCodePoint(0x2547), // ⸸
            rangedAttack: String.fromCodePoint(0x2547), // ⸸
            build: String.fromCodePoint(0x2692), // ⚒
            claiming: String.fromCodePoint(0x26F3), // ⛳
            defending: String.fromCodePoint(0x2694), // ⚔
            noTarget: String.fromCodePoint(0x1f612), // 😒
            fortify: String.fromCodePoint(0x1F528), // 🔨
            dismantle: String.fromCodePoint(0x1F528), // 🔨
            harvest: String.fromCodePoint(0x26CF), // ⛏
            heal: String.fromCodePoint(0x26E8), // ⛨
            idle: String.fromCodePoint(0x1F3B6), // 🎶
            repair: String.fromCodePoint(0x1F527), // 🔧
            transfer: String.fromCodePoint(0x1F4E4), // 📤
            move: String.fromCodePoint(0x1F3C3), // 🏃
            upgrade: String.fromCodePoint(0x21EA), // ⇪
            pickup: String.fromCodePoint(0x1F4E5), // 📥
            withdraw: String.fromCodePoint(0x1F4E5) // 📥
        }
    }
};

global.creepProp = {
    partSize: {
        work: 100,
        carry: 50,
        move: 50,
        claim: 600,
        attack: 80,
        ranged_attack: 150,
        heal: 250
    },
    bodyPlans: {
        upgrader: {
            default: { // 300
                work: 1, // 100
                carry: 2, // 100
                move: 2 //100
            },
            550: {
                work: 2, // 200
                carry: 4, // 200
                move: 3 // 150
            },
            800: {
                work: 3, // 300
                carry: 5, //250
                move: 5 // 250
            },
            1300: {
                work: 6, // 600
                carry: 7, // 350
                move: 7 // 350
            },
            1800: {
                work: 8, // 800
                carry: 10, // 500
                move: 10 // 500
            },
            2300: {
                work: 10, // 1000
                carry: 13, // 650
                move: 13 // 650
            },
            5600: {
                work: 16, // 1400
                carry: 17, // 900
                move: 17 // 900
            },
            12900: {
                work: 16, // 1400
                carry: 17, // 900
                move: 17 // 900
            }
        },
        wallRepairer: {
            default: { // 300
                work: 1, // 100
                carry: 2, // 100
                move: 2 // 100
            },
            550: {
                work: 2,
                carry: 4,
                move: 3
            },
            800: {
                work: 3,
                carry: 5,
                move: 5
            },
            1300: {
                work: 6,
                carry: 7,
                move: 7
            },
            1800: {
                work: 8,
                carry: 10,
                move: 10
            },
            2300: {
                work: 10,
                carry: 13,
                move: 13
            },
            5600: {
                work: 14,
                carry: 18,
                move: 18
            },
            12900: {
                work: 14,
                carry: 18,
                move: 18
            }
        },
        builder: {
            default: {
                work: 1,
                carry: 2,
                move: 2
            },
            550: {
                work: 3,
                carry: 3,
                move: 2
            },
            800: {
                work: 4,
                carry: 4,
                move: 4
            },
            1300: {
                work: 7,
                carry: 6,
                move: 6
            },
            1800: {
                work: 10,
                carry: 8,
                move: 8
            },
            2300: {
                work: 13,
                carry: 10,
                move: 10
            },
            5600: {
                work: 20,
                carry: 15,
                move: 15
            },
            12900: {
                work: 20,
                carry: 15,
                move: 15
            }
        },
        repairer: {
            default: {
                work: 1,
                carry: 2,
                move: 2
            },
            550: {
                work: 3,
                carry: 3,
                move: 2
            },
            800: {
                work: 4,
                carry: 4,
                move: 4
            },
            1300: {
                work: 6,
                carry: 7,
                move: 7
            },
            1800: {
                work: 9,
                carry: 9,
                move: 9
            },
            2300: {
                work: 11,
                carry: 12,
                move: 12
            },
            5600: {
                work: 16,
                carry: 17,
                move: 17
            },
            12900: {
                work: 16,
                carry: 17,
                move: 17
            }
        },
        remoteHauler: {
            default: {
                carry: 6, // 300
                move: 5 // 250
                // size = 550
            },
            800: {
                carry: 8, // 400
                move: 8 // 400
            },
            1300: {
                carry: 13, // 650
                move: 13  // 650
            },
            1800: {
                carry: 16, // 800
                move: 16  // 800
            },
            2300: {
                carry: 16, // 800
                move: 16 // 800
            },
            5600: {
                carry: 16, // 800
                move: 16 // 800
            },
            12900: {
                carry: 16, // 800
                move: 16 // 800
            }

        }
    }
};
