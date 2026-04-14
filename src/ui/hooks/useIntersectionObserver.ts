import { RefObject, useEffect, useState } from 'react'

interface Options {
  threshold?: number
  rootMargin?: string
}

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: Options = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          // Once visible, stop observing (animation plays once)
          observer.unobserve(el)
        }
      },
      { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin },
    )

    observer.observe(el)
    return () => {
      observer.unobserve(el)
    }
  }, [ref, options.threshold, options.rootMargin])

  return isIntersecting
}
