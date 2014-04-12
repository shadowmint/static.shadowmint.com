/// <reference path="__init__.ts"/>
var live;
(function (live) {
    (function (internal) {
        

        

        /* Walks the DISPLAY and runs the given matchers on each node */
        var Walker = (function () {
            function Walker() {
            }
            /* Walk over all the subnodes of the given target */
            Walker.prototype.walk = function (root, detects, matcher) {
                var stack = [root.childNodes];
                var currentList = null;
                var current = null;
                while (stack.length > 0) {
                    currentList = stack.shift();
                    for (var j = 0; j < currentList.length; ++j) {
                        current = currentList[j];
                        stack.push(current.childNodes);
                        detects.each(function (d) {
                            if (d(current)) {
                                matcher(current, d);
                            }
                        });
                    }
                }
            };
            return Walker;
        })();
        internal.Walker = Walker;
    })(live.internal || (live.internal = {}));
    var internal = live.internal;
})(live || (live = {}));
/// <reference path="__init__.ts"/>
var live;
(function (live) {
    (function (internal) {
        (function (ContextChannels) {
            ContextChannels[ContextChannels["DISPLAY"] = 0] = "DISPLAY";
            ContextChannels[ContextChannels["MODEL"] = 1] = "MODEL";
        })(internal.ContextChannels || (internal.ContextChannels = {}));
        var ContextChannels = internal.ContextChannels;
    })(live.internal || (live.internal = {}));
    var internal = live.internal;
})(live || (live = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="walker.ts"/>
/// <reference path="channels.ts"/>
// A class that check for state updates periodically
var live;
(function (live) {
    (function (update) {
        var TimedUpdate = (function () {
            function TimedUpdate(interval) {
                if (typeof interval === "undefined") { interval = 100; }
                this._timer = null;
                this._interval = interval;
            }
            TimedUpdate.prototype.attach = function (context) {
                // TODO, implemenlt on frame update
                this._timer = setInterval(function () {
                    context.update();
                }, this._interval);
            };

            TimedUpdate.prototype.release = function () {
                clearInterval(this._timer);
            };
            return TimedUpdate;
        })();
        update.TimedUpdate = TimedUpdate;
    })(live.update || (live.update = {}));
    var update = live.update;
})(live || (live = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="update.ts"/>
/// <reference path="timed_update.ts"/>
/// <reference path="__init__.ts"/>
var live;
(function (live) {
    

    /* Helper functions for handlers */
    (function (helpers) {
        /* Simple helper to caching arbitrary data against an element */
        var PropertyCache = (function () {
            function PropertyCache() {
                this._data = {};
            }
            /* Set an arbitrary data value */
            PropertyCache.prototype.set = function (e, key, value) {
                this._data[key] = value;
            };

            /* Get a saved data value */
            PropertyCache.prototype.get = function (e, key, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                if (key in this._data) {
                    return this._data[key];
                }
                return defaultValue;
            };
            return PropertyCache;
        })();
        helpers.PropertyCache = PropertyCache;

        /* Check if an element e has an attribute attr, and return it if so */
        function getAttr(e, attr, defaultValue) {
            if (typeof defaultValue === "undefined") { defaultValue = ""; }
            try  {
                var value = e.getAttribute(attr);
                if ((value === null) || (value === '')) {
                    value = defaultValue;
                }
            } catch (e) {
                value = defaultValue;
            }
            return value;
        }
        helpers.getAttr = getAttr;
    })(live.helpers || (live.helpers = {}));
    var helpers = live.helpers;
})(live || (live = {}));
/// <reference path="__init__.ts"/>
var live;
(function (live) {
    /* A context is a set of bindings to read and apply from the DOM */
    var Context = (function () {
        function Context() {
            /* The sync model for this context (see dsync) */
            this.sync = new dsync.Sync();
            /* A list of handlers bound to this context */
            this.handlers = new xn.List();
            this.sync.channel(0 /* DISPLAY */);
            this.sync.channel(1 /* MODEL */);
        }
        /* Register a handler for this controller */
        Context.prototype.register = function (handler) {
            this.handlers.push(handler);
        };

        /* Parse an html node and apply any known handlers to it */
        Context.prototype.watch = function (model, root) {
            return new live.Controller(model, root, this);
        };

        /* Apply an update method to this controller */
        Context.prototype.update = function () {
            this.sync.touch(1 /* MODEL */);
            this.sync.touch(0 /* DISPLAY */);
            this.sync.update();
        };
        return Context;
    })();
    live.Context = Context;
})(live || (live = {}));
/// <reference path="__init__.ts"/>
var live;
(function (live) {
    /* Top level class for looking after a page block */
    var Controller = (function () {
        /*
        * Create a new controller
        * @param model The data model type.
        * @param root The root element to use.
        * @param context The context to use to generate bindings.
        */
        function Controller(model, root, context) {
            /* The updaters for this */
            this._updates = null;
            this.model = model;
            this.root = root;
            this.active = true;
            this._parent = context;
            this._parse(root, context);
        }
        /* Push and activate a new update */
        Controller.prototype._pushUpdate = function (update) {
            if (this._updates == null) {
                this._updates = new xn.List();
            }
            this._updates.push(update);
            update.attach(this._parent);
        };

        /* Create a new timed update and attach it to this controller */
        Controller.prototype.timedUpdate = function (interval) {
            if (typeof interval === "undefined") { interval = 0; }
            this._pushUpdate(new live.update.TimedUpdate(interval));
        };

        /*
        * Directly update the state.
        *
        * The action param is a helper to make code a little cleaner, eg.
        * c.update(() => { model.value = 'Hi'; });
        *
        * @param action The update action to run before calling update.
        */
        Controller.prototype.update = function (action) {
            if (typeof action === "undefined") { action = null; }
            if (action != null) {
                action();
            }
            this._parent.update();
        };

        /* Release this controller */
        Controller.prototype.release = function () {
            this._updates.each(function (u) {
                u.release();
            });
            this.active = false;
        };

        Controller.prototype._parse = function (root, context) {
            var _this = this;
            var walker = new live.internal.Walker();
            var detects = context.handlers.morph(function (i) {
                return i.detect;
            });
            walker.walk(root, detects, function (match, detect) {
                var handler = context.handlers.first(function (item) {
                    return item.detect === detect;
                });
                if (handler) {
                    if (handler.modelState && handler.modelUpdate) {
                        context.sync.add(1 /* MODEL */, _this.model, match, function (model, display) {
                            handler.modelUpdate(model, display);
                            return _this.active;
                        }, handler.modelState);
                    }
                    if (handler.displayState && handler.displayUpdate) {
                        context.sync.add(1 /* MODEL */, _this.model, match, function (model, display) {
                            handler.displayUpdate(model, display);
                            return _this.active;
                        }, handler.displayState);
                    }
                }
            });
        };
        return Controller;
    })();
    live.Controller = Controller;
})(live || (live = {}));
/// <reference path="internal/__init__.ts"/>
/// <reference path="update/__init__.ts"/>
/// <reference path="handler.ts"/>
/// <reference path="context.ts"/>
/// <reference path="controller.ts"/>
/// <reference path="../../../public/js/dsync.d.ts"/>
/// <reference path="../../../public/js/xn.d.ts"/>
/// <reference path="../../../lib/live/src/live/__init__.ts"/>
