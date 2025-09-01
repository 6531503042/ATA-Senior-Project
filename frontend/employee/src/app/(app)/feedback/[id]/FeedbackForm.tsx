'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  MessageSquare,
  User2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAlertDialog } from '@components/ui/alert-dialog'; // provider-backed alerts
import { Button } from '@components/ui/button';               // your button styles
import { cn } from '@/app/lib/utils';                         // class combiner

// ✅ keep your original Overall Comments component (unchanged look)
import { FeedbackOverallComments } from './components';

// -----------------------------
// Local types & mocks
// -----------------------------
type QType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT_BASED' | 'SENTIMENT';

interface FeedbackQuestion {
  id: number;
  text: string;
  description?: string;
  required: boolean;
  type: QType;
  answers?: { text: string; value: string }[];
}

interface FeedbackSubmission {
  id: number;
  title: string;
  description?: string;
  questions: FeedbackQuestion[];
}

type AnswersMap = Record<number, string | string[]>;

interface FeedbackFormProps {
  id: string;
}

const DESIGN_MODE = true;

const mockFeedback: FeedbackSubmission = {
  id: 1001,
  title: 'Quarterly Satisfaction Survey',
  description: 'Help us improve by answering a few quick questions.',
  questions: [
    {
      id: 1,
      text: 'Overall satisfaction with your current project?',
      description: 'Consider workload, support, and outcome.',
      required: true,
      type: 'SINGLE_CHOICE',
      answers: [
        { text: 'Very dissatisfied', value: '1' },
        { text: 'Dissatisfied', value: '2' },
        { text: 'Neutral', value: '3' },
        { text: 'Satisfied', value: '4' },
        { text: 'Very satisfied', value: '5' },
      ],
    },
    {
      id: 2,
      text: 'Pick the areas you want to see improved',
      required: false,
      type: 'MULTIPLE_CHOICE',
      answers: [
        { text: 'Communication', value: 'comm' },
        { text: 'Tools', value: 'tools' },
        { text: 'Meetings', value: 'mtgs' },
        { text: 'Deadlines', value: 'ddl' },
      ],
    },
    {
      id: 3,
      text: 'Any blockers you are facing?',
      description: 'Be as specific as possible.',
      required: false,
      type: 'TEXT_BASED',
    },
    {
      id: 4,
      text: 'How do you feel this week?',
      required: true,
      type: 'SENTIMENT',
      answers: [
        { text: 'Very bad', value: '1' },
        { text: 'Bad', value: '2' },
        { text: 'Okay', value: '3' },
        { text: 'Good', value: '4' },
        { text: 'Great', value: '5' },
      ],
    },
  ],
};

const MAX_TEXT_LENGTH = 255;

// -----------------------------
// Adapter -> fallback QuestionCard prop shape
// -----------------------------
type AdaptedQuestion = {
  id: string;
  content: string;
  category: string;
  answerType: 'single' | 'multiple' | 'text' | 'sentiment';
  validationRule: { required?: boolean };
  options?: { id: string; label: string }[];
  description?: string;
};

function adaptToQuestionCard(q: FeedbackQuestion): AdaptedQuestion {
  const mapType = (t: QType): AdaptedQuestion['answerType'] => {
    switch (t) {
      case 'SINGLE_CHOICE':
        return 'single';
      case 'MULTIPLE_CHOICE':
        return 'multiple';
      case 'TEXT_BASED':
        return 'text';
      case 'SENTIMENT':
        return 'sentiment';
    }
  };

  return {
    id: String(q.id),
    content: q.text,
    description: q.description,
    category: 'general',
    answerType: mapType(q.type),
    validationRule: { required: q.required },
    options: q.answers?.map((a) => ({ id: a.value, label: a.text })),
  };
}

// -----------------------------
// ✅ Typed fallback QuestionCard (no `any`)
// -----------------------------
type FallbackQuestionCardProps = {
  question: AdaptedQuestion;
  currentAnswer: string | string[];
  onAnswerChange: (val: string | string[]) => void;
  questionNumber: number;
  totalQuestions: number;
};

