/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (anim) {
        

        

        /* State information */
        (function (AnimState) {
            AnimState[AnimState["ENTER"] = 0] = "ENTER";
            AnimState[AnimState["EXIT"] = 1] = "EXIT";
            AnimState[AnimState["ACTIVE"] = 2] = "ACTIVE";
        })(anim.AnimState || (anim.AnimState = {}));
        var AnimState = anim.AnimState;

        /* Looking after the current value of an animation state */
        var AnimInfo = (function () {
            function AnimInfo() {
            }
            return AnimInfo;
        })();
        anim.AnimInfo = AnimInfo;
    })(xx.anim || (xx.anim = {}));
    var anim = xx.anim;
})(xx || (xx = {}));
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (anim) {
        /* Keep track of a set of animation states */
        var Animation = (function () {
            function Animation() {
                /* The set of named states */
                this._groups = new xn.Map();
                /* This is the state to transition to */
                this._target = null;
                /* This is the state currently active */
                this._current = null;
            }
            /*
            * Step the current animation
            * @param dt The time since the last frame.
            * @return True if a frame redraw is required.
            */
            Animation.prototype.step = function (dt) {
                var redraw = false;

                // If there is no state information, do nothing
                if (this._current == null && this._target == null) {
                    return false;
                } else if (this._current == null && this._target != null) {
                    this._transition(this._target, 0 /* ENTER */);
                    redraw = true;
                } else if (this._current.state == 1 /* EXIT */ && this._current.complete) {
                    this._transition(this._target, 0 /* ENTER */);
                    redraw = true;
                } else if (this._current.complete) {
                    // If enter is done, enter active
                    if (this._current.state == 0 /* ENTER */) {
                        this._transition(this._current, 2 /* ACTIVE */);
                        redraw = true;
                    } else if (this._current.state == 2 /* ACTIVE */ && this._target) {
                        this._transition(this._current, 1 /* EXIT */);
                        redraw = true;
                    }
                }

                // Otherwise, step the current animation
                if (!redraw) {
                    // Step
                    if (this.state != null) {
                        var output = this.state.step(dt);
                        redraw = output[0];
                        this._current.complete = output[1];
                    } else {
                        this._current.complete = true;
                    }
                }

                return redraw;
            };

            /* Transition to the _target animation state */
            Animation.prototype._transition = function (target, state) {
                this.name = target.group.name;
                this._current = target;
                this._current.state = state;
                this._current.complete = false;
                switch (this._current.state) {
                    case 0 /* ENTER */:
                        this.state = this._current.group.enter;
                        break;
                    case 2 /* ACTIVE */:
                        this.state = this._current.group.active;
                        break;
                    case 1 /* EXIT */:
                        this.state = this._current.group.exit;
                        break;
                    default:
                        throw new xn.Error("Invalid state request: " + state);
                }
                if (this.state != null) {
                    this.state.reset();
                    this.state.step(0);
                }
                if (this._target == target) {
                    this._target = null;
                }
            };

            /* Start transitioning to this new animation state */
            Animation.prototype.set = function (state) {
                if (!this._groups.hasKey(state)) {
                    throw new xn.Error('Invalid state "' + state + '" is unknown on this type"');
                }
                this._target = {
                    group: this._groups.get(state),
                    complete: false,
                    state: 0 /* ENTER */
                };
            };

            /* Add a named animation state */
            Animation.prototype.bind = function (group) {
                this._groups.set(group.name, group);
            };
            return Animation;
        })();
        anim.Animation = Animation;
    })(xx.anim || (xx.anim = {}));
    var anim = xx.anim;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="anim.ts"/>
