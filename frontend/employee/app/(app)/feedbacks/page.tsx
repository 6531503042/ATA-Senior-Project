'use client';

import React, { useState } from 'react';
import { Card, CardBody, Spinner, Button, Input, Chip } from '@heroui/react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle,
  Search,
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeFeedbacks } from '@/hooks/useEmployeeFeedbacks';

export default function FeedbacksPage() {
  const { 
    feedbacks, 
    submissions, 
    loading, 
    error, 
    getPendingFeedbacks, 
    getCompletedFeedbacks 
  } = useEmployeeFeedbacks();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const pendingFeedbacks = getPendingFeedbacks();
  const completedFeedbacks = getCompletedFeedbacks();

  const filteredFeedbacks = () => {
    let filtered = feedbacks;
    
    if (filter === 'pending') {
      filtered = pendingFeedbacks;
    } else if (filter === 'completed') {
      filtered = completedFeedbacks;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <h2 className="text-lg font-semibold text-default-800 mb-1">
            Loading feedbacks
          </h2>
          <p className="text-default-600 text-sm">
            Fetching your assigned feedback forms...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardBody className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error loading feedbacks
            </h2>
            <p className="text-default-600 mb-4">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const filtered = filteredFeedbacks();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              My Feedbacks
            </h1>
            <p className="text-white/70 mt-1">View and complete your assigned feedback forms</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-default-600 mb-1">Total Feedbacks</p>
                <p className="text-3xl font-bold text-blue-600">{feedbacks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-default-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{pendingFeedbacks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-default-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedFeedbacks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search feedbacks..."
                startContent={<Search className="w-4 h-4 text-default-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-10"
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'solid' : 'flat'}
                color={filter === 'all' ? 'primary' : 'default'}
                onClick={() => setFilter('all')}
                startContent={<Filter className="w-4 h-4" />}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'solid' : 'flat'}
                color={filter === 'pending' ? 'warning' : 'default'}
                onClick={() => setFilter('pending')}
                startContent={<Clock className="w-4 h-4" />}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'completed' ? 'solid' : 'flat'}
                color={filter === 'completed' ? 'success' : 'default'}
                onClick={() => setFilter('completed')}
                startContent={<CheckCircle className="w-4 h-4" />}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Feedbacks List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((feedback) => {
            const isCompleted = completedFeedbacks.some(cf => cf.id === feedback.id);
            const submission = submissions.find(s => s.feedbackId === feedback.id);
            
            return (
              <Card
                key={feedback.id}
                isPressable
                as={Link}
                href={`/feedback/${feedback.id}`}
                className="group relative overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all rounded-xl"
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                }`} />
                
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-default-900 group-hover:text-violet-700 transition-colors line-clamp-2 flex-1">
                        {feedback.title}
                      </h3>
                      <Chip
                        size="sm"
                        color={isCompleted ? 'success' : 'warning'}
                        variant="flat"
                        startContent={isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      >
                        {isCompleted ? 'Completed' : 'Pending'}
                      </Chip>
                    </div>
                    
                    <p className="text-sm text-default-600 line-clamp-3">
                      {feedback.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-default-500">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(feedback.endDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="text-sm text-default-500">
                        <span className="font-medium">Project:</span> {feedback.projectName}
                      </div>
                      
                      <div className="text-sm text-default-500">
                        <span className="font-medium">Questions:</span> {feedback.questions?.length || 0}
                      </div>
                    </div>
                    
                    {submission && (
                      <div className="pt-2 border-t border-default-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-default-500">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                          {submission.overallSentiment && (
                            <Chip
                              size="sm"
                              color={
                                submission.overallSentiment === 'positive' ? 'success' :
                                submission.overallSentiment === 'negative' ? 'danger' : 'default'
                              }
                              variant="flat"
                            >
                              {submission.overallSentiment}
                            </Chip>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button
                      as={Link}
                      href={`/feedback/${feedback.id}`}
                      className="w-full"
                      color={isCompleted ? 'default' : 'primary'}
                      variant={isCompleted ? 'flat' : 'solid'}
                      endContent={<ArrowRight className="w-4 h-4" />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isCompleted ? 'View Details' : 'Start Feedback'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardBody className="p-12 text-center">
            <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-default-400" />
            </div>
            <h3 className="text-lg font-semibold text-default-900 mb-2">
              {searchTerm || filter !== 'all' ? 'No matching feedbacks' : 'No feedbacks assigned'}
            </h3>
            <p className="text-default-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You don\'t have any feedback forms assigned at the moment.'}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
