"use client";

import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, MessageSquare, Sparkles, Zap } from 'lucide-react';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = useMemo(() => options.find(opt => opt.id === value), [options, value]);

  const handleSelect = useCallback((option: FeedbackOption) => {
    onChange(option.id);
    setIsOpen(false);
  }, [onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Modern Label with Gradient */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block">
            {label}
          </label>
          <p className="text-xs text-slate-500">Choose a feedback survey to analyze</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-full bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 rounded-2xl px-5 py-4 text-left shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          selectedOption 
            ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg' 
            : 'border-slate-200 hover:border-blue-300 hover:bg-white'
        } ${isOpen ? 'scale-[1.02] shadow-xl' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {selectedOption && (
              <div className="p-1.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <span className={`font-medium ${selectedOption ? 'text-slate-800' : 'text-slate-500'}`}>
              {selectedOption ? selectedOption.title : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-slate-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-400'}`} 
          />
        </div>
      </button>

      {/* Modern Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-72 overflow-auto">
            {options.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="p-3 bg-slate-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No feedbacks available</p>
                <p className="text-xs text-slate-400 mt-1">Create a feedback survey to get started</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">Available Surveys</span>
                  </div>
                </div>
                
                {/* Options */}
                <div className="p-2">
                  {options.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`group relative w-full px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.02] ${
                        value === option.id 
                          ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md font-semibold border border-blue-200' 
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                            value === option.id 
                              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white' 
                              : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                          }`}>
                            <MessageSquare className="w-3 h-3" />
                          </div>
                          <span className="truncate font-medium">{option.title}</span>
                        </div>
                        {value === option.id && (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FeedbackSelector);