"use client"

import type * as React from "react"
//import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-1 relative items-center h-12",
        caption_label: "text-xl font-semibold",
        nav: "absolute right-0 left-0 flex items-center justify-between",
        nav_button: cn("h-7 w-7 bg-transparent p-0 hover:opacity-70 text-black"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full mt-6 mb-2",
        head_cell: "w-10 h-10 font-normal text-base text-center",
        row: "flex w-full mt-1",
        cell: "w-10 h-10 text-center text-base relative p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn("h-10 w-10 p-0 font-normal text-base rounded-full hover:bg-zinc-100"),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white",
        day_today: "bg-zinc-100",
        day_outside: "text-zinc-400",
        day_disabled: "text-zinc-400",
        day_range_middle: "aria-selected:bg-zinc-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        //IconLeft: ({ }) => <ChevronLeft className="h-6 w-6" />,
        //IconRight: ({ }) => <ChevronRight className="h-6 w-6" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
