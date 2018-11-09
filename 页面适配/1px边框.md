在互联网上有关于1px边框的解决方案已经有很多种了，自从使用Flexible库之后，再也没有纠结有关于1px相关的问题。考虑新的移动端适配方案，不得不考虑重新处理1px的方案。

# **Flexible方案**

借助JavaScript来动态修改meta标签中viewport中的initial-scale的值，然后根据dpr修改html中的font-size值，再使用rem来处理。这个方案目前只处理了iOS的dpr为2的情况，其他的都没有处理，也就是说不支持Android和drp=3的情况。

让viewport放大为device-width的dpr倍数，然后缩小1/dpr倍显示。

> viewport的width没设置的话，默认是980px。如果设置了initial-scale，就有viewport=device-width/scale（会推算出viewport宽度）。同时设置scale和viewport，会取较大的那个。

> 如果仅设置某些属性，则iOS上的Safari会推断其他属性的值，目的是在可见区域中拟合网页。例如，如果仅设置初始比例，则推断出宽度和高度。同样，如果仅设置宽度，则推断高度和初始比例，依此类推。如果推断的值不适用于您的网页，则设置更多视口属性。
> [参考资料](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html#//apple_ref/doc/uid/TP40006509-SW27)

首先使用JavaScript计算出scale的值：
```
var scale = 1 / window.devicePixelRation;
```

在head中的meta标签设备：

```
<meta name="viewport" content="densitydpi=device-dpi,initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no"/>
```

iPhone5的viewport的width=640px，得到的meta值：
```
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no"/>
```
符合我们预期所需的结果。

iPhone6 Plus也是完美的：
```
<meta name="viewport" content="initial-scale=0.3333333333,maximum-scale=0.3333333333,minimum-scale=0.3333333333,user-scalable=no"/>
```

再来看几个Android的设备。比如米3，它的dpr=3，viewport的width=1080，得到的值也是我们期待的：
```
<meta name="viewport" content="initial-scale=0.3333333333,maximum-scale=0.3333333333,minimum-scale=0.3333333333,user-scalable=no"/>
```

在米2中，它的dpr=2，viewport的width=720，效果也是OK的。

```
<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no"/>
```

看到这里时，大家可能都会觉得完美，无需纠结啥，事实上在米2和米3中，看到的都是设置默认的浏览器、UC和Chrome浏览器的结果。回过头来再看WebView，那就出问题了。当Webview为360时，线依然也是粗的，这里测试，发现user-scalable=no会使viewport的值等于device-width（取较大的device-width）。那么我们进一步去掉user-scalable=no或者设置user-scalable=yes：

```
<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5"/>

<meta name="viewport" content="initial-scale=0.3333333333,maximum-scale=0.3333333333,minimum-scale=0.3333333333"/>
```
这样设置，在iOS、米3的Webview下都能得到预期效果，但是在米2中的Webview还是有问题，页面会被放大。问题是出在于米2的Webview的viewport的width=490px，是由默认的980px缩放0.5后的值。而米2的device-width=360,所以就会出现撑开放不下的现象。

米2的Webview怎么办? 想起还有个被webkit在2013年3月抛弃的属性target-densitydpi=device-dpi，此属性是之前Android对viewport标签的扩展。**在安卓中有 target-densitydpi 这个私有属性，它表示目标设备的密度等级，作用是决定css中的1px代表多少物理像素。** target-densitydpi的值有: device-dpi, high-dpi, medium-dpi, low-dpi四个。对于小米2的Webview才出现的问题估计只能非标准的属性来hack试试，densitydpi=device-dpi会让页面**按照设备本身的dpi来渲染**。
```
<meta name="viewport" content="densitydpi=device-dpi,initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5"/>
```
测试其他都正常，就小米2的Webview会出现有些边框偶尔出现若隐若现，原来是此时页面的viewport=980,densitydpi=device-dpi以设备真实的dpi显示后，scale的倍数变为360/980，这种情况压缩下去也许就这么残了~~

想办法让小米2的缩放比为小米的dpr，viewport如何能变为2*360=720呢，试试user-scalable=no重新加回去试试，终于，小米2的Webview下出现了纤细的线条。

### **非主流机型**

总的而言，其根本原因是一样的，viewport的默认宽度依然是980，initial-scale等的设置无法改变viewport的基准计算。看来这些非主流机型上只能通过width来改变了。不出所料，设置如下即可:
```
<meta name="viewport" content="target-densitydpi=device-dpi,width=device-width,user-scalable=no"/>
```

最后的设置如下：
```
metaEl.setAttribute('content', 'target-densitydpi=device-dpi,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale);
//不通过加入具体设备的白名单，通过此特征检测 docEl.clientWidth == 980
//initial-scale=1不能省，因为上面设置为其他的scale了，需要重置回来
if(docEl.clientWidth == 980) {
    metaEl.setAttribute('content', 'target-densitydpi=device-dpi,width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1');
}
```

### **兼容iPhone和Android**

以下是一个 [解决方案](https://ariya.io/2011/08/mobile-web-logical-pixel-vs-physical-pixel)

可以根据下面的例子自己推导不同dpr下的方法

```
// iOS
<meta name="viewport" content="width=device-width initial-scale=0.5 maximum-scale=0.5 user-scalable=no"/>
// Android
<meta name="viewport" content="width=device-width target-densityDpi=device-dpi initial-scale=0.5 maximum-scale=0.5 user-scalable=no"/>

// js
if (window.devicePixelRatio === 1) {
    // 横屏和竖屏
    if (window.innerWidth === 2 * screen.width ||
        window.innerWidth === 2 * screen.height) {
        el = document.getElementById('viewport');
        el.setAttribute('content', 'width=device-width target-densityDpi=device-dpi ' +
            'initial-scale=1 maximum-scale=1 user-scalable=no');
        document.head.appendChild(el);
        width = window.innerWidth;
        height = window.innerHeight;
        if (width === 2 * screen.width) {
            width /= 2;
            height /= 2;
        }
    }
}

```

---

# **.5px方案**

在iOS8下，苹果系列都已经支持0.5px了，那么意味着在devicePixelRatio = 2时，我们可以借助媒体查询来处理：

```
.border {
    border: 1px solid black;
}
 
@media (-webkit-min-device-pixel-ratio: 2) {
    .border {
        border-width: 0.5px
    }
}
```

但在iOS7以下和Android等其他系统里，0.5px将会被显示为0px，那么我们就需要想出办法解决，说实在一点就是找到Hack。

首先我们可以通过JavaScript来判断UA，如果是iOS8+，则输出类名hairlines，为了防止重绘，把这段代码添加在之前：
```
if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
        version = parseInt(v[1], 10);
    if(version >= 8){
        document.documentElement.classList.add('hairlines')
    }
}
```

除了判读UA之外，还可以通过JavaScript来判断是否支持0.5px边框，如果支持的话，同样输出类名hairlines：

```
if (window.devicePixelRatio && devicePixelRatio >= 2) {
    var testElem = document.createElement('div');
    testElem.style.border = '.5px solid transparent';
    document.body.appendChild(testElem);
    if (testElem.offsetHeight == 1){
        document.querySelector('html').classList.add('hairlines');
    }
    document.body.removeChild(testElem);
}
```

相比于第一种方法，这种方法的可靠性更高一些，但是需要把JavaScript放在body标签内，相对来说会有一些重绘，个人建议是用第一种方法。

这个方案无法兼容iOS8以下和Android的设备。如果需要完美的兼容，可以考虑和方案一结合在一起处理。只是比较蛋疼。当然除了和Flexible方案结合在一起之外，还可以考虑和下面的方案结合在一起使用。

## **border-image**

border-image是一个很神奇的属性，Web开发人员借助border-image的九宫格特性，可以很好的运用到解决1px边框中。

使用border-image解决1px咱们需要一个特定的图片，这张图片要符合你的要求，不过它长得像下图：

![图1](../Image/1px-1.jpg)

```
border-width: 0 0 1px 0;
border-image: url(linenew.png) 0 0 2 0 stretch;
```

上面的效果也仅实现了底部边框border-bottom的1px的效果。之所以使用的图片是2px的高，上部分的1px颜色为透明，下部分的1px使用的视觉规定的border颜色。但如果我们边框底部和顶部都需要border时，需要做一下图片的调整：

![图1](../Image/1px-2.jpg)

```
border-width: 1px 0;
border-image: url(linenew.png) 2 0 stretch;
```

到目前为止，我们已经能在iPhone上展现1px边框的效果。但是我们也发现这样的方法在非视网膜屏幕上会出现border不显示的现象。为了解决这个问题，可以借助媒体查询来处理：

```
.border-image-1px {
    border-bottom: 1px solid #666;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
    .border-image-1px {
        border-bottom: none;
        border-width: 0 0 1px 0;
        border-image: url(../img/linenew.png) 0 0 2 0 stretch;
    }
}
```

不管是只有一边的边框，还是上下都有边框，我们都需要对图片做相应的处理，除些之外，如果边框的颜色做了变化，那么也需要对图片做处理。这样也不是一个很好的解决方案。

## **PostCSS Write SVG**

使用border-image每次都要去调整图片，总是需要成本的。基于上述的原因，我们可以借助于PostCSS的插件postcss-write-svg来帮助我们。如果你的项目中已经有使用PostCSS，那么只需要在项目中安装这个插件。然后在你的代码中使用：

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

PostCSS会自动帮你把CSS编译出来：

```
.example {
    border: 1px solid transparent;
    border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch;
}
```

使用PostCSS的postcss-write-svg插件，除了可以使用border-image来实现1px的边框效果之外，还可以使用background-image来实现。比如：

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
编译后：
```
#example {
    background: white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2300b1ff' width='100%25' height='100%25'/%3E%3C/svg%3E");
}
```



