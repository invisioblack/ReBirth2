
global.getId = function () {
    if (Memory.globalId === undefined || Memory.globalId > 10000) {
        Memory.globalId = 0;
    }
    Memory.globalId = Memory.globalId + 1;
    return Memory.globalId;
};

global.QueuedAction = function ({id, action, stopResult, tickLimit, startTime}) {
    this.id = id || getId();
    this.action = id ? action : `return (${action.toString()})`;
    this.stopResult = stopResult;
    this.tickLimit = tickLimit || 100;
    this.startTime = startTime || Game.time;
};

QueuedAction.prototype.run = function () {
    let func = Function(this.action);
    try {
        let result = func();
        if (result === this.stopResult) {
            return false;
        }
        if (Game.time - this.startTime >= this.tickLimit) {
            return false;
        }
    } catch (error) {
        console.log(error.stack);
        return false;
    }
    return true;
};

QueuedAction.prototype.add = function () {
    Memory.queuedActions[this.id] = this;
};

QueuedAction.prototype.clear = function () {
    delete Memory.queuedActions[this.id];
};

global.runQueuedActions = function () {
    Object.keys(Memory.queuedActions || {})
        .forEach(id => {
            let action = new QueuedAction(Memory.queuedActions[id]);
            if (!action.run()) action.clear();
        });
};

global.queueAction = function (action, stopResult, tickLimit) {
    if (!Memory.queuedActions) Memory.queuedActions = {};
    let newAction = new QueuedAction({action, stopResult, tickLimit});
    newAction.add();
};
