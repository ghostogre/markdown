### html5

在hash.js里面调用的方法：

```
// 返回当前带有query和hash的路径
export function getLocation (base: string): string {
  // 对当前路径进行decode
  // www.baidu.com/a --> path = '/a'
  let path = decodeURI(window.location.pathname)
  if (base && path.indexOf(base) === 0) {
    // 去除URL基路径
    path = path.slice(base.length)
  }
  // path + '?q=' + '#part1'
  return (path || '/') + window.location.search + window.location.hash
}
```

`vue-router`通过设置`mode = history`可以在浏览器支持 `history` 模式的情况下，用来开启 `HTML5History` 模式。

```
  constructor (router: Router, base: ?string) {
    // 实现 base 基类中的构造函数
    super(router, base)
    
    // 滚动信息处理
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      setupScroll()
    }

    const initLocation = getLocation(this.base) // 获取初始化地址
    // 监听popstate
    window.addEventListener('popstate', e => {
      const current = this.current

      // 避免在有的浏览器中第一次加载路由就会触发 `popstate` 事件
      const location = getLocation(this.base)
      if (this.current === START && location === initLocation) {
        return
      }
      // 执行跳转动作
      this.transitionTo(location, route => {
        if (supportsScroll) {
          handleScroll(router, route, current, true)
        }
      })
    })
  }
```
