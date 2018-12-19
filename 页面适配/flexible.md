## **使用Flexible实现手淘H5页面的终端适配**
```
https://github.com/amfe/article/issues/17
```
注意事项：

    使用flexible的时候不能添加viewport，要让flexible帮你添加，否则不会在html上添加data-dpr，px2rem的/*px*/不能生效

## **amfe-flexible**

**1. DOMContentLoaded**

当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。load 应该仅用于检测一个完全加载的页面。`DOMContentLoaded` 事件必须等待其所属script之前的样式表加载解析完成才会触发。

**设置body字体大小**



**设置rem**

以页面的10分之一为基础设置`font-size`。当页面resize的时候重置rem，pageshow的时候判断e.persisted为true(网页加载自缓存的时候)重置rem。

> 当一条会话历史记录被执行的时候将会触发页面显示(pageshow)事件。

**测试是否支持1px**

当dpr大于等于2的时候，假如不支持加入`hairlines`类到根节点。
