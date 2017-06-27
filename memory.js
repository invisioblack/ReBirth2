"use strict";
module.exports = function () {


    Creep.prototype.memoryWorking = function () {


        // if creep is trying to complete an operation but has no energy left
        if (this.carry.energy === 0 && this.memory.working === true) {
            // switch state
            this.memory.working = false;
            delete this.memory.target;
        }
        // if creep is harvesting energy but is full
        else if (this.carry.energy === this.carryCapacity && this.memory.working === false) {
            // switch state
            this.memory.working = true;
            delete this.memory.target;
        }

    }

};
