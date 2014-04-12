/// <reference path="xx.d.ts" />
/// <reference path="syn.d.ts" />
declare var PIXI: any;
declare module demo {
    class Player extends xx.pixi.box2d.Body {
        public assets: Assets;
        constructor(assets: Assets, body: any);
        public create(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display): void;
        public sync(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display, changed: any[], dt: number): boolean;
    }
    class MoverModel extends xx.pixi.box2d.body.Model {
        public acc: number;
        public offset: number;
    }
    class Mover extends xx.pixi.box2d.Body {
        public assets: Assets;
        constructor(assets: Assets, body: any);
        public create(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display): void;
        public sync(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display, changed: any[], dt: number): boolean;
        public state(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display, dt: number): any[];
    }
    class Star extends xx.pixi.box2d.Body {
        public assets: Assets;
        constructor(assets: Assets, body: any);
        public create(model: xx.pixi.box2d.body.Model, display: xx.pixi.box2d.body.Display): void;
    }
}
declare module demo {
    interface Assets {
        level: any;
        player: any;
        star: any;
        background: any;
        box: any;
    }
    class AssetBundle extends xn.Bundle implements Assets {
        public level: any;
        public player: any;
        public star: any;
        public box: any;
        public background: any;
    }
}
declare var $: any;
declare var PIXI: any;
declare module demo {
    enum Objects {
        PLAYER = 0,
        WALL = 1,
        STAR = 2,
    }
    class Model {
        public loading: string;
    }
    class Controller {
        public model: Model;
        public context: any;
        constructor(logging: boolean);
        public go(assets: Assets): void;
        public isStarExplode(body: any[]): boolean;
        public get(body: any[], t: Objects): any;
        public intersects(body: any[], tA: Objects, tB: Objects): boolean;
        public bindEventHandlers(target: HTMLElement, stage: xx.pixi.Stage, world: xx.box2d.TiledWorld, player: any): void;
    }
}
declare module demo {
    var controller: Controller;
    function main(root: string, logging?: boolean): void;
}