function QuestionCard({
  question,
  currentAnswer,
  onAnswerChange,
}: FallbackQuestionCardProps) {
  const isMultiple = question.answerType === 'multiple';
  const isSingle = question.answerType === 'single' || question.answerType === 'sentiment';
  const isText = question.answerType === 'text';

  const selected = (val: string): boolean =>
    Array.isArray(currentAnswer) ? currentAnswer.includes(val) : currentAnswer === val;

  const toggleMulti = (val: string) => {
    const arr = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(val);
    onAnswerChange(arr);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-medium text-gray-900">{question.content}</h3>
      {question.description && (
        <p className="text-sm text-gray-500 mt-1">{question.description}</p>
      )}

      {/* Single choice */}
      {isSingle && question.options && (
        <div className="mt-5 grid gap-2">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                ${selected(opt.id) ? 'border-violet-300 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}
              `}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                className="h-4 w-4 text-violet-600"
                checked={selected(opt.id)}
                onChange={() => onAnswerChange(opt.id)}
              />
              <span className="text-sm text-gray-800">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Multiple choice */}
      {isMultiple && question.options && (
        <div className="mt-5 grid gap-2">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                ${selected(opt.id) ? 'border-violet-300 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}
              `}
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-violet-600"
                checked={selected(opt.id)}
                onChange={() => toggleMulti(opt.id)}
              />
              <span className="text-sm text-gray-800">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Text */}
      {isText && (
        <div className="mt-5">
          <textarea
            rows={5}
            value={(currentAnswer as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onAnswerChange(e.target.value)
            }
            maxLength={MAX_TEXT_LENGTH}
            placeholder="Type your answer…"
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {String(((currentAnswer as string) ?? '').length)} / {MAX_TEXT_LENGTH}
          </div>
        </div>
      )}

      {/* Sentiment as 1–5 pills (if options are provided, we map those) */}
      {question.answerType === 'sentiment' && !question.options && (
        <div className="mt-5 flex gap-2">
          {['1', '2', '3', '4', '5'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onAnswerChange(val)}
              className={`px-4 py-2 rounded-lg border text-sm transition
                ${selected(val) ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-200 hover:bg-gray-50'}
              `}
            >
              {val}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------
// Component
// -----------------------------
export default function FeedbackForm({ id }: FeedbackFormProps) {
  const router = useRouter();
  const { showAlert } = useAlertDialog();

  const [feedback, setFeedback] = useState<FeedbackSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [overallComments, setOverallComments] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  // Init
  useEffect(() => {
    setLoading(true);
    setFeedback(null);
    setCurrentStep(0);
    setAnswers({});
    setOverallComments('');
    setPrivacyLevel('PUBLIC');

    if (DESIGN_MODE) {
      const t = setTimeout(() => {
        setFeedback({ ...mockFeedback, id: Number(id) || mockFeedback.id });
        setLoading(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [id]);

  const canProceed =
    feedback && currentStep === feedback.questions.length
      ? overallComments.trim().length > 0
      : Boolean(
          feedback &&
            (!feedback.questions[currentStep].required ||
              (answers[feedback.questions[currentStep].id] &&
                (!Array.isArray(answers[feedback.questions[currentStep].id]) ||
                  (answers[feedback.questions[currentStep].id] as string[]).length > 0)))
        );

  const handleSubmit = async () => {
    if (!feedback) return;

    const tooLong = Object.entries(answers).find(([qid, val]) => {
      const q = feedback.questions.find((x) => x.id === Number(qid));
      return q?.type === 'TEXT_BASED' && typeof val === 'string' && val.length > MAX_TEXT_LENGTH;
    });
    if (tooLong) {
      const q = feedback.questions.find((x) => x.id === Number(tooLong[0]));
      showAlert({
        title: 'Text Too Long',
        description: `The response for "${q?.text}" exceeds ${MAX_TEXT_LENGTH} characters.`,
        variant: 'solid',
        color: 'warning',
        duration: 4000,
      });
      return;
    }

    if (!overallComments.trim()) {
      showAlert({
        title: 'Overall Comments Required',
        description: 'Please provide overall comments before submitting.',
        variant: 'solid',
        color: 'warning',
        duration: 3500,
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showAlert({
        title: 'Success!',
        description: 'Your feedback has been submitted (design mode).',
        variant: 'solid',
        color: 'success',
        duration: 3000,
      });
      router.push('/dashboard');
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading your feedback form...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Feedback Not Found</h2>
        <p className="text-gray-500">This feedback form doesn&apos;t exist or has expired.</p>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
          <div className="flex-none p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{feedback.title}</h1>
                <p className="text-sm text-gray-500 line-clamp-1">{feedback.description}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <p className="font-medium text-gray-900">~{feedback.questions.length * 2} mins</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <BarChart className="h-4 w-4" />
                  <span>Questions</span>
                </div>
                <p className="font-medium text-gray-900">{feedback.questions.length} total</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Your Progress</span>
                <span className="font-medium text-violet-600">
                  {Math.round(((currentStep + 1) / (feedback.questions.length + 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / (feedback.questions.length + 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {feedback.questions.map((q, i) => {
              const isCompleted = Boolean(answers[q.id]);
              const isCurrent = currentStep === i;

              return (
                <motion.button
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setCurrentStep(i)}
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
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{i + 1}</span>
                    )}
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
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {q.description || 'No description'}
                    </p>
                  </div>
                </motion.button>
              );
            })}

            {/* Overall comments step */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: feedback.questions.length * 0.05 }}
              onClick={() => setCurrentStep(feedback.questions.length)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all',
                'hover:bg-violet-50 hover:shadow-md',
                currentStep === feedback.questions.length
                  ? 'bg-violet-50 text-violet-700 shadow-md border border-violet-200'
                  : 'bg-white border border-gray-100 shadow-sm',
                overallComments.trim().length > 0 ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0',
                  currentStep === feedback.questions.length
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

        {/* Main panel */}
        <main className="w-3/4 h-screen overflow-y-auto bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <User2 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      {currentStep < feedback.questions.length ? (
                        <>Question {currentStep + 1} of {feedback.questions.length}</>
                      ) : (
                        'Overall Comments'
                      )}
                    </h2>
                    {currentStep < feedback.questions.length &&
                      feedback.questions[currentStep]?.required && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Required</span>
                        </div>
                      )}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {currentStep < feedback.questions.length ? (
                    <QuestionCard
                      key={currentStep}
                      question={adaptToQuestionCard(feedback.questions[currentStep])}
                      currentAnswer={answers[feedback.questions[currentStep].id] || ''}
                      onAnswerChange={(val) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [feedback.questions[currentStep].id]: val,
                        }))
                      }
                      questionNumber={currentStep + 1}
                      totalQuestions={feedback.questions.length}
                    />
                  ) : (
                    <FeedbackOverallComments
                      overallComments={overallComments}
                      privacyLevel={privacyLevel}
                      onCommentsChange={setOverallComments}
                      onPrivacyChange={setPrivacyLevel}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((i) => i - 1)}
                  disabled={currentStep === 0}
                  className="gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep === feedback.questions.length ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !canProceed}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep((i) => i + 1)}
                    disabled={!canProceed}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm"
                  >
                    <span>
                      {currentStep === feedback.questions.length - 1
                        ? 'Final Step'
                        : 'Next Question'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
