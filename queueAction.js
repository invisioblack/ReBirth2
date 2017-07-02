"use strict";

global.getId = function () {
    if (Memory.globalId === undefined || Memory.globalId > 10000) {
        Memory.globalId = 0;
    }
    Memory.globalId = Memory.globalId + 1;
    return Memory.globalId;
};

global.QueuedAction = function ({id, action, stopResult, tickLimit, startTime, roomName}) {

    this.id = id || getId();


/*
    //BB(this);
    this[roomName].id = id || getId();
    this[roomName].action = id ? action : `return (${action.toString()})()`;
    this[roomName].stopResult = stopResult;
    this[roomName].tickLimit = tickLimit || 100;
    this[roomName].startTime = startTime || Game.time;

*/
};

QueuedAction.prototype.run = function (roomName) {

    let func = Function(this[roomName].action);
    try {
        let result = func();
        if (result === this[roomName].stopResult) {
            return false;
        }
        if (Game.time - this[roomName].startTime >= this[roomName].tickLimit) {
            return false;
        }
    } catch (error) {
        console.log(error.stack);
        return false;
    }
    return true;
};

QueuedAction.prototype.add = function (roomName) {

    console.log(roomName);
    Memory.queuedActions[this[roomName]] = this;
};

QueuedAction.prototype.clear = function () {
    delete Memory.queuedActions[this.id];
};

global.runQueuedActions = function () {

    Object.keys(Memory.queuedActions || {})
        .forEach(roomName => {
            let action = new QueuedAction(Memory.queuedActions[roomName].id);
            if (!action.run())
                action.clear();
        });
};

global.queueAction = function (action, stopResult, tickLimit, roomName) {

    //console.log(action, stopResult, tickLimit, roomName);

    if (!Memory.queuedActions) Memory.queuedActions = {};
    if (!Memory.queuedActions[roomName]) Memory.queuedActions[roomName] = {};
    let newAction = new QueuedAction({action, stopResult, tickLimit, roomName});
    console.log(newAction);
    //newAction.add(roomName);
};
