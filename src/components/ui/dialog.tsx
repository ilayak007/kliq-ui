"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

interface DialogProps extends DialogPrimitive.DialogProps {
  children: React.ReactNode
}

export function Dialog({ children, ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

export function DialogTrigger({ children, ...props }: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
}

export function DialogContent({ className, children, ...props }: DialogPrimitive.DialogContentProps) {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700",
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
  }
  

export function DialogTitle({ className, children, ...props }: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title className={cn("text-lg font-semibold text-white", className)} {...props}>
      {children}
    </DialogPrimitive.Title>
  )
}

export function DialogDescription({ className, children, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description className={cn("text-sm text-gray-400", className)} {...props}>
      {children}
    </DialogPrimitive.Description>
  )
}

export function DialogClose({ children, ...props }: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.Close {...props}>{children}</DialogPrimitive.Close>
}
