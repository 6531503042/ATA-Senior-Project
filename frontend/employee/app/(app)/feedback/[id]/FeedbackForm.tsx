'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAlertDialog } from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../../libs/utils';
import type { Question, EmployeeFeedback, EmployeeQuestion } from '../../../../types/employee';
import { FeedbackSidebar } from './components/Sidebar';
import QuestionCard from './components/QuestionCard';
import CongratsModal from './components/CongratsModal';
import employeeService from '../../../../services/employeeService';
import { FeedbackOverallComments } from './components'; // your existing component
import type { Privacy, FeedbackSubmissionPayload } from '../../../../types/employee';
import employeeSvc from '../../../../services/employeeService';

// ---------- Types ----------
type QType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT_BASED' | 'SENTIMENT';
type AnswersMap = Record<number, string | string[]>;

const MAX_TEXT_LENGTH = 255;
const DESIGN_MODE = false;

function mapAnswerType(t: EmployeeQuestion['type']): string {
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
}

// No mock data; real API only

// ---------- Adapters ----------
function adaptToQuestion(q: EmployeeQuestion): Question {
  return {
    id: q.id, // number ✅
    text: q.text, // your QuestionCard reads question.text
    required: q.required,
    type: q.type, // same union
    category: 'general', // default
    answers: q.answers ?? [], // ensure array
    description: q.description ?? '', // must be string (not undefined)
  };
}

