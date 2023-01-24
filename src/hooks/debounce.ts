import { useCallback } from 'react'

/**
 * 防抖hook
 * @param func 需要执行的函数
 * @param wait 延迟时间
 */

export function useDebounce<A extends Array<any>, R = void>(
  func: (..._args: A) => R,
  wait: number
) {
  let timeOut: null | ReturnType<typeof setTimeout> = null
  return useCallback((...args: A) => {
    if (timeOut) {
      clearTimeout(timeOut)
      timeOut = null
    }
    timeOut = setTimeout(() => {
      func.apply(null, args)
    }, wait)
  }, [])
}
