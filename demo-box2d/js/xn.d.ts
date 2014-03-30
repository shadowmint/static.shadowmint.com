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
        display: xn.Point;
        world: xn.Point;
        view(view: xn.Quad): void;
        point(p: xn.Point, target: Target): xn.Point;
        size(p: xn.Point, target: Target): xn.Point;
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
        public keys(): xn.List<U>;
        public values(): xn.List<V>;
        public all(): any;
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
        public size: xn.Point;
        public pos: xn.Point;
        public angle: number;
        constructor(x?: number, y?: number, dx?: number, dy?: number, angle?: number);
        public clone(): Quad;
    }
}
declare module xn {
    class StaticViewport {
        public world: xn.Point;
        public display: xn.Point;
        public viewport: xn.Quad;
        constructor(world: xn.Point, display: xn.Point);
        public all(): void;
        public view(view: xn.Quad): void;
        public point(p: xn.Point, target?: xn.Target): xn.Point;
        private _vpoint(p, target);
        private _size(p, target?);
        public size(p: xn.Point, target?: xn.Target): xn.Point;
    }
}
declare module xn {
    module dom {
        function removeEventListener(e: HTMLElement, key: string, callback: any): void;
        function addEventListener(e: HTMLElement, key: string, callback: any): void;
    }
}
declare module xn {
    module pointer {
        function absolute(e: any): xn.Point;
        function relative(e: any, parent: HTMLElement): xn.Point;
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
        public bindings: xn.List<EventBinding>;
        public bind(target: any, event: string, handler: (e: any) => boolean): Events;
        public activate(): void;
        public clear(): void;
    }
}
declare module xn {
    class EventListenerBase implements xn.EventListener {
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
        class DummyLogger implements logger.Handler {
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
        class ConsoleLogger implements logger.Handler {
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
        class RedirectLogger implements logger.Handler {
            public target: logger.Handler;
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
        class DocumentLogger implements logger.Handler {
            public target: HTMLElement;
            constructor(target?: HTMLElement);
            public _append(msg: string): void;
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
    var log: logger.RedirectLogger;
    function trace(...msgs: any[]): void;
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
    class NotImplementedError extends xn.Error {
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
