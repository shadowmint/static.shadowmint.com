/// <reference path="xn.d.ts" />
/// <reference path="dsync.d.ts" />
/// <reference path="live.d.ts" />
/// <reference path="syn.d.ts" />
/// <reference path="xx.d.ts" />
declare var PIXI: any;
declare module demo {
    class TestSprite implements xx.pixi.Stagable {
        private model;
        private display;
        constructor(b: SpriteBundle);
        public attach(channel: any, stage: xx.pixi.Stage): void;
    }
}
declare module demo {
    interface SpriteBundle {
        texture: HTMLImageElement;
        frames: any;
    }
    class SimpleBundle extends xn.Bundle implements SpriteBundle {
        public texture: any;
        public frames: any;
    }
    class FancyBundle extends SimpleBundle implements SpriteBundle {
        public texture: any;
    }
}
declare var $: any;
declare var PIXI: any;
declare module demo {
    class Demo {
        public loading: string;
    }
    var model: Demo;
    var control: live.Controller;
    function main(root: string): void;
}
