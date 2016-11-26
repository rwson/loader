/**
 * app.js
 * build by rwson @28/09/2016
 * mail:rw_Song@sina.com
 */

"use strict";

loader.define(["module/dom","module/event"], function (dom, event) {

    event.on("demo", "click", function (e) {
    	console.log(e);
        dom.html("demo", dom.html("demo") + "<br/>" + e.type + " @ " + new Date());
    });

});