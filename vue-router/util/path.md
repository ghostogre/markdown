**util/path.js**

```
// 将双斜杠替换成单斜杆
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/')
}
```

