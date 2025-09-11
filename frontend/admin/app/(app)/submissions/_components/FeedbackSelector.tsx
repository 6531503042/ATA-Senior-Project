"use client";

import React, { memo, useCallback, useMemo, useState } from 'react';
import { ChevronDown, Check, MessageSquare } from 'lucide-react';

type FeedbackOption = { id: string; title: string };

type Props = {
  options: FeedbackOption[];
  value?: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
};

function FeedbackSelector({ 
  options, 
  value, 
  onChange,
  label = "Feedback",
  placeholder = "Select feedback"
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = useMemo(() => options.find(opt => opt.id === value), [options, value]);

  const handleSelect = useCallback((option: FeedbackOption) => {
    onChange(option.id);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative w-full">
      {/* Label with Icon */}
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <label className="text-base font-semibold text-gray-900 dark:text-white">
          {label}
        </label>
      </div>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 transition-all duration-200 rounded-2xl px-6 py-4 text-left shadow-sm hover:shadow-md hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 ${
          selectedOption 
            ? 'border-blue-500 dark:border-blue-400 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-400/10 dark:to-indigo-400/10' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className={`text-base font-medium ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {selectedOption ? selectedOption.title : placeholder}
          </span>
          <div className={`flex items-center gap-2 ${selectedOption ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {selectedOption && <Check className="w-4 h-4" />}
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>
        
        {selectedOption && (
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-full" />
        )}
      </button>

      {/* Dropdown - Enhanced */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10 bg-black/10 dark:bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options */}
          <div className="absolute z-20 w-full mt-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl backdrop-blur-sm max-h-64 overflow-auto">
            <div className="py-3">
              {options.length === 0 ? (
                <div className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No options available
                </div>
              ) : (
                options.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`relative w-full px-6 py-4 text-left transition-all duration-150 hover:scale-[0.98] ${
                      value === option.id 
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-l-4 border-blue-500 dark:border-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    } ${index !== options.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.title}</span>
                      {value === option.id && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            Selected
                          </span>
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(FeedbackSelector);