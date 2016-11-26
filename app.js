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


loader.define(["dom","event"], function (dom, event) {

    event.on("demo", "click", function (e) {
    	console.log(e);
        dom.html("demo", dom.html("demo") + "<br/>" + e.type + " @" + (new Date()));
    });

});