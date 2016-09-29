/**
 * app.js
 * build by rwson @28/09/2016
 * mail:rw_Song@sina.com
 */

"use strict";

loader.config({
    base:"modules/",
    paths: {
        module1: "module1.js",
        module2: "module2.js",
        module3: "module3.js"
    },
    urlArg: "v=" + new Date().getTime()
});

loader.require(["module1", "module2", "module3"], function (module1, module2, module3) {
    console.log(module1.method());
    console.log(module2.method());
    console.log(module3.method());
});

