/// <reference path="__init__.ts"/>
var demo;
(function (demo) {
    /* Avoid namespace clutter */
    var test_sprite;
    (function (test_sprite) {
        /* Model for the background widget */
        var Model = (function () {
            function Model() {
                this.ready = false;
                this.dead = false;
                this.last = 0;
                this.step = 50;
            }
            return Model;
        })();
        test_sprite.Model = Model;

        /* Display for the background */
        var Display = (function () {
            function Display(b) {
                this.sprite = null;
                this.b = b;
            }
            return Display;
        })();
        test_sprite.Display = Display;

        /* Create a sprite */
        function create(model, display) {
            var textures = new xx.texture_packer.Textures(display.b.frames, display.b.texture);
            model.ready = true;
            model.anim = textures.sprites['anim_walk'];
            model.frame = -1;

            display.textures = textures;
            display.texture = display.textures.texture();
            display.stage = xx.pixi.Stage.instance;
            display.sprite = new PIXI.Sprite(display.texture);
            display.stage.stage.addChild(display.sprite);
            test_sprite.next_frame(model, display);
        }
        test_sprite.create = create;

        /* Sync to the next frame */
        function next_frame(model, display) {
            model.frame += 1;
            if (model.frame >= model.anim.length) {
                model.frame = 0;
            }
            test_sprite.frame(model, display, model.anim[model.frame]);
        }
        test_sprite.next_frame = next_frame;

        /* Sync to the current frame */
        function frame(model, display, frame) {
            var rect = new PIXI.Rectangle(frame.x, frame.y, frame.dx, frame.dy);
            display.texture.setFrame(rect);
            display.sprite.width = frame.dx;
            display.sprite.height = frame.dy;
        }
        test_sprite.frame = frame;

        /* Destroy a sprite */
        function destroy(model, display) {
            display.stage.stage.removeChild(display.sprite);
            display.sprite = null;
        }
        test_sprite.destroy = destroy;

        /* Update the sprite state */
        function sync(model, display, changed, dt) {
            if (!model.ready) {
                test_sprite.create(model, display);
            }
            if (model.dead) {
                test_sprite.destroy(model, display);
            }
            next_frame(model, display);
            return !model.dead;
        }
        test_sprite.sync = sync;

        /* Detect state changes */
        function state(model, display, dt) {
            var step = false;
            model.last += dt;
            if (model.last > model.step) {
                model.last = 0;
                step = true;
            }
            return [model.source, model.dead, step];
        }
        test_sprite.state = state;
    })(test_sprite || (test_sprite = {}));

    var TestSprite = (function () {
        function TestSprite(b) {
            this.model = new test_sprite.Model();
            this.display = new test_sprite.Display(b);
        }
        TestSprite.prototype.attach = function (channel, stage) {
            stage.sync.add(channel, this.model, this.display, test_sprite.sync, test_sprite.state);
        };
        return TestSprite;
    })();
    demo.TestSprite = TestSprite;
})(demo || (demo = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="__init__.ts"/>
var demo;
(function (demo) {
    // Helpers
    var image = function (url) {
        return xn.Bundle.key(2 /* IMAGE */, url);
    };
    var json = function (url) {
        return xn.Bundle.key(1 /* JSON */, url);
    };

    

    /* Normal set of sprites */
    var SimpleBundle = (function (_super) {
        __extends(SimpleBundle, _super);
        function SimpleBundle() {
            _super.apply(this, arguments);
            this.texture = image('/assets/camel.small.png');
            this.frames = json('/assets/camel.json');
        }
        return SimpleBundle;
    })(xn.Bundle);
    demo.SimpleBundle = SimpleBundle;

    /* Fancy hi-res sprites */
    var FancyBundle = (function (_super) {
        __extends(FancyBundle, _super);
        function FancyBundle() {
            _super.apply(this, arguments);
            this.texture = image('/assets/camel.png');
        }
        return FancyBundle;
    })(SimpleBundle);
    demo.FancyBundle = FancyBundle;
})(demo || (demo = {}));
/// <reference path="../../public/js/xn.d.ts"/>
/// <reference path="../../public/js/dsync.d.ts"/>
/// <reference path="../../public/js/live.d.ts"/>
/// <reference path="../../public/js/syn.d.ts"/>
/// <reference path="../../public/js/xx.d.ts"/>
/// <reference path="sprite.ts"/>
/// <reference path="bundles.ts"/>

var demo;
(function (demo) {
    /* Updates channel */
    var Channels;
    (function (Channels) {
        Channels[Channels["DISPLAY"] = 0] = "DISPLAY";
    })(Channels || (Channels = {}));

    /* UI Model */
    var Demo = (function () {
        function Demo() {
        }
        return Demo;
    })();
    demo.Demo = Demo;

    /* App state */
    demo.model = new Demo();

    /* App controller */
    demo.control = null;

    /* Run with root path for assets */
    function main(root) {
        // Logging
        var e = document.getElementById("log");
        xn.logger.init(new xn.logger.DocumentLogger(e));

        // UI
        demo.control = syn.context().watch(demo.model, document.getElementById("stuff"));

        // Load assets, do things
        go(demo.FancyBundle);
    }
    demo.main = main;

    /* Load and go~ */
    function go(bundle) {
        xn.Bundle.load(bundle, '/', function (e) {
            demo.control.update(function () {
                var msg = 'Loaded: ' + e.assetsLoaded + '/' + e.assetsTotal;
                demo.model.loading = msg;
            });
        }).then(function (b) {
            try  {
                // Loading is now complete; kick the display into action
                demo.control.update(function () {
                    demo.model.loading = '';
                });

                // Load the texture sheet
                var textures = new xx.texture_packer.Textures(b.frames, b.texture);

                var size = { x: 200, y: 200 };
                var display = { x: 200, y: 200 };
                var target = document.getElementById('content');
                var stage = new xx.pixi.Stage(target, size, display);

                stage.sync.channel(0 /* DISPLAY */, true, true);
                stage.add(0 /* DISPLAY */, new demo.TestSprite(b));
                stage.start();
                xn.log('Running');
            } catch (e) {
                xn.log(e);
            }
        });
    }
})(demo || (demo = {}));
