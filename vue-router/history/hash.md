### HashHistory

```
// 继承 History 基类
export class HashHistory extends History {
  // router: VueRouter实例
  constructor (router: VueRouter, base: ?string, fallback: boolean) {
    // 调用基类构造器
    super(router, base)

    // 如果说是从 history 模式降级来的
    // 需要做降级检查
    // this.base来自History类
    if (fallback && this.checkFallback(this.base)) {
      // 如果降级且做了降级处理,则什么也不需要做
      return
    }
    // 保证 hash 是以 / 开头
    ensureSlash()
  }

  // ...

  // 实现History的接口方法
  getCurrentLocation () {
    return getHash()
  }
}

// 降级处理，如果不支持h5的pushState就替换成hash URL
function checkFallback (base) {
  // 得到除去 base 的真正的 location 值
  // getLocation来自./html5
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    // 如果说此时的地址不是以 /# 开头的
    // 需要做一次降级处理，降级为 hash 模式下应有的 /# 开头
    window.location.replace(
      cleanPath(base + '/#' + location)
    )
    return true
  }
}

// 保证 hash 以 / 开头
function ensureSlash (): boolean {
  // 得到 hash 值
  const path = getHash()
  // 如果说是以 / 开头的 直接返回即可
  if (path.charAt(0) === '/') {
    return true
  }
  // 不是的话 需要手工保证一次 替换 hash 值
  replaceHash('/' + path)
  return false
}

// 获取当前URL的hash值
export function getHash (): string {
  // 因为兼容性问题 这里没有直接使用 window.location.hash
  // 因为 Firefox decode hash 值
  let href = window.location.href
  const index = href.indexOf('#')
  // 如果此时没有 # 则返回 ''
  // 否则取得 # 后的所有内容
  if (index < 0) return ''

  href = href.slice(index + 1)
  // decode the hash but not the search or hash
  // as search(query) is already decoded
  // 处理query参数的decode
  const searchIndex = href.indexOf('?')
  if (searchIndex < 0) {
    // 没有query参数，检查是不是还有#
    const hashIndex = href.indexOf('#')
    if (hashIndex > -1) href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex)
    else href = decodeURI(href)
  } else {
    if (searchIndex > -1) href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex)
  }

  return href
}

// 替换hash值
function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path))
  } else {
    window.location.replace(getUrl(path))
  }
}

// 获取完整的hash URL
function getUrl (path) {
  const href = window.location.href
  const i = href.indexOf('#')
  // 获取基础的URL
  const base = i >= 0 ? href.slice(0, i) : href
  // 获取完整的URL
  return `${base}#${path}`
}
```

针对于不支持 history api 的降级处理（checkFallBack），以及保证默认进入的时候对应的 hash 值是以 / 开头的（ensureSlash），如果不是则替换。
