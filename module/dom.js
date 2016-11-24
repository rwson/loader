"use strict";

loader.define("module/dom", function () {
    return {
        g: function (id) {
            return document.getElementById(id);
        },

        html: function (id ,html) {
            if(html) {
                this.g(id).innerHTML = html;
                return;
            }
            return this.g(id).innerHTML
        }
    };
});
