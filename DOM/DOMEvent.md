## **事件类型**

1. 点击: click
2. 滚轮: scroll
3. 滑动: move
4. 进入: enter
5. 加载: load

## **事件机制**

### 1. 事件的监听(事件的绑定)
    
* 通过on+事件名: 这种类型绑定的事件都叫做`DOM0级事件`。
* DOM0级事件，同一个元素的同一个事件监听，绑定的触发运行函数，不能重复绑定，有且只能绑定一回，下一次绑定的会将上一次的给覆盖掉
* 事件设为null，移除事件的监听
* 监听事件，不仅是浏览器的一种机制，也是浏览器赋予DOM文档元素的属性，即事件的监听是时刻存在的，但是事件触发时候运行的处理函数，是我们自己定义的

在JavaScript中，我们使用如下的方式为元素添加事件监听：

    element.addEventListener(<event-name>, <callback>, <use-capture>);

移除不再使用的事件监听是一个最佳实践。我们使用element.removeEventListener()方法来移除事件监听：

    element.removeEventListener(<event-name>, <callback>, <use-capture>);

有一点需要注意的是：你必须要有这个被绑定的回调函数的引用。意思就是说，我们不能使用匿名函数作为回调函数。

### 2. 注意点

一个很容易遇到的问题就是回调函数没有在预想的运行上下文被调用。

    var element = document.getElementById('element');

    var user = {
    firstname: 'Wilson',
    greeting: function(){
    alert('My name is ' + this.firstname);
    }
    };

    // Attach user.greeting as a callback
    element.addEventListener('click', user.greeting);

    // alert => 'My name is undefined'

当我们将greeting函数传给addEventListener方法的时候，我们传递的是一个函数的引用；user相应的上下文并没有传递过去。运行的时候，这个回调函数实际上是在element的上下文中被执行了，也就是说，在运行的时候，this指向的是element，而不是user。

    element.addEventListener('click', function() {
        user.greeting();
        // alert => 'My name is Wilson'
    });

