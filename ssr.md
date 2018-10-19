# VUE服务器渲染

    vue & vue-server-renderer 2.3.0+
    vue-router 2.5.0+
    vue-loader 12.0.0+ & vue-style-loader 3.0.0+

Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。

只是用来改善少数营销页面的 SEO，那么你可能需要预渲染。如果你使用 webpack，你可以使用**prerender-spa-plugin**轻松地添加预渲染。

    npm install vue vue-server-renderer --save

vue-server-renderer 依赖一些 Node.js 原生模块，因此只能在 Node.js 中使用。

    // 第 1 步：创建一个 Vue 实例
    const Vue = require('vue')
    const app = new Vue({
    template: `<div>Hello World</div>`
    })

    // 第 2 步：创建一个 renderer
    const renderer = require('vue-server-renderer').createRenderer()

    // 第 3 步：将 Vue 实例渲染为 HTML
    renderer.renderToString(app, (err, html) => {
    if (err) throw err
    console.log(html)
    // => <div data-server-rendered="true">Hello World</div>
    })

    // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
    renderer.renderToString(app).then(html => {
    console.log(html)
    }).catch(err => {
    console.error(err)
    })

在 Node.js 服务器中使用时相当简单直接，例如 Express

    const Vue = require('vue')
    const server = require('express')()
    const renderer = require('vue-server-renderer').createRenderer()

    server.get('*', (req, res) => {
        const app = new Vue({
            data: {
                url: req.url
            },
            template: `<div>访问的 URL 是： {{ url }}</div>`
        })

        renderer.renderToString(app, (err, html) => {
            if (err) {
                res.status(500).end('Internal Server Error')
                return
            }
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                    <head><title>Hello</title></head>
                    <body>${html}</body>
                </html>
            `)
        })
    })

    server.listen(8080)

当你在渲染 Vue 应用程序时，renderer 只从应用程序生成 HTML 标记(markup)。在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。为了简化这些，你可以直接在创建 renderer 时提供一个页面模板。

注意模板里 <!--vue-ssr-outlet--> 注释 -- 这里将是应用程序 HTML 标记注入的地方。

    const renderer = createRenderer({
        template: require('fs').readFileSync('./index.template.html', 'utf-8')
    })

    renderer.renderToString(app, (err, html) => {
        console.log(html) // html 将是注入应用程序内容的完整页面
    })

模板还支持 __简单插值__。

    <html>
    <head>
        <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
        <title>{{ title }}</title>

        <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
        {{{ meta }}}
    </head>
    <body>
        <!--vue-ssr-outlet-->
    </body>
    </html>

可以通过传入一个"渲染上下文对象"，作为 renderToString 函数的第二个参数，来提供插值数据。也可以与 Vue 应用程序实例共享 context 对象，允许模板插值中的组件动态地注册数据。

    const context = {
        title: 'hello',
        meta: `
            <meta ...>
            <meta ...>
        `
    }

    renderer.renderToString(app, context, (err, html) => {
        // 页面 title 将会是 "Hello"
        // meta 标签也会注入
    })

## 编写**通用**代码

约束条件 - 即运行在服务器和客户端的代码。

在纯客户端应用程序中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：**每个请求**应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染.

因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

由于没有动态更新，所有的**生命周期钩子函数**中，只有 beforeCreate 和 created 会在服务器端渲染(SSR)过程中被调用。这就是说任何其他生命周期钩子函数中的代码，只会在客户端执行。应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码

## 源码结构

1. 避免状态单例

    Node.js 服务器是一个长期运行的进程。当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。不应该直接创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数，为每个请求创建新的应用程序实例。

        // app.js
        const Vue = require('vue')

        module.exports = function createApp (context) {
            return new Vue({
                data: {
                    url: context.url
                },
                template: `<div>访问的 URL 是： {{ url }}</div>`
            })
        }

        // server.js
        const createApp = require('./app')

        server.get('*', (req, res) => {
            const context = { url: req.url }
            const app = createApp(context)

            renderer.renderToString(app, (err, html) => {
                // 处理错误……
                res.end(html)
            })
        })

    同样的规则也适用于 router、store 和 event bus 实例。你不应该直接从模块导出并将其导入到应用程序中，而是需要在 createApp 中创建一个新的实例，并从根 Vue 实例注入。


