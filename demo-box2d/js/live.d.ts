/// <reference path="../../lib/live/lib/dsync/bin/dsync.d.ts" />
/// <reference path="../../lib/live/lib/prim/bin/prim.d.ts" />
/// <reference path="../../lib/live/lib/x/bin/x.d.ts" />
declare module live {
    class Context {
        public sync: dsync.Sync;
        public handlers: x.List<Handler>;
        constructor();
        public register(handler: Handler): void;
        public watch(model: any, root: HTMLElement): Controller;
        public update(model?: boolean, display?: boolean): void;
    }
    class Controller {
        public model: any;
        public root: HTMLElement;
        public active: boolean;
        constructor(model: any, root: HTMLElement, context: Context);
        private _parse(root, context);
    }
    interface Handler {
        detect: (e: HTMLElement) => boolean;
        modelUpdate: (m: any, e: HTMLElement) => void;
        modelState: (m: any, e: HTMLElement) => any[];
        displayUpdate: (m: any, e: HTMLElement) => void;
        displayState: (m: any, e: HTMLElement) => any[];
    }
}
