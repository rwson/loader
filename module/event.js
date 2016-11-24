"use strict";

loader.define("module/event", ["module/dom"], function (dom) {
    return {
        on: function (id, type, fn) {

            dom.g(id)["on" + type] = fn;
        }
    };
});
