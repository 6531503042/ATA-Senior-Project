'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Spinner } from '@heroui/react';
import { PlusIcon, FileText, CheckCircleIcon, TrendingUpIcon, ChevronLeft, ChevronRight, BarChart3, Download, Zap, Eye } from 'lucide-react';

import FeedbackSelector from './_components/FeedbackSelector';
import SubmissionList from './_components/SubmissionList';
import DetailsPanel from './_components/DetailsPanel';
import Header from './_components/Header';
import FeedbackAnalysisSummary from './_components/FeedbackAnalysisSummary';

import { PageHeader } from '@/components/ui/page-header';
import { useSubmissions, calculateOverallSentiment } from '@/hooks/useSubmissions';
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

  // Navigation between submissions
  const currentSubmissionIndex = useMemo(() => {
    if (!selectedSubmissionId || submissionItems.length === 0) return -1;
    return submissionItems.findIndex(item => String(item.id) === selectedSubmissionId);
  }, [submissionItems, selectedSubmissionId]);

  const goToNextSubmission = () => {
    if (currentSubmissionIndex < submissionItems.length - 1) {
      const nextSubmission = submissionItems[currentSubmissionIndex + 1];
      setSelectedSubmissionId(String(nextSubmission.id));
    }
  };

  const goToPreviousSubmission = () => {
    if (currentSubmissionIndex > 0) {
      const prevSubmission = submissionItems[currentSubmissionIndex - 1];
      setSelectedSubmissionId(String(prevSubmission.id));
    }
  };

  // Export functionality for research
  const exportToCSV = async () => {
    if (!selectedFeedbackId) {
      alert('Please select a feedback first');
      return;
    }

    try {
      // Get all questions and submissions for the feedback
      const [questionsRes, submissionsRes] = await Promise.all([
        apiRequest<any>(`/api/feedbacks/${selectedFeedbackId}`, 'GET'),
        apiRequest<any>(`/api/submits/feedback/${selectedFeedbackId}`, 'GET')
      ]);

      const questionIds: number[] = questionsRes.data?.questionIds || [];
      const submissions = Array.isArray(submissionsRes.data?.content) ? submissionsRes.data.content : [];

      // Get question details
      const questions = await Promise.all(
        questionIds.map(id =>
          apiRequest<any>(`/api/questions/${id}`, 'GET')
            .then(r => r.data)
            .catch(() => ({ id, text: `Question #${id}` }))
        )
      );

      // Create CSV data
      const headers = [
        'Submission ID',
        'Submitted By',
        'Privacy Level',
        'Submitted At',
        'Overall Comments',
        ...questions.map(q => `Q${q.id}: ${q.text}`),
        'Admin Rating',
        'Admin Sentiment',
        'Admin Notes'
      ];

      const rows = submissions.map((submission: any) => [
        submission.id,
        submission.submittedBy || 'Anonymous',
        submission.privacyLevel,
        new Date(submission.submittedAt).toLocaleString(),
        submission.overallComments || '',
        ...questions.map(q => submission.responses?.[q.id] || ''),
        '', // Admin Rating - to be filled
        '', // Admin Sentiment - to be filled  
        ''  // Admin Notes - to be filled
      ]);

      // Convert to CSV
      const csvContent = [headers, ...rows]
        .map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `submissions_${selectedFeedbackId}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

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
        title="Submissions Management" 
        description="Review and analyze feedback submissions"
        icon={<FileText />}
      />

      <div className="space-y-8">
        {/* Modern Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  Submissions
                </h1>
                <p className="text-white/80 text-lg">
                  Advanced feedback analysis dashboard
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Chip
                    startContent={<Zap className="w-3 h-3" />}
                    className="bg-green-500/20 text-green-300 border-green-400/30"
                    variant="bordered"
                    size="sm"
                  >
                    Live Analytics
                  </Chip>
                  <Chip
                    startContent={<Eye className="w-3 h-3" />}
                    className="bg-blue-500/20 text-blue-300 border-blue-400/30"
                    variant="bordered"
                    size="sm"
                  >
                    Real-time Updates
                  </Chip>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-medium"
                startContent={<Download className="w-4 h-4" />}
                onPress={exportToCSV}
                radius="lg"
              >
                Export Data
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                startContent={loading ? <Spinner size="sm" color="white" /> : <PlusIcon className="w-4 h-4" />}
                onPress={() => refresh()}
                isLoading={loading}
                radius="lg"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer"
            >
              <CardBody className="p-6 relative">
                {/* Animated background glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-15 transition-all duration-500`}
                />
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`p-2 rounded-xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-700">
                        {stat.title}
        </p>
      </div>

                    <div className="mb-3">
                      <p className="text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                      <Progress
                        value={65 + i * 10}
                        className="mt-2"
                        classNames={{
                          indicator: `bg-gradient-to-r ${stat.gradient}`,
                          track: "bg-slate-200/50"
                        }}
                        size="sm"
                      />
                    </div>
                    
                    <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                      {stat.description}
                    </p>
        </div>
      </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Main Content - Left Panel / Right Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Left Panel - Feedback & Submission Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Feedback Selector */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-700">Feedback Selection</h3>
                </div>
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

            {/* Modern Loading State for Submissions */}
            {submissionLoading && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardBody className="p-8 text-center">
                  <div className="relative">
                    <Spinner 
                      size="lg" 
                      color="primary"
                      classNames={{
                        circle1: "border-b-blue-500",
                        circle2: "border-b-purple-500"
                      }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
                  </div>
                  <p className="text-slate-600 font-medium mt-4">Loading submissions...</p>
                  <p className="text-slate-400 text-sm">Analyzing feedback data</p>
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

            {/* Modern Navigation Controls */}
            {selectedSubmission && submissionItems.length > 1 && (
              <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <Button
                      size="md"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-300"
                      startContent={<ChevronLeft className="w-4 h-4" />}
                      onPress={goToPreviousSubmission}
                      isDisabled={currentSubmissionIndex <= 0}
                      radius="lg"
                    >
                      Previous
                    </Button>
                    
                    <div className="text-center px-6">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <p className="text-white font-semibold">
                          {currentSubmissionIndex + 1} of {submissionItems.length}
                        </p>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      </div>
                      <Progress
                        value={(currentSubmissionIndex + 1) / submissionItems.length * 100}
                        className="max-w-[200px]"
                        classNames={{
                          indicator: "bg-gradient-to-r from-blue-400 to-purple-400",
                          track: "bg-white/20"
                        }}
                        size="sm"
                      />
                      <p className="text-white/70 text-xs mt-2">
                        Progress through submissions
                      </p>
                    </div>
                    
                    <Button
                      size="md"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-300"
                      endContent={<ChevronRight className="w-4 h-4" />}
                      onPress={goToNextSubmission}
                      isDisabled={currentSubmissionIndex >= submissionItems.length - 1}
                      radius="lg"
                    >
                      Next
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Overall Sentiment Analysis */}
            {selectedFeedbackId && submissionItems.length > 0 && (() => {
              const overall = calculateOverallSentiment(submissionItems as any);
              const getSentimentColor = (sentiment: string) => {
                switch (sentiment) {
                  case 'positive': return 'from-emerald-500 to-green-500';
                  case 'negative': return 'from-rose-500 to-red-500';
                  default: return 'from-amber-500 to-orange-500';
                }
              };
              
              const getSentimentIcon = (sentiment: string) => {
                switch (sentiment) {
                  case 'positive': return '😊';
                  case 'negative': return '😞';
                  default: return '😐';
                }
              };

              return (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Overall Sentiment</h4>
                          <p className="text-white/70 text-sm">Feedback analysis summary</p>
                        </div>
                      </div>
                      {overall.isComplete && (
                        <Chip className="bg-green-500/20 text-green-300 border-green-400/30" variant="bordered" size="sm">
                          ✅ Complete
                        </Chip>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sentiment Result */}
                      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getSentimentIcon(overall.overallSentiment)}</span>
                          <div>
                            <p className="text-white font-semibold capitalize">{overall.overallSentiment} Sentiment</p>
                            <p className="text-white/70 text-sm">Based on majority analysis</p>
                          </div>
                        </div>
                        <div className={`w-full h-2 bg-gradient-to-r ${getSentimentColor(overall.overallSentiment)} rounded-full`}></div>
                      </div>

                      {/* Progress */}
                      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-semibold">Analysis Progress</p>
                          <p className="text-white/70 text-sm">{Math.round(overall.completionRate)}%</p>
                        </div>
                        <Progress
                          value={overall.completionRate}
                          className="mb-2"
                          classNames={{
                            indicator: "bg-gradient-to-r from-blue-400 to-purple-400",
                            track: "bg-white/20"
                          }}
                          size="sm"
                        />
                        <p className="text-white/70 text-xs">
                          {submissionItems.filter(s => (s as any).adminSentiment).length} of {submissionItems.length} submissions analyzed
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })()}

            {/* Submission Details Panel */}
            <DetailsPanel 
              item={selectedSubmission} 
              onSentimentSaved={() => {
                // Refresh all submissions data
                refresh();
                // Also refresh the current feedback submissions
                if (selectedFeedbackId) {
                  const loadSubmissions = async () => {
                    try {
                      const response = await apiRequest<any>(`/api/submits/feedback/${selectedFeedbackId}`, 'GET');
                      const items = Array.isArray(response.data?.content) ? response.data.content : [];
                      setSubmissionItems(items);
                    } catch (error) {
                      console.error('Failed to refresh submissions:', error);
                    }
                  };
                  loadSubmissions();
                }
              }} 
            />

            {/* Feedback Analysis Summary */}
            {selectedFeedbackId && submissionItems.length > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-default-900 flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                      Feedback Analysis Summary
                    </h3>
                    <p className="text-sm text-default-600">
                      Overall insights and patterns from all submissions
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <FeedbackAnalysisSummary 
                    feedbackId={Number(selectedFeedbackId)}
                    submissions={submissionItems}
                  />
                </CardBody>
              </Card>
            )}

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

            {/* Research & HR Guide */}
            {!selectedFeedbackId && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 overflow-hidden">
                <CardBody className="p-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <FileText className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-default-700 mb-2">
                        Research & HR Analytics Platform
                      </h3>
                      <p className="text-default-600">
                        Advanced feedback analysis system for research and human resources insights
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <TrendingUpIcon className="w-4 h-4" />
                          Research Features
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Quantitative & qualitative analysis</li>
                          <li>• Sentiment analysis & trends</li>
                          <li>• Statistical data export (CSV)</li>
                          <li>• Response pattern recognition</li>
                          <li>• Quality rating system</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4" />
                          HR Applications
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Employee satisfaction tracking</li>
                          <li>• Team collaboration insights</li>
                          <li>• Performance feedback analysis</li>
                          <li>• Engagement metrics</li>
                          <li>• Action item identification</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3">How to Use:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-800 font-bold">1</div>
                          <p><strong>Select Feedback</strong><br />Choose a survey from the dropdown</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-800 font-bold">2</div>
                          <p><strong>Analyze Submissions</strong><br />Rate quality & add insights</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-800 font-bold">3</div>
                          <p><strong>Export Data</strong><br />Download CSV for research</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <p className="text-sm text-default-500">
                        Select a feedback survey from the left panel to begin analysis
                      </p>
                    </div>
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
