'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  minDate?: Date;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  minDate,
  error,
  disabled = false,
  placeholder = "Pick a date"
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-gray-500",
            error && "border-red-300 focus:ring-red-500",
            "h-[42px]"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabled || (minDate ? { before: minDate } : { before: new Date() })}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}