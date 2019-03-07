# HTTP

`url.resolve()` 方法会以一种 Web 浏览器解析超链接的方式把一个目标 URL 解析成相对于一个基础 URL。

    const url = require('url');
    url.resolve('/one/two/three', 'four');         // '/one/two/four'
    url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
    url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'


