### History

> /src/history/base.js

其他History继承这个基类。

```
  constructor (router: Router, base: ?string) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = START // START存在于../util/route
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
  }

  listen (cb: Function) {
    this.cb = cb
  }

  transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // 调用index.jd里VueRouter的match方法
    const route = this.router.match(location, this.current)
    // 调用this.confirmTransition，执行路由转换
    this.confirmTransition(route, () => {
      // 跳转完成
      // 更新 route
      this.updateRoute(route)
      // 执行 onComplete
      onComplete && onComplete(route)
      // 更新浏览器 url
      this.ensureURL()

      // 调用 ready 的回调
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => { cb(route) })
      }
    }, err => {
      // 处理异常
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => { cb(err) })
      }
    })
  }

  updateRoute (route: Route) {
    const prev = this.current
    // 当前路由更新
    this.current = route
    // cb 执行
    this.cb && this.cb(route)
    // 调用 afterEach 钩子
    this.router.afterHooks.forEach(hook => {
      hook && hook(route, prev)
    })
  }

  // 跳转动作
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    // 定义中断处理
    const abort = err => {
      if (isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => { cb(err) })
        } else {
          warn(false, 'uncaught error during route navigation:')
          console.error(err)
        }
      }
      onAbort && onAbort(err)
    }
    // 同路由且 matched.length 相同
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      route.matched.length === current.matched.length
    ) {
      this.ensureURL()
      return abort()
    }

    const {
      updated,
      deactivated,
      activated
    } = resolveQueue(this.current.matched, route.matched)

    // 整个切换周期的队列
    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      // 得到即将被销毁组件的 beforeRouteLeave 钩子函数
      extractLeaveGuards(deactivated),
      // global before hooks
      // 全局 router before hooks
      this.router.beforeHooks,
      // in-component update hooks
      // 得到组件 updated 钩子
      extractUpdateHooks(updated),
      // in-config enter guards
      // 将要更新的路由的 beforeEnter 钩子
      activated.map(m => m.beforeEnter),
      // async components
      // 异步组件
      resolveAsyncComponents(activated)
    )

    this.pending = route
    // 每一个队列执行的 iterator 函数
    const iterator = (hook: NavigationGuard, next) => {
      // 如果当前处理的路由，已经不等于 route 则终止处理
      if (this.pending !== route) {
        return abort()
      }
      try {
        // hook 是queue 中的钩子函数，在这里执行
        hook(route, current, (to: any) => {
          // 参数就是钩子函数里的to，from，next
          // 钩子函数外部执行的 next 方法
          // next(false): 中断当前的导航。
          // 如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)
          // 那么 URL 地址会重置到 from 路由对应的地址。
          if (to === false || isError(to)) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true) // 跳转操作确认（传入false就是replace）
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' && (
              typeof to.path === 'string' ||
              typeof to.name === 'string'
            ))
          ) {
            // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。
            // 当前的导航被中断，然后进行一个新的导航。
            abort()
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }
    
    // 执行队列 leave 和 beforeEnter 相关钩子
    runQueue(queue, iterator, () => {
      const postEnterCbs = []
      const isValid = () => this.current === route
      // 获取 beforeRouteEnter 钩子函数
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
      // 获取 beforeResolve 钩子函数 并合并生成另一个 queue
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        // 处理完，就不需要再次执行
        if (this.pending !== route) {
          return abort()
        }
        // 清空
        this.pending = null
        // 调用onComplete
        onComplete(route)
        if (this.router.app) {
          // nextTick 执行 postEnterCbs 所有回调
          this.router.app.$nextTick(() => {
            postEnterCbs.forEach(cb => { cb() })
          })
        }
      })
    })
  }
```

##### resolveQueue

`resolveQueue`就是交叉比对当前路由的路由记录和现在的这个路由的路由记录来确定出哪些组件需要更新，哪些需要激活，哪些组件被卸载。再执行其中的对应钩子函数

```
function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  updated: Array<RouteRecord>,
  activated: Array<RouteRecord>,
  deactivated: Array<RouteRecord>
} {
  let i
  // 获取当前route的matched和目标route的matched的长度
  // 获取最大深度
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    // 记录不一样则停止
    if (current[i] !== next[i]) {
      break
    }
  }
  // 分别返回哪些需要更新，哪些需要激活，哪些需要卸载
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

```

#### extractLeaveGuards/extractUpdateHooks

```
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  // 设置了最后的一个true是倒序触发钩子
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

// 将生命周期绑定到组件实例上
function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

// 遍历matched里的components
function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  // flatMapComponents返回组件的一些属性
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    // 获取组件的 beforeRouteLeave 钩子函数
    const guard = extractGuard(def, name)
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  return flatten(reverse ? guards.reverse() : guards)
}

// 创建一个Vue的子类获得他里面的钩子函数
function extractGuard (
  def: Object | Function,
  key: string
): NavigationGuard | Array<NavigationGuard> {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    // 创建一个Vue的子类, .vue会被 vue-loader 转换成一个 options 对象
    def = _Vue.extend(def)
  }
  return def.options[key]
}

export function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {
  return flatten(matched.map(m => {
    // 遍历得到组件的 template, instance, match，和组件名
    return Object.keys(m.components).map(key => fn(
      m.components[key],
      m.instances[key],
      m, key
    ))
  }))
}

// 抹平数组得到一个一维数组
export function flatten (arr: Array<any>): Array<any> {
  return Array.prototype.concat.apply([], arr)
  // 如果参数 arr 是单个值，则 list 为 [ arr ]，如果是数组，则 list 就等于该数组
}

export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    // 如果全部执行完成则执行回调函数 cb
    if (index >= queue.length) {
      cb()
    } else {
      // 如果存在对应的函数
      if (queue[index]) {
        // 这里的 fn 传过来的是个 iterator 函数
        fn(queue[index], () => {
          // 执行队列中的下一个元素
          step(index + 1)
        })
      } else {
        // 执行队列中的下一个元素
        step(index + 1)
      }
    }
  }
  // 默认执行钩子队列中的第一个数据
  step(0)
}

```

##### vue-router/src/util/resolve-components.js

```
// resolveAsyncComponents
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {
  // 返回“异步”钩子函数
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    flatMapComponents(matched, (def, _, match, key) => {
      // 这里假定说路由上定义的组件是函数, 但是没有 options
      // 就认为他是一个异步组件
      // 这里并没有使用 Vue 默认的异步机制的原因是我们希望在得到真正的异步组件之前
      // 整个的路由导航是一直处于挂起状态
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true
        // ...
      }
    })

    if (!hasAsync) next()
  }
}
```

这里主要是用来处理异步组件的问题，通过判断路由上定义的组件是函数且没有 options 来确定异步组件，然后在得到真正的异步组件之前将其路由挂起。


---

##### 流程

1. 执行transitionTo函数，先得到需要跳转路由的 match 对象route
2. 执行confirmTransition函数
3. confirmTransition函数内部判断是否是需要跳转，如果不需要跳转，则直接中断返回
4. confirmTransition判断如果是需要跳转，则先得到钩子函数的任务队列 queue
5. 通过 runQueue 函数来批次执行任务队列中的每个方法。
6. 在执 queue 的钩子函数的时候，通过iterator来构造迭代器由用户传入 next方法，确定执行的过程
一直到整个队列执行完毕后，开始处理完成后的回调函数。

处理完整个钩子函数队列之后将要执行的回调主要就是接入路由组件后期的钩子函数beforeRouteEnter和beforeResolve，并进行队列执行。一切处理完成后，开始执行transitionTo的回调函数onComplete



