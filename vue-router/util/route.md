**util/route.js源码**

```
export const START = createRoute(null, {
  path: '/'
})

export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  // 是否序列化query
  // 配置中的stringifyQuery: 提供自定义查询字符串的解析/反解析函数。覆盖默认行为。
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    // 一个深拷贝
    query = clone(query)
  } catch (e) {}

  // 这里就是this.$route对象
  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    const res = {}
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}
```

`history/base/transitionTo`中的`this.current`就是START，通过createRoute来创建返回。注意返回的是通过Object.freeze定义的只读对象 route。
