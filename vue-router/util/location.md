#### misc.js

```
export function extend (a, b) {
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}
```

#### path.js

```
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}
```

#### location.js

```
export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean,
  router: ?VueRouter
): Location {
  // 将location转化为对象形式
  let next: Location = typeof raw === 'string' ? { path: raw } : raw
  // named target
  // 已经被normalizeLocation处理过的直接返回next
  if (next._normalized) {
    return next
  } else if (next.name) {
    return extend({}, raw) // misc.js
  }

  // relative params
  // 如果是hashhistory，这里传的raw就是string，也就是说next.path存在
  // 所以hash不会执行这里
  if (!next.path && next.params && current) {
    next = extend({}, next)
    next._normalized = true
    const params: any = extend(extend({}, current.params), next.params)
    if (current.name) {
      next.name = current.name
      next.params = params
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path
      next.path = fillParams(rawPath, params, `path ${current.path}`)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, `relative params navigation requires a current route.`)
    }
    return next
  }

  const parsedPath = parsePath(next.path || '')
  // 基路径
  const basePath = (current && current.path) || '/'
  // 处理'..'和'.'
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath

  const query = resolveQuery(
    parsedPath.query, // path上的query
    next.query, // 路由query
    router && router.options.parseQuery // 提供自定义查询字符串的解析/反解析函数，覆盖默认行为。
  )

  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
```

