### 源码

```

// routes为我们初始化VueRouter的路由配置
// router就是我们的VueRouter实例
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  // pathList是根据routes生成的path数组
  // pathMap是根据path的名称生成的map
  // 如果我们在路由配置上定义了name，那么就会有这么一个name的Map
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  // 根据新的routes生成路由
  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  // 路由匹配函数
  function match (
    raw: RawLocation, // 目标url
    currentRoute?: Route, // 当前url对应的route对象
    redirectedFrom?: Location // 重定向
  ): Route {
    // 解析当前 url，得到 hash、path、query和name等信息
    const location = normalizeLocation(raw, currentRoute, false, router)

    const { name } = location
    // 如果是命名路由
    if (name) {
      // 得到路由记录
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      // 不存在记录则会返回
      if (!record) return _createRoute(null, location)
      // regex是路径的正则表达式，可以匹配符合基路径
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }
      // 复制 currentRoute.params 到  location.params
      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }
      // 如果存在 record 记录
      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`)
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      // 处理非命名路由
      location.params = {}
      // 这里会遍历pathList，找到合适的record，因此命名路由的record查找效率更高
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record: RouteRecord,
    location: Location
  ): Route {
    const originalRedirect = record.redirect
    let redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect

    if (typeof redirect === 'string') {
      redirect = { path: redirect }
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, `invalid redirect option: ${JSON.stringify(redirect)}`
        )
      }
      return _createRoute(null, location)
    }

    const re: Object = redirect
    const { name, path } = re
    let { query, hash, params } = location
    query = re.hasOwnProperty('query') ? re.query : query
    hash = re.hasOwnProperty('hash') ? re.hash : hash
    params = re.hasOwnProperty('params') ? re.params : params

    if (name) {
      // resolved named direct
      const targetRecord = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, `redirect failed: named route "${name}" not found.`)
      }
      return match({
        _normalized: true,
        name,
        query,
        hash,
        params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      const rawPath = resolveRecordPath(path, record)
      // 2. resolve params
      const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`)
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query,
        hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`)
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record: RouteRecord,
    location: Location,
    matchAs: string
  ): Route {
    const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`)
    const aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    })
    if (aliasedMatch) {
      const matched = aliasedMatch.matched
      const aliasedRecord = matched[matched.length - 1]
      location.params = aliasedMatch.params
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  // _createRoute会根据RouteRecord执行相关的路由操作，最后返回Route对象
  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    // 重定向
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    // 别名
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    // 普通路由
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match,
    addRoutes
  }
}

function matchRoute (
  regex: RouteRegExp,
  path: string,
  params: Object
): boolean {
  const m = path.match(regex)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (let i = 1, len = m.length; i < len; ++i) {
    const key = regex.keys[i - 1]
    const val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i]
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val
    }
  }

  return true
}

function resolveRecordPath (path: string, record: RouteRecord): string {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}
```

`pathList`、`pathMap`、`nameMap`这几个变量，他们是通过`createRouteMap`来创建的几个对象。

`routes` 是我们定义的路由数组，可能是这样的：

```
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/foo', name: 'foo', component: Foo },
    { path: '/bar/:id', name: 'bar', component: Bar }
  ]
})
```

`createRouteMap`主要作用便是处理传入的routes属性，整理成3个对象：

1. **nameMap**

![nameMap](https://user-images.githubusercontent.com/21073039/40768109-edec6616-64e6-11e8-97af-dadb0b599d6e.png)

2. **pathList**

![pathList](https://user-images.githubusercontent.com/21073039/40768129-fd0bfca6-64e6-11e8-9c10-add34770b36a.png)

3. **pathMap**

![pathMap](https://user-images.githubusercontent.com/21073039/40768188-2c73ce1a-64e7-11e8-8bb6-0aa7697a9fbe.png)

所以`match`的主要功能是通过目标路径匹配定义的 route 数据，根据匹配到的记录，来进行`_createRoute`操作。而`_createRoute`会根据`RouteRecord`执行相关的路由操作，最后返回Route对象：



