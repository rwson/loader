/**
 * module1.js
 * build by rwson @28/09/2016
 * mail:rw_Song@sina.com
 */

"use strict";

loader.define(["Class"], function (Class) {
    return {
    	Class: Class,
        method: function () {
            return "method on module2";
        }
    };
});