/// <reference path="animation.ts"/>
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (pixi) {
        

        /* A wrapper around the pixi stage with some extra stuff */
        var Stage = (function () {
            /* Create a new canvas using the given size and viewport. */
            function Stage(target, world, display, background) {
                if (typeof background === "undefined") { background = 0xffffff; }
                /* The current viewport for the stage */
                this.view = null;
                /* Actions to invoke every step */
                this._actions = [];
                /* Are we running? */
                this._running = false;
                if (Stage.instance != null) {
                    throw Error('Only one stage can exist on a single page');
                }
                this.stage = new PIXI.Stage(background);
                this._renderer = PIXI.autoDetectRenderer(display.x, display.y);
                this.sync = new dsync.Sync();
                this.action(function (s) {
                    s.redraw();
                });
                this.action(function (s) {
                    s.sync.update();
                });
                this.view = new xn.StaticViewport(world, display);
                target.appendChild(this._renderer.view);
                Stage.instance = this;
            }
            /*
            * Create a new stage if we don't want a reference
            *
            * Since this is a safe operation to call multiple times, it also comes with the
            * onCreate helper to invoke one-time unsafe operations when the staging *is* actually
            * created. This function will only be invoked if a new stage is created.
            *
            * @param ... as per constructor
            * @param onCreate Run only if a stage is actually created.
            */
            Stage.init = function (target, world, display, background, onCreate) {
                if (typeof background === "undefined") { background = 0xffffff; }
                if (typeof onCreate === "undefined") { onCreate = null; }
                if (Stage.instance == null) {
                    Stage.instance = new Stage(target, world, display, background);
                    if (onCreate != null) {
                        onCreate(Stage.instance);
                    }
                }
                return Stage.instance;
            };

            /* Add a stagable to the stage */
            Stage.prototype.add = function (channel, stagable) {
                stagable.attach(channel, this);
            };

            /* Animation step worker */
            Stage.prototype._worker = function () {
                var _this = this;
                if (this.__worker == null) {
                    this.__worker = function () {
                        for (var i = 0; i < _this._actions.length; ++i) {
                            _this._actions[i](_this);
                        }
                        if (_this._running) {
                            requestAnimationFrame(_this.__worker);
                        }
                    };
                }
                return this.__worker;
            };

            /* Redraw */
            Stage.prototype.redraw = function () {
                this._renderer.render(this.stage);
            };

            /* Add another callback to invoke every step */
            Stage.prototype.action = function (action) {
                this._actions.unshift(action);
            };

            Stage.prototype.start = function () {
                if (!this._running) {
                    this._running = true;
                    requestAnimationFrame(this._worker());
                }
            };

            Stage.prototype.stop = function () {
                this._running = false;
            };
            Stage.instance = null;
            return Stage;
        })();
        pixi.Stage = Stage;
    })(xx.pixi || (xx.pixi = {}));
    var pixi = xx.pixi;
})(xx || (xx = {}));
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (pixi) {
        /* Common base state model */
        var BaseModel = (function () {
            /* Notice that data population is async */
            function BaseModel(data) {
                if (typeof data === "undefined") { data = {}; }
                var _this = this;
                /* Is the model still alive? */
                this.dead = false;
                /* Has the model / display initialization happened yet? */
                this.ready = false;
                xn.asap(function () {
                    if (data != null) {
                        for (var key in data) {
                            if (xn.data.has(_this, key)) {
                                _this[key] = data[key];
                            }
                        }
                    }
                });
            }
            return BaseModel;
        })();
        pixi.BaseModel = BaseModel;

        /* Common base display model */
        var BaseDisplay = (function () {
            /* Notice that data population is async */
            function BaseDisplay(data) {
                if (typeof data === "undefined") { data = {}; }
                var _this = this;
                this.stage = xx.pixi.Stage.instance;
                xn.asap(function () {
                    if (data != null) {
                        for (var key in data) {
                            if (xn.data.has(_this, key)) {
                                _this[key] = data[key];
                            }
                        }
                    }
                });
            }
            return BaseDisplay;
        })();
        pixi.BaseDisplay = BaseDisplay;
    })(xx.pixi || (xx.pixi = {}));
    var pixi = xx.pixi;
})(xx || (xx = {}));
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (pixi) {
        /* Avoid namespace clutter */
        (function (background) {
            /* Model for the background widget */
            var Model = (function () {
                function Model(url) {
                    this.ready = false;
                    this.dead = false;
                    this.source = url;
                }
                return Model;
            })();
            background.Model = Model;

            /* Display for the background */
            var Display = (function () {
                function Display() {
                    this.sprite = null;
                }
                return Display;
            })();
            background.Display = Display;
        })(pixi.background || (pixi.background = {}));
        var background = pixi.background;

        /* Sets a large static background for the whole canvas */
        var Background = (function () {
            /*
            * Create a background widget
            * @param url The url for the background to display.
            */
            function Background(url) {
                this.model = new xx.pixi.background.Model(url);
                this.display = new xx.pixi.background.Display();
            }
            Background.prototype.attach = function (channel, stage) {
                stage.sync.add(channel, this.model, this.display, Background.sync, Background.state);
            };

            Background.create = function (model, display) {
                model.ready = true;
                model.stage = xx.pixi.Stage.instance;
                display.sprite = PIXI.Sprite.fromImage(model.source);
                display.sprite.width = model.stage.view.display.x;
                display.sprite.height = model.stage.view.display.y;
                model.stage.stage.addChild(display.sprite);
            };

            Background.destroy = function (model, display) {
                model.stage.stage.removeChild(display.sprite);
                display.sprite = null;
            };

            Background.sync = function (model, display, changed, dt) {
                if (!model.ready) {
                    Background.create(model, display);
                }
                if (model.dead) {
                    Background.destroy(model, display);
                }
                return !model.dead;
            };

            Background.state = function (model, display, dt) {
                return [model.source, model.dead];
            };
            return Background;
        })();
        pixi.Background = Background;
    })(xx.pixi || (xx.pixi = {}));
    var pixi = xx.pixi;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
