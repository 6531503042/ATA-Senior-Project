'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ClipboardList, 
  X, 
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  Rocket,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Star,
  MessageCircleQuestion,
  Code,
  Users,
  Briefcase,
  Heart,
  ThumbsUp,
  Target,
  Lightbulb,
  GraduationCap,
  MessagesSquare
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { createFeedback } from '@/lib/api/feedbacks';
import { getAllQuestions } from '@/lib/api/questions';
import { getProjects } from '@/lib/api/projects';
import type { CreateFeedbackDto } from '../models/types';
import type { Question } from '../../questions/models/types';
import type { Project } from '../../projects/models/types';
import { useToast } from '@/hooks/use-toast';

interface CreateFeedbackFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFeedbackForm({ onClose, onSuccess }: CreateFeedbackFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<CreateFeedbackDto>({
    title: '',
    description: '',
    projectId: 0,
    questionIds: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    allowAnonymous: false,
    allowedUserIds: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, questionsData] = await Promise.all([
          getProjects(),
          getAllQuestions()
        ]);
        setProjects(projectsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createFeedback(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestionIds(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
    setFormData(prev => ({
      ...prev,
      questionIds: prev.questionIds.includes(questionId)
        ? prev.questionIds.filter(id => id !== questionId)
        : [...prev.questionIds, questionId]
    }));
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return <CheckSquare className="h-4 w-4 text-blue-600" />;
      case 'MULTIPLE_CHOICE':
        return <ListChecks className="h-4 w-4 text-purple-600" />;
      case 'SENTIMENT':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'TEXT_BASED':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <MessageCircleQuestion className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WORK_ENVIRONMENT':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'WORK_LIFE_BALANCE':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'TEAM_COLLABORATION':
        return <Users className="h-4 w-4 text-indigo-600" />;
      case 'PROJECT_MANAGEMENT':
        return <ClipboardList className="h-4 w-4 text-purple-600" />;
      case 'PROJECT_SATISFACTION':
        return <ThumbsUp className="h-4 w-4 text-cyan-600" />;
      case 'TECHNICAL_SKILLS':
        return <Code className="h-4 w-4 text-emerald-600" />;
      case 'COMMUNICATION':
        return <MessagesSquare className="h-4 w-4 text-orange-600" />;
      case 'LEADERSHIP':
        return <Target className="h-4 w-4 text-red-600" />;
      case 'INNOVATION':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case 'PERSONAL_GROWTH':
        return <GraduationCap className="h-4 w-4 text-teal-600" />;
      default:
        return <MessageCircleQuestion className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="space-y-1 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Create New Feedback</h2>
                    <p className="text-sm text-gray-500">Create a new feedback form for your project</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter feedback title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter feedback description"
                      required
                    />
                  </div>

                  {/* Project Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectId: Number(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      required
                    >
                      <option value={0}>Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal mt-1',
                              !formData.startDate && 'text-gray-400'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? (
                              format(new Date(formData.startDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate ? new Date(formData.startDate) : undefined}
                            onSelect={(date) => handleDateChange('startDate', date)}
                            disabled={{ before: new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal mt-1',
                              !formData.endDate && 'text-gray-400'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? (
                              format(new Date(formData.endDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate ? new Date(formData.endDate) : undefined}
                            onSelect={(date) => handleDateChange('endDate', date)}
                            disabled={{ 
                              before: formData.startDate ? new Date(formData.startDate) : new Date()
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Questions Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Questions</label>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {questions.map(question => (
                        <div
                          key={question.id}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border transition-colors cursor-pointer",
                            selectedQuestionIds.includes(question.id)
                              ? "border-violet-500 bg-violet-50"
                              : "border-gray-200 hover:border-violet-200"
                          )}
                          onClick={() => handleQuestionToggle(question.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.includes(question.id)}
                            onChange={() => handleQuestionToggle(question.id)}
                            className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <div className="flex items-center gap-2">
                                {getQuestionTypeIcon(question.questionType)}
                                <p className="text-sm font-medium text-gray-900">{question.text}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{question.description}</p>
                            </div>
                            
                            {/* Answer Options */}
                            {question.choices && question.choices.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-gray-600">Answer Options:</p>
                                <div className="grid grid-cols-2 gap-1">
                                  {question.choices.map((choice, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-xs px-2 py-1 bg-gray-50 rounded border border-gray-100 text-gray-600"
                                    >
                                      {question.questionType === 'SINGLE_CHOICE' ? (
                                        <div className="w-3 h-3 rounded-full border border-gray-400" />
                                      ) : (
                                        <div className="w-3 h-3 rounded border border-gray-400" />
                                      )}
                                      <span>{choice}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {question.questionType === 'SENTIMENT' && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-gray-600">Sentiment Options:</p>
                                <div className="flex gap-2">
                                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded">
                                    😞 Negative
                                  </span>
                                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                                    😐 Neutral
                                  </span>
                                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                                    😊 Positive
                                  </span>
                                </div>
                              </div>
                            )}

                            {question.questionType === 'TEXT_BASED' && (
                              <div className="mt-2">
                                <p className="flex items-center gap-1 text-xs text-gray-500 italic">
                                  <MessageSquare className="h-3 w-3" />
                                  Free text response
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {getQuestionTypeIcon(question.questionType)}
                              <span>{question.questionType.replace('_', ' ')}</span>
                            </span>
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-600">
                              {getCategoryIcon(question.category)}
                              <span>{question.category.replace('_', ' ')}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow Anonymous Responses</label>
                      <p className="text-xs text-gray-500">Enable anonymous feedback submission</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, allowAnonymous: !prev.allowAnonymous }))}
                      leftIcon={formData.allowAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    >
                      {formData.allowAnonymous ? 'Anonymous' : 'Named'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || !formData.title || !formData.description || !formData.projectId || formData.questionIds.length === 0}
                isLoading={isLoading}
                leftIcon={<Rocket className="h-4 w-4" />}
              >
                Create Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 