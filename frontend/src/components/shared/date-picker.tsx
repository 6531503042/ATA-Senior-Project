'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function DatePicker({
  date,
  setDate,
  label,
  minDate,
  maxDate,
  required,
  disabled,
  error,
}: DatePickerProps) {
  // Create a ref for the popover
  const [open, setOpen] = React.useState(false);

  // Handle date selection with auto-close
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Close the popover after selection
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-gray-500',
              error && 'border-red-300'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={(selectedDate) => {
              // Disable dates before the start date for dueDate
              if (label === "Due Date" && minDate) {
                return selectedDate < minDate;
              }
              if (minDate && selectedDate < minDate) return true;
              if (maxDate && selectedDate > maxDate) return true;
              return selectedDate < new Date(); // Disable past dates for all other date pickers
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}