
## **HTMLElement.offsetWidth**

是一个只读属性，返回一个元素的布局宽度。一个典型的offsetWidth是测量包含元素的边框(border)、水平线上的内边距(padding)、竖直方向滚动条(scrollbar)、以及CSS设置的宽度(width)的值。

这个属性将会四舍五入为一个整数。如果你想要一个小数值,请使用`element.getBoundingClientRect()`.

> https://mdn.mozillademos.org/files/347/Dimensions-offset.png

## **Element.clientWidth 属性**

表示元素的内部宽度，以像素计。该属性包括内边距，但不包括垂直滚动条（如果有）、边框和外边距。

> https://mdn.mozillademos.org/files/346/Dimensions-client.png

## **HTMLElement.offsetParent**

是一个只读属性，返回一个指向最近的包含该元素的定位元素。如果没有定位的元素，则 offsetParent 为最近的 table, table cell 或根元素（标准模式下为 html；quirks 模式下为 body）。

当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。offsetParent 很有用，因为 offsetTop 和 offsetLeft 都是相对于其内边距边界的。

## **鼠标事件**

MouseEvent 接口指用户与指针设备( 如鼠标 )交互时发生的事件。使用此接口的常见事件包括：click，dblclick，mouseup，mousedown。

**只读属性**

1. **MouseEvent.clientX:** 鼠标指针在可视区域中的X坐标
2. **MouseEvent.clientY:** 鼠标指针在可视区域中的Y坐标
3. **MouseEvent.offsetX:** 鼠标指针相对于点击的元素内边位置的X坐标(padding以内)
4. **MouseEvent.offsetY:** 鼠标指针相对于点击的元素内边位置的Y坐标(padding以内)
5. **MouseEvent.screenX:** 鼠标指针相对于全局（屏幕）的X坐标
6. **MouseEvent.screenY:** 鼠标指针相对于全局（屏幕）的Y坐标
7. **MouseEvent.pageX:** 鼠标指针相对于整个文档的X坐标
8. **MouseEvent.pageY:** 鼠标指针相对于整个文档的Y坐标

> https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent

## **触摸事件**

TouchEvent 是一类描述手指在触摸平面的状态变化的事件。这类事件用于描述一个或多个触点，使开发者可以检测触点的移动，触点的增加和减少，等等。

每个 Touch 对象代表一个触点; 每个触点都由其位置，大小，形状，压力大小，和目标 element 描述。 TouchList 对象代表多个触点的一个列表.

1. **TouchEvent.changedTouches**: 一个 TouchList 对象，包含了代表所有从上一次触摸事件到此次事件过程中，状态发生了改变的触点的 Touch 对象。
2. **TouchEvent.targetTouches**: 一个TouchList，包含所有仍与触摸平面接触并且touchstart事件与当前事件在同一个目标元素上发生的Touch对象。
3. **TouchEvent.touches**: 一个 TouchList，其会列出所有当前在与触摸表面接触的  Touch 对象，不管触摸点是否已经改变或其目标元素是在处于 touchstart 阶段。

为了区别触摸相关的状态改变，存在**多种类型的触摸事件**。可以通过检查触摸事件的 `TouchEvent.type` 属性来确定当前事件属于哪种类型

> 不同浏览器上 touchmove 事件的触发频率并不相同。这个触发频率还和硬件设备的性能有关。因此决不能让程序的运作依赖于某个特定的触发频率

**touchcancel**: 触摸中断(比如弹出框)

## **其他属性**

**offsetTop, offsetLeft**：要确定的这两个属性的值，首先得确定元素的offsetParent。offsetParent指的是距该元素最近的position不为static的祖先元素，如果没有则指向body元素。确定了offsetParent，offsetLeft指的是元素左侧偏移offsetParent的距离，同理offsetTop指的是上侧偏移的距离。

**offsetHeight, offsetWidth**：这两个属性返回的是元素的高度或宽度，包括元素的边框、内边距和滚动条。返回值是一个经过四舍五入的整数。

**scrollHeight, scrollWidth**：只读属性。返回元素内容的整体尺寸，包括元素看不见的部分（需要滚动才能看见的）。返回值包括padding，但不包括margin和border。

**clientHeight, clientWidth**：包括padding，但不包括border, margin和滚动条。

**window.innerWidth, window.innerHeight**：只读。视口（viewport）的尺寸，包含滚动条

**scrollTop, scrollLeft**：如果元素不能被滚动，则为0。