var xx;
(function (xx) {
    (function (pixi) {
        (function (box2d) {
            /* Avoid namespace clutter */
            (function (_body) {
                /* Model for the background widget */
                var Model = (function () {
                    function Model(body, parent) {
                        this.body = false;
                        this.body = body;
                        this.ready = false;
                        this.parent = parent;
                        this.dead = false;
                    }
                    return Model;
                })();
                _body.Model = Model;

                /* Display for the background */
                var Display = (function () {
                    function Display() {
                        this.gc = null;
                    }
                    return Display;
                })();
                _body.Display = Display;
            })(box2d.body || (box2d.body = {}));
            var body = box2d.body;

            /* Sets a large static background for the whole canvas */
            var Body = (function () {
                /*
                * Create a background widget
                * @param url The url for the background to display.
                */
                function Body(body) {
                    this.model = new xx.pixi.box2d.body.Model(body, this);
                    this.display = new xx.pixi.box2d.body.Display();
                }
                Body.prototype.attach = function (channel, stage) {
                    stage.sync.add(channel, this.model, this.display, this.sync, this.state);
                };

                Body.prototype.create = function (model, display) {
                    model.ready = true;
                    var bounds = model.body.data;
                    var stage = xx.pixi.Stage.instance;
                    var size = stage.view.size(bounds.size, 1 /* DISPLAY */);
                    display.gc = new PIXI.Graphics();
                    display.gc.beginFill(xn.random.color());
                    display.gc.drawRect(-size.x / 2, -size.y / 2, size.x, size.y);
                    display.gc.endFill();
                    stage.stage.addChild(display.gc);
                };

                Body.prototype.destroy = function (model, display) {
                    xx.pixi.Stage.instance.stage.removeChild(display.gc);
                    display.gc = null;
                };

                Body.prototype.sync = function (model, display, changed, dt) {
                    if (!model.ready) {
                        model.parent.create(model, display);
                    }
                    if (model.dead) {
                        model.parent.destroy(model, display);
                    }
                    var pos = xx.pixi.Stage.instance.view.point(model.body.data.pos, 1 /* DISPLAY */);
                    display.gc.position.x = pos.x;
                    display.gc.position.y = pos.y;
                    display.gc.rotation = -model.body.data.angle;
                    return !model.dead;
                };

                Body.prototype.state = function (model, display, dt) {
                    return [model.body.data.pos.x, model.body.data.pos.y];
                };
                return Body;
            })();
            box2d.Body = Body;
        })(pixi.box2d || (pixi.box2d = {}));
        var box2d = pixi.box2d;
    })(xx.pixi || (xx.pixi = {}));
    var pixi = xx.pixi;
})(xx || (xx = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../__init__.ts"/>
var xx;
(function (xx) {
    (function (pixi) {
        (function (box2d) {
            /* Sets a large static background for the whole canvas */
            var Bound = (function (_super) {
                __extends(Bound, _super);
                function Bound() {
                    _super.apply(this, arguments);
                }
                Bound.prototype.create = function (model, display) {
                    _super.prototype.create.call(this, model, display);
                    display.gc.alpha = 0.1;
                };
                return Bound;
            })(xx.pixi.box2d.Body);
            box2d.Bound = Bound;
        })(pixi.box2d || (pixi.box2d = {}));
        var box2d = pixi.box2d;
    })(xx.pixi || (xx.pixi = {}));
    var pixi = xx.pixi;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="body.ts"/>
/// <reference path="bound.ts"/>
/// <reference path="../__init__.ts"/>
/// <reference path="stage.ts"/>
/// <reference path="base.ts"/>
/// <reference path="background.ts"/>
/// <reference path="box2d/__init__.ts"/>
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (tiled) {
        /*
        * Loads and handles a Tiled json format file
        * Bounds are loaded from objects of type 'bound'
        * Markers are loaded from objects of type 'marker'
        */
        var Level = (function () {
            /*
            * Load tiled level data from the given data JSON object
            * @param data The data from a json export of a tiled level.
            */
            function Level(data) {
                /* Set of bounding  boxes for the level */
                this.bounds = new xn.List();
                /* Set of named markers on the map */
                this.markers = new xn.Map();
                this.width = data.width * data.tilewidth;
                this.height = data.height * data.tileheight;
                for (var i = 0; i < data.layers.length; ++i) {
                    if (data.layers[i].type == 'objectgroup') {
                        var layer_data = data.layers[i].objects;
                        for (var j = 0; j < layer_data.length; ++j) {
                            var q = new xn.Quad(layer_data[j].x, layer_data[j].y, layer_data[j].width, layer_data[j].height);
                            if (layer_data[j].type == 'bound') {
                                this.bounds.push(q);
                            } else if (layer_data[j].type == 'marker') {
                                if (!this.markers.hasKey(layer_data[j].name)) {
                                    this.markers.set(layer_data[j].name, new xn.List());
                                }
                                var list = this.markers.get(layer_data[j].name);
                                list.push(q);
                            }
                        }
                    }
                }
            }
            /*
            * Rescale this level to new bounds
            * @param width The new width
            * @param height The new height
            * @param invertY Invert the Y axis to be (0,0) center compliant
            */
            Level.prototype.resize = function (width, height, invertY) {
                var _this = this;
                if (typeof invertY === "undefined") { invertY = true; }
                var xfactor = width / this.width;
                var yfactor = height / this.height;
                this.width = width;
                this.height = height;
                this.markers.map(function (l) {
                    l.map(function (q) {
                        q.pos.x = q.pos.x * xfactor;
                        q.pos.y = _this.height - q.pos.y * yfactor;
                        q.size.x = q.size.x * xfactor;
                        q.size.y = q.size.y * yfactor;
                        return q;
                    });
                    return l;
                });
                this.bounds.map(function (q) {
                    q.pos.x = q.pos.x * xfactor;
                    q.pos.y = _this.height - q.pos.y * yfactor;
                    q.size.x = q.size.x * xfactor;
                    q.size.y = q.size.y * yfactor;
                    return q;
                });
            };

            /* Offset the whole world by a certain amount to helpfully recenter it */
            Level.prototype.offset = function (x, y) {
                this.markers.map(function (l) {
                    l.map(function (q) {
                        q.pos.x += x;
                        q.pos.y += y;
                        return q;
                    });
                    return l;
                });
                this.bounds.map(function (q) {
                    q.pos.x += x;
                    q.pos.y += y;
                    return q;
                });
            };
            return Level;
        })();
        tiled.Level = Level;
    })(xx.tiled || (xx.tiled = {}));
    var tiled = xx.tiled;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="level.ts"/>
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (box2d) {
        /* Possible types of bodies */
        (function (BodyType) {
            BodyType[BodyType["STATIC"] = 0] = "STATIC";
            BodyType[BodyType["DYNAMIC"] = 1] = "DYNAMIC";
        })(box2d.BodyType || (box2d.BodyType = {}));
        var BodyType = box2d.BodyType;

        /* Box2D world helper */
        var World = (function () {
            /* Create a world */
            function World() {
                var gravity = new Box2D.b2Vec2(0.0, -9.8);
                var world = new Box2D.b2World(gravity, true);
                this.world = world;
            }
            // TODO: Implement the contacts watch again
            World.prototype._contactWatcher = function () {
                // Contacts watcher
                var listener = new Box2D.b2ContactListener();
                Box2D.customizeVTable(listener, [
                    {
                        original: Box2D.b2ContactListener.prototype.BeginContact,
                        replacement: function (thsPtr, contactPtr) {
                            var contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
                            var fixtureA = contact.GetFixtureA();
                            var fixtureB = contact.GetFixtureB();
                            if ((fixtureA.GetBody().data.meta == 0) || (fixtureB.GetBody().data.meta == 0)) {
                                var block = fixtureA.GetBody().data.meta == 1 ? fixtureA.GetBody().data : fixtureB.GetBody().data;
                                block.ground = true;
                            }
                        }
                    }
                ]);
                this.world.SetContactListener(listener);
            };

            /* Create a body for the given block */
            World.prototype.createBody = function (block, type, density, friction, restitution) {
                if (typeof type === "undefined") { type = 1 /* DYNAMIC */; }
                if (typeof density === "undefined") { density = 1; }
                if (typeof friction === "undefined") { friction = 1; }
                if (typeof restitution === "undefined") { restitution = 1; }
                // Smarter defaults for bound objects
                density = type == 1 /* DYNAMIC */ ? friction : 0;
                restitution = type == 1 /* DYNAMIC */ ? friction : 0;

                // Remember box2D uses half-width bounds for SetAsBox.
                var shape = new Box2D.b2PolygonShape();
                shape.SetAsBox(block.size.x / 2.0, block.size.y / 2.0);

                // Create a fixture
                var fixtureDef = new Box2D.b2FixtureDef();
                fixtureDef.set_density(density);
                fixtureDef.set_restitution(restitution);
                fixtureDef.set_friction(friction);
                fixtureDef.set_shape(shape);

                // Box2D shapes are centered, not toplevel
                var pos = new Box2D.b2Vec2(block.pos.x + block.size.x / 2, block.pos.y - block.size.y / 2);

                // Create~
                var bd = new Box2D.b2BodyDef();
                var body_type = type == 1 /* DYNAMIC */ ? Box2D.b2_dynamicBody : Box2D.b2_staticBody;
                bd.set_type(body_type);
                bd.set_position(pos);

                var body = this.world.CreateBody(bd);
                body.CreateFixture(fixtureDef);
                body.data = block;
                return body;
            };

            /* Apply a force to a given body */
            World.prototype.applyForce = function (body, force) {
                // see: http://www.iforce2d.net/b2dtut/forces
                body.ApplyForce(new Box2D.b2Vec2(force.x, force.y), body.GetWorldCenter());
            };

            /* Apply an impluse (immediate force) to a given body */
            World.prototype.applyImpulse = function (body, force) {
                // see: http://www.iforce2d.net/b2dtut/forces
                body.ApplyLinearImpulse(new Box2D.b2Vec2(force.x, force.y), body.GetWorldCenter());
            };

            /* Destroy a body */
            World.prototype.destroyBody = function (body) {
                this.world.DestroyBody(body);
            };

            /* Read geometry from a body */
            World.prototype.readGeometry = function (body, block) {
                if (block) {
                    var bpos = body.GetPosition();
                    block.pos.x = bpos.get_x();
                    block.pos.y = bpos.get_y();
                    block.angle = body.GetAngle();
                }
            };

            /* Timestep */
            World.prototype.step = function (dt) {
                this.world.Step(1 / 60, 6, 2);
                var body = this.world.GetBodyList();
                while (body.a != 0) {
                    this.readGeometry(body, body.data);
                    body = body.GetNext();
                }
            };
            return World;
        })();
        box2d.World = World;
    })(xx.box2d || (xx.box2d = {}));
    var box2d = xx.box2d;
})(xx || (xx = {}));
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (box2d) {
        /* Box2D world helper */
        var TiledWorld = (function (_super) {
            __extends(TiledWorld, _super);
            /* Create a world from a tiled map */
            function TiledWorld(level) {
                _super.call(this);
                /* The set of static bounds, for visualization, etc. */
                this.bounds = new xn.List();
                this.level = level;
                this._addStaticBounds();
            }
            /* Add static bounds from the level */
            TiledWorld.prototype._addStaticBounds = function () {
                var _this = this;
                this.level.bounds.each(function (bound) {
                    var quad = bound.clone();
                    _this.bounds.push(_this.createBody(quad, 0 /* STATIC */));
                });
            };

            /* Create a dynamic body representing a given marker and return the body for it */
            TiledWorld.prototype.addMarker = function (name, density, friction, restitution) {
                if (typeof density === "undefined") { density = 1; }
                if (typeof friction === "undefined") { friction = 1; }
                if (typeof restitution === "undefined") { restitution = 1; }
                var value = this.level.markers.get(name);
                if (value.length()) {
                    var quad = value.shift();
                    return this.createBody(quad, density, friction, restitution);
                } else {
                    xn.console.warn('Invalid marker "' + name + '" was not found on level');
                }
                return null;
            };

            /* Create a set of dynamic bodies representing a given marker and return the bodies for them */
            TiledWorld.prototype.addMarkers = function (name, density, friction, restitution) {
                var _this = this;
                if (typeof density === "undefined") { density = 1; }
                if (typeof friction === "undefined") { friction = 1; }
                if (typeof restitution === "undefined") { restitution = 1; }
                var rtn = new xn.List();
                var value = this.level.markers.get(name);
                if (value) {
                    value.each(function (quad) {
                        rtn.push(_this.createBody(quad, density, friction, restitution));
                    });
                    return rtn;
                } else {
                    xn.console.warn('Invalid marker "' + name + '" was not found on level');
                }
                return null;
            };
            return TiledWorld;
        })(xx.box2d.World);
        box2d.TiledWorld = TiledWorld;
    })(xx.box2d || (xx.box2d = {}));
    var box2d = xx.box2d;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="world.ts"/>
