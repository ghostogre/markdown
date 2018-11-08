# VW

在CSS Values and Units Module Level 3中和Viewport相关的单位有四个，分别为`vw、vh、vmin和vmax`。

* vw：是Viewport's width的简写,1vw等于window.innerWidth的1%
* vh：和vw类似，是Viewport's height的简写，1vh等于window.innerHeihgt的1%
* vmin：vmin的值是当前vw和vh中较小的值
* vmax：vmax的值是当前vw和vh中较大的值

> `vmin`和`vmax`是根据Viewport中长度偏大的那个维度值计算出来的，如果window.innerHeight > window.innerWidth则vmin取百分之一的window.innerWidth，vmax取百分之一的window.innerHeight计算。

![示例图片](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-5.png)

使用vw来代替rem的方案，可以使用PostCSS的插件`postcss-px-to-viewport`，让我们可以直接在代码中写px。PostCSS编译之后就是我们所需要的带vw代码。

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

## **VW适用范围**

* 容器适配，可以使用vw
* 文本的适配，可以使用vw
* 大于1px的边框、圆角、阴影都可以使用vw
* 内距和外距，可以使用vw

## **其他postcss**

`postcss-aspect-ratio-mini` 主要用来处理元素容器宽高比。

## **解决1px方案**

对于1px是不建议将其转换成对应的vw单位的。

依旧是使用PostCSS插件，解决1px可以使用`postcss-write-svg`。使用postcss-write-svg你可以通过 border-image 或者 background-image 两种方式来处理。

```
@svg 1px-border { 
    height: 2px; 
    @rect { 
        fill: var(--color, black); 
        width: 100%; 
        height: 50%; 
    } 
}

.example { 
    border: 1px solid transparent; 
    border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch; 
}
```
PostCSS会自动帮你把CSS编译出来

```
@svg square { 
    @rect { 
        fill: var(--color, black); 
        width: 100%; 
        height: 100%; 
    } 
} 

#example { 
    background: white svg(square param(--color #00b1ff)); 
}

```

1. 使用vw来实现页面的适配，并且通过PostCSS的插件postcss-px-to-viewport把px转换成vw。这样的好处是，我们在撸码的时候，不需要进行任何的计算，你只需要根据设计图写px单位
2. 为了更好的实现长宽比，特别是针对于img、vedio和iframe元素，通过PostCSS插件postcss-aspect-ratio-mini来实现，在实际使用中，只需要把对应的宽和高写进去即可
3. 为了解决1px的问题，使用PostCSS插件postcss-write-svg,自动生成border-image或者background-image的图片


> https://www.jianshu.com/p/1f1b23f8348f

> 商业转载请联系作者获得授权,非商业转载请注明出处。
原文: https://www.w3cplus.com/css/vw-for-layout.html © w3cplus.com