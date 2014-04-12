var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="__init__.ts"/>
var demo;
(function (demo) {
    /* Player sprite type */
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(assets, body) {
            this.assets = assets;
            _super.call(this, body);
        }
        Player.prototype.create = function (model, display) {
            model.ready = true;
            var bounds = model.body.data;
            var stage = xx.pixi.Stage.instance;
            var size = stage.view.size(bounds.size, 1 /* DISPLAY */);

            var sprite = xx.pixi.factory.sprite(this.assets.player);
            sprite.width = size.x;
            sprite.height = size.y;
            sprite.position.x -= size.x / 2;
            sprite.position.y -= size.y / 2;

            display.gc = new PIXI.DisplayObjectContainer();
            display.gc.addChild(sprite);
            stage.stage.addChild(display.gc);
        };

        Player.prototype.sync = function (model, display, changed, dt) {
            var rtn = _super.prototype.sync.call(this, model, display, changed, dt);
            if (rtn) {
                xx.box2d.World.setTransform(model.body, null, 0);
            }
            return rtn;
        };
        return Player;
    })(xx.pixi.box2d.Body);
    demo.Player = Player;

    /* Mover model */
    var MoverModel = (function (_super) {
        __extends(MoverModel, _super);
        function MoverModel() {
            _super.apply(this, arguments);
            this.acc = 0;
            this.offset = 0;
        }
        return MoverModel;
    })(xx.pixi.box2d.body.Model);
    demo.MoverModel = MoverModel;

    /* Moving platform type */
    var Mover = (function (_super) {
        __extends(Mover, _super);
        function Mover(assets, body) {
            this.assets = assets;
            _super.call(this, body, new demo.MoverModel(body, this));
        }
        Mover.prototype.create = function (model, display) {
            model.ready = true;
            var bounds = model.body.data;
            var stage = xx.pixi.Stage.instance;
            var size = stage.view.size(bounds.size, 1 /* DISPLAY */);

            var sprite = xx.pixi.factory.sprite(this.assets.box);
            sprite.width = size.x;
            sprite.height = size.y;
            sprite.position.x -= size.x / 2;
            sprite.position.y -= size.y / 2;

            display.gc = new PIXI.DisplayObjectContainer();
            display.gc.addChild(sprite);
            stage.stage.addChild(display.gc);
        };

        Mover.prototype.sync = function (model, display, changed, dt) {
            var rtn = _super.prototype.sync.call(this, model, display, changed, dt);
            if (rtn) {
                var m = model;
                m.acc += dt;
                if (m.acc > 30) {
                    m.acc = 0;
                    m.offset += 0.05;
                    var x = -4 + m.offset;
                    xx.box2d.World.setTransform(model.body, { x: x, y: 0 });
                    if (m.offset > 8) {
                        m.offset = 0;
                    }
                }
            }
            return rtn;
        };

        Mover.prototype.state = function (model, display, dt) {
            return null;
        };
        return Mover;
    })(xx.pixi.box2d.Body);
    demo.Mover = Mover;

    /* Star sprite type */
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(assets, body) {
            this.assets = assets;
            _super.call(this, body);
        }
        Star.prototype.create = function (model, display) {
            model.ready = true;
            var bounds = model.body.data;
            var stage = xx.pixi.Stage.instance;
            var size = stage.view.size(bounds.size, 1 /* DISPLAY */);

            var sprite = xx.pixi.factory.sprite(this.assets.star);
            sprite.width = size.x;
            sprite.height = size.y;
            sprite.position.x -= size.x / 2;
            sprite.position.y -= size.y / 2;

            display.gc = new PIXI.DisplayObjectContainer();
            display.gc.addChild(sprite);
            stage.stage.addChild(display.gc);
        };
        return Star;
    })(xx.pixi.box2d.Body);
    demo.Star = Star;
})(demo || (demo = {}));
// <reference path="__init__.ts"/>
var demo;
(function (demo) {
    // Helpers
    var image = function (url) {
        return xn.Bundle.key(2 /* IMAGE */, url);
    };
    var json = function (url) {
        return xn.Bundle.key(1 /* JSON */, url);
    };

    

    /* Basic level assets */
    var AssetBundle = (function (_super) {
        __extends(AssetBundle, _super);
        function AssetBundle() {
            _super.apply(this, arguments);
            this.level = json('/assets/level.json');
            this.player = image('/assets/player.png');
            this.star = image('/assets/star.png');
            this.box = image('/assets/box.png');
            this.background = image('/assets/level.png');
        }
        return AssetBundle;
    })(xn.Bundle);
    demo.AssetBundle = AssetBundle;
})(demo || (demo = {}));
/// <reference path="__init__.ts"/>

