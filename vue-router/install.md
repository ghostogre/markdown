### 1. install

Vue 通过 use 方法，加载VueRouter中的 install 方法。install 完成 Vue 实例对 VueRouter 的挂载过程。

```

    
import View from './components/view'
import Link from './components/link'
// 判断是否安装了Vue
export let _Vue

export function install (Vue) {
  // 是否安装，如果已经安装了设置installed，防止重复安装
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  // 是否未定义
  const isDef = v => v !== undefined

  // 注册实例，实现对router-view的挂载操作
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode // 父节点
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  // 混入 beforeCreate 钩子
  Vue.mixin({
    beforeCreate () {
      // 在option上面存在router则代表是根组件 
      if (isDef(this.$options.router)) {
        this._routerRoot = this // 设置根组件
        this._router = this.$options.router
        // 执行_router实例的 init 方法
        this._router.init(this)
        // 为 vue 实例定义数据劫持
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 非根组件则直接从父组件中获取
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
 
  // 设置代理，当访问 this.$router 的时候，代理到 this._routerRoot._router
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 设置代理，当访问 this.$route 的时候，代理到 this._routerRoot._route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
 
  // 注册 router-view 和 router-link 组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // Vue钩子合并策略
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
  // ...
}
```

为了让 _router 的变化能及时响应页面的更新，所以又接着又调用了 `Vue.util.defineReactive`方法来进行get和set的响应式数据定义。

因为只有 router-view 组件定义了`data.registerRouteInstance`函数。`data.registerRouteInstance` 主要用来执行 render 的操作，创建 router-view 组件的 Vnode ：

```
data.registerRouteInstance = (vm, val) => {
  // ...
  return h(component, data, children)
}
```
