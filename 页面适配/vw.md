# VW

在CSS Values and Units Module Level 3中和Viewport相关的单位有四个，分别为`vw、vh、vmin和vmax`。

* vw：是Viewport's width的简写,1vw等于window.innerWidth的1%
* vh：和vw类似，是Viewport's height的简写，1vh等于window.innerHeihgt的1%
* vmin：vmin的值是当前vw和vh中较小的值
* vmax：vmax的值是当前vw和vh中较大的值

> `vmin`和`vmax`是根据Viewport中长度偏大的那个维度值计算出来的，如果window.innerHeight > window.innerWidth则vmin取百分之一的window.innerWidth，vmax取百分之一的window.innerHeight计算。

![示例图片](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-5.png)

使用vw来代替rem的方案，可以使用PostCSS的插件postcss-px-to-viewport，让我们可以直接在代码中写px。PostCSS编译之后就是我们所需要的带vw代码。

在实际使用的时候，你可以对该插件进行相关的参数配置：
```
"postcss-px-to-viewport": { 
    viewportWidth: 750, // 设计稿
    viewportHeight: 1334, 
    unitPrecision: 5, 
    viewportUnit: 'vw', 
    selectorBlackList: [], 
    minPixelValue: 1, 
    mediaQuery: false 
}
```

## **适用范围**

* 容器适配，可以使用vw
* 文本的适配，可以使用vw
* 大于1px的边框、圆角、阴影都可以使用vw
* 内距和外距，可以使用vw



> https://www.jianshu.com/p/1f1b23f8348f

> 商业转载请联系作者获得授权,非商业转载请注明出处。
原文: https://www.w3cplus.com/css/vw-for-layout.html © w3cplus.com