var demo;
(function (demo) {
    var WORLD_SIZE = 5.0;
    var Channels;
    (function (Channels) {
        Channels[Channels["DISPLAY"] = 0] = "DISPLAY";
    })(Channels || (Channels = {}));
    (function (Objects) {
        Objects[Objects["PLAYER"] = 0] = "PLAYER";
        Objects[Objects["WALL"] = 1] = "WALL";
        Objects[Objects["STAR"] = 2] = "STAR";
    })(demo.Objects || (demo.Objects = {}));
    var Objects = demo.Objects;

    /* Display model */
    var Model = (function () {
        function Model() {
            this.loading = 'loading';
        }
        return Model;
    })();
    demo.Model = Model;

    /* Display controller */
    var Controller = (function () {
        function Controller(logging) {
            /* The display state */
            this.model = new Model();
            if (logging) {
                var e = document.getElementById("log");
                if (e) {
                    xn.logger.init(new xn.logger.DocumentLogger(e));
                }
            } else {
                xn.logger.init(new xn.logger.DummyLogger());
            }
            this.context = syn.context().watch(this.model, document.getElementById('content'));
        }
        /* Load the level and display it */
        Controller.prototype.go = function (assets) {
            var _this = this;
            var size = { x: WORLD_SIZE, y: WORLD_SIZE };
            var display = { x: 610, y: 610 };
            var target = document.getElementById('content');
            var stage = new xx.pixi.Stage(target, size, display);

            stage.sync.channel(0 /* DISPLAY */, true, true);
            stage.add(0 /* DISPLAY */, new xx.pixi.Background(assets.background.src));

            // Load level
            var level = new xx.tiled.Level(assets.level);
            level.resize(WORLD_SIZE, WORLD_SIZE);
            level.offset(-WORLD_SIZE / 2, -WORLD_SIZE / 2);

            // Load bounds
            var world = new xx.box2d.TiledWorld(level);
            world.bounds.each(function (b) {
                b.meta = 1 /* WALL */;
                stage.add(0 /* DISPLAY */, new xx.pixi.box2d.Bound(b));
            });
            stage.action(function (stage) {
                world.step(0);
            });

            // Add items from map
            var body = world.addMarker('player', 1, 1, 0.25);
            body.meta = 0 /* PLAYER */;
            stage.add(0 /* DISPLAY */, new demo.Player(assets, body));

            var stars = world.addMarkers('star', 1, 1, 0.02);
            stars.each(function (b) {
                b.meta = 2 /* STAR */;
                stage.add(0 /* DISPLAY */, new demo.Star(assets, b));
            });

            // Add a special movey platform
            var quad = new xn.Quad(-5, 0, 2, 0.2, 0);
            var mover = world.createBody(quad, 0 /* STATIC */, 0, 0, 1);
            stage.add(0 /* DISPLAY */, new demo.Mover(assets, mover));

            // Collision detection
            world.onIntersect(function (body) {
                if (_this.isStarExplode(body)) {
                    xn.asap(function () {
                        var b = _this.get(body, 2 /* STAR */);
                        xx.box2d.World.setTransform(b, { x: 0, y: 2 });
                    });
                }
            });

            // Events
            this.bindEventHandlers(target, stage, world, body);
            stage.start();

            console.log('Running');
        };

        /* Check if this is a star touching the ground */
        Controller.prototype.isStarExplode = function (body) {
            return this.intersects(body, 1 /* WALL */, 2 /* STAR */);
        };

        /* Get body from list based on type */
        Controller.prototype.get = function (body, t) {
            if (body[0].meta == t) {
                return body[0];
            } else if (body[1].meta == t) {
                return body[1];
            }
            return null;
        };

        /* Check if the bodies intersect */
        Controller.prototype.intersects = function (body, tA, tB) {
            return (((body[0].meta == tA) && (body[1].meta == tB)) || ((body[1].meta == tA) && (body[0].meta == tB)));
        };

        /* Bind a click event handler to look after clicks on the canvas itself */
        Controller.prototype.bindEventHandlers = function (target, stage, world, player) {
            var events = new xn.Events();
            var handler = function (e) {
                var display = xn.pointer.relative(e, target);
                var wp = stage.view.point(display, 0 /* WORLD */);
                var bp = player.data.pos;
                var delta = new xn.Vector(wp.x - bp.x, wp.y - bp.y);
                delta.unit().multiply(0.1);
                xx.box2d.World.applyImpulse(player, delta);
                return false;
            };

            var hasTouch = false;
            events.bind(target, 'mousedown', function (e) {
                if (!hasTouch) {
                    return handler(e);
                }
            });
            events.bind(target, 'touchstart', function (e) {
                hasTouch = true;
                return handler(e);
            });
            events.activate();
        };
        return Controller;
    })();
    demo.Controller = Controller;
})(demo || (demo = {}));
/// <reference path="../../public/js/xx.d.ts"/>
/// <reference path="../../public/js/syn.d.ts"/>
/// <reference path="objects.ts"/>
/// <reference path="bundles.ts"/>
/// <reference path="demo.ts"/>
var demo;
(function (demo) {
    demo.controller;
    function main(root, logging) {
        if (typeof logging === "undefined") { logging = false; }
        demo.controller = new demo.Controller(logging);
        xn.Bundle.load(demo.AssetBundle, root, function (t) {
            demo.controller.model.loading = t.assetsLoaded + '/' + t.assetsTotal + ' assets loaded';
            demo.controller.context.update();
        }).then(function (b) {
            demo.controller.go(b);
        });
    }
    demo.main = main;
})(demo || (demo = {}));
