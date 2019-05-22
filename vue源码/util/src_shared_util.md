export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
} // 是否定义

export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
} // 是否未定义

