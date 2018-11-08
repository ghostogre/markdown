最终的解决方案，就是使用 viewport 的polyfill： Viewport Units Buggyfill 。使用 viewport-units-buggyfill 主要分以下几步走：

# 引入JavaScript文件

`viewport-units-buggyfill`主要有两个JavaScript文件： viewport-units-buggyfill.js和viewport-units-buggyfill.hacks.js 。

你只需要在你的HTML文件中引入这两个文件。比如在Vue项目中的 index.html 引入它们：
```
<script src="https://g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
```

第二步，在**HTML文件中**调用 viewport-units-buggyfill ，比如：
```
<script>
    window.onload = function () {
        window.viewportUnitsBuggyfill.init({
            hacks: window.viewportUnitsBuggyfillHacks
        });
    }
</script>
```

在你的CSS中，只要使用到了 viewport 的单位（ vw 、 vh 、 vmin 或 vmax ）地方，需要在样式中添加 content ：
```
.my-viewport-units-using-thingie {
    width: 50vmin;
    height: 50vmax;
    top: calc(50vh - 100px);
    left: calc(50vw - 100px);
    /* hack to engage viewport-units-buggyfill */
    content: 'viewport-units-buggyfill; width: 50vmin; height: 50vmax; top: calc(50vh - 100px); left: calc(50vw - 100px);';
}
```

这个时候就需要前面提到的 postcss-viewport-units 插件 。这个插件将让你无需关注 content 的内容，插件会自动帮你处理。

但是 content 也会引起一定的副作用。比如 img 和伪元素 ::before ( :before )或 ::after （ :after ）。在 img 中 content 会引起部分浏览器下，图片不会显示。这个时候需要全局添加(在main.js 用 Import '@/common/index.css')：
```
img {
    content: normal !important;
}
```

对于 ::after 之类的，就算是里面使用了 vw 单位， Viewport Units Buggyfill 对其并不会起作用。

```
// 编译前
.after {
    content: 'after content';
    display: block;
    width: 100px;
    height: 20px;
    background: green;
}
// 编译后
.after[data-v-469af010] {
    content: "after content";
    display: block;
    width: 13.333vw;
    height: 2.667vw;
    background: green;
}
```