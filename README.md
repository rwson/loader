### loader

javascript AMD加载器

#### API

    //  声明功能模块
    loader.define(id?, deps, factory);


参数名 | 意义 | 类型 | 默认值 | 是否必传
---|---|---|---|---
id | 模块名 | String | null | 否
deps | 模块依赖(各模块返回值将作为factory参数) | Array.&lt;String&gt; | [] | 是
factory | 该模块的工厂函数 | Function | null | 是


    //  主模块
    loader.define(dep?, factory);

参数名 | 意义 | 类型 | 默认值 | 是否必传
---|---|---|---|---
deps | 模块依赖(各模块返回值将作为factory参数) | Array.&lt;String&gt; | [] | 是
factory | 该模块的工厂函数 | Function | null | 是


    //  配置
    loader.config(opt);

参数名 | 意义 | 类型 | 默认值 | 是否必传
---|---|---|---|---
base | 加载模块的目录 | String | "/" | 否
paths | 模块id和模块文件名的映射 | Object{moduleId: moduleUrl} | {} | 是
urlArg | url查询字符串类型的参数 | String["v"= new Date().getTime()] | "" | 否

#### todo

- loader.config加入shim支持
- 允许通过data-main指定入口文件
- 声明功能模块时deps可不传