**util/path.js**

```

export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  const firstChar = relative.charAt(0)
  // 是否以 '/' 开头，是则直接返回
  if (firstChar === '/') {
    return relative
  }

  // query或者hash则带上基路径返回
  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  // 不是append则弹出最后一个元素
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  // 去掉开头的 '/' ，并且用 '/' 分割
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    // 处理路径里的'..'和'.'
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

// 处理路径，返回路径的对象
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

// 将双斜杠替换成单斜杆
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/')
}
```

