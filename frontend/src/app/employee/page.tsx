'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Loader2,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getCookie } from 'cookies-next';

interface Answer {
  text: string;
  value: string;
}

interface Question {
  id: number;
  text: string;
  content: string;
  required: boolean;
  type: string;
  category: string;
  answerType: string;
  answers: Answer[];
  description: string;
  validationRules: ValidationRules | null;
}

interface ValidationRules {
  maxQuestions: number;
  requiresComments: boolean;
  minQuestions: number;
}

interface Feedback {
  id: number;
  title: string;
  description: string;
  projectName: string;
  questions: Question[];
  startDate: string;
  endDate: string;
  active: boolean;
  alreadySubmitted: boolean;
  validationRules: ValidationRules;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = getCookie('accessToken');
        if (!token) {
          console.error('No access token found');
          toast({
            title: "Authentication Error",
            description: "Please log in again.",
            variant: "destructive",
          });
          router.push('/auth/login');
          return;
        }

        console.log('Fetching feedbacks with token:', token ? 'Token exists' : 'No token');
        
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
        console.log('Feedback response:', data);
        
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          console.error('Unexpected response format:', data);
          toast({
            title: "Error",
            description: "Received invalid data format from server",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load feedbacks",
          variant: "destructive",
        });
        
        if (error instanceof Error && error.message.includes('401')) {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [toast, router]);

  const handleSubmitFeedback = async (feedbackId: number) => {
    try {
      setSubmitting(feedbackId);
      router.push(`/employee/feedback/${feedbackId}`);
    } catch (error) {
      console.error('Error starting feedback submission:', error);
      toast({
        title: "Error",
        description: "Failed to start feedback submission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading your feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-gray-500 mt-2">Here are your feedback requests that need attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((feedback, index) => {
          const isSubmitting = submitting === feedback.id;
          
          return (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200 hover:border-violet-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-50 rounded-lg group-hover:bg-violet-100 transition-colors">
                        <MessageSquare className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                          {feedback.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn(
                            feedback.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-700"
                          )}>
                            {feedback.active ? (
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                            )}
                            {feedback.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge className="bg-blue-50 text-blue-700">
                            {feedback.projectName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {feedback.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Questions Info */}
                    <div className="p-3 bg-violet-50 rounded-lg group-hover:bg-violet-100/80 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-600" />
                        <span className="text-sm text-violet-700">Questions</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xl font-bold text-violet-900">
                          {feedback.questions.length}
                        </p>
                        <p className="text-xs text-violet-600">
                          {feedback.validationRules.requiresComments ? 'Comments required' : 'Optional comments'}
                        </p>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="p-3 bg-violet-50 rounded-lg group-hover:bg-violet-100/80 transition-colors">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-violet-600" />
                        <span className="text-sm text-violet-700">Due Date</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-bold text-violet-900">
                          {format(new Date(feedback.endDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-violet-600">
                          {format(new Date(feedback.startDate), 'MMM d')} - {format(new Date(feedback.endDate), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feedback.alreadySubmitted ? (
                        <Badge className="bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Submitted
                        </Badge>
                      ) : feedback.active ? (
                        <Badge className="bg-amber-50 text-amber-700">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          Expired
                        </Badge>
                      )}
                    </div>

                    {!feedback.alreadySubmitted && feedback.active && (
                      <Button 
                        onClick={() => handleSubmitFeedback(feedback.id)}
                        disabled={isSubmitting}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            Start Feedback
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {feedbacks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-violet-50 rounded-full">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Feedbacks Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no feedback requests available for you at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 