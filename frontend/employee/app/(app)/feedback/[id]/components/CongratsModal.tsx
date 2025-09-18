'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../../../components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;      
  onContinue: () => void;    
  seconds?: number;           
  onEditNow?: () => void;     
};

export default function CongratsModal({ open, onClose, onContinue, onEditNow, seconds = 10 }: Props) {
  const [left, setLeft] = useState(seconds);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  // countdown
  useEffect(() => {
    if (!open) return;
    setLeft(seconds);
    const timer = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [open, seconds]);

  // auto-continue
  useEffect(() => {
    if (open && left <= 0) onContinue();
  }, [left, open, onContinue]);

  // outside click + Esc
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (e.target === backdropRef.current) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') onContinue();
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const pct = Math.max(0, (left / seconds) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="grid min-h-full place-items-center p-4">
            <motion.div
              role="dialog" aria-modal="true"
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full">
                  <span className="text-2xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">All set! 🎉</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your feedback has been submitted successfully! Thank you for your valuable input. 🙏
                  </p>
                </div>
              </div>

              {/* progress */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Auto-continue</span>
                  <span>{left}s</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${pct}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <Button variant="outline" onClick={onClose}>Close</Button>
                <div className="flex items-center gap-2">
                  {onEditNow && (
                    <Button variant="outline" onClick={onEditNow}>Edit submission ✏️</Button>
                  )}
                  <Button
                    className="bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800"
                    onClick={onContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
