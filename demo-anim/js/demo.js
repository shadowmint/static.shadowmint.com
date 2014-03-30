var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="__init__.ts"/>
var demo;
(function (demo) {
    /* Avoid namespace clutter */
    (function (test_sprite) {
        /* Model for the background widget  */
        var Model = (function (_super) {
            __extends(Model, _super);
            function Model() {
                _super.apply(this, arguments);
                this.state = null;
                this.type = null;
            }
            return Model;
        })(xx.pixi.BaseModel);
        test_sprite.Model = Model;

        /* Display for the background */
        var Display = (function (_super) {
            __extends(Display, _super);
            function Display() {
                _super.apply(this, arguments);
                this.scale = null;
                this.sprite = null;
                this.container = null;
                this.texture = null;
                this.anims = null;
            }
            return Display;
        })(xx.pixi.BaseDisplay);
        test_sprite.Display = Display;

        /* Initialize */
        function init(model, display) {
            if (display.anims) {
                model.ready = true;
                display.texture = display.anims.texture();
                display.sprite = new PIXI.Sprite(display.texture);
                display.container = new PIXI.DisplayObjectContainer();

                // set a fill and line style
                var graphics = new PIXI.Graphics();
                graphics.beginFill(0xFF3300);
                graphics.lineStyle(2, 0x0000FF, 1);
                graphics.drawRect(-5, -5, 5, 5);

                display.container.addChild(graphics);
                display.container.addChild(display.sprite);
                display.stage.stage.addChild(display.container);
                test_sprite.next_frame(model, display);
            }
        }
        test_sprite.init = init;

        /* Sync to the next frame */
        function next_frame(model, display) {
            if (display.anims && display.anims.state) {
                var frame = display.anims.state.state();
                test_sprite.frame(model, display, frame);
            }
        }
        test_sprite.next_frame = next_frame;

        /* Sync to the current frame */
        function frame(model, display, frame) {
            if (display.sprite) {
                var rect = new PIXI.Rectangle(frame.x, frame.y, frame.dx, frame.dy);
                display.texture.setFrame(rect);

                // Scale sprites uniformly
                if (model.type == "simple") {
                    var ew = frame.dx * 2;
                    var eh = frame.dy * 2;
                } else {
                    var ew = frame.dx;
                    var eh = frame.dy;
                }

                // Apply changes
                display.sprite.width = ew;
                display.sprite.height = eh;
                display.sprite.position.x = -ew / 2;
                display.sprite.position.y = -eh - 10;
                display.container.position.x = 150;
                display.container.position.y = 290;
            }
        }
        test_sprite.frame = frame;

        /* Destroy a sprite */
        function destroy(model, display) {
            display.stage.stage.removeChild(display.container);
            display.sprite = null;
        }
        test_sprite.destroy = destroy;

        /* Update the sprite state */
        function sync(model, display, changed, dt) {
            if (!model.ready) {
                test_sprite.init(model, display);
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
            if (display.anims) {
                if (display.anims.name !== model.state) {
                    display.anims.set(model.state);
                }
                return [model.dead, display.anims.step(dt)];
            }
            return [model.dead];
        }
        test_sprite.state = state;
    })(demo.test_sprite || (demo.test_sprite = {}));
    var test_sprite = demo.test_sprite;

    var TestSprite = (function () {
        function TestSprite(b) {
            var textures = new xx.texture_packer.Textures(b.frames, b.texture);
            var anims = new xx.texture_packer.FrameAnimation();
            anims.load(b.anim, textures);
            this.model = new test_sprite.Model({ state: 'idle' });
            this.display = new test_sprite.Display({ anims: anims });
        }
        TestSprite.prototype.attach = function (channel, stage) {
            stage.sync.add(channel, this.model, this.display, test_sprite.sync, test_sprite.state);
        };
        return TestSprite;
    })();
    demo.TestSprite = TestSprite;
})(demo || (demo = {}));
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
            this.back = image('/assets/back.png');
            this.texture = image('/assets/camel.small.png');
            this.frames = json('/assets/camel.small.json');
            this.anim = json('/assets/camel_anims.json');
        }
        return SimpleBundle;
    })(xn.Bundle);
    demo.SimpleBundle = SimpleBundle;

    /* Fancy hi-res sprites */
    var FancyBundle = (function (_super) {
        __extends(FancyBundle, _super);
        function FancyBundle() {
            _super.apply(this, arguments);
            this.frames = json('/assets/camel.json');
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
        Demo.prototype.stop = function () {
            xx.pixi.Stage.instance.stop();
        };

        /* Set the current animation */
        Demo.prototype.state = function (name) {
            if (this.item) {
                this.item.model.state = name;
            }
        };

        /* Set the resolution bundle */
        Demo.prototype.res = function (name) {
            this.destroy();
            this.type = name;
            if (name == 'fancy') {
                this.go(demo.FancyBundle);
            } else {
                this.go(demo.SimpleBundle);
            }
        };

        /* Destroy any active animation */
        Demo.prototype.destroy = function () {
            if (demo.model.item) {
                demo.model.item.model.dead = true;
                demo.model.item = null;
            }
        };

        /* Reload with a specific bundle */
        Demo.prototype.go = function (bundle) {
            xn.Bundle.load(bundle, demo.model.root, function (e) {
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

                    // Init will only create a stage if one doesn't exist
                    var size = { x: 300, y: 300 };
                    var display = { x: 300, y: 300 };
                    var target = document.getElementById('content');
                    var stage = xx.pixi.Stage.init(target, size, display, 0xffffff, function (stage) {
                        stage.sync.channel(0 /* DISPLAY */, true, true);
                        var background = new xx.pixi.Background(b.back.src);
                        stage.add(0 /* DISPLAY */, background);
                    });

                    // Load the animation sprite
                    demo.model.item = new demo.TestSprite(b);
                    demo.model.item.model.type = demo.model.type;
                    stage.add(0 /* DISPLAY */, demo.model.item);
                    stage.start();
                } catch (e) {
                    xn.log(e);
                }
            });
        };
        return Demo;
    })();
    demo.Demo = Demo;

    /* App state */
    demo.model = new Demo();

    /* App controller */
    demo.control = null;

    /* Run with root path for assets */
    function main(root, logging) {
        // Logging
        if (logging) {
            var e = document.getElementById("log");
            xn.logger.init(new xn.logger.DocumentLogger(e));
        } else {
            xn.logger.init(new xn.logger.DummyLogger());
        }

        // UI
        demo.control = syn.context().watch(demo.model, document.getElementById("stuff"));

        // Load assets, do things
        demo.model.root = root;
        demo.model.res('simple');
    }
    demo.main = main;
})(demo || (demo = {}));
