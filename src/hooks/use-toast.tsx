// Adapted from shadcn/ui toast component
// https://ui.shadcn.com/docs/components/toast

import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
// const TOAST_REMOVE_DELAY = 1000000

type ToastActionElement = React.ReactElement

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ToasterToast = Toast & {
  dismiss: () => void
}

const toasts: ToasterToast[] = []

type ToastProps = Omit<Toast, "id">

export function useToast() {
  const [, setToastState] = useState<ToasterToast[]>([])

  useEffect(() => {
    return () => {
      toasts.splice(0, toasts.length)
    }
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    const toastToRemove = toastId
      ? toasts.find((toast) => toast.id === toastId)
      : toasts[0]

    if (toastToRemove) {
      const indexToRemove = toasts.findIndex((t) => t.id === toastToRemove.id)
      if (indexToRemove !== -1) {
        toasts.splice(indexToRemove, 1)
        setToastState([...toasts])
      }
    }
  }, [])

  const toast = useCallback(
    ({ ...props }: ToastProps) => {
      const id = genId()

      const update = () => {
        const indexToUpdate = toasts.findIndex((t) => t.id === id)
        if (indexToUpdate !== -1) {
          // toasts[indexToUpdate] = { ...toasts[indexToUpdate], ...props }
          setToastState([...toasts])
        }
      }

      const newToast = {
        ...props,
        id,
        dismiss: () => dismiss(id),
      }

      if (toasts.length >= TOAST_LIMIT) {
        toasts.shift()
      }

      toasts.push(newToast)
      setToastState([...toasts])

      return {
        id,
        dismiss: () => dismiss(id),
        update,
      }
    },
    [dismiss]
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}