// ---------- Component ----------
export default function FeedbackForm({ id }: { id: string }) {
  const router = useRouter();
  const { showAlert } = useAlertDialog();

  const [feedback, setFeedback] = useState<EmployeeFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [overallComments, setOverallComments] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<Privacy>('PUBLIC');

  const [submitting, setSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // init/load
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setFeedback(null);
      setCurrentStep(0);
      setAnswers({});
      setOverallComments('');
      setPrivacyLevel('PUBLIC');
      setShowCongrats(false);
      try {
        const data = await employeeService.getFeedbackById(id);
        if (isMounted) {
          // Hydrate questions if backend returns IDs instead of full objects
          const questionIds = (data as any)?.questionIds as number[] | undefined;
          const hydratedQuestions = questionIds && questionIds.length > 0
            ? await Promise.all(
                questionIds.map(async qid => {
                  try {
                    const q = await employeeService.getQuestionById(qid);
                    return {
                      id: q.id,
                      text: q.text || q.title || '',
                      required: !!q.required,
                      type: (q.type || 'TEXT_BASED') as any,
                      category: (q.category || 'general') as any,
                      answers: q.options?.map((o: any) => String(o.text ?? o.value ?? '')) || [],
                      description: q.description || '',
                    } as unknown as EmployeeQuestion;
                  } catch {
                    return null;
                  }
                })
              )
                .then(list => list.filter(Boolean) as EmployeeQuestion[])
            : [];

          const adapted: EmployeeFeedback = {
            ...(data as unknown as EmployeeFeedback),
            questions: hydratedQuestions && hydratedQuestions.length > 0
              ? hydratedQuestions
              : ((data as any)?.questions || []),
          };

          setFeedback(adapted as unknown as EmployeeFeedback);
        }
        // Start timing session when form loads and feedback exists
        const fid = Number(id);
        if (!Number.isNaN(fid)) {
          employeeSvc.startSession(fid).catch(() => {});
        }
      } catch (e) {
        if (isMounted) {
          showAlert({
            title: 'Unable to load feedback',
            description: 'Please try again later.',
            variant: 'solid',
            color: 'danger',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
      // Stop timing session on unmount
      employeeSvc.stopSession().catch(() => {});
    };
  }, [id, showAlert]);

  const totalQuestions = feedback?.questions?.length ?? 0;
  const currentQuestion = totalQuestions > 0 ? feedback?.questions?.[currentStep] : undefined;

  const canProceed =
    totalQuestions > 0 && currentStep === totalQuestions
      ? overallComments.trim().length > 0
      : Boolean(
          currentQuestion &&
            (!currentQuestion.required ||
              (answers[currentQuestion.id] &&
                (!Array.isArray(answers[currentQuestion.id]) ||
                  (answers[currentQuestion.id] as string[]).length > 0))),
        );

  async function handleSubmit() {
    if (!feedback) return;

    // validate text too long
    const tooLong = Object.entries(answers).find(([qid, val]) => {
      const q = feedback.questions.find(x => x.id === Number(qid));
      return (
        q?.type === 'TEXT_BASED' &&
        typeof val === 'string' &&
        val.length > MAX_TEXT_LENGTH
      );
    });
    if (tooLong) {
      const q = feedback.questions.find(x => x.id === Number(tooLong[0]));
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
    const payload: FeedbackSubmissionPayload = {
      feedbackId: Number(feedback.id),
      responses: Object.fromEntries(
        Object.entries(answers).map(([qid, val]) => [
          qid,
          Array.isArray(val) ? val.join(',') : String(val),
        ]),
      ),
      overallComments,
      privacyLevel, // ✅ PUBLIC | PRIVATE | ANONYMOUS
    };

    setSubmitting(true);
    try {
      const created = await employeeService.submitFeedback(String(feedback.id), payload);
      // Stop session after successful submit
      employeeSvc.stopSession().catch(() => {});
      setSubmitting(false);
      setShowCongrats(true);
    } catch (err) {
      setSubmitting(false);
      showAlert({
        title: 'Submission failed',
        description: 'Please try again or contact support if the issue persists.',
        variant: 'solid',
        color: 'danger',
      });
    }
  }

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
        <p className="text-gray-500">
          This feedback form doesn&apos;t exist or has expired.
        </p>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  const isFinal = currentStep === totalQuestions;

  return (
    <>
      <div className="min-h-screen">
        {/* Responsive layout: Sidebar (fixed width) + Flexible Main */}
        <div className="flex gap-6">
          {/* Sidebar (desktop only) */}
          <div className="hidden lg:block shrink-0 w-[280px]">
            <FeedbackSidebar
              title={feedback.title}
              description={feedback.description}
              questions={(feedback.questions ?? []).map(q => ({
                id: q.id,
                description: q.description,
                required: q.required,
              }))}
              currentStep={currentStep}
              answers={answers}
              overallComments={overallComments}
              onSelectStep={setCurrentStep}
            />
          </div>

          {/* Main */}
          <main className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-0">
            {/* Mobile header with progress */}
              <div className="lg:hidden sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium text-gray-700">
                        {isFinal ? 'Overall Comments' : `Question ${currentStep + 1} of ${totalQuestions}`}
                    </h2>
                      {!isFinal && currentQuestion?.required && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {totalQuestions > 0 ? Math.round(((currentStep + 1) / (totalQuestions + 1)) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600"
                      style={{ width: `${totalQuestions > 0 ? Math.round(((currentStep + 1) / (totalQuestions + 1)) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
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
                        {isFinal ? (
                          'Overall Comments'
                        ) : (
                          <>
                            Question {currentStep + 1} of {totalQuestions}
                          </>
                        )}
                      </h2>
                      {!isFinal && currentQuestion?.required && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Required</span>
                          </div>
                        )}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isFinal ? (
                      currentQuestion ? (
                        <QuestionCard
                          question={adaptToQuestion(currentQuestion)}
                          currentAnswer={answers[currentQuestion.id] || ''}
                          onAnswerChange={(val: string | string[]) =>
                            setAnswers(prev => ({
                              ...prev,
                              [currentQuestion.id]: val,
                            }))
                          }
                          questionNumber={currentStep + 1}
                          totalQuestions={totalQuestions}
                        />
                      ) : null
                    ) : (
                      <FeedbackOverallComments
                        overallComments={overallComments}
                        privacyLevel={privacyLevel}
                        onCommentsChange={setOverallComments}
                        onPrivacyChange={p => setPrivacyLevel(p)} // ✅ keep ANONYMOUS as-is
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between pt-6 border-t gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(i => i - 1)}
                    disabled={currentStep === 0}
                    className="gap-2 hover:bg-gray-50 w-full sm:w-auto"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                    <span className="text-lg">⬅️</span>
                  </Button>

                  {isFinal ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !overallComments.trim()}
                      className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm w-full sm:w-auto"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Feedback</span>
                          <span className="text-lg">🚀</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(i => i + 1)}
                      disabled={!canProceed}
                      className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm w-full sm:w-auto"
                    >
                      <span>
                        {totalQuestions > 0 && currentStep === totalQuestions - 1
                          ? 'Final Step'
                          : 'Next Question'}
                      </span>
                      <span className="text-lg">➡️</span>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Congrats Popup */}
      <CongratsModal
        open={showCongrats}
        onClose={() => setShowCongrats(false)}
        onContinue={() => router.push('/feedback-center')}
        onEditNow={() => router.push(`/feedback/${id}`)}
        seconds={10}
      />
    </>
  );
}
