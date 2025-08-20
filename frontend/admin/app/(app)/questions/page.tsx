'use client';

import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '@/types/question';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import {
  PlusIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  StarIcon,
  ToggleLeftIcon,
} from 'lucide-react';
import { useState } from 'react';

import { QuestionsModal } from './_components/QuestionsModal';
import QuestionTable from './_components/QuestionTable';

import { PageHeader } from '@/components/ui/page-header';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { useQuestions } from '@/hooks/useQuestions';

export default function QuestionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );
  const {
    questions,
    stats,
    loading,
    error,
    addQuestion,
    editQuestion,
    removeQuestion,
    refreshQuestions,
  } = useQuestions();

  const handleCreateQuestion = async (data: CreateQuestionRequest) => {
    try {
      await addQuestion(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  const handleEditQuestion = async (data: UpdateQuestionRequest) => {
    try {
      await editQuestion(data);
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      console.error('Failed to update question:', err);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await removeQuestion(questionId);
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleSubmit = async (
    data: CreateQuestionRequest | UpdateQuestionRequest,
  ) => {
    if (editingQuestion) {
      await handleEditQuestion(data as UpdateQuestionRequest);
    } else {
      await handleCreateQuestion(data as CreateQuestionRequest);
    }
  };

  const statsCards = [
    {
      title: 'Total Questions',
      value: stats.totalQuestions.toString(),
      icon: MessageSquareIcon,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-indigo-600',
      description: 'All questions',
      gradient: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Active Questions',
      value: stats.activeQuestions.toString(),
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-600',
      description: 'Currently active',
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Inactive Questions',
      value: stats.inactiveQuestions.toString(),
      icon: StarIcon,
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-amber-600',
      description: 'Currently inactive',
      gradient: 'from-orange-50 to-amber-50',
    },
    {
      title: 'Categories',
      value: stats.totalCategories.toString(),
      icon: ToggleLeftIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-violet-600',
      description: 'Question categories',
      gradient: 'from-purple-50 to-violet-50',
    },
  ];

  return (
    <>
      <PageHeader
        description="Manage and customize your feedback questions"
        icon={<MessageSquareIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </h1>
            <p className="text-default-600 mt-1">
              Manage and customize your feedback questions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={() => setIsModalOpen(true)}
            >
              Create Question
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
                {/* Background gradient overlay */}
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

        {/* Questions Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">
                Question List
              </h3>
              <p className="text-sm text-default-600">
                View and manage all your questions
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-default-400">Loading questions...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : (
              <QuestionTable
                questions={questions}
                onDelete={(questionId: string) => {
                  const question = questions.find(q => q.id === questionId);

                  if (question) {
                    handleDelete(question);
                  }
                }}
                onEdit={handleEdit}
                onRefresh={refreshQuestions}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <QuestionsModal
        isOpen={isModalOpen}
        mode={editingQuestion ? 'edit' : 'create'}
        question={editingQuestion || undefined}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        body={`Are you sure you want to delete "${questionToDelete?.title}"? This action cannot be undone.`}
        cancelColor="primary"
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Delete"
        isOpen={isDeleteModalOpen}
        title="Delete Question"
        onClose={handleDeleteModalClose}
        onConfirm={() =>
          questionToDelete && handleDeleteQuestion(questionToDelete.id)
        }
      />
    </>
  );
}
