"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          error: "group-[.toaster]:bg-red-950 group-[.toaster]:border-red-900 group-[.toaster]:text-red-100",
          success: "group-[.toaster]:bg-green-950 group-[.toaster]:border-green-900 group-[.toaster]:text-green-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
