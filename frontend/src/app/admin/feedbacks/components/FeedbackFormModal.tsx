'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createFeedback, updateFeedback } from '@/lib/api/feedbacks';
import { getProjects } from '@/lib/api/projects';
import { getAllQuestions } from '@/lib/api/questions';
import { 
  CalendarIcon, 
  X, 
  Search,
  Type,
  FileText,
  FolderKanban,
  CalendarRange,
  ListChecks,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  PencilIcon,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/app/admin/projects/models/types';
import type { Question } from '@/app/admin/questions/models/types';
import type { Feedback, CreateFeedbackDto } from '../models/types';

interface FeedbackFormModalProps {
  feedback?: Feedback;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function FeedbackFormModal({ feedback, onClose, onSuccess, mode }: FeedbackFormModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(
    feedback?.questionIds || []
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: feedback?.title || '',
    description: feedback?.description || '',
    projectId: feedback?.project?.id || 0,
    startDate: feedback?.startDate || '',
    endDate: feedback?.endDate || '',
    allowAnonymous: feedback?.allowAnonymous || false,
    allowedUserIds: feedback?.allowedUserIds || []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
          description: 'Failed to load required data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    try {
      setIsLoading(true);
      
      // Validate form
      const errors: Record<string, string> = {};
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      }
      if (!formData.projectId) {
        errors.project = 'Please select a project';
      }
      if (!formData.startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!formData.endDate) {
        errors.dueDate = 'Due date is required';
      }
      if (selectedQuestions.length === 0) {
        errors.questions = 'Please select at least one question';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const feedbackData: CreateFeedbackDto = {
        title: formData.title,
        description: formData.description,
        projectId: Number(formData.projectId),
        questionIds: selectedQuestions,
        startDate: formData.startDate,
        endDate: formData.endDate,
        allowAnonymous: formData.allowAnonymous,
        allowedUserIds: formData.allowedUserIds
      };

      if (mode === 'create') {
        await createFeedback(feedbackData);
      } else {
        await updateFeedback(feedback!.id, feedbackData);
      }

      toast({
        title: 'Success',
        description: `Feedback ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} feedback:`, error);
      setFormErrors({
        ...formErrors,
        submit: `Failed to ${mode} feedback. Please try again.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today && mode === 'create') {
        toast({
          title: 'Invalid Date',
          description: 'Please select a date in the future.',
          variant: 'destructive',
        });
        return;
      }

      if (field === 'endDate' && formData.startDate) {
        const startDate = new Date(formData.startDate);
        if (date < startDate) {
          toast({
            title: 'Invalid Date',
            description: 'End date must be after start date.',
            variant: 'destructive',
          });
          return;
        }
      }

      setFormData(prev => ({ ...prev, [field]: date.toISOString() }));
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isViewOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[1200px] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              {mode === 'create' ? (
                <FileText className="h-6 w-6 text-violet-600" />
              ) : mode === 'edit' ? (
                <PencilIcon className="h-6 w-6 text-violet-600" />
              ) : (
                <Eye className="h-6 w-6 text-violet-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Create New Feedback' : 
                 mode === 'edit' ? 'Edit Feedback' : 'View Feedback'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Design a feedback form to gather valuable insights' :
                 mode === 'edit' ? 'Modify feedback form details' : 'Review feedback form details'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-violet-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Column - Form Fields */}
          <div className="w-[400px] border-r p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="h-5 w-5 text-violet-500" />
                  <label className="block text-sm font-medium text-gray-900">
                    Form Title
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setFormErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={cn(
                    "w-full px-3 py-2 bg-white border rounded-md text-sm",
                    "focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                    "transition-colors duration-200",
                    formErrors.title ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="e.g., Product Satisfaction Survey"
                  required
                  disabled={isViewOnly}
                />
                {formErrors.title && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">{formErrors.title}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-violet-500" />
                  <label className="block text-sm font-medium text-gray-900">
                    Description
                  </label>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    setFormErrors(prev => ({ ...prev, description: '' }));
                  }}
                  rows={4}
                  className={cn(
                    "w-full px-3 py-2 bg-white border rounded-md text-sm",
                    "focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                    "transition-colors duration-200",
                    formErrors.description ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="Describe the feedback form's purpose and goals"
                  required
                  disabled={isViewOnly}
                />
                {formErrors.description && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">{formErrors.description}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FolderKanban className="h-5 w-5 text-violet-500" />
                  <label className="block text-sm font-medium text-gray-900">
                    Project
                  </label>
                </div>
                <select
                  value={formData.projectId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, projectId: parseInt(e.target.value, 10) }));
                    setFormErrors(prev => ({ ...prev, projectId: '' }));
                  }}
                  className={cn(
                    "w-full px-3 py-2 bg-white border rounded-md text-sm",
                    "focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                    "transition-colors duration-200",
                    formErrors.projectId ? "border-red-300" : "border-gray-300"
                  )}
                  disabled={isViewOnly}
                >
                  <option value={0}>Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {formErrors.projectId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">{formErrors.projectId}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarRange className="h-5 w-5 text-violet-500" />
                  <label className="block text-sm font-medium text-gray-900">
                    Timeline
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-gray-500",
                            formErrors.startDate && "border-red-300"
                          )}
                          disabled={isViewOnly}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(new Date(formData.startDate), 'MMM d, yyyy')
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
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      Due Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-gray-500",
                            formErrors.endDate && "border-red-300"
                          )}
                          disabled={isViewOnly}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(new Date(formData.endDate), 'MMM d, yyyy')
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
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {(formErrors.startDate || formErrors.endDate) && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">
                      {formErrors.startDate || formErrors.endDate}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowAnonymous"
                    checked={formData.allowAnonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowAnonymous: e.target.checked }))}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    disabled={isViewOnly}
                  />
                  <label htmlFor="allowAnonymous" className="text-sm text-gray-700">
                    Allow anonymous submissions
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-violet-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-violet-500" />
                  <h3 className="text-sm font-medium text-gray-900">Select Questions</h3>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{selectedQuestions.length} selected</span>
                </div>
              </div>
              {!isViewOnly && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              )}
              {formErrors.questions && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600">{formErrors.questions}</p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredQuestions.map(question => (
                  <div
                    key={question.id}
                    onClick={() => {
                      if (!isViewOnly) {
                        setSelectedQuestions(prev =>
                          prev.includes(question.id)
                            ? prev.filter(id => id !== question.id)
                            : [...prev, question.id]
                        );
                      }
                    }}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      !isViewOnly && "cursor-pointer",
                      selectedQuestions.includes(question.id)
                        ? "bg-violet-50 border-violet-200 shadow-sm"
                        : !isViewOnly && "hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {!isViewOnly && (
                        <div className="flex-shrink-0 mt-1">
                          <div className={cn(
                            "w-4 h-4 rounded border transition-colors",
                            selectedQuestions.includes(question.id)
                              ? "border-violet-500 bg-violet-500"
                              : "border-gray-300"
                          )}>
                            {selectedQuestions.includes(question.id) && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{question.text}</p>
                        {question.description && (
                          <p className="mt-1 text-sm text-gray-500">{question.description}</p>
                        )}
                        <div className="mt-2 flex gap-2">
                          <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
                            {question.questionType.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                            {question.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-violet-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ListChecks className="h-4 w-4" />
            {selectedQuestions.length} questions selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="hover:bg-gray-50"
            >
              {isViewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isViewOnly && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
                    <AlertCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span className="mr-2">{mode === 'create' ? 'Create Feedback' : 'Update Feedback'}</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 