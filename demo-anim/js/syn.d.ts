/// <reference path="dsync.d.ts" />
/// <reference path="xn.d.ts" />
/// <reference path="live.d.ts" />
declare module syn {
    module rules {
        /**
        * Safe click-event handling on markup
        * usage: <div syn-click="thing(blah)">...</div>
        */
        class SynClick {
            static cache: live.helpers.PropertyCache;
            static autoRegister(context: live.Context): void;
            static detect(e: HTMLElement): boolean;
            static displayUpdate(m: any, e: HTMLElement): void;
            static displayState(m: any, e: HTMLElement): any[];
        }
    }
}
declare module syn {
    module rules {
        /**
        * Simple direct .toString() model binding.
        * usage: <div syn-model="thing"></div>
        */
        class SynModel {
            static autoRegister(context: live.Context): void;
            static detect(e: HTMLElement): boolean;
            static displayUpdate(m: any, e: HTMLElement): void;
            static displayState(m: any, e: HTMLElement): any[];
        }
    }
}
declare module syn {
    function context(): live.Context;
}
