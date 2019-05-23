```
export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
} // 是否定义

export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
} // 是否未定义

// 闭包，柯里化。将获取的数据保存到闭包的cache对象上。
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}
```
