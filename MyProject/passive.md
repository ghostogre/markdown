在项目中使用滑动的时候偶尔会报错：`Ignored attempt to cancel a touchstart event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.`

如英文所见的，显示不能关闭touchstart，touchstart的默认事件触发了与touchmove发生了冲突。

所以阻止默认事件就可以了，但是在搜索问题的时候我发现了一些很有趣的东西 -- passive和touch-action

其中**touch-action**是移动端一个与手势触摸密切相关的CSS属性，原本源自windows phone手机，微软系，后来被Chrome吸收借鉴，Firefox浏览器跟上，然后Safari也部分支持，目前已经可以说是在移动端可以畅行的CSS属性。

## **passive**

很多移动端的页面都会监听 touchstart 等 touch 事件，像这样：
```
document.addEventListener("touchstart", function(e){
    ... // 浏览器不知道这里会不会有 e.preventDefault()
})
```

由于 touchstart 事件对象的 cancelable 属性为 true，也就是说它的默认行为可以被监听器通过 preventDefault() 方法阻止，那它的默认行为是什么呢，通常来说就是滚动当前页面（还可能是缩放页面），如果它的默认行为被阻止了，页面就必须静止不动。但浏览器无法预先知道一个监听器会不会调用 preventDefault()，它能做的只有等监听器执行完后再去执行默认行为，而监听器执行是要耗时的，有些甚至耗时很明显，这样就会导致页面卡顿。视频里也说了，即便监听器是个空函数，也会产生一定的卡顿，毕竟空函数的执行也会耗时。

passive 的意思是“顺从的”，表示它不会对事件的默认行为说 no，浏览器知道了一个监听器是 passive 的，它就可以在两个线程里同时执行监听器中的 JavaScript 代码和浏览器的默认行为了。

## **事件监听器**

```
addEventListener(type, listener[, useCapture ]) // 控制监听器是在捕获阶段执行还是在冒泡阶段执行的 useCapture 参数
addEventListener(type, listener[, options ]) // 修订后第三个参数是对象
```

目前规范中 options 对象可用的属性有三个：
```
addEventListener(type, listener, {
  capture: false,
  passive: false,
  once: false
})
```
三个属性都是布尔类型的开关，默认值都为 false。其中 capture 属性等价于以前的 useCapture 参数；once 属性就是表明该监听器是一次性的，执行一次后就被自动 removeEventListener 掉，还没有浏览器实现它；passive 属性 Firefox 和 Chrome 已经实现。

#### **Tips:**

1. 在passive 的监听器里调用了 preventDefault()，preventDefault() 不会产生任何效果，浏览器的开发者工具也会发出警告。
2. 浏览器开发工具发现耗时超过 100 毫秒的非 passive 的监听器，警告你加上 {passive: true}

以前，在第三个参数是布尔值的时候，addEventListener("foo", listener, true) 添加的监听器，必须用 removeEventListener("foo", listener, true) 才能删除掉。因为这个监听器也有可能还注册在了冒泡阶段，那样的话，同一个监听器实际上对应着两个监听器对象（通过 getEventListeners() 可看到）。

那现在 addEventListener("foo", listener, {passive: true}) 添加的监听器该如何删除呢？答案是 removeEventListener("foo", listener) 就可以了，passive 可以省略。一个监听器同时是 passive 和非 passive（以及同时是 once 和非 once）是说不通的，如果你添加了两者，那么后添加的不算，浏览器会认为添加过了。

#### **VUE**

Vue 还对应 addEventListener 中的 passive 选项提供了 .passive 修饰符。
```
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

> 不要把 .passive 和 .prevent 一起使用，因为 .prevent 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，.passive 会告诉浏览器你不想阻止事件的默认行为。



