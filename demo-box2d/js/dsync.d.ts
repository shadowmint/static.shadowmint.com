declare module dsync {
    interface Update<U, V> {
        (model: U, display: V, changed: boolean[], dt: number): boolean;
    }
    interface State<U, V> {
        (model: U, display: V, dt: number): any[];
    }
}
declare module dsync {
    interface Binding<U, V> {
        state: dsync.State<U, V>;
        sync: dsync.Update<U, V>;
        model: U;
        display: V;
        last: any[];
        alive: boolean;
    }
}
declare module dsync {
    class Channel {
        public children: any[];
        public timestamp: number;
        public ready: boolean;
        public locked: boolean;
        public add<U, V>(model: U, display: V, sync: dsync.Update<U, V>, state?: dsync.State<U, V>): void;
        public update(): void;
        public updated<U, V>(target: dsync.Binding<U, V>, changed: boolean[], dt: number): boolean;
        private _state(binding, dt);
    }
}
declare module dsync {
    module dom {
        function watch(sync: dsync.Sync, e: HTMLElement, events: string[], channel: dsync.Channel): void;
    }
}
declare module dsync {
    class Sync {
        public channels: any;
        private _pollRate;
        private _timer;
        constructor(pollRate?: number);
        public channel(name: any, ready?: boolean, locked?: boolean): dsync.Channel;
        public update(): void;
        public touch(channel: any): void;
        public add<U, V>(channel: any, model: U, display: V, sync: dsync.Update<U, V>, state?: dsync.State<U, V>): void;
        public watch(e: HTMLElement, events: string[], channel: any): void;
    }
}
