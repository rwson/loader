/**
 * loader.js
 *
 * AMD javascript module loader
 */

"use strict";

~((function(root, undefined) {

    var loader = (function() {

        //  缓存已经加载好的模块
        var moduleCache = {},

            //  配置对象
            configs = {
                
                base: "/",

                paths: {},

                urlArg: ""

            };

        return {

            /**
             * 配置模块路由
             * @param   opt     配置项
             */
            config: function(opt) {
                for(var i in opt) {
                    configs[i] = opt[i];
                }
            },

            define: function() {

                    //  把参数转换成数组
                var args = [].slice.call(arguments),

                    //  把数组最后一个参数抛出作为模块的构造函数
                    callback = args.pop(),

                    //  如果还有参数,抛出最后一个参数作为依赖数组
                    deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [],

                    //  如果还有参数,抛出最后一个参数作为模块名
                    url = args.length ? args.pop() : null,

                    //  依赖模块序列
                    params = [],

                    //  统计未加载的模块数
                    depsCount = 0,

                    //  循环计数器
                    i = 0,

                    //  获取依赖数组长度
                    len = deps.length;

                //  当前模块依赖其他模块
                if (len > 0) {

                    //  遍历该依赖数组
                    while (i < len) {

                        //  闭包存储i
                        (function(i) {

                            //  增加未加载的依赖模块数
                            depsCount++;

                            //  加载依赖模块
                            loadModule(deps[i], function(module) {

                                //  模块加载完成,数量减一
                                depsCount--;
                                params[i] = module;

                                //  最后一个依赖模块加载完成
                                if (depsCount === 0) {

                                    //  在模块缓存中矫正改模块
                                    setModule(url, params, callback);
                                }
                            })
                        }(i));

                        i++;
                    }
                } else {
                    //  没有依赖, 直接添加到到模块缓存
                    setModule(url, [], callback);
                }

            }

        };

        /**
         * 设置模块并且执行构造函数
         * @param    moduleName     模块名
         * @param    params         模块依赖
         * @param    callback       模块构造函数
         */
        function setModule(moduleName, params, callback) {
            var _module, fn;

            //  当前模块被加载过
            if (moduleCache[moduleName]) {

                //  获取当前模块
                _module = moduleCache[moduleName];

                //  设置模块状态
                _module.status = "loaded";

                //  获取模块返回值
                _module.exports = callback ? callback.apply(_module, params) : null;

                //  执行模块文件加载完成回调
                while (fn = _module.onload.shift()) {
                    fn(_module.exports);
                }
            } else {
                //  匿名模块,直接执行模块构造函数
                callback && callback.apply(root, params);
            }
        }

        /**
         * 
         * @param     moduleName    模块名
         * @param     callback      模块构造函数
         */
        function loadModule(moduleName, callback) {

            //  当前模块
            var _module;

            //  如果该模块在模块缓存中已存在(不管状态是加载中还是加载完成)
            if (moduleCache[moduleName]) {

                //  获取当前模块
                _module = moduleCache[moduleName];

                //  如果当前模块刚加载完成
                if (_module.status === "loaded") {

                    //  timeout阻塞下(刚加载完情况让当前模块先执行),执行改构造函数
                    setTimeout(function() {
                        callback(_module.exports);
                    }, 0);
                } else {

                    //  当前模块正在加载中,缓存该模块所处文件加载完回调函数
                    _module.onload.push(callback);
                }
            } else {

                //  该模块还不存在缓存中
                //  缓存模块相关信息
                moduleCache[moduleName] = {
                    moduleName: moduleName,
                    status: "loading",
                    exports: null,
                    onload: [callback]
                };

                //  加载模块
                loadScript(getUrl(moduleName));
            }
        }

        /**
         * 拼接模块路径
         * @param   moduleName  模块名
         */
        function getUrl(moduleName) {
            return ("" + moduleName).replace(/\.js$/, "") + ".js";
        }

        /**
         * 异步加载模块
         * @param  src    模块路径
         */
        function loadScript(src) {
            var _script = document.createElement("script");
            _script.type = "text/javascript";
            _script.async = true;
            _script.src = src;
            document.getElementsByTagName("head")[0].appendChild(_script);
        }

    })();

    root.loader = loader;

})(window));
