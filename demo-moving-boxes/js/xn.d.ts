declare module xn {
    interface EventListener {
        removeEventListener(key: string, callback: any): void;
        addEventListener(key: string, callback: any): void;
    }
}
declare module xn {
    enum Target {
        WORLD = 0,
        DISPLAY = 1,
    }
    interface Viewport {
        display: Point;
        world: Point;
        view(view: Quad): void;
        point(p: Point, target: Target): Point;
        size(p: Point, target: Target): Point;
    }
}
declare module xn {
    class List<T> {
        private _data;
        public length(): number;
        public all(): T[];
        public set(data: T[]): void;
        public push(item: T): void;
        public unshift(item: T): void;
        public shift(): T;
        public pop(): T;
        public filter(filter: (item: T) => boolean): void;
        public search(filter: (item: T) => boolean, max?: number): T[];
        public first(filter: (item: T) => boolean): T;
        public map(map: (item: T) => T): void;
        public morph<V>(map: (item: T) => V): List<V>;
        public each(apply: (item: T) => void): void;
        public remove(target: T): void;
        public indexOf(item: T): number;
        public any(item: T): boolean;
        public join(joiner: string): string;
    }
}
declare module xn {
    class Map<U, V> {
        private _data;
        constructor(data?: any);
        public set(key: U, value: V): void;
        public get(key: U): V;
        public hasKey(key: U): boolean;
        private _each(apply);
        public each(apply: (key: U, value: V) => void): void;
        public map(map: (value: V) => V): void;
        public setInternal(data: any): void;
        public keys(): List<U>;
        public values(): List<V>;
        public all(): any;
    }
}
declare module xn {
    module data {
        function make<T>(t: any, args?: any[]): T;
        function has(obj: any, prop: any): boolean;
        function get(obj: any, prop: any, defaultValue?: any): any;
    }
}
declare module xn {
    interface Point {
        x: number;
        y: number;
    }
}
declare module xn {
    class Vector {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
        public magnitude(): number;
        public unit(): Vector;
        public multiply(factor: number): Vector;
        public add(other: Vector, factor?: number): Vector;
        public copy(other: Vector): Vector;
    }
}
declare module xn {
    class Quad {
        public size: Point;
        public pos: Point;
        public angle: number;
        constructor(x?: number, y?: number, dx?: number, dy?: number, angle?: number);
        public clone(): Quad;
    }
}
declare module xn {
    class StaticViewport {
        public world: Point;
        public display: Point;
        public viewport: Quad;
        constructor(world: Point, display: Point);
        public all(): void;
        public view(view: Quad): void;
        public point(p: Point, target?: Target): Point;
        private _vpoint(p, target);
        private _size(p, target?);
        public size(p: Point, target?: Target): Point;
    }
}
declare module xn {
    module dom {
        function removeEventListener(e: any, key: string, callback: any): void;
        function addEventListener(e: any, key: string, callback: any): void;
    }
}
declare module xn {
    module pointer {
        function absolute(e: any): Point;
        function relative(e: any, parent: HTMLElement): Point;
    }
}
declare module xn {
    class EventBinding {
        public handler: any;
        public token: any;
        public type: any;
        public target: any;
        constructor(target: any, type: string, handler: (e: any) => boolean);
        public setActive(active?: boolean): void;
    }
    class Events {
        public bindings: List<EventBinding>;
        public bind(target: any, event: string, handler: (e: any) => boolean): Events;
        public activate(): void;
        public clear(): void;
    }
}
declare module xn {
    class EventListenerBase implements EventListener {
        private _bindings;
        private _keys;
        constructor(keys: string[]);
        private _guard(key);
        public addEventListener(key: string, callback: any): void;
        public removeEventListener(key: string, callback: any): void;
        public trigger(key: string, event: any): void;
    }
}
declare module xn {
    module logger {
        interface Handler {
            info(msg: any): void;
            warn(msg: any): void;
            error(msg: any, e: any): void;
            watch(key: string, msg: any): void;
        }
    }
}
declare module xn {
    module logger {
        class DummyLogger implements Handler {
            public log(msg: any): void;
            public info(msg: any): void;
            public warn(msg: any): void;
            public error(msg: any, e: any): void;
            public watch(key: any, msg: any): void;
        }
    }
}
declare var window: Window;
declare module xn {
    module logger {
        class ConsoleLogger implements Handler {
            public info(msg: any): void;
            public warn(msg: any): void;
            public error(msg: any, e: any): void;
            public watch(key: any, msg: any): void;
            private _console();
        }
    }
}
declare module xn {
    module logger {
        class RedirectLogger implements Handler {
            public target: Handler;
            public info(msg: any): void;
            public warn(msg: any): void;
            public error(msg: any, e: any): void;
            public watch(key: any, msg: any): void;
            public dump(data: any): string;
            private _isFunc(t);
            private _isObj(t);
            private _getStackTrace(e);
        }
    }
}
declare module xn {
    module logger {
        class DocumentLogger implements Handler {
            public target: HTMLElement;
            constructor(target?: HTMLElement);
            public _append(prefix: string, msg: any): void;
            public info(msg: any): void;
            public warn(msg: any): void;
            public error(msg: any, e: any): void;
            public watch(key: any, msg: any): void;
            public _find(key: any): HTMLElement;
        }
    }
}
declare module xn {
    module logger {
        /**
        * Returns the logger implementation.
        * If no impl is provided, the dummy logger is used.
        * @param impl The logger Handler implementation if required.
        */
        function init(impl: any): void;
        /**
        * Returns the logger implementation.
        * If no impl is provided, the dummy logger is used.
        */
        function get(): RedirectLogger;
    }
    var console: logger.RedirectLogger;
    function log(...msgs: any[]): void;
    function dump(target: any): string;
}
declare module xn {
    class Error {
        public name: string;
        public message: string;
        constructor(msg: string, type?: string);
        public toString(): string;
    }
}
declare module xn {
    class NotImplementedError extends Error {
        constructor();
    }
}
declare module xn {
    function error(msg: string, type?: string): Error;
    function notImplemented(): Error;
}
declare module xn {
    module random {
        function int(a: number, b: number): number;
        function select(a: any[]): any;
        function color(): number;
    }
}
declare module xn {
    class Xhr {
        private _xhr;
        private _def;
        constructor();
        private _stateChange();
        public open(method: string, url: string): void;
        public send(data?: any): Promise;
        static factory(): any;
    }
}
declare module xn {
    enum AssetType {
        UNKNOWN = 0,
        JSON = 1,
        IMAGE = 2,
        BUNDLE = 3,
    }
    interface Asset {
        data: any;
        url: string;
        type: AssetType;
    }
    class Assets {
        public prefix: string;
        private _types;
        constructor(root: string);
        private _binding(type);
        public load(url: string, type: AssetType): Promise;
        private _url(url);
    }
}
declare module xn {
    module assets {
        interface AssetLoader {
            load(url: any): Promise;
        }
    }
}
declare module xn {
    module assets {
        class ImageLoader implements AssetLoader {
            public load(url: any): Promise;
        }
    }
}
declare module xn {
    module assets {
        class JsonLoader implements AssetLoader {
            public load(url: any): Promise;
        }
    }
}
declare module xn {
    class Bundle {
        private _assets;
        private _total;
        private _loaded;
        constructor(url: string);
        static load(T: any, url?: string, ticks?: (e: TickEvent) => void): Promise;
        static key(T: AssetType, data: any): any;
        private _asType(v);
        public reload(ticks: (e: TickEvent) => void): Promise;
        private _dispatchTick(asset, promise, handler);
        private _loadAsset(key, url, t, promise, handler);
        private _loadBundle(key, target, t, promise, handler);
    }
    interface TickEvent {
        bundle: Bundle;
        assetsLoaded: number;
        assetsTotal: number;
        asset: Asset;
    }
}
declare module xn {
    module prim {
        class Utility {
            static isFunc(target: any): boolean;
            static isObj(target: any): boolean;
            static isPromise(target: any): boolean;
        }
        class Collection {
            public _data: Promised[];
            public add(item: Promised): Promise;
            public any(): number;
            public next(): Promised;
        }
        enum State {
            PENDING = 0,
            FORFILLED = 1,
            REJECTED = 2,
        }
        class Promised {
            public resolve: (value: any) => any;
            public reject: (value: any) => any;
            public child: Promise;
            public accept: boolean;
            constructor(resolve: any, reject: any);
        }
        class Internal {
            public id: number;
            public state: State;
            public children: Collection;
            public value: any;
            public reason: any;
            private static _id;
            constructor();
        }
    }
    class Promise {
        public _state: prim.Internal;
        public then(resolve?: any, reject?: any): Promise;
        public resolve(value?: any): Promise;
        public reject(reason?: any): Promise;
        private _executePromisedAction(promised);
        private _nextPromisedAction();
        private _fullfillPromise();
        private static _resolvePromise(promise, value);
    }
    function asap(target: any): void;
}
