/**
 * app.js
 * build by rwson @28/09/2016
 * mail:rw_Song@sina.com
 */

"use strict";

loader.config({
    base: "module/",
    paths: {
    	dom: "dom",
    	event: "event"
    },
    urlArg: "v=" + new Date().getTime()
});


loader.define(["module/dom","module/event"], function (dom, event) {

    event.on("demo", "click", function () {
    	console.log(111);
        dom.html("demo", dom.html("demo") + "<br/>success!");
    });

});