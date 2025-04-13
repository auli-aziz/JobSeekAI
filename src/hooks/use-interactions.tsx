"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface IntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersection(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false }: IntersectionOptions,
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const node = elementRef?.current
    if (!node || frozen) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
      },
      { threshold, root, rootMargin },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [elementRef, threshold, root, rootMargin, frozen])

  return {
    isIntersecting: !!entry?.isIntersecting,
    entry,
  }
}

