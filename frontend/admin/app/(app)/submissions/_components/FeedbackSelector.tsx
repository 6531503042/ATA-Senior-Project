"use client";

import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const selectedOption = useMemo(() => options.find(opt => opt.id === value), [options, value]);

  const handleSelect = useCallback((option: FeedbackOption) => {
    onChange(option.id);
    setIsOpen(false);
  }, [onChange]);

  // Close dropdown when clicking outside (ignore clicks on trigger or menu)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const withinMenu = menuRef.current?.contains(target);
      const withinButton = buttonRef.current?.contains(target);
      if (!withinMenu && !withinButton) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Position dropdown (fixed) to avoid clipping parents
  useEffect(() => {
    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    };
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Mark mounted so we can safely use portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full">
      {/* Minimal label */}
      <label className="text-sm font-medium text-slate-700 mb-2 block">{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
        className={`group relative w-full border rounded-xl px-4 py-3 text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors ${
          selectedOption ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className={`font-medium ${selectedOption ? 'text-slate-800' : 'text-slate-500'}`}>
              {selectedOption ? selectedOption.title : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-purple-500' : ''}`} 
          />
        </div>
      </button>

      {/* Modern Dropdown - rendered in a portal with very high z-index */}
      {isMounted && isOpen && createPortal(
        <div
          className="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
          ref={menuRef}
          role="listbox"
        >
          <div className="max-h-72 overflow-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">No feedbacks available</div>
            ) : (
              <>
                <div className="py-1">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-50 ${
                        value === option.id ? 'bg-slate-50 font-medium' : 'text-slate-700'
                      }`}
                      role="option"
                      aria-selected={value === option.id}
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span className="truncate flex-1">{option.title}</span>
                      {value === option.id && <Check className="w-4 h-4 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default memo(FeedbackSelector);