/// <reference path="tiled_world.ts"/>
/// <reference path="__init__.ts"/>
var xx;
(function (xx) {
    (function (texture_packer) {
        

        /* Loads and handles a TexturePacker json 'hash' format file */
        var Textures = (function () {
            /*
            * Load tiled level data from the given data JSON object
            *
            * Note that if the given image is not the same size as the texture json
            * block the results are scaled down to match, but this may result in some
            * edges 'bleeding' into each other unless the sprite spacing is sufficient.
            *
            * @param data The data from a json export of a texture packer texture.
            * @param image The image instance.
            */
            function Textures(data, image) {
                /* The same of named animations on this sheet */
                this.sprites = {};
                this._rw = data.meta.size.w;
                this._rh = data.meta.size.h;
                this._image = image;
                this.width = image.width;
                this.height = image.height;
                var tmp = {};
                for (var key in data.frames) {
                    var info = this._parse(key);
                    var items = this._data(tmp, info[0]);
                    info.push(this._frame(data.frames[key]));
                    items.push(info);
                }
                for (var key in tmp) {
                    var raw = tmp[key];
                    raw.sort(function (a, b) {
                        return a[1] - b[1];
                    });
                    this.sprites[key] = [];
                    for (var i = 0; i < raw.length; ++i) {
                        var record = raw[i][2];
                        this._resize(record);
                        this.sprites[key].push(record);
                    }
                }
            }
            /* Resize from sheet size to actual size */
            Textures.prototype._resize = function (frame) {
                var fx = this.width / this._rw;
                var fy = this.height / this._rh;
                frame.x = Math.floor(frame.x * fx);
                frame.y = Math.floor(frame.y * fy);
                frame.dx = Math.floor(frame.dx * fx);
                frame.dy = Math.floor(frame.dy * fy);
            };

            /* Extract a frame reference from a node */
            Textures.prototype._frame = function (data) {
                return {
                    x: data.frame.x,
                    y: data.frame.y,
                    dx: data.frame.w,
                    dy: data.frame.h
                };
            };

            /* Extract the master (name, index) from a sprite name */
            Textures.prototype._parse = function (src) {
                var name = src.split('.')[0];
                var bits = name.split('__');
                return [bits[0], parseInt(bits[1])];
            };

            /* Access the data array of a given name */
            Textures.prototype._data = function (items, name) {
                if (!(name in items)) {
                    items[name] = [];
                }
                return items[name];
            };

            /* Create a new PIXI texture for this pack */
            Textures.prototype.texture = function () {
                var frame = new PIXI.Rectangle(0, 0, 1, 1);
                var base = new PIXI.BaseTexture(this._image);
                var texture = new PIXI.Texture(base, frame);
                return texture;
            };
            return Textures;
        })();
        texture_packer.Textures = Textures;
    })(xx.texture_packer || (xx.texture_packer = {}));
    var texture_packer = xx.texture_packer;
})(xx || (xx = {}));
var xx;
(function (xx) {
    (function (texture_packer) {
        /* An animation using frames */
        var FrameAnim = (function () {
            function FrameAnim(data, t) {
                /* Time since last frame */
                this.elapsed = 0;
                this.frame = 0;
                this.frames = t.sprites[data.name];
                this.duration = data.duration;
                this.name = data.name;
                this.forwards = data.forwards;
                this.repeat = data.repeat;
                this.frameLength = this.duration / this.frames.length;
                if (this.frameLength == 0) {
                    this.frameLength = 1;
                }
            }
            /* Return data for this animation state */
            FrameAnim.prototype.state = function () {
                if (!this.forwards) {
                    return this.frames[this.frames.length - 1 - this.frame];
                }
                return this.frames[this.frame];
            };

            /* Update animation state */
            FrameAnim.prototype.step = function (dt) {
                var previous = this.frame;

                // Determine the number of steps passed
                this.elapsed += dt;
                var steps = Math.floor(this.elapsed / this.frameLength);
                this.elapsed -= steps * this.frameLength;

                // New frame
                var new_frame = this.frame + steps;

                // Are we finished with this animation yet?
                var completed = new_frame >= (this.frames.length - 1);

                // If repeating, sync on edges
                if (this.repeat) {
                    if (new_frame >= this.frames.length) {
                        new_frame = new_frame % this.frames.length;
                    }
                } else if (new_frame > (this.frames.length - 1)) {
                    new_frame = this.frames.length - 1;
                }

                // Update current frame
                this.frame = new_frame;
                return [this.frame != previous, completed];
            };

            /* Reset this animation */
            FrameAnim.prototype.reset = function () {
                this.frame = 0;
                this.elapsed = 0;
            };
            return FrameAnim;
        })();
        texture_packer.FrameAnim = FrameAnim;
    })(xx.texture_packer || (xx.texture_packer = {}));
    var texture_packer = xx.texture_packer;
})(xx || (xx = {}));
var xx;
(function (xx) {
    (function (texture_packer) {
        /* Keep track of a set of animation states */
        var FrameAnimation = (function (_super) {
            __extends(FrameAnimation, _super);
            function FrameAnimation() {
                _super.apply(this, arguments);
                /* The set of texture data for this object */
                this._textures = null;
            }
            /*
            * Load from a data file
            * Assumes a file format like:
            *
            *   {
            *     walk: {
            *       enter: { name: 'anim_start', duration: 1000, repeat: 0, forwards: true },
            *       active: { name: 'anim_walk', duration: 500, repeat: 0, forwards: true },
            *       exit: { name: 'anim_stop', duration: 1000, repeat: 0, forwards: true }
            *     },
            *     jump: { ... },
            *     ...
            *   }
            *
            * Where the names are animation sequences from the associated Textures object.
            * NB. Textures strips the .png etc. from the file names.
            */
            FrameAnimation.prototype.load = function (data, textures) {
                this._textures = textures;
                for (var key in data) {
                    this.add(key, data[key].enter, data[key].active, data[key].exit, textures);
                }
            };

            /* Add a single specific animation group to this object */
            FrameAnimation.prototype.add = function (name, enter, active, exit, textures) {
                this.bind({
                    name: name,
                    enter: enter == null ? null : new xx.texture_packer.FrameAnim(enter, textures),
                    active: active == null ? null : new xx.texture_packer.FrameAnim(active, textures),
                    exit: exit == null ? null : new xx.texture_packer.FrameAnim(exit, textures)
                });
            };

            /* Helper to return the texture for this data set */
            FrameAnimation.prototype.texture = function () {
                return this._textures.texture();
            };
            return FrameAnimation;
        })(xx.anim.Animation);
        texture_packer.FrameAnimation = FrameAnimation;
    })(xx.texture_packer || (xx.texture_packer = {}));
    var texture_packer = xx.texture_packer;
})(xx || (xx = {}));
/// <reference path="../__init__.ts"/>
/// <reference path="textures.ts"/>
/// <reference path="frame_anim.ts"/>
/// <reference path="frame_animation.ts"/>
/// <reference path="anim/__init__.ts"/>
/// <reference path="pixi/__init__.ts"/>
/// <reference path="tiled/__init__.ts"/>
/// <reference path="box2d/__init__.ts"/>
/// <reference path="texture_packer/__init__.ts"/>
/// <reference path="../../../public/js/xn.d.ts"/>
/// <reference path="../../../public/js/dsync.d.ts"/>
/// <reference path="../../../lib/xn/src/xx/__init__.ts"/>
