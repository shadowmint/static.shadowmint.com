/// <reference path="xn.d.ts" />
/// <reference path="dsync.d.ts" />
/// <reference path="live.d.ts" />
/// <reference path="syn.d.ts" />
/// <reference path="xx.d.ts" />
declare var PIXI: any;
declare module demo {
    module test_sprite {
        class Model extends xx.pixi.BaseModel {
            public state: string;
            public type: string;
        }
        class Display extends xx.pixi.BaseDisplay {
            public scale: number;
            public sprite: any;
            public container: any;
            public texture: any;
            public anims: xx.texture_packer.FrameAnimation;
        }
        function init(model: Model, display: Display): void;
        function next_frame(model: Model, display: Display): void;
        function frame(model: Model, display: Display, frame: xx.texture_packer.Frame): void;
        function destroy(model: Model, display: Display): void;
        function sync(model: Model, display: Display, changed: any[], dt: number): boolean;
        function state(model: Model, display: Display, dt: number): any[];
    }
    class TestSprite implements xx.pixi.Stagable {
        public model: test_sprite.Model;
        public display: test_sprite.Display;
        constructor(b: SpriteBundle);
        public attach(channel: any, stage: xx.pixi.Stage): void;
    }
}
declare module demo {
    interface SpriteBundle {
        texture: HTMLImageElement;
        frames: any;
        anim: any;
    }
    class SimpleBundle extends xn.Bundle implements SpriteBundle {
        public back: any;
        public texture: any;
        public frames: any;
        public anim: any;
    }
    class FancyBundle extends SimpleBundle implements SpriteBundle {
        public frames: any;
        public texture: any;
    }
}
declare module demo {
    class Demo {
        public loading: string;
        public item: TestSprite;
        public type: string;
        public root: string;
        public stop(): void;
        public state(name: string): void;
        public res(name: string): void;
        public destroy(): void;
        public go(bundle: any): void;
    }
    var model: Demo;
    var control: live.Controller;
    function main(root: string, logging: boolean): void;
}
