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
/// <reference path="event_listener.ts"/>
/// <reference path="viewport.ts"/>
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
            return xn.data.has(this._data, key);
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
var xn;
(function (xn) {
    (function (data) {
        /*
        * Make an instance from a class object
        * @param t The class to make one of
        * @param args The constructor arguments
        */
        function make(t, args) {
            if (typeof args === "undefined") { args = []; }
            var instance = Object.create(t.prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }
        data.make = make;

        /* Check if an object t has property prop which is not a method */
        function has(obj, prop) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        }
        data.has = has;

        /* Return the value of a property, with default value */
        function get(obj, prop, defaultValue) {
            if (typeof defaultValue === "undefined") { defaultValue = null; }
            return has(obj, prop) ? obj[prop] : defaultValue;
        }
        data.get = get;
    })(xn.data || (xn.data = {}));
    var data = xn.data;
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="list.ts"/>
/// <reference path="map.ts"/>
/// <reference path="utils.ts"/>
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
/// <reference path="../__init__.ts"/>
/// <reference path="point.ts"/>
/// <reference path="vector.ts"/>
/// <reference path="quad.ts"/>
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
/// <reference path="../__init__.ts"/>
/// <reference path="static_viewport.ts"/>
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
            var _this = this;
            if (typeof active === "undefined") { active = true; }
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
/// <reference path="../__init__.ts"/>
/// <reference path="dom.ts"/>
/// <reference path="pointer.ts"/>
/// <reference path="events.ts"/>
/// <reference path="event_listener.ts"/>
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
                        return xn.console;
                    } catch (e) {
                        return new logger.DummyLogger();
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
                this.target = new xn.logger.ConsoleLogger();
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
            DocumentLogger.prototype._append = function (prefix, msg) {
                msg = msg == null ? 'null' : msg;
                var e = document.createElement('div');
                e.innerHTML = prefix + ": " + msg.toString();
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
                this._append('info', msg);
            };

            DocumentLogger.prototype.warn = function (msg) {
                this._append('warning', msg);
            };

            DocumentLogger.prototype.error = function (msg, e) {
                e = e == null ? 'null' : e.toString();
                this._append('error', msg + ': ' + e);
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
    (function (__logger) {
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
        __logger.init = init;

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
        __logger.get = get;
    })(xn.logger || (xn.logger = {}));
    var logger = xn.logger;

    /* Public logger instance for anyone to use */
    xn.console = xn.logger.get();

    /* A simple info trace helper */
    function log() {
        var msgs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            msgs[_i] = arguments[_i + 0];
        }
        for (var i = 0; i < msgs.length; ++i) {
            xn.console.info(msgs[i]);
        }
    }
    xn.log = log;

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
            if (typeof type === "undefined") { type = 'xn.Error'; }
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
            _super.call(this, 'Not implemented', 'xn.NotImplementedError');
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
        if (typeof type === "undefined") { type = 'xn.Error'; }
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
var xn;
(function (xn) {
    /* Simple ajax wrapper */
    var Xhr = (function () {
        function Xhr() {
            var _this = this;
            this._def = null;
            this._xhr = Xhr.factory();
            xn.dom.addEventListener(this._xhr, 'readystatechange', function (e) {
                _this._stateChange();
            });
        }
        /* Changes on state */
        Xhr.prototype._stateChange = function () {
            if (this._xhr.readyState == 4) {
                if (this._xhr.status == 200) {
                    this._def.resolve(this._xhr.responseText);
                } else {
                    this._def.reject(this._xhr.statusText);
                }
            }
        };

        /* Open a url */
        Xhr.prototype.open = function (method, url) {
            this._xhr.open(method, url);
        };

        /* Send the request */
        Xhr.prototype.send = function (data) {
            if (this._def != null) {
                throw xn.error("Invalid request; this object is already busy");
            }
            this._xhr.send(data);
            this._def = new xn.Promise();
            return this._def;
        };

        /* Create and return an XHR object */
        Xhr.factory = function () {
            try  {
                return new XMLHttpRequest();
            } catch (e) {
            }
            try  {
                return new ActiveXObject("Msxml3.XMLHTTP");
            } catch (e) {
            }
            try  {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e) {
            }
            try  {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e) {
            }
            try  {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            }
            try  {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
            return null;
        };
        return Xhr;
    })();
    xn.Xhr = Xhr;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /* Known types of assets */
    (function (AssetType) {
        AssetType[AssetType["UNKNOWN"] = 0] = "UNKNOWN";
        AssetType[AssetType["JSON"] = 1] = "JSON";
        AssetType[AssetType["IMAGE"] = 2] = "IMAGE";
        AssetType[AssetType["BUNDLE"] = 3] = "BUNDLE";
    })(xn.AssetType || (xn.AssetType = {}));
    var AssetType = xn.AssetType;

    

    /* Path controlled asset loader */
    var Assets = (function () {
        /* Create an instance with a given root prefix for assets */
        function Assets(root) {
            /* The set of known bindings for asset types */
            this._types = {};
            root = root.replace(/^\/*/, '');
            root = root.replace(/\/*$/, '');
            this.prefix = '/' + root + '/';
            this.prefix = this.prefix.replace('//', '/');
            this._types[2 /* IMAGE */] = xn.assets.ImageLoader;
            this._types[1 /* JSON */] = xn.assets.JsonLoader;
        }
        /* Get the current binding */
        Assets.prototype._binding = function (type) {
            var rtn = this._types[type];
            rtn = rtn ? rtn : null;
            return rtn;
        };

        /* Load all the assets async and dispatch an event when they're ready */
        Assets.prototype.load = function (url, type) {
            var factory = this._binding(type);
            if (!factory) {
                throw xn.error("Invalid type: '" + type + "' is not a known asset type");
            }
            var def = new xn.Promise();
            var loader = xn.data.make(factory);
            loader.load(this._url(url)).then(function (data) {
                var asset = { type: type, url: url, data: data };
                def.resolve(asset);
            });
            return def;
        };

        /* Make url specific to this asset loader */
        Assets.prototype._url = function (url) {
            url = url.replace(/^\/*/, '');
            url = this.prefix + url;
            return url;
        };
        return Assets;
    })();
    xn.Assets = Assets;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (assets) {
        var ImageLoader = (function () {
            function ImageLoader() {
            }
            ImageLoader.prototype.load = function (url) {
                var def = new xn.Promise();
                var data = new Image();
                xn.dom.addEventListener(data, 'load', function () {
                    def.resolve(data);
                });
                xn.dom.addEventListener(data, 'error', function (e) {
                    def.reject(e);
                });
                data.src = url;
                return def;
            };
            return ImageLoader;
        })();
        assets.ImageLoader = ImageLoader;
    })(xn.assets || (xn.assets = {}));
    var assets = xn.assets;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (assets) {
        var JsonLoader = (function () {
            function JsonLoader() {
            }
            JsonLoader.prototype.load = function (url) {
                var def = new xn.Promise();
                var request = new xn.Xhr();
                request.open('GET', url);
                request.send().then(function (data) {
                    try  {
                        var data = JSON.parse(data);
                        def.resolve(data);
                    } catch (e) {
                        def.reject(e);
                    }
                }, function (reason) {
                    def.reject(reason);
                });
                return def;
            };
            return JsonLoader;
        })();
        assets.JsonLoader = JsonLoader;
    })(xn.assets || (xn.assets = {}));
    var assets = xn.assets;
})(xn || (xn = {}));
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    /*
    * Handles loading groups of assets
    *
    * It can be convenient to load a group of assets all at once.
    * To do this, extend bundler and give the subclass a set of public
    * properties that are of type any with a value:
    *
    *      [type, data]
    *
    * Where type is one of AssetType and data is as appropriate for the type;
    * usually a url. The Bundle.key() shortcut exists for formatting these
    * correctly:
    *
    *      public mything:any = Bundle.key(AssetType.IMAGE, '/blah/image.png');
    *      public myjson:any = Bundle.key(AssetType.JSON//png, '/blah/images.json');
    *      public mybundle:any = Bundle.key(AssetType.BUNDLE, OtherBundle);
    *
    * Bundle load is recursive and will break things if you have cycles in
    * the binding of child-parents.
    */
    var Bundle = (function () {
        function Bundle(url) {
            this._assets = new xn.Assets(url);
            this._total = 0;
            this._loaded = 0;
        }
        /*
        * Loads and then resolves with the Bundle
        * @param T The bundle type to load.
        * @param url The base url to assets.
        * @param ticks A callback invoked everytime an asset is loaded.
        */
        Bundle.load = function (T, url, ticks) {
            if (typeof url === "undefined") { url = '/'; }
            if (typeof ticks === "undefined") { ticks = null; }
            var i = xn.data.make(T, [url]);
            return i.reload(ticks);
        };

        /* Generate an appropriate key */
        Bundle.key = function (T, data) {
            return [T, data];
        };

        /* Parse as a valid asset type */
        Bundle.prototype._asType = function (v) {
            var rtn = 0 /* UNKNOWN */;
            try  {
                rtn = Number(v);
            } catch (e) {
            }
            return rtn;
        };

        /* Load the assets for this instance */
        Bundle.prototype.reload = function (ticks) {
            var def = new xn.Promise();
            for (var key in this) {
                var value = this[key];
                if (value instanceof Array) {
                    try  {
                        var t = this._asType(value[0]);
                        var v = value[1];
                        if (t == 3 /* BUNDLE */) {
                            this._loadBundle(key, v, t, def, ticks);
                        } else {
                            this._loadAsset(key, v, t, def, ticks);
                        }
                        this._total += 1;
                    } catch (e) {
                        xn.log("Error invoking bundler", e);
                    }
                }
            }
            return def;
        };

        /* Dispatch a tick event */
        Bundle.prototype._dispatchTick = function (asset, promise, handler) {
            handler({
                bundle: this,
                assetsLoaded: this._loaded,
                assetsTotal: this._total,
                asset: asset
            });
            if (this._loaded == this._total) {
                promise.resolve(this);
            }
        };

        /* Load an actual asset */
        Bundle.prototype._loadAsset = function (key, url, t, promise, handler) {
            var _this = this;
            this._assets.load(url, t).then(function (asset) {
                _this._loaded += 1;
                _this[key] = asset.data;
                _this._dispatchTick(asset, promise, handler);
            });
        };

        /* Load a bundle */
        Bundle.prototype._loadBundle = function (key, target, t, promise, handler) {
            var _this = this;
            Bundle.load(target, this._assets.prefix, handler).then(function (bundle) {
                _this._loaded += 1;
                var asset = {
                    url: null,
                    data: bundle,
                    type: 3 /* BUNDLE */
                };
                _this[key] = bundle;
                _this._dispatchTick(asset, promise, handler);
            });
        };
        return Bundle;
    })();
    xn.Bundle = Bundle;

    
})(xn || (xn = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="xhr.ts"/>
/// <reference path="assets.ts"/>
/// <reference path="asset_loader.ts"/>
/// <reference path="image.ts"/>
/// <reference path="json.ts"/>
/// <reference path="bundle.ts"/>
/// <reference path="__init__.ts"/>
var xn;
(function (xn) {
    (function (prim) {
        // Utility functions
        var Utility = (function () {
            function Utility() {
            }
            // Check if a function
            Utility.isFunc = function (target) {
                return !!(target && target.constructor && target.call && target.apply);
            };

            // Check if an object
            Utility.isObj = function (target) {
                return (!!target) && (typeof (target) === 'object');
            };

            // Check if object is a promise
            Utility.isPromise = function (target) {
                return target instanceof Promise;
            };
            return Utility;
        })();
        prim.Utility = Utility;

        // Safe aggregate of objects
        var Collection = (function () {
            function Collection() {
                // Actual data
                this._data = [];
            }
            // Add an item
            Collection.prototype.add = function (item) {
                this._data.push(item);
                return item.child;
            };

            // Any items left?
            Collection.prototype.any = function () {
                return this._data.length;
            };

            // Get the next item or raise exception
            Collection.prototype.next = function () {
                if (this._data.length == 0) {
                    throw new xn.Error('Invalid attempt read empty dataset');
                }
                return this._data.shift();
            };
            return Collection;
        })();
        prim.Collection = Collection;

        // Promise states
        (function (State) {
            State[State["PENDING"] = 0] = "PENDING";
            State[State["FORFILLED"] = 1] = "FORFILLED";
            State[State["REJECTED"] = 2] = "REJECTED";
        })(prim.State || (prim.State = {}));
        var State = prim.State;

        // A promised action set and its associated promise
        var Promised = (function () {
            function Promised(resolve, reject) {
                this.resolve = resolve;
                this.reject = reject;
                this.child = new Promise();
                this.accept = true;
            }
            return Promised;
        })();
        prim.Promised = Promised;

        // The internal state collections of a promise
        var Internal = (function () {
            function Internal() {
                this.state = 0 /* PENDING */;
                this.children = new Collection();
                Internal._id += 1;
                this.id = Internal._id;
            }
            Internal._id = 0;
            return Internal;
        })();
        prim.Internal = Internal;
    })(xn.prim || (xn.prim = {}));
    var prim = xn.prim;

    // Promise type
    var Promise = (function () {
        function Promise() {
            // Internal state collection
            this._state = new prim.Internal();
        }
        // Chain promises
        Promise.prototype.then = function (resolve, reject) {
            if (typeof resolve === "undefined") { resolve = undefined; }
            if (typeof reject === "undefined") { reject = undefined; }
            return this._state.children.add(new prim.Promised(resolve, reject));
        };

        // Resolve this promise
        Promise.prototype.resolve = function (value) {
            var _this = this;
            if (typeof value === "undefined") { value = undefined; }
            if (this._state.state == 0 /* PENDING */) {
                if (this === value) {
                    throw TypeError('Cannot resolve promise with itself');
                }
                this._state.value = value;
                this._state.state = 1 /* FORFILLED */;
                xn.asap(function () {
                    Promise._resolvePromise(_this, value);
                });
            }
            return this;
        };

        // Reject this promise
        Promise.prototype.reject = function (reason) {
            var _this = this;
            if (typeof reason === "undefined") { reason = undefined; }
            if (this._state.state == 0 /* PENDING */) {
                if (this === reason) {
                    throw TypeError('Cannot reject promise with itself');
                }
                this._state.reason = reason;
                this._state.state = 2 /* REJECTED */;
                xn.asap(function () {
                    Promise._resolvePromise(_this, reason);
                });
            }
            return this;
        };

        // Run the resolution action for a promise, and return the correct return value
        Promise.prototype._executePromisedAction = function (promised) {
            try  {
                var action = null;
                var value;
                if (promised.accept) {
                    value = this._state.value;
                    action = promised.resolve;
                } else {
                    value = this._state.reason;
                    action = promised.reject;
                }
                if (prim.Utility.isFunc(action)) {
                    return action(value);
                } else {
                    return value;
                }
            } catch (e) {
                promised.accept = false;
                return e;
            }
        };

        // Run the next promise resolution for this promise
        // Update internal promise state from the result
        // @return true if a new next promise should be scheduled
        Promise.prototype._nextPromisedAction = function () {
            var rtn = false;
            if (this._state.state != 0 /* PENDING */) {
                if (this._state.children.any()) {
                    rtn = true; // If we have an action, we need to poll for actions added by children
                    var promised = this._state.children.next();
                    promised.accept = this._state.state == 1 /* FORFILLED */;
                    var promise_rtn = this._executePromisedAction(promised);

                    try  {
                        if (promised.accept) {
                            var child = promised.child;
                            child.resolve(promise_rtn);
                        } else {
                            var child = promised.child;
                            child.reject(promise_rtn);
                        }
                    } catch (e) {
                        promised.child.reject(e);

                        // An error of this type rejects this promise too for
                        // the rest of the internal promise chain
                        this._state.state = 2 /* REJECTED */;
                        this._state.reason = e;
                    }
                }
            }
            return rtn;
        };

        // Fullfill this promise with the given value
        Promise.prototype._fullfillPromise = function () {
            var _this = this;
            if (this._nextPromisedAction()) {
                xn.asap(function () {
                    _this._fullfillPromise();
                });
            }
        };

        // Compliant resolve promise.
        Promise._resolvePromise = function (promise, value) {
            if (prim.Utility.isPromise(value)) {
                promise._state.state = value._state.state;
            } else if (prim.Utility.isFunc(value) || prim.Utility.isObj(value)) {
                try  {
                    var then = value.then;
                    if (prim.Utility.isFunc(then)) {
                        var resolved = false;
                        try  {
                            then.call(value, function (v) {
                                if (!resolved) {
                                    resolved = true;
                                    Promise._resolvePromise(promise, v);
                                }
                            }, function (r) {
                                if (!resolved) {
                                    resolved = true;
                                    Promise._resolvePromise(promise, r);
                                }
                            });
                        } catch (e) {
                            if (!resolved) {
                                resolved = true;
                                promise._state.state = 2 /* REJECTED */;
                                promise._state.state = e;
                                promise._fullfillPromise();
                            }
                        }
                    } else {
                        promise._fullfillPromise();
                    }
                } catch (e) {
                    promise._state.state = 2 /* REJECTED */;
                    promise._state.state = e;
                    promise._fullfillPromise();
                }
            } else {
                promise._fullfillPromise();
            }
        };
        return Promise;
    })();
    xn.Promise = Promise;

    /* Invoke an async callback */
    function asap(target) {
        setTimeout(target, 0);
    }
    xn.asap = asap;
})(xn || (xn = {}));
/// <reference path="promise.ts"/>
/// <reference path="interfaces/__init__.ts"/>
/// <reference path="data/__init__.ts"/>
/// <reference path="geom/__init__.ts"/>
/// <reference path="viewports/__init__.ts"/>
/// <reference path="events/__init__.ts"/>
/// <reference path="logger/__init__.ts"/>
/// <reference path="errors/__init__.ts"/>
/// <reference path="random/__init__.ts"/>
/// <reference path="assets/__init__.ts"/>
/// <reference path="promise/__init__.ts"/>
/// <reference path="../../../lib/xn/src/xn/__init__.ts"/>
