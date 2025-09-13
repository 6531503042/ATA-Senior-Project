'use client';

import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '@/types/question';

import { Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import {
  PlusIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  ToggleLeftIcon,
  UsersIcon,
  ShapesIcon,
  TrendingUpIcon,
  ClockIcon,
  StarIcon,
  FileTextIcon,
  ListIcon,
  ToggleLeftIcon as ToggleIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestions,
  } = useQuestions();

  // Calculate enhanced stats from questions array
  const stats = {
    totalQuestions: questions.length,
    requiredQuestions: questions.filter(q => q.required).length,
    optionalQuestions: questions.filter(q => !q.required).length,
    totalCategories: new Set(questions.map(q => q.category).filter(Boolean)).size,
    multipleChoiceQuestions: questions.filter(q => q.type === 'MULTIPLE_CHOICE').length,
    ratingQuestions: questions.filter(q => q.type === 'RATING').length,
    booleanQuestions: questions.filter(q => q.type === 'BOOLEAN').length,
    textQuestions: questions.filter(q => q.type === 'TEXT').length,
  };

  // Calculate percentages and trends
  const percentages = {
    requiredPercentage: stats.totalQuestions > 0 ? (stats.requiredQuestions / stats.totalQuestions) * 100 : 0,
    typeDistribution: {
      multipleChoice: stats.totalQuestions > 0 ? (stats.multipleChoiceQuestions / stats.totalQuestions) * 100 : 0,
      rating: stats.totalQuestions > 0 ? (stats.ratingQuestions / stats.totalQuestions) * 100 : 0,
      boolean: stats.totalQuestions > 0 ? (stats.booleanQuestions / stats.totalQuestions) * 100 : 0,
      text: stats.totalQuestions > 0 ? (stats.textQuestions / stats.totalQuestions) * 100 : 0,
    }
  };

  const handleCreateQuestion = async (data: CreateQuestionRequest) => {
    try {
      await createQuestion(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  const handleEditQuestion = async (data: UpdateQuestionRequest) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, data);
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      console.error('Failed to update question:', err);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(parseInt(questionId));
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
      description: 'All questions in system',
      gradient: 'from-blue-50 to-indigo-50',
      trend: '+12%',
      trendColor: 'text-green-600',
      progress: 100,
      progressColor: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Required Questions',
      value: stats.requiredQuestions.toString(),
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-600',
      description: 'Mandatory questions',
      gradient: 'from-green-50 to-emerald-50',
      trend: '+5%',
      trendColor: 'text-green-600',
      progress: percentages.requiredPercentage,
      progressColor: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Question Types',
      value: `${stats.multipleChoiceQuestions + stats.ratingQuestions + stats.booleanQuestions + stats.textQuestions}`,
      icon: ToggleLeftIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-violet-600',
      description: 'Different question formats',
      gradient: 'from-purple-50 to-violet-50',
      trend: '4 types',
      trendColor: 'text-purple-600',
      progress: 100,
      progressColor: 'from-purple-500 to-violet-500',
    },
    {
      title: 'Categories',
      value: stats.totalCategories.toString(),
      icon: ShapesIcon,
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-amber-600',
      description: 'Question categories',
      gradient: 'from-orange-50 to-amber-50',
      progress: 100,
      progressColor: 'from-orange-500 to-amber-500',
    },
  ];

  const typeDistributionCards = [
    {
      title: 'Multiple Choice',
      value: stats.multipleChoiceQuestions.toString(),
      icon: ListIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-100 to-violet-100',
      percentage: percentages.typeDistribution.multipleChoice,
      description: 'Select from options',
    },
    {
      title: 'Rating Scale',
      value: stats.ratingQuestions.toString(),
      icon: StarIcon,
      color: 'text-amber-600',
      bgColor: 'from-amber-100 to-orange-100',
      percentage: percentages.typeDistribution.rating,
      description: 'Numeric rating',
    },
    {
      title: 'Yes/No',
      value: stats.booleanQuestions.toString(),
      icon: ToggleIcon,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-100 to-green-100',
      percentage: percentages.typeDistribution.boolean,
      description: 'Boolean choice',
    },
    {
      title: 'Text Input',
      value: stats.textQuestions.toString(),
      icon: FileTextIcon,
      color: 'text-blue-600',
      bgColor: 'from-blue-100 to-indigo-100',
      percentage: percentages.typeDistribution.text,
      description: 'Free text response',
    },
  ];

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Auto-load questions when component mounts
  useEffect(() => {
    if (questions.length === 0 && !loading) {
      fetchQuestions();
    }
  }, [questions.length, loading, fetchQuestions]);

  return (
    <>
      <PageHeader
        description="Manage and customize your feedback questions"
        icon={<MessageSquareIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 dark:border-gray-700 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-800 dark:via-purple-800 dark:to-gray-900 shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/10 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl">
              <MessageSquareIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Questions Management</h1>
              <p className="text-white/70 dark:text-gray-300 mt-1">Create, edit, and manage your feedback questions with analytics</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-white border-white/20 dark:border-gray-600"
              color="default"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="bordered"
              onPress={() => setIsModalOpen(true)}
            >
              Create Question
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="border border-default-200 dark:border-default-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800 overflow-hidden group"
            >
              <CardBody className="p-6 relative text-default-900 dark:text-white">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-300`}
                />

                <div className="flex items-center justify-between relative z-10 mb-4">
                  <div>
                    <p className="text-sm font-medium text-default-600 dark:text-default-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-default-900 dark:text-white">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <p className={`text-xs font-medium ${stat.trendColor} mt-1 flex items-center gap-1`}>
                        <TrendingUpIcon className="w-3 h-3" />
                        {stat.trend}
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <stat.icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs text-default-600 dark:text-default-400 mb-2">
                    <span>{stat.description}</span>
                    <span>{stat.progress.toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={stat.progress}
                    className="w-full"
                    color="primary"
                    size="sm"
                    classNames={{
                      track: "bg-default-100",
                      indicator: `bg-gradient-to-r ${stat.progressColor}`,
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Question Type Distribution */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900 dark:text-white">
                Question Type Distribution
              </h3>
              <p className="text-sm text-default-600 dark:text-default-400">
                Overview of different question types in your system
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {typeDistributionCards.map((type, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-default-200 dark:border-default-700 hover:border-default-300 dark:hover:border-default-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.bgColor} flex items-center justify-center`}>
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-default-900 dark:text-white">{type.title}</p>
                      <p className="text-xs text-default-500 dark:text-default-400">{type.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-default-900 dark:text-white">{type.value}</span>
                      <span className="text-sm font-medium text-default-600 dark:text-default-400">{type.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={type.percentage}
                      className="w-full"
                      size="sm"
                      color="primary"
                      classNames={{
                        track: "bg-default-100",
                        indicator: `bg-gradient-to-r ${type.bgColor.replace('100', '500')}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Questions Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900 dark:text-white">
                Question List
              </h3>
              <p className="text-sm text-default-600 dark:text-default-400">
                View and manage all your questions with advanced filtering and sorting
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center animate-pulse">
                    <MessageSquareIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-default-600 dark:text-default-400 mb-2">Loading questions...</div>
                    <div className="text-sm text-default-400 dark:text-default-500">Please wait while we fetch your data</div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquareIcon className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="text-red-500 text-lg font-medium mb-2">Error loading questions</div>
                  <div className="text-red-400 text-sm">{error}</div>
                </div>
              </div>
            ) : (
              <QuestionTable
                questions={questions}
                onDelete={(questionId: string) => {
                  const question = questions.find(q => q.id.toString() === questionId);
                  if (question) {
                    handleDelete(question);
                  }
                }}
                onEdit={handleEdit}
                onRefresh={fetchQuestions}
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
        body={`Are you sure you want to delete "${questionToDelete?.text}"? This action cannot be undone.`}
        cancelColor="primary"
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Delete"
        isOpen={isDeleteModalOpen}
        title="Delete Question"
        onClose={handleDeleteModalClose}
        onConfirm={() =>
          questionToDelete && handleDeleteQuestion(questionToDelete.id.toString())
        }
      />
    </>
  );
}