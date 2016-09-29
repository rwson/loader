/**
 * loader.js
 *
 * AMD javascript module loader
 */

"use strict";

(function (root, undefined) {

    var loader = (function () {

        //  cache some objects
        var doc = document,
            head = doc.head || doc.getElementsByTagName("head")[0],
            modules = {},
            interactiveScript = null,
            continueLoad = true;

        //  default configs
        var configs = {
            base: "/",
            paths: {},
            shim: {},
            urlArg: ""
        };

        return {

            /**
             * config method
             * @param cfg   config object
             *      @attribute  base    String
             *      @attribute  paths   Object
             *      @attribute  shim    Object
             *      @attribute  urlArg  String
             */
            config: function (cfg) {
                if (_typeOf(cfg) === "Object") {
                    configs = _merge(configs, cfg);
                }
            },

            /**
             * define a module
             * @param id        module id
             * @param deps      module dependence
             * @param factory   constructor function
             */
            define: function (id, deps, factory) {
                var _argus = _toArray(arguments),
                    _len = _argus.length;

                //  arguments check
                if (_len === 2) {
                    if (_typeOf(id) !== "String") {
                        factory = deps;
                        deps = _toArray(id);
                        id = null;
                    } else if (_typeOf(deps) !== "Array") {
                        factory = deps;
                        deps = [];
                    }
                }

                id = id || _extractId(_getCurrentScript());
                if (modules[id]) {
                    throw new Error("module " + id + " already exist!");
                }

                //  build modules map
                modules[id] = {
                    id: id,
                    deps: deps,
                    factory: factory
                };
            },

            /**
             * define an executable module
             * @param deps      module dependence
             * @param factory   constructor function
             */
            require: function (deps, factory) {
                var _argus = _toArray(arguments),
                    _len = _argus.length,
                    _depLen, _argsCalled;

                //  arguments check
                if (_len === 0) {
                    throw new Error("loader.require must pass in one or two arguments! but none !");
                } else if (_len === 1 && _typeOf(deps) !== "Function") {
                    throw new Error("constructor function must be an funciton");
                }

                if (_len === 1) {
                    factory = deps;
                    deps = [];
                }

                //  get dependence modules length
                _depLen = deps.length;

                if (_depLen === 0) {
                    factory();
                } else {
                    _argsCalled = [];
                    deps.forEach(function (dep, index) {
                        _loadScript(_buildPath(configs.paths[dep]), function () {
                            _argsCalled.push(_executeModule(dep));
                            if (index === _depLen - 1) {
                                factory.apply(root, _argsCalled);
                            }
                        });
                    });
                }
            }
        };

        /**
         * execute module
         * @param id    module id/name
         * @returns {*}
         * @private
         */
        function _executeModule(id) {
            var _curModule = modules[id];
            return _curModule.factory.apply(_curModule.deps);
        }

        /**
         * extract filename as id from an url
         * @param url
         * @returns {String}
         * @private
         */
        function _extractId(url) {
            url = ("" + url);
            if (url.search(/^(http:\/\/|https:\/\/|\/\/)/) === -1) {
                return url;
            }
            url = url.split("?")[0];
            url = url.substring(url.lastIndexOf("/") + 1);
            url = url.replace(/\.\w+$/, "");
            return url;
        }

        /**
         * get current script src
         * @returns {*}
         * @private
         */
        function _getCurrentScript() {
            if (doc.currentScript) {
                return doc.currentScript.src;
            }
            if (currentlyAddingScript) {
                return currentlyAddingScript.src;
            }
            // For IE6-9 browsers, the script onload event may not fire right
            // after the script is evaluated. Kris Zyp found that it
            // could query the script nodes and the one that is in "interactive"
            // mode indicates the current script
            // ref: http://goo.gl/JHfFW
            if (interactiveScript && interactiveScript.readyState === "interactive") {
                return interactiveScript.src;
            }

            var scripts = head.getElementsByTagName("script");
            for (var i = scripts.length - 1; i >= 0; i--) {
                var script = scripts[i];
                if (script.readyState === "interactive") {
                    interactiveScript = script;
                    return interactiveScript.src;
                }
            }
            return null;
        }

        /**
         * build src
         * @param src   passed src
         * @returns {String}
         * @private
         */
        function _buildPath(src) {
            var path = src, _splitor;
            if (path.indexOf("./") === 0 || path.indexOf("/") === 0) {
                path = configs.base + path.replace(/^\//, "").replace(/^\.\//, "");
            } else if ((/^http[s]?:/i).test(path)) {
                path = src;
            } else if (path.match(/^[a-zA-Z1-9]/)) {
                path = configs.base + path;
            } else {
                throw new Error("your script src " + path + " is incorrect!");
            }
            if (!(/\.js$/).test(path)) {
                path += ".js";
            }
            if (configs.urlArg && path.indexOf(configs.urlArg) === -1) {
                _splitor = (path.indexOf("?") > -1) ? "&" : "?";
                path += (_splitor + configs.urlArg);
            }
            return path;
        }

        /**
         * load script
         * @param src       src
         * @param success   success callback
         * @private
         */
        function _loadScript(src, success) {
            var _script = doc.createElement("script");
            _script.src = src;
            _script.type = "text/javascript";
            _script.async = true;
            if ("onload" in _script) {
                _script.onload = function () {
                    continueLoad = true;
                    success();
                };
                _script.onerror = function () {
                    continueLoad = false;
                    throw new Error("module " + src + " not found!");
                };
            } else {
                _script.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        continueLoad = true;
                        success();
                    } else {
                        continueLoad = false;
                        throw new Error("module " + src + " not found!");
                    }
                }
            }
            head.appendChild(_script);
        }

        /**
         * merge two objects
         * @param obj1
         * @param obj2
         * @returns {*}
         * @private
         */
        function _merge(obj1, obj2) {
            var res = _copy(obj1);
            for (var i in obj2) {
                if (obj2.hasOwnProperty(i)) {
                    res[i] = obj2[i];
                }
            }
            return res;
        }

        /**
         * deep copy an object
         * @param obj
         * @returns {*}
         * @private
         */
        function _copy(obj) {
            var _type = _typeOf(obj),
                _nativeReg = /\[native\s{1}code\]/g,
                res;
            switch (_type) {
                case "Object":
                    res = {};
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            res[i] = _copy(obj[i]);
                        }
                    }
                    break;
                case "Array":
                    res = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        res.push(_copy(obj[i]));
                    }
                    break;
                case "Function":
                    res = obj.toString();
                    if (!_nativeReg.test(res)) {
                        for (var i in obj) {
                            res[i] = obj[i];
                        }
                    }
                    break;
                default:
                    res = obj;
                    break;
            }
            return res;
        }

        /**
         * tranform fake array to real array
         * @param fakeArray
         * @return {Array.<T>}
         * @private
         */
        function _toArray(fakeArray) {
            if (_typeOf(fakeArray) === "Array") {
                return fakeArray;
            }

            if (fakeArray && typeof fakeArray === "object" && isFinite(fakeArray.length) && fakeArray.length >= 0 && fakeArray.length === Math.floor(fakeArray.length) && fakeArray.length < 4294967296) {
                return [].slice.call(fakeArray);
            }
        }

        /**
         * get prototype class name on an object
         * @param obj
         * @returns {String}
         * @private
         */
        function _typeOf(obj) {
            return {}.toString.call(obj).slice(8, -1);
        }

    })();

    root.loader = loader;

})(window);