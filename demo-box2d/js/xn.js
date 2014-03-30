/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Directions for mapping */
    (function (Target) {
        Target[Target["WORLD"] = 0] = "WORLD";
        Target[Target["DISPLAY"] = 1] = "DISPLAY";
    })(xn.Target || (xn.Target = {}));
    var Target = xn.Target;

    
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
var xn;
(function (xn) {
    /* An array wrapper with some extra features and browser support */
    var List = (function () {
        function List() {
            /* Internal data array */
            this._data = [];
        }
        /* Calc length */
        List.prototype.length = function () {
            return this._data.length;
        };

        /* Return a copy of the internal data (but not the inner array itself) */
        List.prototype.all = function () {
            return this._data.slice(0);
        };

        /*
        * Absorb a list to replace the internal data model
        * Notice this takes a copy of the given list.
        */
        List.prototype.set = function (data) {
            this._data = data.slice(0);
        };

        /* Add a new child */
        List.prototype.push = function (item) {
            this._data.push(item);
        };

        /* Add a new child to the front */
        List.prototype.unshift = function (item) {
            this._data.unshift(item);
        };

        /* Remove a child from the front */
        List.prototype.shift = function () {
            return this._data.shift();
        };

        /* Remove a child from the bacj */
        List.prototype.pop = function () {
            return this._data.pop();
        };

        /* Filter this list */
        List.prototype.filter = function (filter) {
            var data = [];
            this.each(function (i) {
                if (filter(i)) {
                    data.push(i);
                }
            });
            this._data = data;
        };

        /* A filter-like action that returns an array of matches */
        List.prototype.search = function (filter, max) {
            if (typeof max === "undefined") { max = -1; }
            var data = [];
            for (var i = 0; i < this._data.length; ++i) {
                if (filter(this._data[i])) {
                    data.push(this._data[i]);
                }
                if ((max !== -1) && (data.length >= max)) {
                    break;
                }
            }
            return data;
        };

        /* A shortcut for the first search result, or null */
        List.prototype.first = function (filter) {
            var all = this.search(filter, 1);
            if (all.length) {
                return all[0];
            }
            return null;
        };

        /*
        * Map objects to the same type and apply and update.
        * Often each is good enough for this, but for example to modify
        * a list of primitive types like strings, you need to use this.
        */
        List.prototype.map = function (map) {
            var _data = [];
            this.each(function (i) {
                _data.push(map(i));
            });
            this.set(_data);
        };

        /* Morph this into a new list of new type objects. */
        List.prototype.morph = function (map) {
            var _data = [];
            var rtn = new List();
            this.each(function (i) {
                _data.push(map(i));
            });
            rtn.set(_data);
            return rtn;
        };

        /* Do something on each element */
        List.prototype.each = function (apply) {
            for (var i = 0; i < this._data.length; ++i) {
                apply(this._data[i]);
            }
        };

        /* Remove a specific elements */
        List.prototype.remove = function (target) {
            this.filter(function (i) {
                return i != target;
            });
        };

        /* Return the index of the given element in the list, or -1 */
        List.prototype.indexOf = function (item) {
            if (this._data.indexOf) {
                return this._data.indexOf(item);
            }
            for (var i = 0; i < this._data.length; ++i) {
                if (this._data[i] === item) {
                    return i;
                }
            }
            return -1;
        };

        /* A simple wrapper for indexOf that returns a boolean */
        List.prototype.any = function (item) {
            return this.indexOf(item) != -1;
        };

        /* Join wrapper */
        List.prototype.join = function (joiner) {
            return this._data.join(joiner);
        };
        return List;
    })();
    xn.List = List;
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
var xn;
(function (xn) {
    /* A map wrapper with some extra features and browser support */
    var Map = (function () {
        /* Create a map from a dictionary */
        function Map(data) {
            if (typeof data === "undefined") { data = {}; }
            this._data = data;
        }
        /* Set a value */
        Map.prototype.set = function (key, value) {
            this._data[key] = value;
        };

        /* Get a value */
        Map.prototype.get = function (key) {
            return this._data[key];
        };

        /* Check if a key exists */
        Map.prototype.hasKey = function (key) {
            var found = false;
            this._each(function (k, v) {
                found = key === k;
                return !found;
            });
            return found;
        };

        /* Internal smart each operator */
        Map.prototype._each = function (apply) {
            for (var key in this._data) {
                if (!apply(key, this._data[key])) {
                    break;
                }
            }
        };

        /* Do something on each element */
        Map.prototype.each = function (apply) {
            this._each(function (k, v) {
                apply(k, v);
                return true;
            });
        };

        /* Value the values to new values */
        Map.prototype.map = function (map) {
            var _data = {};
            this.each(function (k, v) {
                _data[k] = map(v);
                return true;
            });
            this.setInternal(_data);
        };

        /* Update the internal data */
        Map.prototype.setInternal = function (data) {
            this._data = data;
        };

        /* Get keys as a list */
        Map.prototype.keys = function () {
            var rtn = new xn.List();
            this.each(function (k, v) {
                rtn.push(k);
            });
            return rtn;
        };

        /* Get values as a list */
        Map.prototype.values = function () {
            var rtn = new xn.List();
            this.each(function (k, v) {
                rtn.push(v);
            });
            return rtn;
        };

        /* All the values in the map */
        Map.prototype.all = function () {
            return this._data;
        };
        return Map;
    })();
    xn.Map = Map;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* 2D vector */
    var Vector = (function () {
        function Vector(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        /* Return the magnitude */
        Vector.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        /* Convert into a unit vector and return self */
        Vector.prototype.unit = function () {
            var magn = this.magnitude();
            if (magn == 0) {
                this.x = 0;
                this.y = 0;
            } else {
                this.x = this.x / magn;
                this.y = this.y / magn;
            }
            return this;
        };

        /* Multiple by constant factor and return self */
        Vector.prototype.multiply = function (factor) {
            this.x = this.x * factor;
            this.y = this.y * factor;
            return this;
        };

        /* Add another vector to this one, with an optional factor and return self */
        Vector.prototype.add = function (other, factor) {
            if (typeof factor === "undefined") { factor = 1.0; }
            this.x += other.x * factor;
            this.y += other.y * factor;
            return this;
        };

        /* Copy from another vector easily and return self */
        Vector.prototype.copy = function (other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        };
        return Vector;
    })();
    xn.Vector = Vector;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Generic 2D block */
    var Quad = (function () {
        function Quad(x, y, dx, dy, angle) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof dx === "undefined") { dx = 0; }
            if (typeof dy === "undefined") { dy = 0; }
            if (typeof angle === "undefined") { angle = 0; }
            this.pos = { x: x, y: y };
            this.size = { x: dx, y: dy };
            this.angle = angle;
        }
        /* Create a copy and return it */
        Quad.prototype.clone = function () {
            return new Quad(this.pos.x, this.pos.y, this.size.x, this.size.y, this.angle);
        };
        return Quad;
    })();
    xn.Quad = Quad;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Map between centralized 0,0 coordinates and top left viewport coordinates */
    var StaticViewport = (function () {
        function StaticViewport(world, display) {
            this.world = world;
            this.display = display;
            this.all();
        }
        /* View the entire world space */
        StaticViewport.prototype.all = function () {
            this.view(new xn.Quad(0, 0, this.world.x / 2, this.world.y / 2));
        };

        /* Change the current view to that given */
        StaticViewport.prototype.view = function (view) {
            this.viewport = view;
        };

        /*
        * Generate a new point to be relative to the viewport.
        * By default the output is in display space; to modify use target.
        * @param p The point to generate output from
        * @param target The output coordinate space
        * @return A new point in the target coordinate space.
        */
        StaticViewport.prototype.point = function (p, target) {
            if (typeof target === "undefined") { target = 1 /* DISPLAY */; }
            var rtn = { x: p.x, y: p.y };
            if (target == 1 /* DISPLAY */) {
                this._vpoint(rtn, target);
                this._size(rtn, target);
            } else {
                this._size(rtn, target);
                this._vpoint(rtn, target);
            }
            return rtn;
        };

        /* Converts a point in world space to a point view port space from top left corner */
        StaticViewport.prototype._vpoint = function (p, target) {
            if (target == 1 /* DISPLAY */) {
                p.x = p.x - (this.viewport.pos.x - this.viewport.size.x);
                p.y = (this.viewport.pos.y + this.viewport.size.y) - p.y;
            } else {
                p.x = p.x + (this.viewport.pos.x - this.viewport.size.x);
                p.y = (this.viewport.pos.y + this.viewport.size.y) - p.y;
            }
        };

        /* Apply sizing on an existing point */
        StaticViewport.prototype._size = function (p, target) {
            if (typeof target === "undefined") { target = 1 /* DISPLAY */; }
            if (target == 1 /* DISPLAY */) {
                p.x = p.x * this.display.x / (this.viewport.size.x * 2);
                p.y = p.y * this.display.y / (this.viewport.size.y * 2);
            } else {
                p.x = p.x * (this.viewport.size.x * 2) / this.display.x;
                p.y = p.y * (this.viewport.size.y * 2) / this.display.y;
            }
        };

        /*
        * Generate a new size to be relative to the viewport.
        * By default the output is in display space; to modify use target.
        *
        * Notice that the distinction between size() and point() is that the
        * point assumes that display space is 0,0 based at the top left, and
        * corrects coordiantes accordingly.
        *
        * @param p The point to generate output from
        * @param target The output coordinate space
        * @return A new point in the target coordinate space.
        */
        StaticViewport.prototype.size = function (p, target) {
            if (typeof target === "undefined") { target = 1 /* DISPLAY */; }
            var rtn = { x: p.x, y: p.y };
            this._size(rtn, target);
            return rtn;
        };
        return StaticViewport;
    })();
    xn.StaticViewport = StaticViewport;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (dom) {
        /* Browser agnostic remove events */
        function removeEventListener(e, key, callback) {
            if (e.removeEventListener) {
                e.removeEventListener(key, callback, false);
            } else if (e.detachEvent) {
                e.detachEvent('on' + key, callback);
            }
        }
        dom.removeEventListener = removeEventListener;

        /* Browser agnostic add events */
        function addEventListener(e, key, callback) {
            if (e.addEventListener) {
                e.addEventListener(key, callback, false);
            } else if (e.attachEvent) {
                e.attachEvent('on' + key, callback);
            }
        }
        dom.addEventListener = addEventListener;
    })(xn.dom || (xn.dom = {}));
    var dom = xn.dom;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (pointer) {
        /* Special helper to get absolute (page) pointer event coordinates */
        function absolute(e) {
            var pageX = e.pageX;
            var pageY = e.pageY;
            if (pageX === undefined) {
                pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return { x: pageX, y: pageY };
        }
        pointer.absolute = absolute;

        /* Special helper to get coordinates relative to given parent */
        function relative(e, parent) {
            var bounds = parent.getBoundingClientRect();
            var abs = absolute(e);
            abs.x -= bounds.left;
            abs.y -= bounds.top;
            return abs;
        }
        pointer.relative = relative;
    })(xn.pointer || (xn.pointer = {}));
    var pointer = xn.pointer;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* A single event binding */
    var EventBinding = (function () {
        function EventBinding(target, type, handler) {
            this.target = target;
            this.type = type;
            this.handler = handler;
            this.token = null;
        }
        /* Add/remove this event target */
        EventBinding.prototype.setActive = function (active) {
            if (typeof active === "undefined") { active = true; }
            var _this = this;
            if ((active) && (!this.token)) {
                this.token = function (e) {
                    e = e || window.event;
                    return _this.handler(e);
                };
                xn.dom.addEventListener(this.target, this.type, this.token);
            } else if ((!active) && this.token) {
                xn.dom.removeEventListener(this.target, this.type, this.token);
            }
        };
        return EventBinding;
    })();
    xn.EventBinding = EventBinding;

    /* A collection of events which can easily be turned on or off */
    var Events = (function () {
        function Events() {
            /* Set of bindings we currently have */
            this.bindings = new xn.List();
        }
        /*
        * Add an event binding
        * @param target The target element to attach an event to.
        * @param event The event code; eg. keydown
        * @param handler The callback to invoke when the event happens.
        * @return This call returns the object itself to as to be chainable.
        */
        Events.prototype.bind = function (target, event, handler) {
            this.bindings.push(new EventBinding(target, event, handler));
            return this;
        };

        /* Turn all events on */
        Events.prototype.activate = function () {
            this.bindings.each(function (b) {
                b.setActive(true);
            });
        };

        /* Turn all events off */
        Events.prototype.clear = function () {
            this.bindings.each(function (b) {
                b.setActive(false);
            });
        };
        return Events;
    })();
    xn.Events = Events;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Helper for objects that implement event listening */
    var EventListenerBase = (function () {
        /* Create an event listener with a finite set of accepting keys */
        function EventListenerBase(keys) {
            var _this = this;
            /* Actual event bindings */
            this._bindings = {};
            /* Accepted event keys */
            this._keys = new xn.List();
            this._keys.set(keys);
            this._keys.map(function (key) {
                return key.toLocaleLowerCase();
            });
            this._keys.each(function (key) {
                _this._bindings[key] = new xn.List();
            });
        }
        EventListenerBase.prototype._guard = function (key) {
            if (!this._keys.any(key)) {
                throw xn.error('Invalid key for event listener: "' + key + '" (accepts: ' + this._keys.join(', ') + ')');
            }
        };

        /* Attach an event binding */
        EventListenerBase.prototype.addEventListener = function (key, callback) {
            this._guard(key);
            this._bindings[key].push(callback);
        };

        /* Remove an event listener */
        EventListenerBase.prototype.removeEventListener = function (key, callback) {
            this._guard(key);
            this._bindings[key].remove(callback);
        };

        /* Trigger events */
        EventListenerBase.prototype.trigger = function (key, event) {
            this._guard(key);
            this._bindings[key].each(function (callback) {
                callback(event);
            });
        };
        return EventListenerBase;
    })();
    xn.EventListenerBase = EventListenerBase;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (logger) {
        /* Dummy logger */
        var DummyLogger = (function () {
            function DummyLogger() {
            }
            DummyLogger.prototype.log = function (msg) {
            };

            DummyLogger.prototype.info = function (msg) {
            };

            DummyLogger.prototype.warn = function (msg) {
            };

            DummyLogger.prototype.error = function (msg, e) {
            };

            DummyLogger.prototype.watch = function (key, msg) {
            };
            return DummyLogger;
        })();
        logger.DummyLogger = DummyLogger;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (logger) {
        /* Console logger */
        var ConsoleLogger = (function () {
            function ConsoleLogger() {
            }
            ConsoleLogger.prototype.info = function (msg) {
                this._console().log(msg);
            };

            ConsoleLogger.prototype.warn = function (msg) {
                this._console().warn(msg);
            };

            ConsoleLogger.prototype.error = function (msg, e) {
                this._console().error(msg, e);
            };

            ConsoleLogger.prototype.watch = function (key, msg) {
                // Watching not possible on the console, sorry!
            };

            ConsoleLogger.prototype._console = function () {
                try  {
                    return window.console;
                } catch (e) {
                    try  {
                        return console;
                    } catch (e) {
                        console.log('Failed: ' + e.toString());
                        return new xn.logger.DummyLogger();
                    }
                }
            };
            return ConsoleLogger;
        })();
        logger.ConsoleLogger = ConsoleLogger;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (logger) {
        /* Redirect logger; redirects to real impl */
        var RedirectLogger = (function () {
            function RedirectLogger() {
                /* Actual logger to invoke */
                this.target = new xn.logger.DummyLogger();
            }
            RedirectLogger.prototype.info = function (msg) {
                this.target.info(msg);
            };

            RedirectLogger.prototype.warn = function (msg) {
                this.target.warn(msg);
            };

            RedirectLogger.prototype.error = function (msg, e) {
                this.target.error(msg, e);
                var st = this._getStackTrace(e);
                if (st) {
                    for (var i = 0; i < st.length; ++i) {
                        this.target.info(st[i]);
                    }
                }
            };

            RedirectLogger.prototype.watch = function (key, msg) {
                this.target.watch(key, msg);
            };

            /* Try to dump an object as a string */
            RedirectLogger.prototype.dump = function (data) {
                try  {
                    var rtn = '';
                    for (var key in data) {
                        if (!this._isFunc(data[key])) {
                            rtn += '( ' + key;
                            if (this._isObj(data[key])) {
                                rtn += ': ' + this.dump(data[key]) + ' )';
                            } else {
                                rtn += ': ' + data[key] + ' )';
                            }
                        }
                    }
                    return rtn;
                } catch (e) {
                }
                return data.toString();
            };

            RedirectLogger.prototype._isFunc = function (t) {
                var getType = {};
                return t && getType.toString.call(t) === '[object Function]';
            };

            RedirectLogger.prototype._isObj = function (t) {
                var getType = {};
                return t && getType.toString.call(t) === '[object Object]';
            };

            RedirectLogger.prototype._getStackTrace = function (e) {
                var rtn = null;
                if (e.stack) {
                    rtn = e.stack.split('\n');
                } else if (window['opera'] && e.message) {
                    rtn = e.message.split('\n');
                }
                return rtn;
            };
            return RedirectLogger;
        })();
        logger.RedirectLogger = RedirectLogger;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (logger) {
        /* Document append logger */
        var DocumentLogger = (function () {
            /*
            * Creates a new logger
            * @param target If provided, the document element to log to.
            */
            function DocumentLogger(target) {
                if (typeof target === "undefined") { target = null; }
                if (target !== null) {
                    this.target = target;
                } else {
                    var e = document.createElement('div');
                    document.body.appendChild(e);
                    this.target = e;
                }
            }
            DocumentLogger.prototype._append = function (msg) {
                var e = document.createElement('div');
                e.innerHTML = msg.toString();
                if (this.target.childNodes.length > 0) {
                    this.target.insertBefore(e, this.target.firstChild);
                } else {
                    this.target.appendChild(e);
                }
                if (window.console) {
                    window.console.log(msg);
                }
            };

            DocumentLogger.prototype.info = function (msg) {
                msg = msg == null ? 'null' : msg.toString();
                this._append('info: ' + msg);
            };

            DocumentLogger.prototype.warn = function (msg) {
                msg = msg == null ? 'null' : msg.toString();
                this._append('warning: ' + msg);
            };

            DocumentLogger.prototype.error = function (msg, e) {
                msg = msg == null ? 'null' : msg.toString();
                e = e == null ? 'null' : e.toString();
                this._append('error: ' + msg + ': ' + e);
                if (window.console) {
                    window.console.error(e);
                }
            };

            DocumentLogger.prototype.watch = function (key, msg) {
                var e = this._find(key);
                e.innerHTML = msg.toString();
            };

            DocumentLogger.prototype._find = function (key) {
                var rtn = null;
                for (var i = 0; i < this.target.children.length; ++i) {
                    var value = this.target.children[i];
                    if (value.getAttribute('id') == key) {
                        rtn = value;
                        break;
                    }
                }
                if (rtn == null) {
                    rtn = document.createElement('div');
                    rtn.id = key;
                    this.target.appendChild(rtn);
                }
                return rtn;
            };
            return DocumentLogger;
        })();
        logger.DocumentLogger = DocumentLogger;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="handler.ts"/>
/// <reference path="dummy_logger.ts"/>
/// <reference path="console_logger.ts"/>
/// <reference path="redirect_logger.ts"/>
/// <reference path="document_logger.ts"/>
var xn;
(function (xn) {
    (function (logger) {
        /* Public logger handle; allows rebinding in init */
        var _logger;

        /**
        * Returns the logger implementation.
        * If no impl is provided, the dummy logger is used.
        * @param impl The logger Handler implementation if required.
        */
        function init(impl) {
            var logger = get();
            logger.target = impl;
        }
        logger.init = init;

        /**
        * Returns the logger implementation.
        * If no impl is provided, the dummy logger is used.
        */
        function get() {
            if (_logger == null) {
                _logger = new xn.logger.RedirectLogger();
            }
            return _logger;
        }
        logger.get = get;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;

    /* Public logger instance for anyone to use */
    xn.log = xn.logger.get();

    /* A simple info trace helper */
    function trace() {
        var msgs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            msgs[_i] = arguments[_i + 0];
        }
        for (var i = 0; i < msgs.length; ++i) {
            xn.log.info(msgs[i]);
        }
    }
    xn.trace = trace;

    /* Print all properties on a target */
    function dump(target) {
        try  {
            return JSON.stringify(target);
        } catch (e) {
            return ('Failed to iterate over target: ' + e);
        }
    }
    xn.dump = dump;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Base type for meaningful errors */
    var Error = (function () {
        function Error(msg, type) {
            if (typeof type === "undefined") { type = 'x.Error'; }
            this.message = msg;
            this.name = type;
        }
        /* Public version */
        Error.prototype.toString = function () {
            return this.name + ": " + this.message;
        };
        return Error;
    })();
    xn.Error = Error;
})(xn || (xn = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* For things not ready yet */
    var NotImplementedError = (function (_super) {
        __extends(NotImplementedError, _super);
        function NotImplementedError() {
            _super.call(this, 'Not implemented', 'x.NotImplementedError');
        }
        return NotImplementedError;
    })(xn.Error);
    xn.NotImplementedError = NotImplementedError;
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="error.ts"/>
/// <reference path="not_implemented_error.ts"/>
var xn;
(function (xn) {
    /* Easy exception creation */
    function error(msg, type) {
        if (typeof type === "undefined") { type = 'n.Error'; }
        return new xn.Error(msg, type);
    }
    xn.error = error;

    /* Easy exception creation */
    function notImplemented() {
        return new xn.NotImplementedError();
    }
    xn.notImplemented = notImplemented;
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
var xn;
(function (xn) {
    (function (random) {
        /* Generate a random number between a and b, inclusive */
        function int(a, b) {
            var lower = Math.floor(a);
            var upper = Math.floor(b);
            var range = 1 + Math.abs(upper - lower);
            var step = Math.floor(Math.random() * range);
            return lower + step;
        }
        random.int = int;

        /* Select a random element from an array */
        function select(a) {
            if (a.length > 0) {
                var index = int(0, a.length - 1);
                return a[index];
            }
            return null;
        }
        random.select = select;

        /* Build a random hex code colour as an int */
        function color() {
            return ((int(0, 255) << 16) | (int(0, 255)) << 8) | int(0, 255);
        }
        random.color = color;
    })(xn.random || (xn.random = {}));
    var random = xn.random;
})(xn || (xn = {}));
