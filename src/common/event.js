var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");

var globalHookFn;
var EVENT_TYPE = "@@EVENT";

var counter = 0;

function EventEmitterEx(parent) {
    EventEmitter.call(this);
    this.parent = parent;
    this.id = (parent ? parent.id + "." : "") + counter;
    counter++;
}

! function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}(EventEmitterEx, EventEmitter);

EventEmitterEx.prototype.fork = function(cb) {
    var ret = new EventEmitterEx(this);
    if (typeof cb == "function") ret.event(cb);
    return ret;
}

EventEmitterEx.prototype.hook = function(cb) {
    this.hookFn = cb;
}

EventEmitterEx.prototype.globalHook = function(cb) {
    if (!cb) {
        return globalHookFn;
    } else {
        globalHookFn = cb;
    }
}
EventEmitterEx.prototype.on = function(type, cb) {
    // EventEmitter.prototype.removeListener.apply(this, arguments);
    EventEmitter.prototype.on.apply(this, arguments);
    return this;
}

EventEmitterEx.prototype.event = function(cb) {
    if (typeof cb == "function") {
        this.on(EVENT_TYPE, cb);
        return this;
    }
    var args = _.concat([EVENT_TYPE], arguments);
    return this.emit.apply(this, args);
}

EventEmitterEx.prototype.emitSelf = function(type, action) {
    globalHookFn && globalHookFn.apply(null, arguments);
    this.hookFn && this.hookFn.apply(this, arguments);
    return EventEmitter.prototype.emit.apply(this, arguments);
}

EventEmitterEx.prototype.emitParent = function(type, action) {
    globalHookFn && globalHookFn.apply(null, arguments);
    this.hookFn && this.hookFn.apply(this, arguments);
    if (!this.parent) {
        return EventEmitter.prototype.emit.apply(this, arguments);
    } else {
        return EventEmitter.prototype.emit.apply(this.parent, arguments);
    }
}

EventEmitterEx.prototype.emit = function(type, action) {
    if (this.listenerCount(type) > 0) {
        //1. has handler
        return this.emitSelf.apply(this, arguments);
    } else if (this.parent) {
        //2. has parent
        return this.emit.apply(this.parent, arguments);
    } else {
        return this.emitSelf.apply(this, arguments);
    }

    // if (this.parent && this.parent.listenerCount(type) > 0) {
    //     //1.has parent and parent has handler
    //     return this.parent.emitParent.apply(this, arguments);
    // } else if (this.parent && this.parent.listenerCount(type) == 0) {
    //     //2.has parent but parent has not handler
    //     return this.parent.emit.apply(this.parent, arguments);
    // } else {
    //     //3.has not parent
    //     return this.emitSelf.apply(this, arguments);
    // }
}

module.exports = new EventEmitterEx();
