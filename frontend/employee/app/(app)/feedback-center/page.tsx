'use client';

import React from 'react';
import { Card, CardBody, Spinner, Button } from '@heroui/react';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  FileText,
  Users,
  Calendar,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeDashboard } from '../../../hooks/useEmployeeDashboard';
import { useEmployeeFeedbacks } from '../../../hooks/useEmployeeFeedbacks';
import { useAuthContext } from '../../../contexts/AuthContext';

export default function FeedbackCenter() {
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useEmployeeDashboard();
  const { getPendingFeedbacks, loading: feedbacksLoading } = useEmployeeFeedbacks();
  const { user } = useAuthContext();

  const pendingFeedbacks = getPendingFeedbacks();

  if (dashboardLoading || feedbacksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <h2 className="text-lg font-semibold text-default-800 mb-1">
            Loading Feedback Center
          </h2>
          <p className="text-default-600 text-sm">
            Fetching your feedback data...
          </p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardBody className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error loading feedback center
            </h2>
            <p className="text-default-600 mb-4">{dashboardError}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalFeedbacks: 0,
    pendingFeedbacks: 0,
    completedFeedbacks: 0,
    totalSubmissions: 0,
  };

  const statsConfig = [
    {
      title: 'Total Feedbacks',
      value: stats.totalFeedbacks,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending',
      value: stats.pendingFeedbacks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Completed',
      value: stats.completedFeedbacks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Feedback Center
            </h1>
            <p className="text-white/70 mt-1">Submit feedback and track your submissions</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-default-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pending Feedbacks Section */}
      <Card className="border-0 shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-default-900">Pending Feedbacks</h2>
            </div>
            {pendingFeedbacks.length > 0 && (
              <Button
                as={Link}
                href="/feedbacks"
                variant="flat"
                color="primary"
                endContent={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            )}
          </div>
          
          {pendingFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingFeedbacks.slice(0, 6).map((feedback) => (
                <Card
                  key={feedback.id}
                  isPressable
                  as={Link}
                  href={`/feedback/${feedback.id}`}
                  className="group relative overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all rounded-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-default-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                        {feedback.title}
                      </h3>
                      <p className="text-sm text-default-600 line-clamp-2">
                        {feedback.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-default-500">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {new Date(feedback.endDate).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-default-900 mb-2">All caught up!</h3>
              <p className="text-default-600">You have no pending feedback forms at the moment.</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-default-900">Recent Submissions</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recentSubmissions?.length ? (
                dashboardData.recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="p-4 bg-default-50 rounded-lg border border-default-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-default-900 mb-1">{submission.feedbackTitle}</h3>
                        <p className="text-sm text-default-600 mb-2">{submission.projectName}</p>
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <Calendar className="w-3 h-3" />
                          <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'analyzed' 
                            ? 'bg-green-100 text-green-700' 
                            : submission.status === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {submission.status}
                        </span>
                        {submission.overallSentiment && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.overallSentiment === 'positive' 
                              ? 'bg-green-100 text-green-700' 
                              : submission.overallSentiment === 'negative'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {submission.overallSentiment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-default-300 mx-auto mb-3" />
                  <p className="text-default-500">No recent submissions</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* My Projects */}
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-default-900">My Projects</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.projects?.length ? (
                dashboardData.projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="p-4 bg-default-50 rounded-lg border border-default-200">
                    <h3 className="font-medium text-default-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-default-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {project.status}
                      </span>
                      <div className="text-xs text-default-500">
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-default-300 mx-auto mb-3" />
                  <p className="text-default-500">No projects assigned</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}