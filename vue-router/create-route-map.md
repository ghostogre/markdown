
```
// 生成匹配特定URL的正则表达式
import Regexp from 'path-to-regexp'
import { cleanPath } from './util/path'
import { assert, warn } from './util/warn'

export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>;
  pathMap: Dictionary<RouteRecord>;
  nameMap: Dictionary<RouteRecord>;
} {
  // 初始化
  // 数组，包括所有的 path
  const pathList: Array<string> = oldPathList || []
  // 对象，key 为 path，值为路由对象
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // 对象，key 为 name，值为路由对象
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)
  // 循环遍历 routes ，添加路由记录
  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // 路径通配符
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]) // 把通配符放到末尾
      l-- // 长度减一，就不会匹配一次末尾的通配符了
      i-- // 长度改变了，i也要修改
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}

function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route
  // 断言
  // ...省略

  // 编译正则的选项 2.6.0+
  const pathToRegexpOptions: PathToRegexpOptions = route.pathToRegexpOptions || {}
  // 序列化 path, 作 / 替换
  const normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  )

  // 匹配规则是否大小写敏感？(默认值：false) 2.6.0+
  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  // 创建一个路由记录对象
  const record: RouteRecord = {
    path: normalizedPath,
    // 将 path 和 regex 作解析映射
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  }

  // 递归子路由
  if (route.children) {
    if (process.env.NODE_ENV !== 'production') {
      // 如果是命名路由，且没有重定向，子路由存在'/'或者''(也就是默认路由)
      if (route.name && !route.redirect && route.children.some(child => /^\/?$/.test(child.path))) {
        // 发出警告
      }
    }
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  // 别名处理
  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias]

    aliases.forEach(alias => {
      const aliasRoute = {
        path: alias,
        children: route.children
      } // 别名路由
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    })
  }

  // 添加到pathList和pathMap
  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }

  // 假如是命名路由，假如到nameMap
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        `Duplicate named routes definition: ` +
        `{ name: "${name}", path: "${record.path}" }`
      )
    }
  }
}

// 处理路由匹配正则表达式
function compileRouteRegex (path: string, pathToRegexpOptions: PathToRegexpOptions): RouteRegExp {
  // [] 是要使用路径中找到的键填充的数组(就是keys)
  const regex = Regexp(path, [], pathToRegexpOptions)
  if (process.env.NODE_ENV !== 'production') {
    const keys: any = Object.create(null)
    regex.keys.forEach(key => {
      warn(!keys[key.name], `Duplicate param keys in route with path: "${path}"`)
      keys[key.name] = true
    })
  }
  // ( ? ), ( * ) 就是可选项 optional: true
  // /:foo?
  // keys = [{ name: 'foo', delimiter: '/', optional: true, repeat: true }]
  return regex
}

// 格式化路径
function normalizePath (path: string, parent?: RouteRecord, strict?: boolean): string {
  if (!strict) path = path.replace(/\/$/, '') // 去掉末尾的'/'
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}

```
