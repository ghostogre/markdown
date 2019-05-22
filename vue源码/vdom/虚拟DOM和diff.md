### 虚拟DOM

virtual DOM是将真实的DOM的数据抽取出来，以对象的形式模拟树形结构。

### diff算法

diff可是逐层比较的，如果第一层不一样那么就不会继续深入比较第二层了。在采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。

当数据发生改变时，`set`方法会让调用`Dep.notify`通知所有订阅者`Watcher`，订阅者就会调用`patch`给真实的`DOM`打补丁，更新相应的视图。

#### patch函数

接收两个参数 `oldVnode` 和 `Vnode` 分别代表新的节点和之前的旧节点。

* 如果两个节点都是一样的，那么就深入检查他们的子节点，是则执行`patchVnode`
* 如果两个节点不一样那就说明`Vnode`完全被改变了，就可以**直接替换**`oldVnode`。

#### patchVnode

1. 找到对应的真实dom，称为`el`。
2. 判断`Vnode`和`oldVnode`是否指向同一个对象，如果是，那么直接return
3. 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`Vnode`的文本节点。
4. 如果`oldVnode`有子节点而`Vnode`没有，则删除`el`的子节点
5. 如果`oldVnode`没有子节点而`Vnode`有，则将`Vnode`的子节点真实化之后添加到el
6. 如果两者都有子节点，则执行`updateChildren`函数比较子节点

#### updateChildren

1. 将`Vnode`的子节点`Vch`和`oldVnode`的子节点`oldCh`提取出来。
2. `oldCh`和`vCh`各有两个头尾的变量`StartIdx`和`EndIdx`，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，**如果设置了key，就会用key进行比较**，在比较的过程中，变量会往中间靠，一旦`StartIdx>EndIdx`表明`oldCh`和`vCh`至少有一个已经遍历完了，就会结束比较。


