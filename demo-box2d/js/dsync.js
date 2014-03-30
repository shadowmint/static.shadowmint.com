/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
var dsync;
(function (dsync) {
    /* A set of watch bindings */
    var Channel = (function () {
        function Channel() {
            /* The set of child bindings held */
            this.children = [];
            /* Timestamp */
            this.timestamp = 0;
            /* If this channel currently needs an update */
            this.ready = true;
            /* Locked into a ready state? */
            this.locked = false;
        }
        /* Add a sync model-display binding to this channel */
        Channel.prototype.add = function (model, display, sync, state) {
            if (typeof state === "undefined") { state = null; }
            this.children.push({
                sync: sync,
                state: state,
                model: model,
                display: display,
                last: null,
                alive: true
            });
        };

        /* Update all child elements if they have altered state */
        Channel.prototype.update = function () {
            var now = Date.now();
            var dt = this.timestamp == 0 ? 1 : now - this.timestamp;
            this.timestamp = now;
            var dropped = false;
            var changed = [];
            var change = false;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];
                change = this.updated(child, changed, dt);
                if (change) {
                    child.alive = child.sync(child.model, child.display, changed, dt);
                    if (!child.alive) {
                        dropped = true;
                    }
                }
            }
            if (dropped) {
                var children = [];
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i].alive) {
                        children.push(this.children[i]);
                    }
                }
                this.children = children;
            }
        };

        /*
        * Check if a child has updated.
        * @param target A sync binding.
        * @param changed An array to put changed booleans into.
        * @param dt The time delta since last update.
        * @return the index into the state array of the first changed value.
        */
        Channel.prototype.updated = function (target, changed, dt) {
            changed.splice(0);
            if (target.last == null) {
                target.last = this._state(target, dt);
                if (target.last != null) {
                    for (var i = 0; i < target.last.length; ++i) {
                        changed.push(true);
                    }
                }
                return true;
            }
            var change = false;
            var state = this._state(target, dt);
            if (state != null) {
                for (var i = 0; i < state.length; ++i) {
                    changed.push(state[i] !== target.last[i]);
                    if (changed[i]) {
                        change = true;
                    }
                }
            }
            target.last = state;
            return change;
        };

        /* Get the state record for a target */
        Channel.prototype._state = function (binding, dt) {
            if (binding.state == null) {
                return null;
            }
            return binding.state(binding.model, binding.display, dt);
        };
        return Channel;
    })();
    dsync.Channel = Channel;
})(dsync || (dsync = {}));
/// <reference path="__init__.ts"/>
var dsync;
(function (dsync) {
    (function (dom) {
        /* Watch DOM changes on an element and trigger a channel */
        function watch(sync, e, events, channel) {
            for (var i = 0; i < events.length; ++i) {
                addEventListener(e, events[i], function () {
                    channel.ready = true;
                    sync.update();
                });
            }
        }
        dom.watch = watch;

        function addEventListener(e, key, callback) {
            if (e.addEventListener) {
                e.addEventListener(key, callback, false);
            } else if (e.attachEvent) {
                e.attachEvent('on' + key, callback);
            }
        }

        function removeEventListener(e, key, callback) {
            if (e.removeEventListener) {
                e.removeEventListener(key, callback, false);
            } else if (e.detachEvent) {
                e.detachEvent('on' + key, callback);
            }
        }
    })(dsync.dom || (dsync.dom = {}));
    var dom = dsync.dom;
})(dsync || (dsync = {}));
/// <reference path="__init__.ts"/>
var dsync;
(function (dsync) {
    /* Top level manager for a set of synchronized objects */
    var Sync = (function () {
        /*
        * Create an instance of the sync class
        * @param pollRate The minimum interval in ms between updates.
        */
        function Sync(pollRate) {
            if (typeof pollRate === "undefined") { pollRate = 10; }
            /* Actual channel objects */
            this.channels = {};
            /* If we have a pending update, the timer goes here */
            this._timer = null;
            this._pollRate = pollRate;
        }
        /* Get access to an events channel */
        Sync.prototype.channel = function (name, ready, locked) {
            if (typeof ready === "undefined") { ready = true; }
            if (typeof locked === "undefined") { locked = false; }
            if (this.channels[name] === undefined) {
                this.channels[name] = new dsync.Channel();
                this.channels[name].ready = ready;
                this.channels[name].locked = locked;
            }
            return this.channels[name];
        };

        /* Update channels async */
        Sync.prototype.update = function () {
            var _this = this;
            if (this._timer == null) {
                this._timer = setTimeout(function () {
                    _this._timer = null;
                    for (var key in _this.channels) {
                        var chan = _this.channels[key];
                        if (chan.ready) {
                            if (!chan.locked) {
                                chan.ready = false;
                            }
                            chan.update();
                        }
                    }
                }, this._pollRate);
            }
        };

        /*
        * Touch a channel to make it update next frame
        * Notice this is an async request.
        */
        Sync.prototype.touch = function (channel) {
            var _this = this;
            setTimeout(function () {
                if (!(channel instanceof dsync.Channel)) {
                    channel = _this.channel(channel);
                }
                channel.ready = true;
                _this.update();
            }, 1);
        };

        /* Shortcut for channel.add() */
        Sync.prototype.add = function (channel, model, display, sync, state) {
            if (typeof state === "undefined") { state = null; }
            if (!(channel instanceof dsync.Channel)) {
                channel = this.channel(channel);
            }
            channel.add(model, display, sync, state);
        };

        /*
        * Watch DOM changes on an element and trigger a channel
        * @param e The element to watch
        * @param event The event to trigger on
        * @param channel The channel to invoke when it happens
        */
        Sync.prototype.watch = function (e, events, channel) {
            if (!(channel instanceof dsync.Channel)) {
                channel = this.channel(channel);
            }
            dsync.dom.watch(this, e, events, channel);
        };
        return Sync;
    })();
    dsync.Sync = Sync;
})(dsync || (dsync = {}));
