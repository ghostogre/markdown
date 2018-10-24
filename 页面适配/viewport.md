> ## 设备像素比dpr

    设备像素比 = 设备像素/设备独立像素

设备独立像素等于css像素.

> ## 像素密度

对角线上每英寸物理像素的数量。

> ## 高倍图

最好的做法是不同的dpr下，加载不同尺寸的图片。

> ## `border: 1px`问题

实际上CSS中border-width: 1px在普通屏和高清屏上并无太大差别，但是一般设计师要求一条直线尽可能的细，即屏幕能显示的最小宽度，所以此处1px实际指的是1物理像素，倘若在dpr为2的屏幕上，CSS像素应该是0.5px，但是不是所有手机浏览器都支持border-width: 0.5px的写法，有可能被当成0px或1px处理。

> ## 视口

浏览器默认的viewport叫做`layout viewport`。这个layout viewport的宽度可以通过 `document.documentElement.clientWidth` 来获取。ayout viewport 的宽度是大于浏览器可视区域的宽度的。

`visual viewport` (**浏览器**可视区域，不是手机屏幕可视范围)的宽度可以通过window.innerWidth 来获取，但在Android 2, Oprea mini 和 UC 8中无法正确获取。

`ideal viewport`并没有一个固定的尺寸，不同的设备拥有有不同的ideal viewport。ideal viewport的宽度等于移动设备的屏幕宽度，只要在css中把某一元素的宽度设为ideal viewport的宽度(单位用px)，那么这个元素的宽度就是设备屏幕的宽度了.

缩放是相对于ideal viewport来缩放的，缩放值越大，当前viewport的宽度就会越小

    当前缩放值=ideal viewport宽度/visual viewport宽度

> ## 媒体查询

在使用媒体查询时，width指的是layout viewport，device-width指的是移动设备屏幕的宽度，两者都是用CSS像素来衡量的。

> ## 多屏幕适配

适配的方式多样，可以采用相对长度单位，em、rem、%、vm等来实现.

> ## rem布局

CSS以rem为单位的元素，它的大小是相对于html根节点的font-size值的。

如果想要相同的内容在不同的设备上显示出相同的比例:

    设计稿元素尺寸/设计稿宽度=元素CSS像素/视口宽度

1. visual viewport宽度=ideal viewport宽度/当前缩放值=ideal viewport宽度×dpr
2. 元素CSS像素=设计稿元素尺寸/设计稿宽度×ideal viewport宽度×dpr

我们令 rem=ideal viewport宽度×dpr，则在书写CSS代码时， {property name}: {设计稿元素尺寸/设计稿宽度}rem。

html根元素的font-size应该设置成ideal viewport宽度×dpr，由于不同的手机ideal viewport宽度以及dpr不同，所以最好动态设置html根元素的font-size:

    var dpr, rem, scale;
    var docEl = document.documentElement;
    var styleEl = document.createElement( 'style' );
    var metaEl = document.querySelector( 'meta[name="viewport"]' );

    dpr = window.devicePixelRatio || 1;
    rem = docEl.screen.width * dpr / 10; // 这里除以10是为了让写CSS像素值时数值不至于太小
    scale = 1 / dpr;

    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute( 'content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no' );

    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute( 'data-dpr', dpr );

    // 动态写入样式，设置根节点字体大小
    docEl.firstElementChild.appendChild( styleEl );
    styleEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

这种方式，可以精确地算出不同屏幕所应有的rem基准值，缺点就是要加载这么一段js代码，并且编写CSS代码时要经过较复杂的换算（{property name}: {设计稿元素尺寸/设计稿宽度×10}rem）。

* 字体最好不要用rem。

一是通过rem表示的字体不精确，二是大多数设计要求在一定屏幕大小范围内，显示的字体一样大。

> 字体通常采用媒体查询的方式设置

CSS字体大小应该为：设计稿字体大小/设计稿倍数×dpr

媒体查询时应该查询device-width而不是width，原因是页面经缩放width会大于或小于屏幕宽度。



