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
/// <reference path="../__init__.ts"/>
/// <reference path="textures.ts"/>
/// <reference path="pixi/__init__.ts"/>
/// <reference path="tiled/__init__.ts"/>
/// <reference path="box2d/__init__.ts"/>
/// <reference path="texture_packer/__init__.ts"/>
/// <reference path="../../../public/js/xn.d.ts"/>
/// <reference path="../../../public/js/dsync.d.ts"/>
/// <reference path="../../../lib/xn/src/xx/__init__.ts"/>
