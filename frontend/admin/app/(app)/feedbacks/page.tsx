'use client';

import type { Feedback } from '@/types/feedback';
import type { Project } from '@/types/project';
import type { User } from '@/types/user';
import type { Question } from '@/types/question';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { MessageSquare, CheckCircle, Star, Clock, FileText } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { useFeedback } from '@/hooks/useFeedback';
import { useProjects } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { useQuestions } from '@/hooks/useQuestions';

import FeedbackModal from './_components/FeedbackModal';
import FeedbackTable from './_components/FeedbackTable';
import TopContent from './_components/TopContent';
import BottomContent from './_components/BottomContent';
import FeedbackDetailModal from './_components/FeedbackDetailModal';

export default function FeedbacksPage() {
  const {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    updateFeedbackStatus,
  } = useFeedback();

  const { projects } = useProjects();
  const { users } = useUsers();
  const { questions, loading: questionsLoading, error: questionsError, fetchQuestions } = useQuestions();

  // Use questions from API only - no fallback
  const availableQuestions = questions;

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Calculate stats from feedbacks data
  const stats = {
    totalFeedbacks: feedbacks.length,
    activeFeedbacks: feedbacks.filter(f => f.status === 'ACTIVE').length,
    completedFeedbacks: feedbacks.filter(f => f.status === 'COMPLETED').length,
    pendingFeedbacks: feedbacks.filter(f => f.status === 'PENDING').length,
    draftFeedbacks: feedbacks.filter(f => f.status === 'DRAFT').length,
  };

  const statsCards = [
    {
      title: 'Total Surveys',
      value: stats.totalFeedbacks.toString(),
      description: 'All feedback surveys',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-600 to-indigo-700',
      icon: MessageSquare,
    },
    {
      title: 'Active Surveys',
      value: stats.activeFeedbacks.toString(),
      description: 'Currently active surveys',
      gradient: 'from-green-400 to-teal-500',
      bgColor: 'from-green-600 to-teal-700',
      icon: CheckCircle,
    },
    {
      title: 'Completed Surveys',
      value: stats.completedFeedbacks.toString(),
      description: 'Successfully completed surveys',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-600 to-pink-700',
      icon: Star,
    },
    {
      title: 'Draft Surveys',
      value: stats.draftFeedbacks.toString(),
      description: 'Draft surveys in preparation',
      gradient: 'from-gray-400 to-slate-500',
      bgColor: 'from-gray-600 to-slate-700',
      icon: FileText,
    },
  ];

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleAddFeedback = () => {
    setSelectedFeedback(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleSubmit = async (formData: FormData, mode: 'create' | 'edit') => {
    try {
      if (mode === 'create') {
        await createFeedback(formData);
      } else if (mode === 'edit' && selectedFeedback) {
        await updateFeedback(selectedFeedback.id, formData);
      }
      handleModalClose();
      // Refresh feedbacks list
      await fetchFeedbacks();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    try {
      await deleteFeedback(id);
      await fetchFeedbacks();
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateFeedbackStatus(id, { status: newStatus as 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'DRAFT' });
      await fetchFeedbacks();
    } catch (error) {
      console.error('Failed to update feedback status:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch =
      feedback.title.toLowerCase().includes(filterValue.toLowerCase()) ||
      feedback.description.toLowerCase().includes(filterValue.toLowerCase());
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(feedback.status.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  return (
    <>
             <PageHeader
        title="Feedback Surveys Management"
        description="Manage and monitor all feedback surveys with scope and visibility control"
        icon={<MessageSquare />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Feedback Surveys</h1>
              <p className="text-white/70 mt-1">Manage feedback surveys with scope-based visibility and time-based access control</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button
              className="w-full sm:w-auto font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20"
              onClick={handleAddFeedback}
            >
              Create Survey
            </button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
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

        {/* Filters and Search */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardBody className="p-6">
            <TopContent
              filterValue={filterValue}
              onClear={() => setFilterValue('')}
              onSearchChange={setFilterValue}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onRefresh={fetchFeedbacks}
              onAdd={() => {
                setModalMode('create');
                setSelectedFeedback(null);
                setIsModalOpen(true);
              }}
            />
          </CardBody>
        </Card>

        {/* Feedbacks Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">
                Feedback Surveys List
              </h3>
              <p className="text-sm text-default-600">
                View and manage all feedback surveys with their scope and visibility settings
                  </p>
                </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="py-6">
                <div className="space-y-3">
                  <div className="h-6 bg-default-100 rounded w-1/3" />
                  <div className="h-4 bg-default-100 rounded w-1/2" />
                </div>
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 bg-default-100 rounded" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : (
              <FeedbackTable
                feedbacks={pagedFeedbacks}
                onView={handleViewFeedback}
                onEdit={handleEditFeedback}
                onDelete={handleDeleteFeedback}
                onStatusChange={handleStatusChange}
              />
            )}

            {filteredFeedbacks.length === 0 && !loading && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No feedback surveys found</p>
              </div>
            )}

            {/* Pagination */}
            {filteredFeedbacks.length > 0 && (
              <BottomContent
                page={page}
                pages={totalPages}
                setPage={setPage}
                totalFeedbacks={filteredFeedbacks.length}
                currentPage={page}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Feedback Modal */}
              <FeedbackModal
          feedback={selectedFeedback || undefined}
          isOpen={isModalOpen}
          mode={modalMode}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          projects={projects}
          questions={availableQuestions}
          departments={[]}
          users={users}
        />

              {/* Questions Status Display */}
        {questionsLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Loading questions...</strong> Please wait while we fetch available questions from the backend.
            </p>
          </div>
        )}

        {questionsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Questions API Error:</strong> {questionsError}
            </p>
            <p className="text-red-700 text-sm mt-1">
              Cannot create feedback surveys without questions. Please check the backend API.
            </p>
            <button 
              onClick={fetchQuestions}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Retry loading questions
            </button>
          </div>
        )}

        {!questionsLoading && !questionsError && questions.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>No Questions Available:</strong> No questions found in the database.
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Please create some questions first before creating feedback surveys.
            </p>
    </div>
        )}

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
