**util/route.js源码**

```
const trailingSlashRE = /\/?$/

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

// 比较route是否相同
export function isSameRoute (a: Route, b: ?Route): boolean {
  if (b === START) { // 如果B是初始化的route对象，直接比较对象
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      // 去掉末尾的/进行比较
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a = {}, b = {}): boolean {
  // handle null value #1566
  if (!a || !b) return a === b
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => {
    const aVal = a[key]
    const bVal = b[key]
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}
```

`history/base/transitionTo`构造函数中的`this.current`就是START，通过createRoute来创建返回。注意返回的是通过Object.freeze定义的只读对象 route。
