'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { PlusIcon, FileText, CheckCircleIcon, TrendingUpIcon } from 'lucide-react';

import FeedbackSelector from './_components/FeedbackSelector';
import SubmissionList from './_components/SubmissionList';
import DetailsPanel from './_components/DetailsPanel';
import Header from './_components/Header';

import { PageHeader } from '@/components/ui/page-header';
import { useSubmissions } from '@/hooks/useSubmissions';
import { apiRequest } from '@/utils/api';
import type { SubmitDto } from '@/types/submission';

export default function SubmissionsPage() {
  const { allItems, stats, loading, error, refresh } = useSubmissions();

  // State management
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [feedbackOptions, setFeedbackOptions] = useState<{ id: string; title: string }[]>([]);
  const [submissionItems, setSubmissionItems] = useState<SubmitDto[]>([]);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  // Get feedback options from all submissions
  const feedbackOptionsFromSubmissions = useMemo(() => {
    const map = new Map<string, string>();
    allItems.forEach(item => {
      const key = String(item.feedbackId);
      if (!map.has(key)) {
        map.set(key, item.feedbackTitle || `Feedback #${key}`);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [allItems]);

  // Load feedback options from API if not available from submissions
  useEffect(() => {
    let mounted = true;
    const loadFeedbacks = async () => {
      if (feedbackOptionsFromSubmissions.length > 0) {
        setFeedbackOptions(feedbackOptionsFromSubmissions);
        return;
      }

      try {
        const response = await apiRequest<any>('/api/feedbacks', 'GET');
        const feedbacks = Array.isArray(response.data?.content) ? response.data.content : [];
        const options = feedbacks.map((f: any) => ({
          id: String(f.id),
          title: f.title || `Feedback #${f.id}`
        }));
        if (mounted) setFeedbackOptions(options);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
        if (mounted) setFeedbackOptions([]);
      }
    };

    loadFeedbacks();
    return () => { mounted = false; };
  }, [feedbackOptionsFromSubmissions]);

  // Auto-select first feedback if none selected
  useEffect(() => {
    if (!selectedFeedbackId && feedbackOptions.length > 0) {
      setSelectedFeedbackId(feedbackOptions[0].id);
    }
  }, [feedbackOptions, selectedFeedbackId]);

  // Load submissions for selected feedback
  useEffect(() => {
    let mounted = true;
    const loadSubmissions = async () => {
      if (!selectedFeedbackId) {
        setSubmissionItems([]);
        setSelectedSubmissionId(null);
        return;
      }

      setSubmissionLoading(true);
      try {
        const response = await apiRequest<any>(`/api/submits/feedback/${selectedFeedbackId}`, 'GET');
        const items = Array.isArray(response.data?.content) ? response.data.content : [];
        if (mounted) {
          setSubmissionItems(items);
          // Auto-select first submission
          if (items.length > 0 && !selectedSubmissionId) {
            setSelectedSubmissionId(String(items[0].id));
          }
        }
      } catch (error) {
        console.error('Failed to load submissions:', error);
        if (mounted) {
          setSubmissionItems([]);
          setSelectedSubmissionId(null);
        }
      } finally {
        if (mounted) setSubmissionLoading(false);
      }
    };

    loadSubmissions();
    return () => { mounted = false; };
  }, [selectedFeedbackId]);

  // Get selected submission details
  const selectedSubmission = useMemo(() => {
    if (!selectedSubmissionId) return null;
    return submissionItems.find(item => String(item.id) === selectedSubmissionId) || null;
  }, [submissionItems, selectedSubmissionId]);

  // Enhanced stats calculation
  const enhancedStats = useMemo(() => {
    const total = allItems.length;
    const analyzed = allItems.filter(s => s.status === 'analyzed').length;
    const pending = allItems.filter(s => s.status === 'pending').length;
    const publicCount = allItems.filter(s => s.privacyLevel === 'PUBLIC').length;
    const privateCount = allItems.filter(s => s.privacyLevel === 'PRIVATE').length;
    const anonymousCount = allItems.filter(s => s.privacyLevel === 'ANONYMOUS').length;

    // Calculate satisfaction from selected feedback submissions
    const feedbackSubmissions = selectedFeedbackId 
      ? allItems.filter(item => String(item.feedbackId) === selectedFeedbackId)
      : allItems;
    
    const positiveCount = feedbackSubmissions.filter(s => s.overallSentiment === 'positive').length;
    const satisfactionRate = feedbackSubmissions.length > 0 
      ? Math.round((positiveCount / feedbackSubmissions.length) * 100) 
      : 0;

    return {
      total,
      analyzed,
      pending,
      publicCount,
      privateCount,
      anonymousCount,
      satisfactionRate,
      selectedFeedbackSubmissions: feedbackSubmissions.length
    };
  }, [allItems, selectedFeedbackId]);

  const statsCards = [
    {
      title: 'Total Submissions',
      value: enhancedStats.total.toString(),
      description: 'All feedback responses',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-600 to-indigo-700',
      icon: FileText,
    },
    {
      title: 'Satisfaction Rate',
      value: `${enhancedStats.satisfactionRate}%`,
      description: 'Positive feedback ratio',
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-600 to-emerald-700',
      icon: TrendingUpIcon,
    },
    {
      title: 'Analysis Complete',
      value: enhancedStats.analyzed.toString(),
      description: 'Processed submissions',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-600 to-pink-700',
      icon: CheckCircleIcon,
    },
    {
      title: 'Current Feedback',
      value: enhancedStats.selectedFeedbackSubmissions.toString(),
      description: 'Selected feedback responses',
      gradient: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-600 to-red-700',
      icon: FileText,
    },
  ];

  return (
    <>
      <PageHeader
        description="Review and analyze feedback submissions"
        icon={<FileText />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 shadow-lg">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Submissions Analytics
            </h1>
            <p className="text-default-600 mt-1">
              Comprehensive feedback analysis and insights dashboard
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={() => refresh()}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group cursor-pointer"
            >
              <CardBody className="p-6 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-default-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Main Content - Left Panel / Right Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Left Panel - Feedback & Submission Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Feedback Selector */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
              <CardBody className="p-4">
                <FeedbackSelector
                  options={feedbackOptions}
                  value={selectedFeedbackId || undefined}
                  onChange={setSelectedFeedbackId}
                  label="Select Feedback"
                  placeholder="Choose a feedback survey..."
                />
              </CardBody>
            </Card>

            {/* Submission List */}
            {selectedFeedbackId && (
              <SubmissionList
                items={submissionItems}
                selectedId={selectedSubmissionId}
                onSelect={setSelectedSubmissionId}
              />
            )}

            {/* Loading State for Submissions */}
            {submissionLoading && (
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6 text-center">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-default-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 bg-default-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-default-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-default-500 text-sm mt-3">Loading submissions...</p>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Panel - Submission Details & Analysis */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header for Selected Feedback */}
            {selectedFeedbackId && (
              <Header
                title={feedbackOptions.find(f => f.id === selectedFeedbackId)?.title || 'Feedback Analysis'}
                total={submissionItems.length}
                onBack={() => setSelectedFeedbackId(null)}
              />
            )}

            {/* Submission Details Panel */}
            <DetailsPanel item={selectedSubmission} />

            {/* Answers Section */}
            {selectedSubmission && selectedFeedbackId && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-default-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Submission Responses
                    </h3>
                    <p className="text-sm text-default-600">
                      Detailed answers and feedback content
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <AnswersDisplay 
                    feedbackId={Number(selectedFeedbackId)} 
                    submissionId={Number(selectedSubmission.id)} 
                  />
                </CardBody>
              </Card>
            )}

            {/* Empty State */}
            {!selectedFeedbackId && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 overflow-hidden">
                <CardBody className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <FileText className="w-16 h-16 text-default-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-default-700 mb-2">
                      Select a Feedback Survey
                    </h3>
                    <p className="text-default-500">
                      Choose a feedback survey from the left panel to view its submissions and analyze responses.
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Component for displaying answers
function AnswersDisplay({ feedbackId, submissionId }: { feedbackId: number; submissionId: number }) {
  const [qa, setQa] = useState<{ id: number; q: string; a: string; type?: string; choices?: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadAnswers = async () => {
      setLoading(true);
      try {
        const [feedbackRes, submissionRes] = await Promise.all([
          apiRequest<any>(`/api/feedbacks/${feedbackId}`, 'GET'),
          apiRequest<any>(`/api/submits/${submissionId}`, 'GET'),
        ]);

        const responses: Record<number, string> = submissionRes.data?.responses || {};
        const questionIds: number[] = feedbackRes.data?.questionIds || [];
        const responseIds = Object.keys(responses).map(Number);
        const allIds = Array.from(new Set([...questionIds, ...responseIds]));

        if (allIds.length > 0) {
          const questions = await Promise.all(
            allIds.map(id =>
              apiRequest<any>(`/api/questions/${id}`, 'GET')
                .then(r => ({
                  id: r.data?.id ?? id,
                  text: r.data?.text ?? `Question #${id}`,
                  questionType: r.data?.questionType,
                  choices: r.data?.choices
                }))
                .catch(() => ({ id, text: `Question #${id}` }))
            )
          );

          const qaData = allIds.map(id => {
            const question = questions.find(q => q.id === id);
            return {
              id,
              q: question?.text || `Question #${id}`,
              a: String(responses[id] ?? ''),
              type: (question as any)?.questionType,
              choices: (question as any)?.choices,
            };
          });

          if (mounted) setQa(qaData);
        }
      } catch (error) {
        console.error('Failed to load answers:', error);
        if (mounted) setQa([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAnswers();
    return () => { mounted = false; };
  }, [feedbackId, submissionId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-default-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-default-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (qa.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-default-400">No responses found for this submission.</p>
      </div>
    );
  }

  const renderAnswer = (row: { id: number; q: string; a: string; type?: string; choices?: string[] }) => {
    const type = row.type || 'TEXT';
    const answer = row.a || '';

    switch (type) {
      case 'MULTIPLE_CHOICE': {
        const choices = answer.split(/[,;]\s*/).filter(Boolean);
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {choices.length > 0 ? choices.map((choice, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-full border border-blue-200 font-medium"
              >
                {choice}
              </span>
            )) : (
              <span className="text-default-400 text-sm italic">No selection</span>
            )}
          </div>
        );
      }
      case 'BOOLEAN': {
        const isYes = String(answer).toLowerCase() === 'true' || answer === 'YES' || answer === 'Yes';
        return (
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                isYes
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200'
              }`}
            >
              {isYes ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        );
      }
      case 'RATING': {
        const rating = Number(answer);
        const percentage = isNaN(rating) ? 0 : Math.min(100, Math.max(0, (rating / 5) * 100));
        return (
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-default-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-default-700 min-w-[60px]">
                {isNaN(rating) ? answer : `${rating}/5`}
              </span>
            </div>
          </div>
        );
      }
      default: {
        return (
          <div className="mt-2 p-3 bg-gradient-to-r from-default-50 to-default-100 rounded-lg border border-default-200">
            <p className="text-sm text-default-800 leading-relaxed">
              {answer || <span className="text-default-400 italic">No response provided</span>}
            </p>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {qa.map((row, index) => (
        <div
          key={row.id}
          className="p-4 bg-white rounded-xl border border-default-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-700">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-default-700 mb-2 leading-snug">
                {row.q}
              </h4>
              {renderAnswer(row)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
