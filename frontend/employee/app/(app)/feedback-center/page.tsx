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
  ArrowRight,
  Eye,
  Pencil
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeDashboard } from '../../../hooks/useEmployeeDashboard';
import { useEmployeeFeedbacks } from '../../../hooks/useEmployeeFeedbacks';
import { useAuthContext } from '../../../contexts/AuthContext';

export default function FeedbackCenter() {
  const { dashboardData, loading: dashboardLoading, error: dashboardError, refresh: refreshDashboard } = useEmployeeDashboard();
  const { getPendingFeedbacks, loading: feedbacksLoading, refresh: refreshFeedbacks } = useEmployeeFeedbacks();
  const { user } = useAuthContext();

  const pendingFeedbacks = getPendingFeedbacks();

  // Ensure the latest data after navigation back from a submission
  React.useEffect(() => {
    refreshDashboard();
    refreshFeedbacks();
  }, []);

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 p-8 rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Feedback Center
              </h1>
              <p className="text-white/80 text-lg">Submit feedback and track your submissions</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/70 text-sm">Welcome back, {user?.firstName || user?.username}!</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/70 text-sm">Last updated</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                    <p className={`text-4xl font-bold ${stat.color} mb-1`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          stat.color.includes('blue') ? 'bg-blue-500' :
                          stat.color.includes('orange') ? 'bg-orange-500' :
                          stat.color.includes('green') ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min((stat.value / Math.max(stats.totalFeedbacks, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Pending Feedbacks Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardBody className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pending Feedbacks</h2>
                  <p className="text-gray-600 mt-1">Complete these feedback forms to help improve our processes</p>
                </div>
              </div>
              {pendingFeedbacks.length > 0 && (
                <Button
                  as={Link}
                  href="/feedback-center"
                  variant="solid"
                  color="primary"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  View All
                </Button>
              )}
            </div>
          
            {pendingFeedbacks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingFeedbacks.slice(0, 6).map((feedback) => (
                  <Card
                    key={feedback.id}
                    isPressable
                    as={Link}
                    href={`/feedback/${feedback.id}`}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm"
                  >
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
                    <CardBody className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-2 text-lg">
                            {feedback.title}
                          </h3>
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-full text-xs font-semibold shadow-sm">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                          {feedback.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Due: {new Date(feedback.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-400">Click to start</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">All caught up!</h3>
                <p className="text-gray-600 text-lg">You have no pending feedback forms at the moment.</p>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Great job staying on top of your feedback!
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    as={Link}
                    href="/feedback-center"
                    variant="flat"
                    className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200"
                    startContent={<MessageSquare className="w-4 h-4" />}
                  >
                    View All Feedbacks
                  </Button>
                  <Button
                    variant="flat"
                    className="w-full justify-start bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200"
                    startContent={<CheckCircle className="w-4 h-4" />}
                  >
                    My Submissions
                  </Button>
                  <Button
                    variant="flat"
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200"
                    startContent={<Users className="w-4 h-4" />}
                  >
                    My Projects
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Progress Overview */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold text-gray-900">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-gray-900">Avg: 0 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Logged in</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Dashboard viewed</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardBody className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recent Submissions</h2>
                    <p className="text-gray-600 mt-1">Your latest feedback submissions and their status</p>
                  </div>
                </div>
                {dashboardData?.recentSubmissions?.length ? (
                  <Button as={Link} href="/feedback-center" variant="solid" color="default" className="bg-gray-900 text-white">
                    View all
                  </Button>
                ) : null}
              </div>

              <div className="space-y-4">
                {dashboardData?.recentSubmissions?.length ? (
                  dashboardData.recentSubmissions.slice(0, 5).map((submission) => {
                    const statusStyle =
                      submission.status === 'analyzed'
                        ? 'bg-green-100 text-green-700'
                        : submission.status === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700';
                    const sentimentEmoji =
                      submission.overallSentiment === 'positive'
                        ? '😊'
                        : submission.overallSentiment === 'negative'
                        ? '😕'
                        : submission.overallSentiment === 'neutral'
                        ? '😐'
                        : '—';
                    return (
                      <div key={submission.id} className="relative p-5 rounded-xl border border-gray-200 bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-t-xl" />
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{submission.feedbackTitle || 'Feedback'}</h3>
                            <p className="text-sm text-gray-600 mb-3 truncate">{submission.projectName || '—'}</p>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>{submission.status}</span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                Sentiment: <span className="ml-1">{sentimentEmoji}</span>
                              </span>
                              <span className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button as={Link} href={`/feedback/${submission.id}`} variant="flat" className="bg-gray-100 text-gray-800 hover:bg-gray-200" startContent={<Eye className="w-4 h-4" />}>View</Button>
                            <Button as={Link} href={`/feedback/${submission.id}`} variant="flat" className="bg-violet-100 text-violet-800 hover:bg-violet-200" startContent={<Pencil className="w-4 h-4" />}>Edit</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent submissions</h3>
                    <p className="text-gray-600">Your completed feedback will appear here</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* My Projects */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardBody className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                  <p className="text-gray-600 mt-1">Projects you're currently involved in</p>
                </div>
              </div>
            
              <div className="space-y-4">
                {dashboardData?.projects?.length ? (
                  dashboardData.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : project.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {project.status}
                        </span>
                        <div className="text-sm text-gray-500 bg-white p-2 rounded-lg">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects assigned</h3>
                    <p className="text-gray-600">You'll see your assigned projects here</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
            </div>

            {/* Additional Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Insights */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Performance Insights</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                      <p className="text-sm font-medium text-indigo-900">Feedback Quality</p>
                      <p className="text-xs text-indigo-700">Based on your responses</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <p className="text-sm font-medium text-purple-900">Engagement Score</p>
                      <p className="text-xs text-purple-700">How active you are</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h3>
                  </div>
                  <div className="space-y-3">
                    {pendingFeedbacks.slice(0, 2).map((feedback) => (
                      <div key={feedback.id} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                        <p className="text-sm font-medium text-orange-900 line-clamp-1">{feedback.title}</p>
                        <p className="text-xs text-orange-700">Due: {new Date(feedback.endDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                    {pendingFeedbacks.length === 0 && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                        <p className="text-sm font-medium text-green-900">No upcoming deadlines</p>
                        <p className="text-xs text-green-700">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                      <span className="text-sm font-medium text-emerald-900">This Month</span>
                      <span className="text-lg font-bold text-emerald-700">0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Total Time</span>
                      <span className="text-lg font-bold text-blue-700">0m</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <span className="text-sm font-medium text-purple-900">Avg Rating</span>
                      <span className="text-lg font-bold text-purple-700">-</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}