/// <reference path="xn.d.ts" />
/// <reference path="dsync.d.ts" />
declare var PIXI: any;
declare module xx {
    module pixi {
        interface Stagable {
            attach(channel: any, stage: Stage): void;
        }
        class Stage {
            public view: xn.Viewport;
            public stage: any;
            public sync: dsync.Sync;
            private _renderer;
            private _actions;
            private _running;
            private __worker;
            static instance: Stage;
            constructor(target: HTMLElement, world: xn.Point, display: xn.Point, background?: number);
            public add(channel: any, stagable: Stagable): void;
            private _worker();
            public redraw(): void;
            public action(action: (stage: Stage) => void): void;
            public start(): void;
            public stop(): void;
        }
    }
}
declare var PIXI: any;
declare module xx {
    module pixi {
        module background {
            class Model {
                public ready: boolean;
                public dead: boolean;
                public source: string;
                public stage: Stage;
                constructor(url: string);
            }
            class Display {
                public sprite: any;
            }
        }
        class Background implements Stagable {
            public model: background.Model;
            public display: background.Display;
            constructor(url: string);
            public attach(channel: any, stage: Stage): void;
            static create(model: background.Model, display: background.Display): void;
            static destroy(model: background.Model, display: background.Display): void;
            static sync(model: background.Model, display: background.Display, changed: any[], dt: number): boolean;
            static state(model: background.Model, display: background.Display, dt: number): any[];
        }
    }
}
declare var PIXI: any;
declare module xx {
    module pixi {
        module box2d {
            module body {
                class Model {
                    public body: any;
                    public ready: boolean;
                    public dead: boolean;
                    public parent: Body;
                    constructor(body: any, parent: Body);
                }
                class Display {
                    public gc: any;
                }
            }
            class Body implements Stagable {
                public model: body.Model;
                public display: body.Display;
                constructor(body: string);
                public attach(channel: any, stage: Stage): void;
                public create(model: body.Model, display: body.Display): void;
                public destroy(model: body.Model, display: body.Display): void;
                public sync(model: body.Model, display: body.Display, changed: any[], dt: number): boolean;
                public state(model: body.Model, display: body.Display, dt: number): any[];
            }
        }
    }
}
declare var PIXI: any;
declare module xx {
    module pixi {
        module box2d {
            class Bound extends Body {
                public create(model: body.Model, display: body.Display): void;
            }
        }
    }
}
declare module xx {
    module tiled {
        class Level {
            public width: number;
            public height: number;
            public bounds: xn.List<xn.Quad>;
            public markers: xn.Map<string, xn.List<xn.Quad>>;
            constructor(data: any);
            public resize(width: number, height: number, invertY?: boolean): void;
            public offset(x: number, y: number): void;
        }
    }
}
declare var Box2D: any;
declare module xx {
    module box2d {
        enum BodyType {
            STATIC = 0,
            DYNAMIC = 1,
        }
        class World {
            public world: any;
            constructor();
            private _contactWatcher();
            public createBody(block: xn.Quad, type?: BodyType, density?: number, friction?: number, restitution?: number): any;
            public applyForce(body: any, force: xn.Point): void;
            public applyImpulse(body: any, force: xn.Point): void;
            public destroyBody(body: any): void;
            public readGeometry(body: any, block: xn.Quad): void;
            public step(dt: number): void;
        }
    }
}
declare var Box2D: any;
declare module xx {
    module box2d {
        class TiledWorld extends World {
            public level: tiled.Level;
            public bounds: xn.List<any>;
            constructor(level: tiled.Level);
            private _addStaticBounds();
            public addMarker(name: string, density?: number, friction?: number, restitution?: number): any;
            public addMarkers(name: string, density?: number, friction?: number, restitution?: number): xn.List<any>;
        }
    }
}
declare var PIXI: any;
declare module xx {
    module texture_packer {
        interface Frame {
            x: number;
            y: number;
            dx: number;
            dy: number;
        }
        class Textures {
            private _rw;
            private _rh;
            private _image;
            public width: number;
            public height: number;
            public sprites: {
                [key: string]: Frame[];
            };
            constructor(data: any, image: HTMLImageElement);
            private _resize(frame);
            private _frame(data);
            private _parse(src);
            private _data(items, name);
            public texture(): any;
        }
    }
}
