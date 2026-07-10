"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const slidingTabsListVariants = cva(
  "sliding-pill relative inline-flex w-full items-center",
  {
    variants: {
      variant: {
        default:
          "sliding-pill--default h-9 justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        glass:
          "sliding-pill--glass grid grid-cols-[repeat(var(--tab-count,3),minmax(0,1fr))] rounded-full border border-white/12 bg-white/[0.07] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const slidingTabsTriggerVariants = cva(
  "relative z-1 inline-flex flex-1 items-center justify-center gap-2 border border-transparent text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "h-[calc(100%-1px)] rounded-md px-2 py-1 tracking-[-0.09em]",
        glass: "rounded-full py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function SlidingTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="sliding-tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function SlidingTabsList({
  className,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof slidingTabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(slidingTabsListVariants({ variant }), className)}
      style={style}
      {...props}
    />
  )
}

function SlidingTabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof slidingTabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(slidingTabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

function SlidingTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

function SlidingTabsPanel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sliding-tabs-panel"
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

type SlidingTabItem = {
  value: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
}

type SlidingTabsBarProps = {
  items: SlidingTabItem[]
  variant?: VariantProps<typeof slidingTabsListVariants>["variant"]
  listClassName?: string
  triggerClassName?: string
  disabled?: boolean
  "aria-label"?: string
}

function SlidingTabsBar({
  items,
  variant = "default",
  listClassName,
  triggerClassName,
  disabled = false,
  "aria-label": ariaLabel,
}: SlidingTabsBarProps) {
  return (
    <SlidingTabsList
      variant={variant}
      className={listClassName}
      aria-label={ariaLabel}
      style={{ "--tab-count": items.length } as React.CSSProperties}
    >
      {items.map(({ value, label, icon: Icon, disabled: itemDisabled }) => (
        <SlidingTabsTrigger
          key={value}
          value={value}
          variant={variant}
          disabled={disabled || itemDisabled}
          className={triggerClassName}
        >
          {Icon ? <Icon aria-hidden /> : null}
          <span>{label}</span>
        </SlidingTabsTrigger>
      ))}
    </SlidingTabsList>
  )
}

type SlidingTabsPanelsProps = {
  items: Pick<SlidingTabItem, "value">[]
  panelClassName?: string
  children?: React.ReactNode
}

function SlidingTabsPanels({
  items,
  panelClassName,
  children,
}: SlidingTabsPanelsProps) {
  return (
    <>
      {items.map(({ value }) => (
        <SlidingTabsContent key={value} value={value}>
          <SlidingTabsPanel className={panelClassName}>
            {children}
          </SlidingTabsPanel>
        </SlidingTabsContent>
      ))}
    </>
  )
}

export {
  SlidingTabs,
  SlidingTabsList,
  SlidingTabsTrigger,
  SlidingTabsContent,
  SlidingTabsPanel,
  SlidingTabsBar,
  SlidingTabsPanels,
  slidingTabsListVariants,
  slidingTabsTriggerVariants,
  type SlidingTabItem,
}
