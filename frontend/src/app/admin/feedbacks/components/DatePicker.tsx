'use client';

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  label: string;
  startDate?: Date;
  disabled?: boolean;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  label,
  startDate,
  disabled = false,
  error
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start mt-1 bg-white border-gray-300 hover:bg-gray-50/50",
              "text-left font-normal",
              !date && "text-gray-500",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (label.toLowerCase().includes('due') && startDate) {
                return date < startDate || date < today;
              }
              return date < today;
            }}
            initialFocus
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker; 