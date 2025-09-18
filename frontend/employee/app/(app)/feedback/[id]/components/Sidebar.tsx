'use client';

import { motion } from 'framer-motion';
import { BarChart, CheckCircle2, ClipboardList, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/libs/utils';

type Q = { id: number; description?: string; required: boolean };
type Props = {
  title: string;
  description?: string;
  questions: Q[];
  currentStep: number;
  answers: Record<number, unknown>;
  overallComments: string;
  onSelectStep: (index: number) => void;
};

export function FeedbackSidebar({
  title,
  description,
  questions,
  currentStep,
  answers,
  overallComments,
  onSelectStep,
}: Props) {
  const progressPct = Math.round(((currentStep + 1) / (questions.length + 1)) * 100);

  return (
    <aside className="w-full bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden rounded-2xl">
      <div className="flex-none p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <ClipboardList className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-500 line-clamp-1">{description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <p className="font-medium text-gray-900">~{questions.length * 2} mins</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <BarChart className="h-4 w-4" />
              <span>Questions</span>
            </div>
            <p className="font-medium text-gray-900">{questions.length} total</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Your Progress</span>
            <span className="font-medium text-violet-600">{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {questions.map((q, i) => {
          const isCompleted = Boolean(answers[q.id]);
          const isCurrent = currentStep === i;

          return (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectStep(i)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all',
                'hover:bg-violet-50 hover:shadow-md',
                isCurrent
                  ? 'bg-violet-50 text-violet-700 shadow-md border border-violet-200'
                  : 'bg-white border border-gray-100 shadow-sm',
                isCompleted ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors shrink-0',
                  isCurrent
                    ? 'bg-violet-100 text-violet-700'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-medium">{i + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">Question {i + 1}</span>
                  {q.required && (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{q.description || 'No description'}</p>
              </div>
            </motion.button>
          );
        })}

        {/* Overall comments step */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: questions.length * 0.05 }}
          onClick={() => onSelectStep(questions.length)}
          className={cn(
            'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all',
            'hover:bg-violet-50 hover:shadow-md',
            currentStep === questions.length
              ? 'bg-violet-50 text-violet-700 shadow-md border border-violet-200'
              : 'bg-white border border-gray-100 shadow-sm',
            overallComments.trim().length > 0 ? 'text-gray-900' : 'text-gray-500'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0',
              currentStep === questions.length
                ? 'bg-violet-100 text-violet-700'
                : overallComments.trim().length > 0
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            )}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">Overall Comments</span>
            <p className="text-xs text-gray-500 mt-1">Final thoughts and suggestions</p>
          </div>
        </motion.button>
      </div>
    </aside>
  );
}
