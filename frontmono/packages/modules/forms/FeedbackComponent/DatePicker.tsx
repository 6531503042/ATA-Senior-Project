import React from "react";
import { Calendar } from "@modules/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@modules/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@modules/lib/utils";
import { Button } from "@modules/ui/button";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
  errorMessage?: string;
  startDate?: Date; // For dueDate validation to ensure it's after the startDate
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  label,
  errorMessage,
  startDate,
}) => {
  return (
    <div className="flex flex-col w-1/2">
      <h3 className="text-sm font-medium">{label}</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start border border-zinc-200 bg-white outline-none p-4 rounded-lg mt-2 text-sm focus:shadow-sm text-left hover:bg-gray-50",
              !date && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(selectedDate) => {
                // Disable dates before the start date for dueDate
                if (label === "Due Date" && startDate) {
                  return selectedDate < startDate;
                }
                return selectedDate < new Date(); // Disable past dates for all other date pickers
              }}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default DatePicker;
