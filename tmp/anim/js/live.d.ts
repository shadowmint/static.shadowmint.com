/// <reference path="dsync.d.ts" />
/// <reference path="xn.d.ts" />
declare module live {
    module internal {
        interface Detect {
            (e: Node): boolean;
        }
        interface Matcher {
            (match: Node, detect: Detect): any;
        }
        class Walker {
            public walk(root: HTMLElement, detects: xn.List<Detect>, matcher: Matcher): void;
        }
    }
}
declare module live {
    module internal {
        enum ContextChannels {
            DISPLAY = 0,
            MODEL = 1,
        }
    }
}
declare module live {
    module update {
        interface Update {
            attach(context: Context): any;
            release(): void;
        }
    }
}
declare module live {
    module update {
        class TimedUpdate implements Update {
            private _timer;
            private _interval;
            constructor(interval?: number);
            public attach(context: Context): void;
            public release(): void;
        }
    }
}
declare module live {
    interface Handler {
        detect: (e: HTMLElement) => boolean;
        modelUpdate: (m: any, e: HTMLElement) => void;
        modelState: (m: any, e: HTMLElement) => any[];
        displayUpdate: (m: any, e: HTMLElement) => void;
        displayState: (m: any, e: HTMLElement) => any[];
    }
    module helpers {
        class PropertyCache {
            private _data;
            public set(e: HTMLElement, key: string, value: any): void;
            public get(e: HTMLElement, key: string, defaultValue?: any): any;
        }
        function getAttr(e: HTMLElement, attr: string, defaultValue?: string): string;
    }
}
declare module live {
    class Context {
        public sync: dsync.Sync;
        public handlers: xn.List<Handler>;
        constructor();
        public register(handler: Handler): void;
        public watch(model: any, root: HTMLElement): Controller;
        public update(): void;
    }
}
declare module live {
    class Controller {
        public model: any;
        public root: HTMLElement;
        public active: boolean;
        private _parent;
        private _updates;
        constructor(model: any, root: HTMLElement, context: Context);
        private _pushUpdate(update);
        public timedUpdate(interval?: number): void;
        public update(action?: () => void): void;
        public release(): void;
        private _parse(root, context);
    }
}
