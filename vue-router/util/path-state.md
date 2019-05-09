**util/path-state.js源码**

```
// 判断是否支持pushState
export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent

  // 根据浏览器版本识别
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  // 根据history和pushState是否存在
  return window.history && 'pushState' in window.history
})()

// Performance.now() 返回一个表示从性能测量时刻开始经过的毫秒数
const Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date

let _key: string = genKey()

function genKey (): string {
  return Time.now().toFixed(3)
}

export function getStateKey () {
  return _key
}

export function setStateKey (key: string) {
  _key = key
}

// 跳转历史记录
export function pushState (url?: string, replace?: boolean) {
  // 保存滚动位置
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  // 获取浏览器history对象
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    // 不兼容history
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

// 替换历史记录
export function replaceState (url?: string) {
  pushState(url, true)
}
```
