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