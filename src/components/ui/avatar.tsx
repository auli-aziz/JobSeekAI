"use client"

import * as React from "react"
import { cn } from "~/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = "Avatar"

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "", onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(src ? "loading" : "error")

    React.useEffect(() => {
      if (!src) {
        setStatus("error")
        onLoadingStatusChange?.("error")
        return
      }

      setStatus("loading")
      onLoadingStatusChange?.("loading")
    }, [src, onLoadingStatusChange])

    return (
      <img
        ref={ref}
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn("aspect-square h-full w-full", className)}
        onLoad={() => {
          setStatus("loaded")
          onLoadingStatusChange?.("loaded")
        }}
        onError={() => {
          setStatus("error")
          onLoadingStatusChange?.("error")
        }}
        style={{ display: status === "error" ? "none" : undefined }}
        {...props}
      />
    )
  },
)
AvatarImage.displayName = "AvatarImage"

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, delayMs = 0, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(delayMs === 0)

    React.useEffect(() => {
      if (delayMs === 0) return

      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delayMs)

      return () => clearTimeout(timer)
    }, [delayMs])

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
        {...props}
      />
    )
  },
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