我们不能获得回调函数的句柄以便后面通过.removeEventListener()移除事件监听。用.bind()方法(做为ECMAScript 5的标准内建在所有的函数对象中）来生成一个新的函数（被绑定过的函数），这个函数会在指定的上下文中被执行。然后我们将这个被绑定过的函数作为参数传给.addEventListener()的回调函数。

    // Overwrite the original function with
    // one bound to the context of 'user'
    user.greeting = user.greeting.bind(user);

    // Attach the bound user.greeting as a callback
    button.addEventListener('click', user.greeting);

    button.removeEventListener('click', user.greeting);

## **Event对象**

Event对象在event第一次触发的时候被创建出来，并且一直伴随着事件在DOM结构中流转的整个生命周期。event对象会被作为第一个参数传递给事件监听的回调函数。

1. type (String) — 事件的名称

2. target (node) — 事件起源的DOM节点

3. currentTarget?(node) — 当前回调函数被触发的DOM节点
   
4. bubbles (boolean) — 指明这个事件是否是一个冒泡事件

5. preventDefault(function) — 这个方法将阻止浏览器中用户代理对当前事件的相关默认行为被触发。

6. stopPropagation (function) — 这个方法将阻止当前事件链上后面的元素的回调函数被触发，当前节点上针对此事件的其他回调函数依然会被触发。
   
7. stopImmediatePropagation (function) — 这个方法将阻止当前事件链上所有的回调函数被触发，也包括当前节点上针对此事件已绑定的其他回调函数。

8. cancelable (boolean) — 这个变量指明这个事件的默认行为是否可以通过调用event.preventDefault来阻止。也就是说，只有cancelable为true的时候，调用event.preventDefault才能生效。

9.  defaultPrevented (boolean) — 这个状态变量表明当前事件对象的preventDefault方法是否被调用过

10. isTrusted (boolean) — 如果一个事件是由设备本身（如浏览器）触发的，而不是通过JavaScript模拟合成的，那个这个事件被称为可信任的(trusted)

11. eventPhase (number) — 这个数字变量表示当前这个事件所处的阶段(phase):none(0), capture(1),target(2),bubbling(3)。我们会在下一个部分介绍事件的各个阶段

12. timestamp (number) — 事件发生的时间

## **事件阶段**

当一个DOM事件被触发的时候，它并不只是在它的起源对象上触发一次，而是会经历三个不同的阶段。简而言之：事件一开始从文档的根节点流向目标对象（捕获阶段），然后在目标对向上被触发（目标阶段），之后再回溯到文档的根节点（冒泡阶段）。

![事件流](../Image/eventflow.png)

### 事件捕获阶段

事件的第一个阶段是捕获阶段。事件从文档的根节点出发，随着DOM树的结构向事件的目标节点流去。途中经过各个层次的DOM节点，并在各节点上触发捕获事件，直到到达事件的目标节点。捕获阶段的主要任务是建立传播路径，在冒泡阶段，事件会通过这个路径回溯到文档跟节点。

我们可以通过将addEventListener的第三个参数设置成true来为事件的捕获阶段添加监听回调函数。在实际应用中，我们并没有太多使用捕获阶段监听的用例，但是通过在捕获阶段对事件的处理，我们可以阻止类似clicks事件在某个特定元素上被触发。

    var form = document.querySelector('form');

    form.addEventListener('click', function(event) {
    event.stopPropagation();
    }, true); // Note: 'true'

如果你对这种用法不是很了解的话，最好还是将useCapture设置为false或者undefined，从而在冒泡阶段对事件进行监听。

### 目标阶段（Target Phase）

当事件到达目标节点的，事件就进入了目标阶段。事件在目标节点上被触发，然后会逆向回流，直到传播至最外层的文档节点。

对于多层嵌套的节点，鼠标和指针事件经常会被定位到最里层的元素上。

### 冒泡阶段（Bubble Phase）

事件在目标元素上触发后，并不在这个元素上终止。它会随着DOM树一层层向上冒泡，直到到达最外层的根节点。也就是说，同一个事件会依次在目标节点的父节点，父节点的父节点。直到最外层的节点上被触发。

可以通过调用事件对象的`stopPropagation`方法，在任何阶段（捕获阶段或者冒泡阶段）中断事件的传播。此后，事件不会在后面传播过程中的经过的节点上调用任何的监听函数。

如果你希望阻止当前节点上的其他回调函数被调用的话，你可以使用更激进的`event.stopImmediatePropagation()`方法。

浏览器并不是唯一能触发DOM事件的载体。我们可以创建`自定义的事件`并把它们分派给你文档中的任意节点。这些自定义的事件和通常的DOM事件有相同的行为。

    var myEvent = new CustomEvent("myevent", {
        detail: {
            name: "Wilson"
        },
        bubbles: true,
        cancelable: false
    });

    // Listen for 'myevent' on an element
    myElement.addEventListener('myevent', function(event) {
        alert('Hello ' + event.detail.name);
    });

    // Trigger the 'myevent'
    myElement.dispatchEvent(myEvent);

## 代理事件监听(事件委托)

代理事件监听可以让你使用一个事件监听器去监听大量的DOM节点的事件，在这种情况下，它是一种更加方便并且高性能的事件监听方法。

代理事件监听可以让我们更简单的处理这种情况。我们不去监听所有的子元素的click事件，相反，我们监听他们的父元素。当一个子元素被点击的时候，这个事件会向上冒泡至父元素，触发回调函数。我们可以通过检查事件的event.target属性来判断具体是哪一个子元素被点击了。

    var list = document.querySelector('ul');

    list.addEventListener('click', function(event) {
    var target = event.target;

    while (target.tagName !== 'LI') {
        target = target.parentNode;
        if (target === list) return;
    }

    // Do stuff here
    });

并不建议在项目中使用上面的这个粗糙的实现。相反，使用一个事件代理的JavaScript库是更好的选择。如果你在使用jQuery，你可以在调用.on()方法的时候，将一个选择器作为第二个参数的方式来轻松的实现事件代理。

    // Not using event delegation
    $('li').on('click', function(){});

    // Using event delegation
    $('ul').on('click', 'li', function(){});

### load

`load事件`可以在任何资源（包括被依赖的资源）被加载完成时被触发，这些资源可以是图片，css，脚本，视频，音频等文件，也可以是document或者window。

`window.onbeforeunload`让开发人员可以在想用户离开一个页面的时候进行确认。这个在有些应用中非常有用，比如用户不小心关闭浏览器的tab，我们可以要求用户保存他的修改和数据，否则将会丢失他这次的操作。对页面添加onbeforeunload处理会导致浏览器不对页面进行缓存，这样会影响页面的访问响应时间。同时，onbeforeunload的处理函数必须是同步的。


