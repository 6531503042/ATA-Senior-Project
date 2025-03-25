'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAlertDialog } from '@/components/ui/alert-dialog';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, MessageSquare, ChevronLeft, ChevronRight, ClipboardList, Clock, User2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/feedback/QuestionCard';
import { FeedbackOverallComments } from './components/FeedbackOverallComments';
import {
  FeedbackFormProps,
  FeedbackFormState,
  FeedbackSubmission,
} from '@/types/employee';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MAX_TEXT_LENGTH = 255; // Maximum character length for text responses

export default function FeedbackForm({ id }: FeedbackFormProps) {
  const [state, setState] = useState<FeedbackFormState>({
    feedback: null,
    currentStep: 0,
    answers: {},
    overallComments: '',
    privacyLevel: 'PUBLIC',
    loading: true,
    submitting: false,
  });

  const { showAlert } = useAlertDialog();
  const router = useRouter();

  // Reset state when feedback ID changes
  useEffect(() => {
    setState({
      feedback: null,
      currentStep: 0,
      answers: {},
      overallComments: '',
      privacyLevel: 'PUBLIC',
      loading: true,
      submitting: false,
    });
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        showAlert({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "solid",
          color: "danger",
          duration: 5000,
        });
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:8084/api/v1/feedback-submissions/available', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const currentFeedback = data.find((f: FeedbackSubmission) => f.id === parseInt(id));
      
      if (currentFeedback) {
        setState(prev => ({ 
          ...prev, 
          feedback: currentFeedback,
          loading: false 
        }));
      } else {
        throw new Error('Feedback not found');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      showAlert({
        title: "Error",
        description: "Failed to load feedback questions. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSubmit = async () => {
    if (!state.feedback) return;

    // Validate text length for all responses
    const textLengthValidation = Object.entries(state.answers).find(([questionId, answer]) => {
      const question = state.feedback!.questions.find(q => q.id === parseInt(questionId));
      if (question?.type === 'TEXT_BASED' && typeof answer === 'string') {
        return answer.length > MAX_TEXT_LENGTH;
      }
      return false;
    });

    if (textLengthValidation) {
      const [questionId] = textLengthValidation;
      const question = state.feedback.questions.find(q => q.id === parseInt(questionId));
      showAlert({
        title: "Text Too Long",
        description: `The response for "${question?.text}" exceeds the maximum length of ${MAX_TEXT_LENGTH} characters. Please shorten your response.`,
        variant: "solid",
        color: "warning",
        duration: 5000,
      });
      return;
    }

    // Validate overall comments length
    if (state.overallComments.length > MAX_TEXT_LENGTH) {
      showAlert({
        title: "Overall Comments Too Long",
        description: `Overall comments exceed the maximum length of ${MAX_TEXT_LENGTH} characters. Please shorten your response.`,
        variant: "solid",
        color: "warning",
        duration: 5000,
      });
      return;
    }

    const unansweredRequired = state.feedback.questions.some(
      q => q.required && (!state.answers[q.id] || 
        (Array.isArray(state.answers[q.id]) && (state.answers[q.id] as string[]).length === 0))
    );

    if (unansweredRequired) {
      showAlert({
        title: "Required Questions",
        description: "Please answer all required questions before submitting.",
        variant: "solid",
        color: "warning",
        duration: 5000,
      });
      return;
    }

    if (!state.overallComments.trim()) {
      showAlert({
        title: "Overall Comments Required",
        description: "Please provide overall comments before submitting.",
        variant: "solid",
        color: "warning",
        duration: 5000,
      });
      return;
    }

    setState(prev => ({ ...prev, submitting: true }));

    try {
      const token = getCookie('accessToken');
      if (!token) {
        showAlert({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "solid",
          color: "danger",
          duration: 5000,
        });
        router.push('/auth/login');
        return;
      }

      // Format responses according to the API requirements
      const formattedResponses = Object.entries(state.answers).reduce((acc, [questionId, answer]) => {
        const question = state.feedback!.questions.find(q => q.id === parseInt(questionId));
        if (!question) return acc;

        let formattedAnswer = '';
        if (Array.isArray(answer)) {
          // For multiple choice questions, join with commas
          formattedAnswer = answer.join(', ');
        } else if (typeof answer === 'string') {
          if (question.type === 'TEXT_BASED') {
            // For text-based questions, trim and limit length
            formattedAnswer = answer.trim().slice(0, MAX_TEXT_LENGTH);
          } else {
            // For single choice and sentiment questions
            formattedAnswer = answer;
          }
        }

        if (formattedAnswer) {
          acc[questionId] = formattedAnswer;
        }
        return acc;
      }, {} as Record<string, string>);

      const submissionData = {
        feedbackId: parseInt(id),
        responses: formattedResponses,
        overallComments: state.overallComments.trim().slice(0, MAX_TEXT_LENGTH),
        privacyLevel: state.privacyLevel
      };

      console.log('Submitting feedback:', submissionData);

      const response = await fetch('http://localhost:8084/api/v1/feedback-submissions/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Submission error response:', responseData);
        throw new Error(responseData.message || 'Failed to submit feedback');
      }

      showAlert({
        title: "Success!",
        description: "Your feedback has been submitted successfully.",
        variant: "solid",
        color: "success",
        duration: 5000,
      });
      router.push('/employee');
    } catch (error) {
      console.error('Submission error:', error);
      showAlert({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unable to submit your feedback. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading your feedback form...</p>
        </div>
      </div>
    );
  }

  if (!state.feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Feedback Not Found</h2>
        <p className="text-gray-500">This feedback form doesn&apos;t exist or has expired.</p>
        <Button onClick={() => router.push('/employee')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const canProceed = state.currentStep === state.feedback?.questions.length ? 
    state.overallComments.trim().length > 0 :
    Boolean(state.feedback && !state.feedback.questions[state.currentStep].required) || 
    Boolean(state.answers[state.feedback!.questions[state.currentStep].id] && 
    (!Array.isArray(state.answers[state.feedback!.questions[state.currentStep].id]) || 
    (state.answers[state.feedback!.questions[state.currentStep].id] as string[]).length > 0));

  return (
    <div className="min-h-screen bg-gray-50/50 overflow-hidden">
      <div className="flex h-screen">
        {/* Left Sidebar - 25% width */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
          {/* Header Section - Fixed */}
          <div className="flex-none p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{state.feedback.title}</h1>
                <p className="text-sm text-gray-500 line-clamp-1">{state.feedback.description}</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <p className="font-medium text-gray-900">~{state.feedback.questions.length * 2} mins</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <BarChart className="h-4 w-4" />
                  <span>Questions</span>
                </div>
                <p className="font-medium text-gray-900">{state.feedback.questions.length} total</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Your Progress</span>
                <span className="font-medium text-violet-600">
                  {Math.round(((state.currentStep + 1) / (state.feedback.questions.length + 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((state.currentStep + 1) / (state.feedback.questions.length + 1)) * 100}%` 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* Questions Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {state.feedback.questions.map((question, index) => {
              const isCompleted = state.answers[question.id];
              const isCurrent = state.currentStep === index;
              
              return (
                <motion.button
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setState(prev => ({ ...prev, currentStep: index }))}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all",
                    "hover:bg-violet-50 hover:shadow-md",
                    isCurrent 
                      ? "bg-violet-50 text-violet-700 shadow-md border border-violet-200" 
                      : "bg-white border border-gray-100 shadow-sm",
                    isCompleted 
                      ? "text-gray-900" 
                      : "text-gray-500"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors shrink-0",
                    isCurrent 
                      ? "bg-violet-100 text-violet-700" 
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        Question {index + 1}
                      </span>
                      {question.required && (
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {question.description || 'No description'}
                    </p>
                  </div>
                </motion.button>
              );
            })}
            
            {/* Overall Comments Step */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: state.feedback.questions.length * 0.05 }}
              onClick={() => setState(prev => ({ 
                ...prev, 
                currentStep: state.feedback!.questions.length 
              }))}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all",
                "hover:bg-violet-50 hover:shadow-md",
                state.currentStep === state.feedback.questions.length
                  ? "bg-violet-50 text-violet-700 shadow-md border border-violet-200"
                  : "bg-white border border-gray-100 shadow-sm",
                state.overallComments.trim().length > 0
                  ? "text-gray-900"
                  : "text-gray-500"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                state.currentStep === state.feedback.questions.length
                  ? "bg-violet-100 text-violet-700"
                  : state.overallComments.trim().length > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
              )}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">Overall Comments</span>
                <p className="text-xs text-gray-500 mt-1">Final thoughts and suggestions</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Main Content Area - 75% width */}
        <main className="w-3/4 h-screen overflow-y-auto bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto p-8">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Question Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <User2 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Question {state.currentStep + 1} of {state.feedback.questions.length}
                    </h2>
                    {state.feedback.questions[state.currentStep]?.required && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Required</span>
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {state.currentStep < state.feedback.questions.length ? (
                    <QuestionCard
                      key={state.currentStep}
                      question={state.feedback.questions[state.currentStep]}
                      currentAnswer={state.answers[state.feedback.questions[state.currentStep].id] || ''}
                      onAnswerChange={(value) => setState(prev => ({
                        ...prev,
                        answers: { ...prev.answers, [state.feedback!.questions[state.currentStep].id]: value }
                      }))}
                      questionNumber={state.currentStep + 1}
                      totalQuestions={state.feedback.questions.length}
                    />
                  ) : (
                    <FeedbackOverallComments
                      overallComments={state.overallComments}
                      privacyLevel={state.privacyLevel}
                      onCommentsChange={(comments) => setState(prev => ({ ...prev, overallComments: comments }))}
                      onPrivacyChange={(privacy) => setState(prev => ({ ...prev, privacyLevel: privacy }))}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }))}
                  disabled={state.currentStep === 0}
                  className="gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {state.currentStep === state.feedback.questions.length ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={state.submitting || !canProceed}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm"
                  >
                    {state.submitting ? (
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
                    onClick={() => setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))}
                    disabled={!canProceed}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm"
                  >
                    <span>
                      {state.currentStep === state.feedback.questions.length - 1 ? 'Final Step' : 'Next Question'}
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