"use strict";

// ---------------------  ROOM ---------------------

Object.defineProperty(Room.prototype, 'myRoom', {
    get: function () {

        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myRoom)
            this._myRoom = _.get(this, 'controller.my', false);

        return this._myRoom;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'mySpawns', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._mySpawns)
            this._mySpawns = this.find(FIND_MY_SPAWNS);

        return this._mySpawns;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myCreeps', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myCreeps)
            this._myCreeps = _.filter(Game.creeps, {memory: {homeroom: this.name}});

        return this._myCreeps;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'hostileCreeps', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._hostileCreeps) {

            let realHostiles,
                username,
                hostileCreeps = this.find(FIND_HOSTILE_CREEPS);

            realHostiles = _.filter(hostileCreeps, function (hostileCreep) {
                username = hostileCreep.owner.username;
                if (config.allies.indexOf(username) === -1 && hostileCreep.contains([HEAL]))
                    return username;
                else if (config.allies.indexOf(username) === -1 && hostileCreep.contains([ATTACK, RANGED_ATTACK, HEAL, WORK]))
                    return username;
            });

            this._hostileCreeps = realHostiles;

        }
        return this._hostileCreeps;
    },
    enumerable: false,
    configurable: true
});


Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;
        if (!this._sources) {

            if (!this.memory.sources) {
                this.memory.sources = this.find(FIND_SOURCES).map(source => source.id);
            }
            this._sources = this.memory.sources.map(id => Game.getObjectById(id));
        }
        return this._sources;
    },
    set: function (value) {
        this.memory.sources = value.map(source => source.id);
        this._sources = value;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myStructures', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myStructures)
            this._myStructures = this.find(FIND_MY_STRUCTURES);

        return this._myStructures;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myExtensions', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myExtensions)
            this._myExtensions = _.filter(this.structures, function (structure) {
                return structure.structureType === STRUCTURE_EXTENSION;
            });

        return this._myExtensions;
    },
    enumerable: false,
    configurable: true
});


Object.defineProperty(Room.prototype, 'containers', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._containers)
            this._containers = _.filter(this.structures, function (structure) {
                return structure.structureType === STRUCTURE_CONTAINER
            });

        return this._containers;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myStorage', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myStorage)
            this._myStorage = _.filter(this.myStructures, function (structure) {
                return structure.structureType === STRUCTURE_STORAGE
            });

        return this._myStorage;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'myConstructionSites', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._myConstructionSites)
            this._myConstructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);

        return this._myConstructionSites;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'damagedStructures', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._damagedStructures) {

            let structures = this.containers;

            this._damagedStructures = _.filter(structures, function (structure) {
                return structure.hits / structure.hitsMax <= MAX_REPAIR_TRESHOLD
                    && structure.hits / structure.hitsMax > MIN_REPAIR_TRESHOLD
            });

        }
        return this._damagedStructures;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'canSpawn', {
    get: function () {
        if (this === Room.prototype || this === undefined)
            return;

        if (!this._canSpawn)
            this._canSpawn = _.filter(this.mySpawns, function (spawn) {
                    return spawn.spawning === null
                }).length > 0;

        return this._canSpawn;
    },
    enumerable: false,
    configurable: true
});

// ---------------------  SOURCE ---------------------

Object.defineProperty(Source.prototype, 'memory', {

    get: function () {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(Memory.sources)) {
            return undefined;
        }
        return Memory.sources[this.id] = Memory.sources[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
        }
        Memory.sources[this.id] = value;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'freeSpaceCount', {
    get: function () {

        if (this === Room.prototype || this === undefined)
            return;

        if (this._freeSpaceCount === undefined) {
            if (this.memory.freeSpaceCount === undefined) {
                let freeSpaceCount = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) !== 'wall')
                            freeSpaceCount++;
                    }, this);
                }, this);
                this.memory.freeSpaceCount = freeSpaceCount;
            }
            this._freeSpaceCount = this.memory.freeSpaceCount;
        }
        return this._freeSpaceCount;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'stationaryPos', {
    get: function () {

        if (this === Room.prototype || this === undefined)
            return;

        if (this._stationaryPos === undefined) {

            if (this.memory.stationaryPos === undefined) {

                let creepPosition,
                    creepPositions = [],
                    centerPosition = new RoomPosition(25, 25, this.room.name),
                    sourceArea = this.room.checkArea(LOOK_TERRAIN, this.pos.x, this.pos.y, 1, 'wall', false);

                for (let position of sourceArea)
                    creepPositions.push(new RoomPosition(position.x, position.y, this.room.name));

                creepPosition = centerPosition.findClosestByRange(creepPositions);

                this.memory.stationaryPos = JSON.stringify(creepPosition);
            }

            this._stationaryPos = this.memory.stationaryPos;
        }
        return this._stationaryPos;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'containerBuilt', {
    get: function () {

        if (this === Source.prototype || this === undefined)
            return;

        if (!this._containerBuilt) {

            let containers;
            this._containerBuilt = false;

            containers = this.room.checkArea(LOOK_STRUCTURES, this.pos.x, this.pos.y, 1);

            for (let container of containers) {
                if (container.structure.structureType === 'container') {
                    this._containerBuilt = true;
                    break;
                }
            }
        }
        return this._containerBuilt;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'freeSpot', {
    get: function () {

        if (this === Source.prototype || this === undefined)
            return;

        if (!this._freeSpot) {

            let mySource = this,
                busyCreeps;

            busyCreeps = _.filter(this.room.myCreeps, function (creep) {
                return creep.memory.target === mySource.id && creep.memory.working === false;
            });
            busyCreeps.length >= this.freeSpaceCount ? this._freeSpot = false : this._freeSpot = true;
        }
        return this._freeSpot;
    },
    enumerable: false,
    configurable: true
});


// ---------------------  EXTENSION ---------------------

Object.defineProperty(StructureExtension.prototype, 'busy', {
    get: function () {

        if (this === StructureExtension.prototype || this === undefined)
            return;

        if (!this._busy){

            let myExtension = this,
                busyCreeps;

            busyCreeps = _.filter(this.room.myCreeps, function (creep){
                return creep.memory.target === myExtension.id
                    && (creep.memory.role === 'hauler' || creep.memory.role === 'harvester') ;
            });

            busyCreeps.length > 0 ? this._busy = true : this._busy = false;
        }

        return this._busy;
    },
    enumerable: false,
    configurable: true
});


Creep.prototype.contains = function (parts) {

    return _.some(this.body, bodyParts => parts.includes(bodyParts.type));
};
