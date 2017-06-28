"use strict";

module.exports = function () {

    if (!Creep.prototype._harvest) {

        Creep.prototype._harvest = Creep.prototype.harvest;

        Creep.prototype.harvest = function () {

            let target;

            if (!this.memory.target)
                this.targetSource();

            target = Game.getObjectById(this.memory.target);

            if (target) {
                let harvest = this._harvest(target);

                if (harvest === ERR_NOT_IN_RANGE) {
                    this.travelTo(target);
                    return true;
                } else if (harvest === OK)
                    return true;
            } else
                return false;
        }
    }

    if (!Creep.prototype._upgradeController) {

        Creep.prototype._upgradeController = Creep.prototype.upgradeController;

        Creep.prototype.upgradeController = function () {

            let target;

            if (!this.memory.target)
                this.memory.target = this.room.controller.id;

            target = Game.getObjectById(this.memory.target);

            if (target) {
                if (target.sign === undefined || target.sign.text !== 'Territory of the Twilight Kingdoms of the East')
                    if (this.signController(target, 'Territory of the Twilight Kingdoms of the East') === ERR_NOT_IN_RANGE)
                        this.travelTo(target);

                if (this._upgradeController(target) === ERR_NOT_IN_RANGE)
                    this.travelTo(target);
            }
        }
    }
};



