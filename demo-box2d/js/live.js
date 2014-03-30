/// <reference path="../lib/dsync/bin/dsync.d.ts"/>
/// <reference path="../lib/prim/bin/prim.d.ts"/>
/// <reference path="../lib/x/bin/x.d.ts"/>
var live;
(function (live) {
    var ContextChannels;
    (function (ContextChannels) {
        ContextChannels[ContextChannels["DISPLAY"] = 0] = "DISPLAY";
        ContextChannels[ContextChannels["MODEL"] = 1] = "MODEL";
    })(ContextChannels || (ContextChannels = {}));

    var Context = (function () {
        function Context() {
            this.sync = new dsync.Sync();
            this.handlers = new x.List();
            this.sync.channel(0 /* DISPLAY */);
            this.sync.channel(1 /* MODEL */);
        }
        // Register a handler for this controller
        Context.prototype.register = function (handler) {
            this.handlers.push(handler);
        };

        // Watch something
        Context.prototype.watch = function (model, root) {
            return new Controller(model, root, this);
        };

        // manually sync controller model to display
        Context.prototype.update = function (model, display) {
            if (typeof model === "undefined") { model = true; }
            if (typeof display === "undefined") { display = true; }
            if (model) {
                this.sync.touch(1 /* MODEL */);
            }
            if (display) {
                this.sync.touch(0 /* DISPLAY */);
            }
            this.sync.update();
        };
        return Context;
    })();
    live.Context = Context;

    var Controller = (function () {
        function Controller(model, root, context) {
            this.model = model;
            this.root = root;
            this.active = true;
            this._parse(root, context);
        }
        Controller.prototype._parse = function (root, context) {
            var _this = this;
            var walker = new internal.Walker();
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

    var internal;
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
    })(internal || (internal = {}));
})(live || (live = {}));
