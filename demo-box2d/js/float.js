var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../public/js/xx.d.ts"/>

var float;
(function (float) {
    var Channels;
    (function (Channels) {
        Channels[Channels["DISPLAY"] = 0] = "DISPLAY";
    })(Channels || (Channels = {}));

    var WORLD_SIZE = 5.0;

    float.root = '/';

    // Asset finder helper
    function asset(path) {
        return float.root + 'assets/' + path;
    }

    function main(root) {
        float.root = root;
        xn.logger.init(new xn.logger.ConsoleLogger());
        $.getJSON(asset('level.json')).then(function (data) {
            var size = { x: WORLD_SIZE, y: WORLD_SIZE };
            var display = { x: 610, y: 610 };
            var target = document.getElementById('content');
            var stage = new xx.pixi.Stage(target, size, display);

            stage.sync.channel(0 /* DISPLAY */, true, true);
            stage.add(0 /* DISPLAY */, new xx.pixi.Background(asset('level.png')));

            var level = new xx.tiled.Level(data);
            level.resize(WORLD_SIZE, WORLD_SIZE);
            level.offset(-WORLD_SIZE / 2, -WORLD_SIZE / 2);

            var world = new xx.box2d.TiledWorld(level);
            world.bounds.each(function (b) {
                stage.add(0 /* DISPLAY */, new xx.pixi.box2d.Bound(b));
            });
            stage.action(function (stage) {
                world.step(0);
            });

            var body = world.addMarker('player', 1, 1, 0.25);
            stage.add(0 /* DISPLAY */, new Player(body));

            var stars = world.addMarkers('star', 1, 1, 0.02);
            stars.each(function (b) {
                stage.add(0 /* DISPLAY */, new Star(b));
            });

            bindEventHandlers(target, stage, world, body);
            stage.start();

            console.log('Running');
        });
    }
    float.main = main;

    /* Bind a click event handler to look after clicks on the canvas itself */
    function bindEventHandlers(target, stage, world, player) {
        var events = new xn.Events();
        var handler = function (e) {
            var display = xn.pointer.relative(e, target);
            var wp = stage.view.point(display, 0 /* WORLD */);
            var bp = player.data.pos;
            var delta = new xn.Vector(wp.x - bp.x, wp.y - bp.y);
            delta.unit().multiply(0.1);
            world.applyImpulse(player, delta);
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
    }

    /* Player sprite type */
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.apply(this, arguments);
        }
        Player.prototype.create = function (model, display) {
            model.ready = true;
            var bounds = model.body.data;
            var stage = xx.pixi.Stage.instance;
            var size = stage.view.size(bounds.size, 1 /* DISPLAY */);

            var sprite = PIXI.Sprite.fromImage(asset('player.png'));
            sprite.width = size.x;
            sprite.height = size.y;
            sprite.position.x -= size.x / 2;
            sprite.position.y -= size.y / 2;

            display.gc = new PIXI.DisplayObjectContainer();
            display.gc.addChild(sprite);
            stage.stage.addChild(display.gc);
        };
        return Player;
    })(xx.pixi.box2d.Body);

    /* Star sprite type */
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star() {
            _super.apply(this, arguments);
        }
        Star.prototype.create = function (model, display) {
            model.ready = true;
            var bounds = model.body.data;
            var stage = xx.pixi.Stage.instance;
            var size = stage.view.size(bounds.size, 1 /* DISPLAY */);

            var sprite = PIXI.Sprite.fromImage(asset('star.png'));
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
})(float || (float = {}));
