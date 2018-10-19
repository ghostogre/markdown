# 骨架屏
### 尽快渲染出首屏，减少白屏时间
1. 优化 Critical Rendering Path(关键渲染路径)，尽可能减少阻塞渲染的 JavaScript 和 CSS。常见做法包括使用 async/defer 让浏览器下载 JavaScript 的同时不阻塞 HTML 解析，内联页面关键部分的样式到 HTML 中等。
2. 使用 Service Worker 缓存 AppShell，加快后续访问速度。
3. 使用 HTTP/2 Server Push，帮助浏览器尽早发现静态资源，减少请求数。浅谈 HTTP/2 Server Push一文介绍了 Ele.me 在这方面的实践，推送 API 请求而非静态资源。

骨架屏可以看成一个简单的**关键渲染路径**，由于只是页面的大致框架，样式不会太复杂，内联在 HTML 中体积很小。使用 Service Worker 缓存包含骨架屏的 HTML 页面之后，从缓存中取出展示速度更快。



    https://lavas.baidu.com/guide