var syn;
(function (syn) {
    (function (rules) {
        /**
        * Safe click-event handling on markup
        * usage: <div syn-click="thing(blah)">...</div>
        */
        var SynClick = (function () {
            function SynClick() {
            }
            /* Register this handler on the given context */
            SynClick.autoRegister = function (context) {
                xn.log('autoRegister: SynClick');
                context.register({
                    detect: SynClick.detect,
                    displayUpdate: SynClick.displayUpdate,
                    displayState: SynClick.displayState,
                    modelUpdate: null,
                    modelState: null
                });
            };

            /* Detect this helper */
            SynClick.detect = function (e) {
                return live.helpers.getAttr(e, 'syn-click', '') != '';
            };

            /* Bind an event handler for the given element and return it as the state */
            SynClick.displayUpdate = function (m, e) {
                var handler = SynClick.cache.get(e, 'syn-click', null);
                if (handler) {
                    xn.dom.removeEventListener(e, 'click', handler);
                }
                var click_action = live.helpers.getAttr(e, 'syn-click', '');
                handler = function (e) {
                    e.preventDefault();
                    var action = "m." + click_action;
                    try  {
                        eval(action);
                    } catch (e) {
                        xn.console.error("syn-click", e);
                    }
                };
                xn.dom.addEventListener(e, 'click', handler);
                SynClick.cache.set(e, 'syn-click', handler);
            };

            /* The state is always the text value of the syn-click tag */
            SynClick.displayState = function (m, e) {
                var rtn = [live.helpers.getAttr(e, 'syn-click', '')];
                return rtn;
            };
            SynClick.cache = new live.helpers.PropertyCache();
            return SynClick;
        })();
        rules.SynClick = SynClick;
    })(syn.rules || (syn.rules = {}));
    var rules = syn.rules;
})(syn || (syn = {}));
var syn;
(function (syn) {
    (function (rules) {
        /**
        * Simple direct .toString() model binding.
        * usage: <div syn-model="thing"></div>
        */
        var SynModel = (function () {
            function SynModel() {
            }
            /* Register this handler on the given context */
            SynModel.autoRegister = function (context) {
                xn.log('autoRegister: SynModel');
                context.register({
                    detect: SynModel.detect,
                    displayUpdate: SynModel.displayUpdate,
                    displayState: SynModel.displayState,
                    modelUpdate: null,
                    modelState: null
                });
            };

            /* Detect this helper */
            SynModel.detect = function (e) {
                return live.helpers.getAttr(e, 'syn-model', '') != '';
            };

            /* Map the model value to the display */
            SynModel.displayUpdate = function (m, e) {
                var model = live.helpers.getAttr(e, 'syn-model', '');
                var value = m[model];
                value = value === null || value === undefined ? '' : value.toString();
                e.innerHTML = value;
            };

            /* Trigger a display update if the model changes, but not vice versa */
            SynModel.displayState = function (m, e) {
                var rtn = [m[live.helpers.getAttr(e, 'syn-model', '')]];
                return rtn;
            };
            return SynModel;
        })();
        rules.SynModel = SynModel;
    })(syn.rules || (syn.rules = {}));
    var rules = syn.rules;
})(syn || (syn = {}));
/// <reference path="syn-click.ts"/>
/// <reference path="syn-model.ts"/>
var syn;
(function (syn) {
    /* Return a syn context */
    function context() {
        var rtn = new live.Context();
        for (var key in syn.rules) {
            if (syn.rules[key]['autoRegister']) {
                syn.rules[key].autoRegister(rtn);
            }
        }
        return rtn;
    }
    syn.context = context;
})(syn || (syn = {}));
/// <reference path="rules/__init__.ts"/>
/// <reference path="syn.ts"/>
/// <reference path="../../../public/js/dsync.d.ts"/>
/// <reference path="../../../public/js/xn.d.ts"/>
/// <reference path="../../../public/js/live.d.ts"/>
/// <reference path="../../../lib/live/src/syn/__init__.ts"/>
