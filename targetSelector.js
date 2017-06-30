"use strict";
module.exports = function () {

    RoomObject.prototype.getTarget = function (selector, validator = _.identity, chooser = _.first, prop = 'target') {
        let tid = this.memory[prop];
        let target = Game.getObjectById(tid);
        if (target === null || !validator(target)) {
            let candidates = _.filter(selector.call(this, this), validator);
            if (candidates && candidates.length)
                target = chooser(candidates, this);
            else
                target = null;
            if (target) {
                this.memory[prop] = target.id;
                console.log(`New target on tick ${Game.time}: ${target}`);
            } else
                delete this.memory[prop];
        }
        if (target)
            target.room.visual.line(this.pos, target.pos, {lineStyle: 'dashed', opacity: 0.5});
        return target;
    };

    RoomObject.prototype.getUniqueTarget = function (selector, restrictor, validator=_.identity, chooser=_.first, prop='target') {
        let tid = this.memory[prop];
        let target = Game.getObjectById(tid);
        if (target === null || !validator(target)) {
            this.clearTarget(prop);
            let invalid = restrictor.call(this, this) || [];
            let candidates = _.filter(selector.call(this, this), x => validator(x) && !invalid.includes(x.id));
            if (candidates && candidates.length)
                target = chooser(candidates, this);
            else
                target = null;
            if (target)
                this.memory[prop] = target.id;
            console.log(`New target on tick ${Game.time}: ${target}`);
        }
        if (target)
            target.room.visual.line(this.pos, target.pos, {lineStyle: 'dashed', opacity: 0.5});
        return target;
    };

    RoomObject.prototype.clearTarget = function (prop='target') {
        // delete this.memory[prop];
        this.memory[prop] = undefined;
    };

    Creep.prototype.getHarvestTarget = function () {
        return this.getTarget(
            (room) => this.room.sources,
            (sources) => sources.energy > 0 && sources.freeSpot,
            (candidates) => _.max(candidates, 'energy')
        );
    }




};
