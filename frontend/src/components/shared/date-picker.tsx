'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adjust calendar position if it would go off screen
  useEffect(() => {
    if (isOpen && calendarRef.current && containerRef.current) {
      const calendar = calendarRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const calendarRect = calendar.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Check if calendar would go off the bottom of the screen
      if (containerRect.bottom + calendarRect.height > viewportHeight) {
        calendar.style.top = 'auto';
        calendar.style.bottom = '100%';
        calendar.style.marginTop = '0';
        calendar.style.marginBottom = '0.25rem';
      } else {
        calendar.style.top = '100%';
        calendar.style.bottom = 'auto';
        calendar.style.marginTop = '0.25rem';
        calendar.style.marginBottom = '0';
      }

      // Check if calendar would go off the right of the screen
      if (containerRect.left + calendarRect.width > viewportWidth) {
        calendar.style.left = 'auto';
        calendar.style.right = '0';
      } else {
        calendar.style.left = '0';
        calendar.style.right = 'auto';
      }
    }
  }, [isOpen]);

  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div className="flex flex-col w-full" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center px-3 py-2 text-left border rounded-lg
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${error ? 'border-red-300' : 'border-gray-300'}
            hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span className={!date ? 'text-gray-400' : 'text-gray-900'}>
            {date ? format(date, 'PPP') : 'Pick a date'}
          </span>
        </button>

        {isOpen && (
          <div
            ref={calendarRef}
            className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              position: 'absolute',
              minWidth: 'max-content',
            }}
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(day: Date | undefined) => {
                setDate(day);
                setIsOpen(false);
              }}
              disabled={disabledDays}
              modifiersClassNames={{
                selected: 'bg-blue-600 text-white',
                today: 'text-red-500 font-bold',
              }}
              className="p-3"
              showOutsideDays
              fixedWeeks
              defaultMonth={date || new Date()}
              captionLayout="dropdown"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 