## **.postcssrc.js**

```
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "autoprefixer": {}
  }
}
```
1. `postcss-import` 主要功有是解决@import引入路径问题。
2. `postcss-url` 主要用来处理文件，比如图片文件、字体文件等引用路径的处理。在Vue项目中，vue-loader已具有类似的功能，只需要配置中将vue-loader配置进去。
3. `autoprefixer` 插件是用来自动处理浏览器前缀的一个插件。如果你配置了postcss-cssnext，其中就已具备了autoprefixer的功能。

要完成vw的布局兼容方案，还需要配置下面的几个PostCSS插件:
```
npm i postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano --S
```

`.postcssrc.js` 文件对新安装的PostCSS插件进行配置：
```
module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-aspect-ratio-mini": {}, 
        "postcss-write-svg": {
            utf8: false
        },
        "postcss-cssnext": {},
        "postcss-px-to-viewport": {
            viewportWidth: 750,     // (Number) The width of the viewport.
            viewportHeight: 1334,    // (Number) The height of the viewport.
            unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
            viewportUnit: 'vw',     // (String) Expected units.
            selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
            minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
            mediaQuery: false       // (Boolean) Allow px to be converted in media queries.
        }, 
        "postcss-viewport-units":{},
        "cssnano": {
            preset: "advanced",
            autoprefixer: false,
            "postcss-zindex": false
        }
    }
}
```

特别声明： 由于 cssnext 和 cssnano 都具有 autoprefixer ,事实上只需要一个，所以把默认的 autoprefixer 删除掉，然后把 cssnano 中的 autoprefixer 设置为 false 。对于其他的插件使用，稍后会简单的介绍。

---

`postcss-cssnext` 其实就是 cssnext 。该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理。

---

`cssnano` 主要用来压缩和清理CSS代码。在Webpack中， cssnano 和 css-loader 捆绑在一起，所以不需要自己加载它。不过你也可以使用 postcss-loader 显式的使用 cssnano 。

在 cssnano 的配置中，使用了 preset: "advanced" ，所以我们需要另外安装：
```
npm i cssnano-preset-advanced --save-dev
```
cssnano 集成了一些 其他的PostCSS插件 ，如果你想禁用 cssnano 中的某个插件的时候，可以像下面这样操作：
```
"cssnano": {
    autoprefixer: false,
    "postcss-zindex": false
}
```
上面的代码把 autoprefixer 和 postcss-zindex 禁掉了。前者是有重复调用，后者是一个讨厌的东东。只要启用了这个插件， z-index 的值就会重置为 1 。这是一个天坑， 千万记得将 postcss-zindex 设置为 false 。

---

`postcss-px-to-viewport` 插件主要用来把 px 单位转换为 vw 、 vh 、 vmin 或者 vmax 这样的视窗单位，也是 vw 适配方案 的核心插件之一。

```
"postcss-px-to-viewport": {
    viewportWidth: 750,      // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
    viewportHeight: 1334,    // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
    unitPrecision: 3,        // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    viewportUnit: 'vw',      // 指定需要转换成的视窗单位，建议使用vw
    selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
    minPixelValue: 1,       // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
    mediaQuery: false       // 允许在媒体查询中转换`px`
}
```

在不想要把 px 转换为 vw 的时候，首先在对应的元素（ html ）中添加配置中指定的类名 .ignore 或 .hairlines ( .hairlines 一般用于设置 border-width:0.5px 的元素中)

---

`postcss-aspect-ratio-mini` 主要用来处理元素容器宽高比。在实际使用的时候，具有一个默认的结构
```
<div aspectratio>
  <div aspectratio-content></div>
</div>
```

在实际使用的时候，你可以把自定义属性 aspectratio 和 aspectratio-content 换成相应的类名，比如：
```
<div class="aspectratio">
  <div class="aspectratio-content"></div>
</div>
```

自定义属性和类名所起的作用是同等的。

结构定义之后，需要在你的样式文件中添加一个统一的宽度比默认属性。
```
[aspectratio] {
  position: relative;
}
[aspectratio]::before {
  content: '';
  display: block;
  width: 1px;
  margin-left: -1px;
  height: 0;
}
[aspectratio-content] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
```

如果我们想要做一个 188:246 （ 188 是容器宽度， 246 是容器高度）这样的比例容器，只需要这样使用：
```
[w-188-246] {
    aspect-ratio: '188:246';
}
```

`aspect-ratio` 属性不能和其他属性写在一起，否则编译出来的属性只会留下 aspect-ratio 的值，比如：
```
<div aspectratio w-188-246 class="color"></div>
```

编译前的CSS如下：
```
[w-188-246] {
  width: 188px;
  background-color: red;
  aspect-ratio: '188:246';
}
```
编译之后：
```
[w-188-246]:before {
    padding-top: 130.85106382978725%;
}
```
主要是因为在插件中做了相应的处理，不在每次调用 aspect-ratio 时，生成前面指定的默认样式代码，这样代码没那么冗余。所以在使用的时候，需要把 width 和 background-color 分开来写：
```
[w-188-246] {
    width: 188px;
    background-color: red;
}
[w-188-246] {
    aspect-ratio: '188:246';
}
```
这个时候，编译出来的CSS就正常了：
```
[w-188-246] {
    width: 25.067vw;
    background-color: red;
}
[w-188-246]:before {
    padding-top: 130.85106382978725%;
}
```



---

`postcss-viewport-units` 插件主要是给CSS的属性添加 content 的属性，配合 viewport-units-buggyfill 库给 vw 、 vh 、 vmin 和 vmax 做适配的操作。


