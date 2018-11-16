Normalize.css 只是一个很小的CSS文件，但它在默认的HTML元素样式上提供了跨浏览器的高度一致性。相比于传统的CSS reset，Normalize.css是一种现代的、为HTML5准备的优质替代方案。

    npm install --save normalize.css

    import 'normalize.css'

在设计网页查看自己的css效果时，有时候会发现自己写的样式无法起作用，查看了一下样式，发现是user agent stylesheet 的样式将我们写的样式给覆盖了，user agent stylesheet 是浏览器默认的样式，浏览器的css样式渲染了我们的html。


