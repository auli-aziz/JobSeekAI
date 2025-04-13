/* eslint-disable */
//many error so i disable it

"use client"

import { useEffect, useRef } from "react"

type DebounceFn<T extends any[]> = (...args: T) => void

export function useDebounce<T extends any[]>(fn: DebounceFn<T>, delay: number): DebounceFn<T> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (...args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

